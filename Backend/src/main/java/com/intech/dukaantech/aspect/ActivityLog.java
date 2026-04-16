package com.intech.dukaantech.aspect;

import com.intech.dukaantech.authentication.security.CurrentUser;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
public class ActivityLog {

    private static final Logger activityLog =
            LoggerFactory.getLogger("ACTIVITY_LOGGER");

    // Apply to all controllers and services
    @Pointcut("within(com.intech.dukaantech..*.controller..*) || " +
            "within(com.intech.dukaantech..*.service..*)")
    public void applicationLayer() {}

    @Around("applicationLayer()")
    public Object logActivity(ProceedingJoinPoint pjp) throws Throwable {

        String className  = pjp.getTarget().getClass().getSimpleName();
        String methodName = pjp.getSignature().getName();
        String user       = AspectUtils.getCurrentUser();

        long start = System.currentTimeMillis();

        activityLog.info(
                "[ENTER] class={} | method={} | user={}",
                className, methodName, user
        );

        try {

            Object result = pjp.proceed();
            long duration = System.currentTimeMillis() - start;

            activityLog.info(
                    "[EXIT] class={} | method={} | status=SUCCESS | durationMs={}",
                    className, methodName, duration
            );

            return result;

        } catch (Throwable ex) {

            long duration = System.currentTimeMillis() - start;

            activityLog.info(
                    "[EXIT] class={} | method={} | status=FAILED | durationMs={}",
                    className, methodName, duration
            );

            throw ex;
        }
    }
}