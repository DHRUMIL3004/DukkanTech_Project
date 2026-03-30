package com.intech.dukaantech.billing.service;

import com.intech.dukaantech.billing.dto.BillingRequest;
import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.dto.OrderItemRequest;
import com.intech.dukaantech.billing.mapper.BillingMapper;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.model.OrderItem;
import com.intech.dukaantech.billing.repository.BillingRepository;
import com.intech.dukaantech.common.exception.custom.ResourceNotFoundException;
import com.intech.dukaantech.customer.model.Customer;
import com.intech.dukaantech.customer.repository.CustomerRepository;
import com.intech.dukaantech.inventory.model.Item;
import com.intech.dukaantech.inventory.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BillingServiceImpl implements BillingService {


    private final ItemRepository itemRepository;
    private final BillingRepository billingRepository;
    private final BillingMapper billingMapper; // mapper for DTO conversion
    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    @Override
    public BillingResponse createOrder(BillingRequest request) {

        Customer customer =customerRepository.findByPhone(request.getPhone())
                .orElseGet(()->{
                    Customer newCustomer =new Customer();
                    newCustomer.setPhone(request.getPhone());
                    return newCustomer;
                });

        // Update / Set latest details
        customer.setCustomerName(request.getCustomerName());
        customer.setCity(request.getCity());
        customer.setDob(request.getDob());

        //save customer
        customer=customerRepository.save(customer);


        // Create new Bill
        Bill bill = new Bill();
        bill.setOrderId(UUID.randomUUID().toString());
       bill.setCustomer(customer);
        bill.setPaymentMethod(request.getPaymentMethod());
        bill.setPaid(true);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subTotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        // Process each item in the order request
        for (OrderItemRequest itemRequest : request.getItems()) {

            Item item = itemRepository.findByItemID(itemRequest.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemRequest.getItemId()));

            long currentStock = String.valueOf(item.getQuantity()) == null ? 0L : Long.parseLong(String.valueOf(item.getQuantity()));
            long requestedQty = itemRequest.getQuantity();

            if (requestedQty <= 0) {
                throw new RuntimeException("Quantity must be greater than zero");
            }

            if (currentStock < requestedQty) {
                throw new RuntimeException("Not enough stock for item: " + item.getName());
            }

            item.setQuantity(currentStock - requestedQty);
            itemRepository.save(item);

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

    @Override
    public BigDecimal getTotalAmounts(String customerId) {
        Bill bill=billingRepository.findByCustomerId(customerId).orElseThrow(()->new ResourceNotFoundException("Customer not found: " + customerId));

     return bill.getTotalAmount();
    }

    @Override
    public Bill getBillByOrderId(String orderId) {
      return billingRepository.findByOrderId(orderId)
              .orElseThrow(()->new ResourceNotFoundException("Bill not found: " + orderId));
    }


}