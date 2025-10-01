package com.ask.basic.auth.service;

import com.ask.basic.auth.request.LoginRequest;
import com.ask.basic.auth.request.RegisterRequest;
import com.ask.basic.auth.response.LoginResponse;

import java.io.IOException;

public interface AuthWritePlatformService {
    LoginResponse register(RegisterRequest request);

    LoginResponse authenticate(LoginRequest request) throws IOException;
}
