package com.intech.dukaantech.billing.service;

import com.intech.dukaantech.billing.dto.BillingRequest;
import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.dto.OrderItemRequest;
import com.intech.dukaantech.billing.mapper.BillingMapper;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.model.OrderItem;
import com.intech.dukaantech.billing.repository.BillingRepository;
import com.intech.dukaantech.inventory.model.Item;
import com.intech.dukaantech.inventory.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final ItemRepository itemRepository;
    private final BillingRepository billingRepository;
    private final BillingMapper billingMapper; // mapper for DTO conversion

    @Override
    public BillingResponse createOrder(BillingRequest request) {

        // Create new Bill
        Bill bill = new Bill();
        bill.setOrderId(UUID.randomUUID().toString());
        bill.setCustomerName(request.getCustomerName());
        bill.setPhone(request.getPhone());
        bill.setPaymentMethod(request.getPaymentMethod());
        bill.setPaid(true);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subTotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        // Process each item in the order request
        for (OrderItemRequest itemRequest : request.getItems()) {

            Item item = itemRepository.findByItemID(itemRequest.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + itemRequest.getItemId()));

            BigDecimal price = item.getPrice();
            BigDecimal quantity = BigDecimal.valueOf(itemRequest.getQuantity());
            BigDecimal itemTotal = price.multiply(quantity);

            // Calculate tax
            BigDecimal taxPercent = BigDecimal.valueOf(item.getCategory().getTax());
            BigDecimal taxAmount = itemTotal.multiply(taxPercent).divide(BigDecimal.valueOf(100));
            BigDecimal finalAmount = itemTotal.add(taxAmount);

            // Create OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setItemName(item.getName());
            orderItem.setPrice(price);
            orderItem.setQuantity(quantity.intValue());
            orderItem.setTax(taxPercent);
            orderItem.setTaxAmount(taxAmount);
            orderItem.setTotal(finalAmount);
            orderItem.setBill(bill);

            orderItems.add(orderItem);

            // Update totals
            subTotal = subTotal.add(itemTotal);
            totalTax = totalTax.add(taxAmount);
        }

        // Set bill totals
        bill.setItems(orderItems);
        bill.setSubTotal(subTotal);
        bill.setTotalTax(totalTax);
        bill.setTotalAmount(subTotal.add(totalTax));

        // Save to database
        Bill savedBill = billingRepository.save(bill);

        // Map to response DTO
        return billingMapper.toBillingResponse(savedBill);
    }
}