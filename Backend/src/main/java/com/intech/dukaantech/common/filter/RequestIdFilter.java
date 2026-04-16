package com.intech.dukaantech.common.filter;

import jakarta.servlet.*;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(1) // VERY IMPORTANT → runs before JWT filter
public class RequestIdFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        // Generate one requestId per request
        String requestId = UUID.randomUUID().toString().substring(0, 8);

        // Put into MDC
        MDC.put("requestId", requestId);

        try {
            chain.doFilter(request, response);
        } finally {
            // MUST clear after request
            MDC.clear();
        }
    }
}