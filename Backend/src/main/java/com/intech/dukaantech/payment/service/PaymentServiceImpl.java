package com.intech.dukaantech.payment.service;

import com.intech.dukaantech.common.exception.custom.BadRequestException;
import com.intech.dukaantech.common.exception.custom.ConflictException;
import com.intech.dukaantech.common.exception.custom.ExternalServiceException;
import com.intech.dukaantech.common.exception.custom.InternalServerException;
import com.intech.dukaantech.common.exception.custom.ResourceNotFoundException;
import com.intech.dukaantech.payment.dto.*;
import com.intech.dukaantech.payment.model.PaymentStatus;
import com.intech.dukaantech.payment.model.PaymentTransaction;
import com.intech.dukaantech.payment.repository.PaymentTransactionRepository;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;

    @Value("${razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:}")
    private String razorpayKeySecret;

    @Value("${payment.upi-max-transaction-inr:100000}")
    private BigDecimal upiMaxTransactionInr;

    @Override
    public CreatePaymentOrderResponse createRazorpayOrder(CreatePaymentOrderRequest request) {
        validateRazorpayConfig();

        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }

        String currency = (request.getCurrency() == null || request.getCurrency().isBlank())
                ? "INR"
                : request.getCurrency().trim().toUpperCase();

        if (!"INR".equals(currency)) {
            throw new BadRequestException("Only INR currency is supported for UPI checkout");
        }

        if (request.getAmount().compareTo(upiMaxTransactionInr) > 0) {
            throw new BadRequestException("UPI transaction limit exceeded. Maximum allowed amount is INR " + upiMaxTransactionInr);
        }

        String receipt = (request.getReceipt() == null || request.getReceipt().isBlank())
                ? "rcpt_" + UUID.randomUUID().toString().replace("-", "")
                : request.getReceipt().trim();

        Optional<PaymentTransaction> existingOpt = paymentTransactionRepository.findByReceipt(receipt);
        if (existingOpt.isPresent()) {
            PaymentTransaction existing = existingOpt.get();
            existing.setDuplicateAttempts(existing.getDuplicateAttempts() + 1);
            paymentTransactionRepository.save(existing);
            return mapDuplicateCreateResponse(existing);
        }

        long amountInPaise = request.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValue();

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject options = new JSONObject();
            options.put("amount", amountInPaise);
            options.put("currency", currency);
            options.put("receipt", receipt);

            JSONObject notes = new JSONObject();
            if (request.getCustomerName() != null) {
                notes.put("customerName", request.getCustomerName());
            }
            if (request.getPhone() != null) {
                notes.put("phone", request.getPhone());
            }
            if (request.getEmail() != null) {
                notes.put("email", request.getEmail());
            }
            if (notes.length() > 0) {
                options.put("notes", notes);
            }

            Order razorpayOrder = client.orders.create(options);

            PaymentTransaction tx = new PaymentTransaction();
            tx.setReceipt(receipt);
            tx.setRazorpayOrderId(razorpayOrder.get("id"));
            tx.setAmount(request.getAmount().setScale(2, RoundingMode.HALF_UP));
            tx.setCurrency(currency);
            tx.setStatus(PaymentStatus.CREATED);
            paymentTransactionRepository.save(tx);

            CreatePaymentOrderResponse response = new CreatePaymentOrderResponse();
            response.setKeyId(razorpayKeyId);
            response.setRazorpayOrderId(tx.getRazorpayOrderId());
            response.setAmountInPaise(amountInPaise);
            response.setCurrency(currency);
            response.setReceipt(receipt);
            response.setStatus(tx.getStatus().name());
            response.setDuplicate(false);
            response.setMessage("Razorpay order created successfully");
            return response;

        } catch (RazorpayException ex) {
            throw new ExternalServiceException("Unable to create Razorpay order: " + ex.getMessage());
        }
    }

    @Override
    public VerifyPaymentResponse verifyRazorpayPayment(VerifyPaymentRequest request) {
        validateRazorpayConfig();

        if (isBlank(request.getRazorpayOrderId()) || isBlank(request.getRazorpayPaymentId()) || isBlank(request.getRazorpaySignature())) {
            throw new BadRequestException("razorpayOrderId, razorpayPaymentId and razorpaySignature are required");
        }

        PaymentTransaction tx = paymentTransactionRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment order not found"));

        if (tx.getStatus() == PaymentStatus.CANCELLED) {
            throw new ConflictException("Payment already cancelled");
        }

        if (tx.getStatus() == PaymentStatus.PAID) {
            if (request.getRazorpayPaymentId().equals(tx.getRazorpayPaymentId())) {
                VerifyPaymentResponse duplicatePaid = new VerifyPaymentResponse();
                duplicatePaid.setVerified(true);
                duplicatePaid.setDuplicate(true);
                duplicatePaid.setStatus(tx.getStatus().name());
                duplicatePaid.setMessage("Payment already verified for this order");
                duplicatePaid.setReceipt(tx.getReceipt());
                duplicatePaid.setRazorpayOrderId(tx.getRazorpayOrderId());
                duplicatePaid.setRazorpayPaymentId(tx.getRazorpayPaymentId());
                duplicatePaid.setPaymentMethod(tx.getPaymentMethod());
                return duplicatePaid;
            }
            throw new ConflictException("Duplicate payment attempt detected with a different payment id");
        }

        boolean validSignature = verifySignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());
        if (!validSignature) {
            tx.setStatus(PaymentStatus.FAILED);
            paymentTransactionRepository.save(tx);
            throw new BadRequestException("Invalid payment signature");
        }

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            Payment payment = client.payments.fetch(request.getRazorpayPaymentId());

            String orderIdFromGateway = payment.get("order_id");
            String paymentStatus = payment.get("status");
            String method = payment.get("method");

            if (!request.getRazorpayOrderId().equals(orderIdFromGateway)) {
                throw new BadRequestException("Order mismatch while verifying payment");
            }

            if (!("captured".equalsIgnoreCase(paymentStatus) || "authorized".equalsIgnoreCase(paymentStatus))) {
                tx.setStatus(PaymentStatus.FAILED);
                paymentTransactionRepository.save(tx);
                throw new BadRequestException("Payment is not successful. Current gateway status: " + paymentStatus);
            }

            tx.setRazorpayPaymentId(request.getRazorpayPaymentId());
            tx.setRazorpaySignature(request.getRazorpaySignature());
            tx.setPaymentMethod(method);
            tx.setStatus(PaymentStatus.PAID);
            paymentTransactionRepository.save(tx);

            VerifyPaymentResponse response = new VerifyPaymentResponse();
            response.setVerified(true);
            response.setDuplicate(false);
            response.setStatus(tx.getStatus().name());
            response.setMessage("Payment verified successfully");
            response.setReceipt(tx.getReceipt());
            response.setRazorpayOrderId(tx.getRazorpayOrderId());
            response.setRazorpayPaymentId(tx.getRazorpayPaymentId());
            response.setPaymentMethod(tx.getPaymentMethod());
            return response;

        } catch (RazorpayException ex) {
            throw new ExternalServiceException("Unable to verify payment from Razorpay: " + ex.getMessage());
        }
    }

    @Override
    public CancelPaymentResponse cancelPayment(CancelPaymentRequest request) {
        PaymentTransaction tx = findTransactionByOrderOrReceipt(request.getRazorpayOrderId(), request.getReceipt());

        if (tx.getStatus() == PaymentStatus.CANCELLED) {
            CancelPaymentResponse duplicateCancel = new CancelPaymentResponse();
            duplicateCancel.setCancelled(true);
            duplicateCancel.setDuplicate(true);
            duplicateCancel.setStatus(tx.getStatus().name());
            duplicateCancel.setMessage("Payment already cancelled");
            duplicateCancel.setReceipt(tx.getReceipt());
            duplicateCancel.setRazorpayOrderId(tx.getRazorpayOrderId());
            return duplicateCancel;
        }

        if (tx.getStatus() == PaymentStatus.PAID) {
            throw new ConflictException("Paid payment cannot be cancelled");
        }

        tx.setStatus(PaymentStatus.CANCELLED);
        tx.setCancelReason(isBlank(request.getReason()) ? "Cancelled by user" : request.getReason().trim());
        paymentTransactionRepository.save(tx);

        CancelPaymentResponse response = new CancelPaymentResponse();
        response.setCancelled(true);
        response.setDuplicate(false);
        response.setStatus(tx.getStatus().name());
        response.setMessage("Payment cancelled successfully");
        response.setReceipt(tx.getReceipt());
        response.setRazorpayOrderId(tx.getRazorpayOrderId());
        return response;
    }

    @Override
    public String getPublicKey() {
        validateRazorpayConfig();
        return razorpayKeyId;
    }

    private CreatePaymentOrderResponse mapDuplicateCreateResponse(PaymentTransaction tx) {
        CreatePaymentOrderResponse response = new CreatePaymentOrderResponse();
        response.setKeyId(razorpayKeyId);
        response.setRazorpayOrderId(tx.getRazorpayOrderId());
        response.setAmountInPaise(tx.getAmount().multiply(BigDecimal.valueOf(100)).longValue());
        response.setCurrency(tx.getCurrency());
        response.setReceipt(tx.getReceipt());
        response.setStatus(tx.getStatus().name());
        response.setDuplicate(true);

        if (tx.getStatus() == PaymentStatus.PAID) {
            response.setMessage("Receipt already paid. Duplicate payment prevented.");
            return response;
        }

        if (tx.getStatus() == PaymentStatus.CANCELLED) {
            throw new ConflictException("This receipt is already cancelled. Use a new receipt.");
        }

        if (tx.getStatus() == PaymentStatus.FAILED) {
            throw new BadRequestException("Previous attempt for this receipt failed. Use a new receipt.");
        }

        response.setMessage("Payment order already exists for this receipt. Reusing existing order.");
        return response;
    }

    private PaymentTransaction findTransactionByOrderOrReceipt(String razorpayOrderId, String receipt) {
        if (!isBlank(razorpayOrderId)) {
            return paymentTransactionRepository.findByRazorpayOrderId(razorpayOrderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment order not found"));
        }

        if (!isBlank(receipt)) {
            return paymentTransactionRepository.findByReceipt(receipt)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment receipt not found"));
        }

        throw new BadRequestException("Either razorpayOrderId or receipt is required");
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            StringBuilder expected = new StringBuilder();
            for (byte b : hash) {
                expected.append(String.format("%02x", b));
            }
            return expected.toString().equals(signature);
        } catch (Exception ex) {
            throw new InternalServerException("Unable to validate signature");
        }
    }

    private void validateRazorpayConfig() {
        if (isBlank(razorpayKeyId) || isBlank(razorpayKeySecret)) {
            throw new InternalServerException("Razorpay configuration missing. Please set razorpay.key-id and razorpay.key-secret");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
