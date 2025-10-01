package com.ask.basic.auth.service;

import com.ask.basic.auth.domain.User;
import com.ask.basic.auth.domain.UserRepository;
import com.ask.basic.auth.request.LoginRequest;
import com.ask.basic.auth.request.RegisterRequest;
import com.ask.basic.auth.response.LoginResponse;
import com.ask.basic.infrastructure.auth.JwtService;
import com.ask.basic.infrastructure.exceptions.GeneralRulePlatformException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Data
@RequiredArgsConstructor
@Service
public class AuthWritePlatformServiceImpl implements AuthWritePlatformService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public LoginResponse register(RegisterRequest request) {

        if (userEmailExists(request)) {
            throw new GeneralRulePlatformException("this user already exists");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();

        String token = "Bearer " + jwtService.generateToken(user);

        this.userRepository.save(user);
        return LoginResponse.builder()
                .token(token)
                .build();


    }

    private Boolean userEmailExists(RegisterRequest request) {
        return this.userRepository.findByEmail(request.getEmail()).isPresent();
    }

    @Override
    public LoginResponse authenticate(LoginRequest request) throws IOException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = this.userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = "Bearer " + jwtService.generateToken(user);
        return LoginResponse.builder()
                .token(token)
                .StatusCode("200")
                .build();

    }


}
