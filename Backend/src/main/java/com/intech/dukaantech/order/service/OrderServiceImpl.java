package com.intech.dukaantech.order.service;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.mapper.BillingMapper;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.repository.BillingRepository;
import com.intech.dukaantech.common.dto.PageResponse;
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

        Specification<Bill> spec = (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // 🔍 SEARCH
            if (search != null && !search.isEmpty()) {

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

            // 📅 DATE FILTER
            if (fromDate != null && toDate != null) {
                predicates.add(cb.between(
                        root.get("createdAt"),
                        Timestamp.valueOf(fromDate + " 00:00:00"),
                        Timestamp.valueOf(toDate + " 23:59:59")
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

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
}