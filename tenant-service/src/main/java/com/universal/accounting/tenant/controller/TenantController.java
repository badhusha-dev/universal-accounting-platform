package com.universal.accounting.tenant.controller;

import com.universal.accounting.tenant.dto.TenantDto;
import com.universal.accounting.tenant.service.TenantService;
import com.universal.accounting.common.aspects.LogExecution;
import com.universal.accounting.common.aspects.MonitorPerformance;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {
    
    private final TenantService tenantService;
    
    @PostMapping
    @LogExecution
    @MonitorPerformance
    public ResponseEntity<TenantDto.Response> createTenant(@Valid @RequestBody TenantDto.CreateRequest request) {
        TenantDto.Response response = tenantService.createTenant(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    @LogExecution
    @MonitorPerformance
    public ResponseEntity<TenantDto.Response> getTenant(@PathVariable Long id) {
        TenantDto.Response response = tenantService.getTenantById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    @LogExecution
    @MonitorPerformance
    public ResponseEntity<List<TenantDto.Response>> getAllTenants() {
        List<TenantDto.Response> responses = tenantService.getAllTenants();
        return ResponseEntity.ok(responses);
    }
    
    @PutMapping("/{id}")
    @LogExecution
    @MonitorPerformance
    public ResponseEntity<TenantDto.Response> updateTenant(
            @PathVariable Long id,
            @Valid @RequestBody TenantDto.UpdateRequest request) {
        TenantDto.Response response = tenantService.updateTenant(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @LogExecution
    @MonitorPerformance
    public ResponseEntity<Void> deleteTenant(@PathVariable Long id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok().build();
    }
}
