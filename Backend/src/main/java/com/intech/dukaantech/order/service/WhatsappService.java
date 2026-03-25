package com.intech.dukaantech.order.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class WhatsappService {

    @Value("${twilio.account-sid}")
    private String sid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String from;



   public void sendMessage(String to, String name, BigDecimal amount){
       Twilio.init(sid,authToken);
       System.out.println(from);
       Message.creator(
               new PhoneNumber("whatsapp:" + to),
               new PhoneNumber(from),
               ""
       ).setContentSid("HXfc0cca0961b309099e19ee381475ebe7")
               .setContentVariables("{\"1\":\"" + name + "\",\"2\":\"" + amount + "\"}")
               .create();
    }

}
