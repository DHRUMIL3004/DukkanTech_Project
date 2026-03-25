package com.intech.dukaantech.inventory.controller;

import com.intech.dukaantech.inventory.model.Item;
import com.intech.dukaantech.inventory.repository.ItemRepository;
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

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping("/mail")
    public String sendTestMail() {


        Item item = new Item();

        List<Item> lowStockItems=itemRepository.findByQuantityLessThan(2);




        if (lowStockItems.isEmpty()) {
            return "No low stock items found!";
        }

        emailService.sendLowStockEmail(lowStockItems);

        return "Email sent!";
    }
}
