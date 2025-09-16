package com.universal.accounting.auth.service;

import com.universal.accounting.auth.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Set the secret key using reflection
        ReflectionTestUtils.setField(jwtService, "secretKey", "mySecretKey123456789012345678901234567890");
        ReflectionTestUtils.setField(jwtService, "expiration", 86400000L); // 24 hours

        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .role(User.UserRole.USER)
                .tenantId(1L)
                .build();
    }

    @Test
    void generateToken_ShouldReturnValidJwtToken() {
        // When
        String token = jwtService.generateToken(testUser);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts separated by dots
    }

    @Test
    void generateRefreshToken_ShouldReturnValidJwtToken() {
        // When
        String refreshToken = jwtService.generateRefreshToken(testUser);

        // Then
        assertThat(refreshToken).isNotNull();
        assertThat(refreshToken).isNotEmpty();
        assertThat(refreshToken.split("\\.")).hasSize(3); // JWT has 3 parts separated by dots
    }

    @Test
    void extractUsername_WithValidToken_ShouldReturnUsername() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        String username = jwtService.extractUsername(token);

        // Then
        assertThat(username).isEqualTo("testuser");
    }

    @Test
    void extractExpiration_WithValidToken_ShouldReturnExpirationDate() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        Date expiration = jwtService.extractExpiration(token);

        // Then
        assertThat(expiration).isNotNull();
        assertThat(expiration.getTime()).isGreaterThan(System.currentTimeMillis());
    }

    @Test
    void isTokenValid_WithValidToken_ShouldReturnTrue() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        boolean isValid = jwtService.isTokenValid(token, testUser);

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    void isTokenValid_WithExpiredToken_ShouldReturnFalse() {
        // Given
        ReflectionTestUtils.setField(jwtService, "expiration", 1L); // 1ms expiration
        String expiredToken = jwtService.generateToken(testUser);
        
        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Reset expiration for other tests
        ReflectionTestUtils.setField(jwtService, "expiration", 86400000L);

        // When
        boolean isValid = jwtService.isTokenValid(expiredToken, testUser);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    void isTokenValid_WithWrongUser_ShouldReturnFalse() {
        // Given
        String token = jwtService.generateToken(testUser);
        
        User differentUser = User.builder()
                .id(2L)
                .username("differentuser")
                .email("different@example.com")
                .role(User.UserRole.ADMIN)
                .tenantId(2L)
                .build();

        // When
        boolean isValid = jwtService.isTokenValid(token, differentUser);

        // Then
        assertThat(isValid).isFalse();
    }
}
