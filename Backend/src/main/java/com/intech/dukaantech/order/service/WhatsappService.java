package com.intech.dukaantech.order.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsappService {

    @Value("${twilio.account-sid}")
    private String sid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String from;



   public void sendMessage(String to, String message){
       Twilio.init(sid,authToken);
       System.out.println(from);
       Message.creator(
               new PhoneNumber("whatsapp:" + to),
               new PhoneNumber(from),
               message
       ).create();
    }

}
