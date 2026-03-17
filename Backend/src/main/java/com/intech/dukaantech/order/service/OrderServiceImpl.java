package com.intech.dukaantech.order.service;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.mapper.BillingMapper;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.repository.BillingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private final BillingRepository billingRepository;
   private final BillingMapper billingMapper;


    @Override
    public List<BillingResponse> fetchOrders() {
        List<Bill> bills=billingRepository.findAll();
        return bills.stream()
                .map(billingMapper :: toBillingResponse)
                .toList();
    }
}
