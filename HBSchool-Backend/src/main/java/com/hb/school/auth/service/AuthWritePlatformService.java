package com.hb.school.auth.service;

import com.hb.school.auth.request.LoginRequest;
import com.hb.school.auth.request.RegisterRequest;
import com.hb.school.auth.response.LoginResponse;

import java.io.IOException;

public interface AuthWritePlatformService {
    LoginResponse register(RegisterRequest request);

    LoginResponse authenticate(LoginRequest request) throws IOException;
}
