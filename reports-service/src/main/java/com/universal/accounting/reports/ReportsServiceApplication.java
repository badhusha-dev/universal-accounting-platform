package com.universal.accounting.reports;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class ReportsServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReportsServiceApplication.class, args);
    }
}
