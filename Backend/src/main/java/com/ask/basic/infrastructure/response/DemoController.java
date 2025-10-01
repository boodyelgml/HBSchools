package com.ask.basic.infrastructure.response;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/demo")
public class DemoController {

    @GetMapping("/success")
    public ApiResponse<String> successExample() {
        return ApiResponse.success("This is a successful response", "Operation completed successfully");
    }

    @GetMapping("/error")
    public ApiResponse<String> errorExample() {
        throw new RuntimeException("This is a test error to demonstrate unified error handling");
    }
}
