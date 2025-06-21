package com.greenlink.controller;

import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenlink.model.Club;
import com.greenlink.model.User;
import com.greenlink.repository.ClubRepository;
import com.greenlink.repository.UserRepository;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = "http://localhost:5173")
public class ClubController {
    
    @Autowired
    private ClubRepository clubRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all clubs (for testing)
    @GetMapping
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }
    
    // Create new club
    @PostMapping
    public ResponseEntity<?> createClub(@RequestBody CreateClubRequest request) {
        // Find the user who wants to create the club
        User owner = userRepository.findById(request.getOwnerId()).orElse(null);
        if (owner == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        
        // Generate unique club code
        String clubCode = generateClubCode();
        while (clubRepository.existsByClubCode(clubCode)) {
            clubCode = generateClubCode();
        }
        
        // Create club
        Club club = new Club();
        club.setName(request.getName());
        club.setClubCode(clubCode);
        club.setDescription(request.getDescription());
        club.setLocation(request.getLocation());
        club.setOwner(owner);
        
        Club savedClub = clubRepository.save(club);
        
        return ResponseEntity.ok(Map.of(
            "id", savedClub.getId(),
            "name", savedClub.getName(),
            "clubCode", savedClub.getClubCode(),
            "description", savedClub.getDescription(),
            "location", savedClub.getLocation(),
            "owner", Map.of(
                "id", owner.getId(),
                "fullName", owner.getFullName(),
                "username", owner.getUsername()
            )
        ));
    }
    
    // Find club by code
    @GetMapping("/code/{clubCode}")
    public ResponseEntity<?> getClubByCode(@PathVariable String clubCode) {
        Club club = clubRepository.findByClubCode(clubCode).orElse(null);
        if (club == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Club not found"));
        }
        
        return ResponseEntity.ok(Map.of(
            "id", club.getId(),
            "name", club.getName(),
            "clubCode", club.getClubCode(),
            "description", club.getDescription(),
            "location", club.getLocation(),
            "teamCount", club.getTeamCount(),
            "memberCount", club.getMemberCount()
        ));
    }
    
    // Generate random club code (like "EAGLES2024")
    private String generateClubCode() {
        String[] words = {"EAGLES", "LIONS", "TIGERS", "BEARS", "WOLVES", "HAWKS", "STORM", "FIRE", "THUNDER", "LIGHTNING"};
        String word = words[new Random().nextInt(words.length)];
        int number = 1000 + new Random().nextInt(9000); // 4-digit number
        return word + number;
    }
    
    // Request class
    public static class CreateClubRequest {
        private String name;
        private String description;
        private String location;
        private Long ownerId;
        
        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        
        public Long getOwnerId() { return ownerId; }
        public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    }
}