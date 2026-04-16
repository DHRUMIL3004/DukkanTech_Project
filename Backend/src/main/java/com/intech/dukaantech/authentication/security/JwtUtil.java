package com.intech.dukaantech.authentication.security;


import com.intech.dukaantech.user.model.UserEntity;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(UserEntity user){

        String token= Jwts.builder()
                .setSubject(user.getUserId())
                .claim("role", user.getRole().name())
                .claim("email", user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+86400000))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();

        return token;
    }

    public String extractEmail(String token){
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .get("email", String.class);
    }

    public String extractRole(String token){
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public String extractUserId(String token){
        String userId = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();

        return userId;
    }

    public boolean validateToken(String token){

        try{
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}