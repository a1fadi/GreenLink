package com.greenlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.greenlink.model.Player;
import com.greenlink.model.Team;
import com.greenlink.repository.PlayerRepository;
import com.greenlink.repository.TeamRepository;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class GreenlinkApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(GreenlinkApplication.class, args);
    }
    
    @RestController
    @CrossOrigin(origins = "http://localhost:5173")
    public static class ApiController {
        
        @Autowired
        private PlayerRepository playerRepository;
        
        @Autowired
        private TeamRepository teamRepository;
        
        // Health check endpoint
        @GetMapping("/api/health")
        public String health() {
            return "GreenLink Backend is running! 🚀";
        }
        
        // Get players by team
        @GetMapping("/api/players/team/{teamId}")
        public ResponseEntity<?> getPlayersByTeam(@PathVariable Long teamId) {
            Team team = teamRepository.findById(teamId).orElse(null);
            if (team == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Team not found"));
            }
            
            List<Player> players = playerRepository.findByTeam(team);
            return ResponseEntity.ok(players);
        }
        
        // Create new player for a team
        @PostMapping("/api/players")
        public ResponseEntity<?> createPlayer(@RequestBody CreatePlayerRequest request) {
            Team team = teamRepository.findById(request.getTeamId()).orElse(null);
            if (team == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Team not found"));
            }
            
            Player player = new Player();
            player.setName(request.getName());
            player.setPosition(request.getPosition());
            player.setJerseyNumber(request.getJerseyNumber());
            player.setTeam(team);
            
            Player savedPlayer = playerRepository.save(player);
            return ResponseEntity.ok(savedPlayer);
        }
        
        // Update player
        @PutMapping("/api/players/{id}")
        public ResponseEntity<?> updatePlayer(@PathVariable Long id, @RequestBody Player playerDetails) {
            Player player = playerRepository.findById(id).orElse(null);
            if (player == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Player not found"));
            }
            
            player.setName(playerDetails.getName());
            player.setPosition(playerDetails.getPosition());
            player.setJerseyNumber(playerDetails.getJerseyNumber());
            player.setMatchesPlayed(playerDetails.getMatchesPlayed());
            player.setGoals(playerDetails.getGoals());
            player.setAssists(playerDetails.getAssists());
            player.setYellowCards(playerDetails.getYellowCards());
            player.setRedCards(playerDetails.getRedCards());
            
            Player updatedPlayer = playerRepository.save(player);
            return ResponseEntity.ok(updatedPlayer);
        }
        
        // Delete player
        @DeleteMapping("/api/players/{id}")
        public ResponseEntity<?> deletePlayer(@PathVariable Long id) {
            if (playerRepository.existsById(id)) {
                playerRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "Player deleted"));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Player not found"));
        }
    }
    
    // Request class for creating players
    public static class CreatePlayerRequest {
        private String name;
        private String position;
        private Integer jerseyNumber;
        private Long teamId;
        
        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getPosition() { return position; }
        public void setPosition(String position) { this.position = position; }
        
        public Integer getJerseyNumber() { return jerseyNumber; }
        public void setJerseyNumber(Integer jerseyNumber) { this.jerseyNumber = jerseyNumber; }
        
        public Long getTeamId() { return teamId; }
        public void setTeamId(Long teamId) { this.teamId = teamId; }
    }
}