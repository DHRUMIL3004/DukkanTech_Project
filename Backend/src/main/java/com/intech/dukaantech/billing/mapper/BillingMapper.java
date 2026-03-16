package com.intech.dukaantech.billing.mapper;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.dto.OrderItemResponse;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.model.OrderItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BillingMapper {

//    Maps Bill entity to BillingResponse DTO

    public BillingResponse toBillingResponse(Bill bill) {
        BillingResponse response = new BillingResponse();
        response.setOrderId(bill.getOrderId());
        response.setCustomerName(bill.getCustomerName());
        response.setPhone(bill.getPhone());
        response.setPaymentMethod(bill.getPaymentMethod());
        response.setSubTotal(bill.getSubTotal());
        response.setTotalTax(bill.getTotalTax());
        response.setTotalAmount(bill.getTotalAmount());
        response.setPaid(bill.isPaid());
        response.setCreatedAt(bill.getCreatedAt());


        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem item : bill.getItems()) {
            itemResponses.add(toOrderItemResponse(item));
        }
        response.setItems(itemResponses);

        return response;
    }


//      Maps OrderItem entity to OrderItemResponse DTO

    public OrderItemResponse toOrderItemResponse(OrderItem item) {
        OrderItemResponse res = new OrderItemResponse();
        res.setItemName(item.getItemName());
        res.setPrice(item.getPrice());
        res.setQuantity(item.getQuantity());
        res.setTax(item.getTax());
        res.setTaxAmount(item.getTaxAmount());
        res.setTotal(item.getTotal());
        return res;
    }
}