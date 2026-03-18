package com.intech.dukaantech.customer.service;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.customer.model.Customer;
import com.intech.dukaantech.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImp implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public Optional<Customer> findByPhone(String phone) {
        return customerRepository.findByPhone(phone);
    }

    @Override
    public Customer createOrUpdate(Customer customerData) {
        Customer customer = customerRepository.findByPhone(customerData.getPhone())
                .orElse(new Customer());

        customer.setPhone(customerData.getPhone());
        customer.setCustomerName(customerData.getCustomerName());
        customer.setCity(customerData.getCity());
        customer.setDob(customerData.getDob());


        return customerRepository.save(customer);
    }
}
