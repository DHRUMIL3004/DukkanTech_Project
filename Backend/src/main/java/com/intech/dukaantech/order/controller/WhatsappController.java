package com.intech.dukaantech.order.controller;

import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.repository.BillingRepository;
import com.intech.dukaantech.billing.service.BillingService;
import com.intech.dukaantech.customer.model.Customer;
import com.intech.dukaantech.customer.repository.CustomerRepository;
import com.intech.dukaantech.order.service.WhatsappService;
import com.twilio.rest.api.v2010.account.call.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/whatsapp")
@RequiredArgsConstructor
public class WhatsappController {

    private final WhatsappService whatsappService;
    private final CustomerRepository customerRepository;
    private final BillingService billingService;



    @GetMapping("/send/{id}")
    public String sendMsg(@PathVariable String id) {

        Bill bill =billingService.getBillByOrderId(id);


        Customer customer=bill.getCustomer();

        String phone=customer.getPhone();

       String name= customer.getCustomerName();

//        whatsappService.sendMessage("91"+phone,"Payement Alert :   " +"Hello  "+ name + " Your Payment of  " + bill.getTotalAmount()+" is success , Thanks form DukkanTech ");

        return  "msg sent on "+phone;
    }
}
