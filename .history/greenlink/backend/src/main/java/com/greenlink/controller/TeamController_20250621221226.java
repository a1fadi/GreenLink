package com.greenlink.controller;

import com.greenlink.model.Team;
import com.greenlink.model.Club;
import com.greenlink.model.User;
import com.greenlink.repository.TeamRepository;
import com.greenlink.repository.ClubRepository;
import com.greenlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:5173")
public class TeamController {
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private ClubRepository clubRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all teams in a club
    @GetMapping("/club/{clubId}")
    public ResponseEntity<?> getTeamsByClub(@PathVariable Long clubId) {
        Club club = clubRepository.findById(clubId).orElse(null);
        if (club == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Club not found"));
        }
        
        List<Team> teams = teamRepository.findByClub(club);
        return ResponseEntity.ok(teams.stream().map(team -> Map.of(
            "id", team.getId(),
            "name", team.getName(),
            "teamCode", team.getTeamCode(),
            "ageGroup", team.getAgeGroup() != null ? team.getAgeGroup() : "",
            "description", team.getDescription() != null ? team.getDescription() : "",
            "manager", Map.of(
                "id", team.getManager().getId(),
                "fullName", team.getManager().getFullName()
            ),
            "playerCount", team.getPlayerCount(),
            "memberCount", team.getMemberCount()
        )).toList());
    }
    
    // Create new team
    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody CreateTeamRequest request) {
        // Find club
        Club club = clubRepository.findById(request.getClubId()).orElse(null);
        if (club == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Club not found"));
        }
        
        // Find manager
        User manager = userRepository.findById(request.getManagerId()).orElse(null);
        if (manager == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Manager not found"));
        }
        
        // Generate unique team code
        String teamCode = generateTeamCode();
        while (teamRepository.existsByTeamCode(teamCode)) {
            teamCode = generateTeamCode();
        }
        
        // Create team
        Team team = new Team();
        team.setName(request.getName());
        team.setTeamCode(teamCode);
        team.setAgeGroup(request.getAgeGroup());
        team.setDescription(request.getDescription());
        team.setClub(club);
        team.setManager(manager);
        
        Team savedTeam = teamRepository.save(team);
        
        return ResponseEntity.ok(Map.of(
            "id", savedTeam.getId(),
            "name", savedTeam.getName(),
            "teamCode", savedTeam.getTeamCode(),
            "ageGroup", savedTeam.getAgeGroup() != null ? savedTeam.getAgeGroup() : "",
            "description", savedTeam.getDescription() != null ? savedTeam.getDescription() : "",
            "club", Map.of(
                "id", club.getId(),
                "name", club.getName()
            ),
            "manager", Map.of(
                "id", manager.getId(),
                "fullName", manager.getFullName()
            )
        ));
    }
    
    // Find team by code
    @GetMapping("/code/{teamCode}")
    public ResponseEntity<?> getTeamByCode(@PathVariable String teamCode) {
        Team team = teamRepository.findByTeamCode(teamCode).orElse(null);
        if (team == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Team not found"));
        }
        
        return ResponseEntity.ok(Map.of(
            "id", team.getId(),
            "name", team.getName(),
            "teamCode", team.getTeamCode(),
            "ageGroup", team.getAgeGroup() != null ? team.getAgeGroup() : "",
            "description", team.getDescription() != null ? team.getDescription() : "",
            "club", Map.of(
                "id", team.getClub().getId(),
                "name", team.getClub().getName()
            ),
            "manager", Map.of(
                "id", team.getManager().getId(),
                "fullName", team.getManager().getFullName()
            ),
            "playerCount", team.getPlayerCount()
        ));
    }
    
    // Generate random team code (like "SQUAD2024")
    private String generateTeamCode() {
        String[] words = {"SQUAD", "TEAM", "LIONS", "TIGERS", "EAGLES", "HAWKS", "STORM", "FIRE", "STARS", "UNITED"};
        String word = words[new Random().nextInt(words.length)];
        int number = 1000 + new Random().nextInt(9000);
        return word + number;
    }
    
    // Request class
    public static class CreateTeamRequest {
        private String name;
        private String ageGroup;
        private String description;
        private Long clubId;
        private Long managerId;
        
        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getAgeGroup() { return ageGroup; }
        public void setAgeGroup(String ageGroup) { this.ageGroup = ageGroup; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public Long getClubId() { return clubId; }
        public void setClubId(Long clubId) { this.clubId = clubId; }
        
        public Long getManagerId() { return managerId; }
        public void setManagerId(Long managerId) { this.managerId = managerId; }
    }
}