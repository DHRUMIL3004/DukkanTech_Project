package com.intech.dukaantech.aspect;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AspectUtils {

    private AspectUtils(){} // prevent instantiation

    public static String getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {

                return auth.getPrincipal().toString();
            }
        } catch (Exception ignored) {}

        return "anonymous";
    }
}
