package com.intech.dukaantech.inventory.service;


import com.intech.dukaantech.inventory.model.Item;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailServices {

    @Autowired
    private JavaMailSender mailSender;

    public void sendLowStockEmail(List<Item> items) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo("xyzpatel8077@gmail.com");
            helper.setSubject("Low Stock Alert");

            String htmlContent = buildHtml(items);

            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
      private String buildHtml(List<Item> items){

            StringBuilder rows = new StringBuilder();

            for (Item item : items) {
                rows.append("<tr>")
                        .append("<td>").append(item.getName()).append("</td>")
                        .append("<td>").append(item.getQuantity()).append("</td>")
                        .append("</tr>");
            }

            return """
            <html>
            <body style="font-family: Arial; background-color:#f4f6f8; padding:20px;">
                
                <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:20px;">
                    
                    <h2 style="color:#e63946; text-align:center;">
                        🚨 Low Stock Alert
                    </h2>

                    <p style="text-align:center; color:#555;">
                        The following items are running low in your inventory.
                    </p>

                    <table style="width:100%; border-collapse:collapse; margin-top:20px;">
                        <thead>
                            <tr style="background:#e63946; color:white;">
                                <th style="padding:10px;">Item Name</th>
                                <th style="padding:10px;">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            """ + rows + """
                        </tbody>
                    </table>

                    <p style="margin-top:20px; color:#777; text-align:center;">
                        Please restock soon to avoid stockouts.
                    </p>

                    <hr>

                    <p style="text-align:center; font-size:12px; color:#aaa;">
                        DukaanTech Inventory System
                    </p>

                </div>
            </body>
            </html>
        """;

        }


    }

