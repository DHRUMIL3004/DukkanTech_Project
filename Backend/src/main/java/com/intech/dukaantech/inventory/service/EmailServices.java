package com.intech.dukaantech.inventory.service;


import com.intech.dukaantech.inventory.model.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailServices {

    @Autowired
    private JavaMailSender mailSender;

    public void sendLowStockEmail(List<Item> items){

        StringBuilder content = new StringBuilder();
        content.append(" Low Stock Alert (Below 2)\n\n");

        for(Item item:items){
            content.append( "Item Name : " + item.getName()+"\n");
            content.append("Item Qty : "+item.getQuantity()+"\n");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("dhrumil.patel@ics-global.in");
        message.setSubject("Low Stock Alert (<2)");
        message.setText(content.toString());

        mailSender.send(message);
    }
}
