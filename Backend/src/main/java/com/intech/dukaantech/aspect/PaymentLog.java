package com.intech.dukaantech.aspect;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.payment.dto.*;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PaymentLog {

    private static final Logger paymentLog =
            LoggerFactory.getLogger("PAYMENT_LOGGER");

    // POINTCUTS

    @Pointcut("execution(* com.intech.dukaantech.payment.service.PaymentServiceImpl.createRazorpayOrder(..))")
    public void createPaymentOrder() {}

    @Pointcut("execution(* com.intech.dukaantech.payment.service.PaymentServiceImpl.verifyRazorpayPayment(..))")
    public void verifyPayment() {}

    @Pointcut("execution(* com.intech.dukaantech.payment.service.PaymentServiceImpl.cancelPayment(..))")
    public void cancelPayment() {}

    @Pointcut("execution(* com.intech.dukaantech.billing.service.BillingServiceImpl.createOrder(..))")
    public void createBillingOrder() {}

    // ADVICES

    // CREATE ORDER
    @AfterReturning(pointcut = "createPaymentOrder()", returning = "response")
    public void afterCreateOrder(Object response) {

        if (response instanceof CreatePaymentOrderResponse res) {

            paymentLog.info(
                    "[PAYMENT_ORDER_CREATED] orderId={} | amount={} | currency={} | user={}",
                    res.getRazorpayOrderId(),
                    res.getAmountInPaise(),
                    res.getCurrency(),
                    getCurrentUser()
            );
        }
    }

    // VERIFY PAYMENT
    @AfterReturning(pointcut = "verifyPayment()", returning = "response")
    public void afterVerifyPayment(Object response) {

        if (response instanceof VerifyPaymentResponse res) {

            paymentLog.info(
                    "[PAYMENT_SUCCESS] orderId={} | paymentId={} | method={} | user={}",
                    res.getRazorpayOrderId(),
                    res.getRazorpayPaymentId(),
                    res.getPaymentMethod(),
                    getCurrentUser()
            );
        }
    }

    // CANCEL PAYMENT
    @AfterReturning(pointcut = "cancelPayment()", returning = "response")
    public void afterCancelPayment(Object response) {

        if (response instanceof CancelPaymentResponse res) {

            paymentLog.info(
                    "[PAYMENT_CANCELLED] orderId={} | user={}",
                    res.getRazorpayOrderId(),
                    getCurrentUser()
            );
        }
    }

    // BILLING (CASH / OFFLINE)
    @AfterReturning(pointcut = "createBillingOrder()", returning = "response")
    public void afterBillingOrderCreated(Object response) {

        if (response instanceof BillingResponse res) {

            paymentLog.info(
                    "[BILLING_SUCCESS] orderId={} | amount={} | method={} | user={}",
                    res.getOrderId(),
                    res.getTotalAmount(),
                    res.getPaymentMethod(),
                    getCurrentUser()
            );
        }
    }

    // helper methods

    private String getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {

                Object principal = auth.getPrincipal();

                if (principal instanceof com.intech.dukaantech.authentication.security.CurrentUser user) {
                    return "id=" + user.getUserId() + "|role=" + user.getRole();
                }

                return principal.toString();
            }
        } catch (Exception ignored) {}

        return "anonymous";
    }
}