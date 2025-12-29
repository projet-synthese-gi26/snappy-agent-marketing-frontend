package com.example.snappy.controller;

import com.example.snappy.dto.*;
import com.example.snappy.repository.UserRepository;
import com.example.snappy.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        var user = userRepo.findByEmail(request.email)
                .orElseThrow();

        if (!user.getPassword().equals(request.password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return new LoginResponse(jwtUtil.generateToken(user.getEmail()));
    }
}
