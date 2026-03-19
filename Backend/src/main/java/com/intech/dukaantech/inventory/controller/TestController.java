package com.intech.dukaantech.inventory.controller;

import com.intech.dukaantech.inventory.model.Item;
import com.intech.dukaantech.inventory.service.EmailServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private EmailServices emailService;

    @GetMapping("/mail")
    public String sendTestMail() {

        Item item = new Item();
        item.setName("Test Product");
        item.setQuantity(5L);

        List<Item> list = new ArrayList<>();
        list.add(item);

        emailService.sendLowStockEmail(list);

        return "Email sent!";
    }
}
