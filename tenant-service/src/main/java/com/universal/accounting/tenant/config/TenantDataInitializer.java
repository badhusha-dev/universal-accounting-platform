package com.universal.accounting.tenant.config;

import com.universal.accounting.common.models.Tenant;
import com.universal.accounting.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class TenantDataInitializer implements CommandLineRunner {

    private final TenantRepository tenantRepository;

    @Override
    public void run(String... args) throws Exception {
        createDemoTenants();
    }

    private void createDemoTenants() {
        // Demo Tenant 1 - General Business
        if (!tenantRepository.existsByName("Universal Accounting Demo")) {
            Tenant tenant1 = Tenant.builder()
                    .name("Universal Accounting Demo")
                    .businessType("GENERAL")
                    .email("demo@universalaccounting.com")
                    .phone("+1-555-0100")
                    .address("123 Business St")
                    .city("New York")
                    .state("NY")
                    .country("USA")
                    .postalCode("10001")
                    .fiscalYearStart(LocalDate.of(2024, 1, 1))
                    .currencyCode("USD")
                    .isActive(true)
                    .schemaName("tenant_demo_1")
                    .build();
            tenantRepository.save(tenant1);
            log.info("Created demo tenant 1: Universal Accounting Demo");
        }

        // Demo Tenant 2 - Restaurant
        if (!tenantRepository.existsByName("Bella Vista Restaurant")) {
            Tenant tenant2 = Tenant.builder()
                    .name("Bella Vista Restaurant")
                    .businessType("RESTAURANT")
                    .email("info@bellavista.com")
                    .phone("+1-555-0200")
                    .address("456 Restaurant Ave")
                    .city("Los Angeles")
                    .state("CA")
                    .country("USA")
                    .postalCode("90210")
                    .fiscalYearStart(LocalDate.of(2024, 1, 1))
                    .currencyCode("USD")
                    .isActive(true)
                    .schemaName("tenant_restaurant_2")
                    .build();
            tenantRepository.save(tenant2);
            log.info("Created demo tenant 2: Bella Vista Restaurant");
        }

        // Demo Tenant 3 - Retail Store
        if (!tenantRepository.existsByName("TechMart Electronics")) {
            Tenant tenant3 = Tenant.builder()
                    .name("TechMart Electronics")
                    .businessType("RETAIL")
                    .email("sales@techmart.com")
                    .phone("+1-555-0300")
                    .address("789 Retail Blvd")
                    .city("Chicago")
                    .state("IL")
                    .country("USA")
                    .postalCode("60601")
                    .fiscalYearStart(LocalDate.of(2024, 1, 1))
                    .currencyCode("USD")
                    .isActive(true)
                    .schemaName("tenant_retail_3")
                    .build();
            tenantRepository.save(tenant3);
            log.info("Created demo tenant 3: TechMart Electronics");
        }

        // Demo Tenant 4 - Freelancer
        if (!tenantRepository.existsByName("Alex Freelancer Services")) {
            Tenant tenant4 = Tenant.builder()
                    .name("Alex Freelancer Services")
                    .businessType("FREELANCER")
                    .email("alex@freelancer.com")
                    .phone("+1-555-0400")
                    .address("321 Home Office")
                    .city("Austin")
                    .state("TX")
                    .country("USA")
                    .postalCode("73301")
                    .fiscalYearStart(LocalDate.of(2024, 1, 1))
                    .currencyCode("USD")
                    .isActive(true)
                    .schemaName("tenant_freelancer_4")
                    .build();
            tenantRepository.save(tenant4);
            log.info("Created demo tenant 4: Alex Freelancer Services");
        }

        log.info("Demo tenants initialization completed!");
        log.info("Available demo tenants:");
        log.info("1. Universal Accounting Demo (GENERAL business type)");
        log.info("2. Bella Vista Restaurant (RESTAURANT business type)");
        log.info("3. TechMart Electronics (RETAIL business type)");
        log.info("4. Alex Freelancer Services (FREELANCER business type)");
    }
}
