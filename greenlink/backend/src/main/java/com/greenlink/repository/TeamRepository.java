package com.greenlink.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greenlink.model.Club;
import com.greenlink.model.Team;
import com.greenlink.model.User;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    
    // Find team by team code
    Optional<Team> findByTeamCode(String teamCode);
    
    // Check if team code exists
    boolean existsByTeamCode(String teamCode);
    
    // Find teams managed by a specific user
    List<Team> findByManager(User manager);
    
    // Find all teams in a club
    List<Team> findByClub(Club club);
    
    // Find teams by name within a club
    List<Team> findByClubAndNameContainingIgnoreCase(Club club, String name);
    
    // Find teams by age group within a club
    List<Team> findByClubAndAgeGroup(Club club, String ageGroup);
}