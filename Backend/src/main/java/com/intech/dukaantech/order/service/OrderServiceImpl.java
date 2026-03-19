package com.intech.dukaantech.order.service;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.mapper.BillingMapper;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.repository.BillingRepository;
import com.intech.dukaantech.common.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private final BillingRepository billingRepository;
    private final BillingMapper billingMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BillingResponse> fetchOrders(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Bill> billPage = billingRepository.findAll(pageable);

        List<BillingResponse> responseList = billPage.getContent()
                .stream()
                .map(billingMapper::toBillingResponse)
                .toList();

        return PageResponse.<BillingResponse>builder()
                .page(billPage.getNumber())
                .size(billPage.getSize())
                .totalPages(billPage.getTotalPages())
                .totalElements(billPage.getTotalElements())
                .data(responseList)
                .build();
    }
}