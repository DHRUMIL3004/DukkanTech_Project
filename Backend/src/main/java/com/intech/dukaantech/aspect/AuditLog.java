package com.intech.dukaantech.aspect;

import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.user.dto.UserResponse;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditLog {

    private static final Logger auditLog =
            LoggerFactory.getLogger("AUDIT_LOGGER");

    // POINTCUTS

    @Pointcut("execution(* com.intech.dukaantech.inventory.service.ItemServiceImpl.add(..))")
    public void itemCreated() {}

    @Pointcut("execution(* com.intech.dukaantech.inventory.service.ItemServiceImpl.updateItem(..))")
    public void itemUpdated() {}

    @Pointcut("execution(* com.intech.dukaantech.inventory.service.ItemServiceImpl.deleteItem(..))")
    public void itemDeleted() {}

    @Pointcut("execution(* com.intech.dukaantech.category.service.CategoryServiceImpl.createCategory(..))")
    public void categoryCreated() {}

    @Pointcut("execution(* com.intech.dukaantech.category.service.CategoryServiceImpl.updateCategory(..))")
    public void categoryUpdated() {}

    @Pointcut("execution(* com.intech.dukaantech.category.service.CategoryServiceImpl.deleteCategory(..))")
    public void categoryDeleted() {}

    @Pointcut("execution(* com.intech.dukaantech.user.service.UserServiceImpl.createUser(..))")
    public void userCreated() {}

    @Pointcut("execution(* com.intech.dukaantech.user.service.UserServiceImpl.updateUser(..))")
    public void userUpdated() {}

    @Pointcut("execution(* com.intech.dukaantech.user.service.UserServiceImpl.deleteUser(..))")
    public void userDeleted() {}

    // ADVICES

    // ITEM
    @AfterReturning(pointcut = "itemCreated()", returning = "response")
    public void afterItemCreated(Object response) {
        String user = getCurrentUser();

        if (response instanceof ItemResponse item) {
            auditLog.info(
                    "[CREATE ITEM] itemId={} | name={} | price={} | user={}",
                    item.getItemId(), item.getName(), item.getPrice(), user
            );
        }
    }

    @AfterReturning("itemUpdated()")
    public void afterItemUpdated(JoinPoint jp) {
        String itemId = extractId(jp);
        auditLog.info(
                "[UPDATE ITEM] itemId={} | user={}",
                itemId, getCurrentUser()
        );
    }

    @AfterReturning("itemDeleted()")
    public void afterItemDeleted(JoinPoint jp) {
        String itemId = extractId(jp);
        auditLog.info(
                "[DELETE ITEM] itemId={} | user={}",
                itemId, getCurrentUser()
        );
    }

    // CATEGORY
    @AfterReturning(pointcut = "categoryCreated()", returning = "response")
    public void afterCategoryCreated(Object response) {
        if (response instanceof CategoryResponse cat) {
            auditLog.info(
                    "[CREATE CATEGORY] categoryId={} | name={} | user={}",
                    cat.getCategoryId(), cat.getName(), getCurrentUser()
            );
        }
    }

    @AfterReturning("categoryUpdated()")
    public void afterCategoryUpdated(JoinPoint jp) {
        auditLog.info(
                "[UPDATE CATEGORY] categoryId={} | user={}",
                extractId(jp), getCurrentUser()
        );
    }

    @AfterReturning("categoryDeleted()")
    public void afterCategoryDeleted(JoinPoint jp) {
        auditLog.info(
                "[DELETE CATEGORY] categoryId={} | user={}",
                extractId(jp), getCurrentUser()
        );
    }

    // USER
    @AfterReturning(pointcut = "userCreated()", returning = "response")
    public void afterUserCreated(Object response) {
        if (response instanceof UserResponse userRes) {
            auditLog.info(
                    "[CREATE USER] userId={} | name={} | role={} | createdBy={}",
                    userRes.getUserId(), userRes.getName(), userRes.getRole(), getCurrentUser()
            );
        }
    }

    @AfterReturning("userUpdated()")
    public void afterUserUpdated(JoinPoint jp) {
        auditLog.info(
                "[UPDATE USER] userId={} | updatedBy={}",
                extractId(jp), getCurrentUser()
        );
    }

    @AfterReturning("userDeleted()")
    public void afterUserDeleted(JoinPoint jp) {
        auditLog.info(
                "[DELETE USER] userId={} | deletedBy={}",
                extractId(jp), getCurrentUser()
        );
    }

    // helper methods

    private String getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                return auth.getPrincipal().toString(); // replace with userId if available
            }
        } catch (Exception ignored) {}

        return "anonymous";
    }

    private String extractId(JoinPoint jp) {
        Object[] args = jp.getArgs();
        if (args != null && args.length > 0) {
            return String.valueOf(args[0]);
        }
        return "?";
    }
}