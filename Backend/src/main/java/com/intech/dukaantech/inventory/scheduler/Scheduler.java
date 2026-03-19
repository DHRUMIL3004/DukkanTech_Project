package com.intech.dukaantech.inventory.scheduler;

import com.intech.dukaantech.inventory.model.Item;
import com.intech.dukaantech.inventory.service.EmailServices;
import com.intech.dukaantech.inventory.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Scheduler {

    @Autowired
    private ItemService itemService;

    @Autowired
    private EmailServices emailServices;

    @Scheduled(cron = "0 * * * * ?")
    public void checkLowStock() {
        List<Item> items= itemService.getLowStockItems();
        System.out.println("Low Stock Alert");
        if (!items.isEmpty()) {
            emailServices.sendLowStockEmail(items);
        }
    }
}
