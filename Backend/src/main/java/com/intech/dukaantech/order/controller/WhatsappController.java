package com.intech.dukaantech.order.controller;

import com.intech.dukaantech.order.service.WhatsappService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/whatsapp")
@RequiredArgsConstructor
public class WhatsappController {

    private final WhatsappService whatsappService;

    @GetMapping("/send")
    public String sendMsg(){
        whatsappService.sendMessage("917874658874","Hello from DukaanTech, Order is Completed , Thanks for Coming!!!!!");

        return "sent successfull !";

    }
}
