package com.universal.accounting.tenant.service;

import com.universal.accounting.common.models.Tenant;
import com.universal.accounting.event.contracts.Events;
import com.universal.accounting.tenant.dto.TenantDto;
import com.universal.accounting.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantService {
    
    private final TenantRepository tenantRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Transactional
    public TenantDto.Response createTenant(TenantDto.CreateRequest request) {
        if (tenantRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (tenantRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tenant name already exists");
        }
        
        String schemaName = "tenant_" + UUID.randomUUID().toString().replace("-", "");
        
        Tenant tenant = Tenant.builder()
                .name(request.getName())
                .businessType(request.getBusinessType())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .fiscalYearStart(request.getFiscalYearStart())
                .currencyCode(request.getCurrencyCode() != null ? request.getCurrencyCode() : "USD")
                .isActive(true)
                .schemaName(schemaName)
                .build();
        
        tenant = tenantRepository.save(tenant);
        
        // Publish tenant created event
        Events.TenantCreated event = new Events.TenantCreated(
                tenant.getId(),
                tenant.getName(),
                tenant.getBusinessType(),
                LocalDateTime.now()
        );
        kafkaTemplate.send("tenant-events", event);
        
        return mapToResponse(tenant);
    }
    
    public TenantDto.Response getTenantById(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        return mapToResponse(tenant);
    }
    
    public List<TenantDto.Response> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TenantDto.Response updateTenant(Long id, TenantDto.UpdateRequest request) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        
        if (request.getName() != null) tenant.setName(request.getName());
        if (request.getBusinessType() != null) tenant.setBusinessType(request.getBusinessType());
        if (request.getEmail() != null) tenant.setEmail(request.getEmail());
        if (request.getPhone() != null) tenant.setPhone(request.getPhone());
        if (request.getAddress() != null) tenant.setAddress(request.getAddress());
        if (request.getCity() != null) tenant.setCity(request.getCity());
        if (request.getState() != null) tenant.setState(request.getState());
        if (request.getCountry() != null) tenant.setCountry(request.getCountry());
        if (request.getPostalCode() != null) tenant.setPostalCode(request.getPostalCode());
        if (request.getFiscalYearStart() != null) tenant.setFiscalYearStart(request.getFiscalYearStart());
        if (request.getCurrencyCode() != null) tenant.setCurrencyCode(request.getCurrencyCode());
        if (request.getIsActive() != null) tenant.setIsActive(request.getIsActive());
        
        tenant = tenantRepository.save(tenant);
        return mapToResponse(tenant);
    }
    
    @Transactional
    public void deleteTenant(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        
        tenant.setIsActive(false);
        tenantRepository.save(tenant);
    }
    
    private TenantDto.Response mapToResponse(Tenant tenant) {
        return TenantDto.Response.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .businessType(tenant.getBusinessType())
                .email(tenant.getEmail())
                .phone(tenant.getPhone())
                .address(tenant.getAddress())
                .city(tenant.getCity())
                .state(tenant.getState())
                .country(tenant.getCountry())
                .postalCode(tenant.getPostalCode())
                .fiscalYearStart(tenant.getFiscalYearStart())
                .currencyCode(tenant.getCurrencyCode())
                .isActive(tenant.getIsActive())
                .schemaName(tenant.getSchemaName())
                .build();
    }
}
