package com.greenlink.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "players")
public class Player {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column
    private String position;
    
    @Column(name = "jersey_number")
    private Integer jerseyNumber;
    
    // Stats
    @Min(value = 0, message = "Matches played cannot be negative")
    @Column(name = "matches_played")
    private Integer matchesPlayed = 0;
    
    @Min(value = 0, message = "Goals cannot be negative")
    private Integer goals = 0;
    
    @Min(value = 0, message = "Assists cannot be negative")
    private Integer assists = 0;
    
    @Min(value = 0, message = "Yellow cards cannot be negative")
    @Column(name = "yellow_cards")
    private Integer yellowCards = 0;
    
    @Min(value = 0, message = "Red cards cannot be negative")
    @Column(name = "red_cards")
    private Integer redCards = 0;
    
    // Player belongs to a team
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;
    
    // Constructors
    public Player() {}
    
    public Player(String name, Team team) {
        this.name = name;
        this.team = team;
    }
    
    public Player(String name, String position, Team team) {
        this.name = name;
        this.position = position;
        this.team = team;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    
    public Integer getJerseyNumber() { return jerseyNumber; }
    public void setJerseyNumber(Integer jerseyNumber) { this.jerseyNumber = jerseyNumber; }
    
    public Integer getMatchesPlayed() { return matchesPlayed; }
    public void setMatchesPlayed(Integer matchesPlayed) { this.matchesPlayed = matchesPlayed; }
    
    public Integer getGoals() { return goals; }
    public void setGoals(Integer goals) { this.goals = goals; }
    
    public Integer getAssists() { return assists; }
    public void setAssists(Integer assists) { this.assists = assists; }
    
    public Integer getYellowCards() { return yellowCards; }
    public void setYellowCards(Integer yellowCards) { this.yellowCards = yellowCards; }
    
    public Integer getRedCards() { return redCards; }
    public void setRedCards(Integer redCards) { this.redCards = redCards; }
    
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    
    // Helper methods
    public double getGoalsPerMatch() {
        return matchesPlayed > 0 ? (double) goals / matchesPlayed : 0.0;
    }
    
    public double getAssistsPerMatch() {
        return matchesPlayed > 0 ? (double) assists / matchesPlayed : 0.0;
    }
    
    public int getTotalCards() {
        return yellowCards + redCards;
    }
}