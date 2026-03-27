package com.intech.dukaantech.order.service;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.mapper.BillingMapper;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.repository.BillingRepository;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.order.dto.OrderHistorySummaryResponse;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private final BillingRepository billingRepository;
    private final BillingMapper billingMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BillingResponse> fetchOrders(
            int page,
            int size,
            String search,
            String fromDate,
            String toDate,
            String sortBy,
            String sortDir
    ) {

        if (sortBy.equals("customerName")) {
            sortBy = "customer.customerName";
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                sortDir.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending()
        );

        Specification<Bill> spec = buildOrderFilters(search, fromDate, toDate);

        Page<Bill> billPage = billingRepository.findAll(spec, pageable);

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

    @Override
    @Transactional(readOnly = true)
    public OrderHistorySummaryResponse fetchOrderSummary(String search, String fromDate, String toDate) {
        Specification<Bill> spec = buildOrderFilters(search, fromDate, toDate);
        List<Bill> bills = billingRepository.findAll(spec);

        long totalOrders = bills.size();
        long totalCustomers = bills.stream()
                .map(Bill::getCustomer)
                .filter(customer -> customer != null && customer.getPhone() != null && !customer.getPhone().isBlank())
                .map(customer -> customer.getPhone().trim())
                .distinct()
                .count();

        BigDecimal totalRevenue = bills.stream()
                .map(Bill::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageOrderValue = totalOrders > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return OrderHistorySummaryResponse.builder()
                .totalCustomers(totalCustomers)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .averageOrderValue(averageOrderValue)
                .build();
    }

    private Specification<Bill> buildOrderFilters(String search, String fromDate, String toDate) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {

                Join<Object, Object> customerJoin = root.join("customer");

                Predicate name = cb.like(
                        cb.lower(customerJoin.get("customerName")),
                        "%" + search.toLowerCase() + "%"
                );

                Predicate phone = cb.like(
                        customerJoin.get("phone"),
                        "%" + search + "%"
                );

                Predicate amount = cb.like(
                        root.get("totalAmount").as(String.class),
                        "%" + search + "%"
                );

                predicates.add(cb.or(name, phone, amount));
            }

            if (fromDate != null && !fromDate.isBlank() && toDate != null && !toDate.isBlank()) {
                predicates.add(cb.between(
                        root.get("createdAt"),
                        Timestamp.valueOf(fromDate + " 00:00:00"),
                        Timestamp.valueOf(toDate + " 23:59:59")
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Override
    public BigDecimal getTotalRevenue() {
        return billingRepository.getTotalRevenue();
    }
}