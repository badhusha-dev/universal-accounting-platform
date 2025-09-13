package com.universal.accounting.auth.service;

import com.universal.accounting.auth.dto.AuthDto;
import com.universal.accounting.auth.repository.UserRepository;
import com.universal.accounting.auth.entity.User;
import com.universal.accounting.event.contracts.Events;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(User.UserRole.USER)
                .tenantId(request.getTenantId())
                .isActive(true)
                .build();
        
        user = userRepository.save(user);
        
        String token = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        // Publish user registration event
        Events.UserLoggedIn event = new Events.UserLoggedIn(
                user.getId(),
                user.getTenantId(),
                user.getUsername(),
                LocalDateTime.now(),
                "127.0.0.1"
        );
        kafkaTemplate.send("user-events", event);
        
        return AuthDto.AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .tenantId(user.getTenantId())
                .expiresIn(86400L)
                .build();
    }
    
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        User user = (User) authentication.getPrincipal();
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        String token = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        // Publish login event
        Events.UserLoggedIn event = new Events.UserLoggedIn(
                user.getId(),
                user.getTenantId(),
                user.getUsername(),
                LocalDateTime.now(),
                "127.0.0.1"
        );
        kafkaTemplate.send("user-events", event);
        
        return AuthDto.AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .tenantId(user.getTenantId())
                .expiresIn(86400L)
                .build();
    }
    
    public AuthDto.AuthResponse refreshToken(AuthDto.RefreshTokenRequest request) {
        String username = jwtService.extractUsername(request.getRefreshToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!jwtService.isTokenValid(request.getRefreshToken(), user)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        String token = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        return AuthDto.AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .tenantId(user.getTenantId())
                .expiresIn(86400L)
                .build();
    }
}
