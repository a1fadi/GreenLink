package com.greenlink;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.greenlink.model.Player;
import com.greenlink.repository.PlayerRepository;

@SpringBootApplication
public class GreenlinkApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(GreenlinkApplication.class, args);
    }
    
    @RestController
    @CrossOrigin(origins = "http://localhost:5173")
    public static class PlayerController {
        
        @Autowired
        private PlayerRepository playerRepository;
        
        @GetMapping("/api/players")
        public List<Player> getAllPlayers() {
            return playerRepository.findAll();
        }
        
        @PostMapping("/api/players")
        public Player createPlayer(@RequestBody Player player) {
            return playerRepository.save(player);
        }
    }
}