package com.greenlink.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.greenlink.model.Player;
import com.greenlink.model.Team;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    
    // Find players by team
    List<Player> findByTeam(Team team);
    
    // Find players by position within a team
    List<Player> findByTeamAndPosition(Team team, String position);
    
    // Find players by name within a team (case insensitive)
    List<Player> findByTeamAndNameContainingIgnoreCase(Team team, String name);
    
    // Find player by jersey number within a team
    Optional<Player> findByTeamAndJerseyNumber(Team team, Integer jerseyNumber);
    
    // Custom queries for team statistics
    @Query("SELECT p FROM Player p WHERE p.team = ?1 ORDER BY p.goals DESC")
    List<Player> findTopScorersByTeam(Team team);
    
    @Query("SELECT p FROM Player p WHERE p.team = ?1 ORDER BY p.assists DESC")
    List<Player> findTopAssistsByTeam(Team team);
    
    @Query("SELECT p FROM Player p WHERE p.team = ?1 ORDER BY p.matchesPlayed DESC")
    List<Player> findMostActiveByTeam(Team team);
    
    // Count players by position in a team
    @Query("SELECT COUNT(p) FROM Player p WHERE p.team = ?1 AND p.position = ?2")
    Long countByTeamAndPosition(Team team, String position);
}