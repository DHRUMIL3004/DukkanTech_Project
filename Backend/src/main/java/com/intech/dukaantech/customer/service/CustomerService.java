package com.intech.dukaantech.customer.service;

import com.intech.dukaantech.billing.dto.BillingRequest;
import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.customer.model.Customer;

import java.util.Optional;

public interface CustomerService {

   Optional<Customer> findByPhone(String phone);

   Customer createOrUpdate(Customer customer);

}
