package com.intech.dukaantech.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ErrorLog {

    private static final Logger errorLog = LoggerFactory.getLogger("ERROR_LOGGER");

    @Pointcut("execution(* com.intech.dukaantech..controller..*(..)) || " +
                    "execution(* com.intech.dukaantech..service..*(..))")
    public void applicationLayer(){}

    @AfterThrowing(pointcut = "applicationLayer()", throwing = "ex")
    public void logError(JoinPoint jp, Throwable ex){

        String className = jp.getTarget().getClass().getSimpleName();
        String methodName = jp.getSignature().getName();
        String user = getCurrentUser();
        String exType = ex.getClass().getSimpleName();
        String message = ex.getMessage();

        if(isBussinessException(ex)){
            // Business errors -> ERROR(with no stack trace)
            errorLog.warn("[BUSINESS_ERROR] class={} | method={} | exception={} | message={} | user={}",
                    className, methodName, exType, message, user);
        }else {

            // System errors -> ERROR(with stack trace)
            errorLog.warn("[SYSTEM_ERROR] class={} | method={} | exception={} | message={} | user={}",
                    className, methodName, exType, message, user, ex);
        }
    }

    // helper method
    private boolean isBussinessException(Throwable ex){

        String pkg = ex.getClass().getPackageName();

        if (pkg.startsWith("com.intech.dukaantech.common.exception")){
            return true;
        }

        String type = ex.getClass().getSimpleName();

        return type.contains("AccessDenied")
                || type.contains("Authentication")
                || type.contains("BadCredentials");
    }

    private String getCurrentUser(){

        try{
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())){
                return auth.getPrincipal().toString();
            }
        }catch (Exception ignored){}

        return "anonymous";
    }
}
