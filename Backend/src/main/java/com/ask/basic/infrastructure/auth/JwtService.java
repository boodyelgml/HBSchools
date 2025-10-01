package com.ask.basic.infrastructure.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

import static java.time.temporal.ChronoUnit.DAYS;

@Data
@AllArgsConstructor
@Service
public class JwtService {
    private static final String SECRET_KEY = "3778214125442A472D4B6150645267556B58703273357638792F423F4528482B";

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimType) {
        final Claims claims = extractAllClaims(token);
        return claimType.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }

    private Key getSigningKey() {
        byte[] bytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(bytes);
    }

    public String generateToken(Map<String, Objects> extraClaims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(
                        Date.from(
                                Instant.now().plus(15, DAYS)
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }



    public String generateToken(UserDetails userDetails) {
        return generateToken(Collections.emptyMap(),userDetails);
    }

    public Boolean isTokenValid(String token, UserDetails userDetails) {
        String tokenUsername = extractUserName(token);
        return tokenUsername.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
