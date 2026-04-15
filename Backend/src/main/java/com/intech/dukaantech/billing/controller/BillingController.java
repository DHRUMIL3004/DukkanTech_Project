package com.intech.dukaantech.billing.controller;

import com.intech.dukaantech.billing.dto.BillingRequest;
import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.service.BillingService;
import com.intech.dukaantech.billing.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;
    private final PdfService pdfService;


    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @PostMapping("/create")
    public ResponseEntity<BillingResponse> createOrder(@RequestBody BillingRequest request){
        return   ResponseEntity.ok(billingService.createOrder(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @PostMapping("/invoice")
    public ResponseEntity<byte[]> generate(@RequestBody Map<String,Object> data){
         byte[] pdf =pdfService.generateInvoice(data);

         return ResponseEntity.ok()
                 .header("Content-Disposition", "attachment; filename=invoice.pdf")
                 .contentType(MediaType.APPLICATION_PDF)
                 .body(pdf);
    }

}
