package com.universal.accounting.auth.controller;

import com.universal.accounting.auth.dto.AuthDto;
import com.universal.accounting.auth.service.AuthService;
import com.universal.accounting.common.aspects.LogExecution;
import com.universal.accounting.common.aspects.MonitorPerformance;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    @LogExecution
    @MonitorPerformance
    public ResponseEntity<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        AuthDto.AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    @LogExecution
    @MonitorPerformance
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        AuthDto.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    @LogExecution
    @MonitorPerformance
    public ResponseEntity<AuthDto.AuthResponse> refreshToken(@Valid @RequestBody AuthDto.RefreshTokenRequest request) {
        AuthDto.AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/.well-known/jwks.json")
    @LogExecution
    public ResponseEntity<String> getJwks() {
        // In a real implementation, this would return the JWKS
        return ResponseEntity.ok("{\"keys\":[]}");
    }
}
