package com.intech.dukaantech.order.service;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.mapper.BillingMapper;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.repository.BillingRepository;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.order.dto.OrderHistorySummaryResponse;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import static com.intech.dukaantech.billing.model.QBill.bill;
import static com.intech.dukaantech.customer.model.QCustomer.customer;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private final BillingRepository billingRepository;
    private final BillingMapper billingMapper;
        private final JPAQueryFactory queryFactory;

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

        BooleanBuilder where = buildOrderFilters(search, fromDate, toDate);

                OrderSpecifier<?> orderSpecifier = null;
                if (sortBy != null && !sortBy.isBlank()) {
                        Order direction = "asc".equalsIgnoreCase(sortDir) ? Order.ASC : Order.DESC;
                        orderSpecifier = switch (sortBy) {
                                case "customerName" -> new OrderSpecifier<>(direction, customer.customerName);
                                case "phone" -> new OrderSpecifier<>(direction, customer.phone);
                                case "totalAmount" -> new OrderSpecifier<>(direction, bill.totalAmount);
                                case "paymentMethod" -> new OrderSpecifier<>(direction, bill.paymentMethod);
                                default -> new OrderSpecifier<>(direction, bill.createdAt);
                        };
                }

                var query = queryFactory
                .selectFrom(bill)
                .leftJoin(bill.customer, customer).fetchJoin()
                                .where(where);

                if (orderSpecifier != null) {
                        query.orderBy(orderSpecifier);
                }

                List<Bill> bills = query
                .offset((long) page * size)
                .limit(size)
                .fetch();

        Long totalElements = queryFactory
                .select(bill.count())
                .from(bill)
                .leftJoin(bill.customer, customer)
                .where(where)
                .fetchOne();

        long safeTotal = totalElements == null ? 0L : totalElements;

        List<BillingResponse> responseList = bills
                .stream()
                .map(billingMapper::toBillingResponse)
                .toList();

        return PageResponse.<BillingResponse>builder()
                .page(page)
                .size(size)
                .totalPages((int) Math.ceil((double) safeTotal / size))
                .totalElements(safeTotal)
                .data(responseList)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderHistorySummaryResponse fetchOrderSummary(String search, String fromDate, String toDate) {
        BooleanBuilder where = buildOrderFilters(search, fromDate, toDate);

        List<Bill> bills = queryFactory
                .selectFrom(bill)
                .leftJoin(bill.customer, customer).fetchJoin()
                .where(where)
                .fetch();

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

        private BooleanBuilder buildOrderFilters(String search, String fromDate, String toDate) {
                BooleanBuilder where = new BooleanBuilder();

                if (search != null && !search.isBlank()) {
                        where.and(
                                        customer.customerName.containsIgnoreCase(search)
                                                        .or(customer.phone.contains(search))
                                                        .or(bill.totalAmount.stringValue().contains(search))
                        );
                }

                if (fromDate != null && !fromDate.isBlank() && toDate != null && !toDate.isBlank()) {
                        where.and(bill.createdAt.between(
                                        Timestamp.valueOf(fromDate + " 00:00:00"),
                                        Timestamp.valueOf(toDate + " 23:59:59")
                        ));
                }

                return where;
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalRevenue() {
        return billingRepository.getTotalRevenue();
    }
}