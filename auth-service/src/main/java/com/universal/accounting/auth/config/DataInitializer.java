package com.universal.accounting.auth.config;

import com.universal.accounting.auth.repository.UserRepository;
import com.universal.accounting.auth.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createDemoUsers();
    }

    private void createDemoUsers() {
        // Demo Admin User
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@universalaccounting.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("User")
                    .role(User.UserRole.ADMIN)
                    .tenantId(1L)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            log.info("Created demo admin user: admin/admin123");
        }

        // Demo Accountant User
        if (!userRepository.existsByUsername("accountant")) {
            User accountant = User.builder()
                    .username("accountant")
                    .email("accountant@universalaccounting.com")
                    .passwordHash(passwordEncoder.encode("accountant123"))
                    .firstName("John")
                    .lastName("Accountant")
                    .role(User.UserRole.ACCOUNTANT)
                    .tenantId(1L)
                    .isActive(true)
                    .build();
            userRepository.save(accountant);
            log.info("Created demo accountant user: accountant/accountant123");
        }

        // Demo Regular User
        if (!userRepository.existsByUsername("user")) {
            User user = User.builder()
                    .username("user")
                    .email("user@universalaccounting.com")
                    .passwordHash(passwordEncoder.encode("user123"))
                    .firstName("Jane")
                    .lastName("User")
                    .role(User.UserRole.USER)
                    .tenantId(1L)
                    .isActive(true)
                    .build();
            userRepository.save(user);
            log.info("Created demo user: user/user123");
        }

        // Demo Restaurant Owner
        if (!userRepository.existsByUsername("restaurant")) {
            User restaurant = User.builder()
                    .username("restaurant")
                    .email("owner@restaurant.com")
                    .passwordHash(passwordEncoder.encode("restaurant123"))
                    .firstName("Maria")
                    .lastName("Restaurant")
                    .role(User.UserRole.ACCOUNTANT)
                    .tenantId(2L)
                    .isActive(true)
                    .build();
            userRepository.save(restaurant);
            log.info("Created demo restaurant user: restaurant/restaurant123");
        }

        // Demo Retail Owner
        if (!userRepository.existsByUsername("retail")) {
            User retail = User.builder()
                    .username("retail")
                    .email("owner@retail.com")
                    .passwordHash(passwordEncoder.encode("retail123"))
                    .firstName("David")
                    .lastName("Retail")
                    .role(User.UserRole.ACCOUNTANT)
                    .tenantId(3L)
                    .isActive(true)
                    .build();
            userRepository.save(retail);
            log.info("Created demo retail user: retail/retail123");
        }

        // Demo Freelancer
        if (!userRepository.existsByUsername("freelancer")) {
            User freelancer = User.builder()
                    .username("freelancer")
                    .email("freelancer@example.com")
                    .passwordHash(passwordEncoder.encode("freelancer123"))
                    .firstName("Alex")
                    .lastName("Freelancer")
                    .role(User.UserRole.USER)
                    .tenantId(4L)
                    .isActive(true)
                    .build();
            userRepository.save(freelancer);
            log.info("Created demo freelancer user: freelancer/freelancer123");
        }

        log.info("Demo users initialization completed!");
        log.info("Available demo users:");
        log.info("1. admin/admin123 (ADMIN role, Tenant 1)");
        log.info("2. accountant/accountant123 (ACCOUNTANT role, Tenant 1)");
        log.info("3. user/user123 (USER role, Tenant 1)");
        log.info("4. restaurant/restaurant123 (ACCOUNTANT role, Tenant 2)");
        log.info("5. retail/retail123 (ACCOUNTANT role, Tenant 3)");
        log.info("6. freelancer/freelancer123 (USER role, Tenant 4)");
    }
}
