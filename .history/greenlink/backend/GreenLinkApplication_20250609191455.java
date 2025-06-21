package com.greenlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class GreenlinkApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(GreenlinkApplication.class, args);
    }
    
    @RestController
    @CrossOrigin(origins = "http://localhost:5173")
    public static class HealthController {
        
        @GetMapping("/api/health")
        public String health() {
            return "GreenLink Backend is running! 🚀";
        }
    }
}