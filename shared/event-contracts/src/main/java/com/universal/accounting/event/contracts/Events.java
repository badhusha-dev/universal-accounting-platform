package com.universal.accounting.event.contracts;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

public class Events {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JournalEntryCreated {
        private Long tenantId;
        private Long journalEntryId;
        private String entryNumber;
        private LocalDateTime createdAt;
        private String createdBy;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JournalEntryPosted {
        private Long tenantId;
        private Long journalEntryId;
        private String entryNumber;
        private LocalDateTime postedAt;
        private String postedBy;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TenantCreated {
        private Long tenantId;
        private String tenantName;
        private String businessType;
        private LocalDateTime createdAt;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserLoggedIn {
        private Long userId;
        private Long tenantId;
        private String username;
        private LocalDateTime loginTime;
        private String ipAddress;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReportGenerated {
        private Long tenantId;
        private String reportType;
        private String reportName;
        private LocalDateTime generatedAt;
        private String generatedBy;
        private Map<String, Object> parameters;
    }
}