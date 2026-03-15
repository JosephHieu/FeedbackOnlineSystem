package com.josephhieu.feedbackonline.common.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.UUID;

@Component
public class TraceIdFilter implements Filter {

    private static final String TRACE_ID = "traceId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            String traceId = UUID.randomUUID().toString().substring(0, 8);

            MDC.put(TRACE_ID, traceId);

            chain.doFilter(request, response);
        } finally {
            MDC.remove(TRACE_ID);
        }
    }
}