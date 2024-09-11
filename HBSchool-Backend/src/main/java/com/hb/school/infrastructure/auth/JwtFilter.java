package com.hb.school.infrastructure.auth;


import com.hb.school.auth.domain.User;
import com.hb.school.auth.domain.UserRepository;
import com.hb.school.infrastructure.exceptions.NotFoundException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;

@Component
@Data
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        String token = request.getHeader("token");
        if (isNotBearer(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = token.substring(7);
        String email = jwtService.extractUserName(jwt);

        if (userNotAuthenticated(email)) {
            User user = this.userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("user", email));

            if (jwtService.isTokenValid(jwt, user)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

            filterChain.doFilter(request, response);
        }
    }

    private static boolean isNotBearer(String token) {
        return token == null || !token.startsWith("Bearer");
    }

    Boolean userNotAuthenticated(String email) {
        return email != null && SecurityContextHolder.getContext().getAuthentication() == null;
    }
}
