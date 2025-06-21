package com.greenlink.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "players")
public class Player {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    // Position is optional - can be null initially
    @Column
    private String position;
    
    // Default constructor (required by JPA)
    public Player() {}
    
    // Constructor with just name
    public Player(String name) {
        this.name = name;
    }
    
    // Constructor with name and position (optional)
    public Player(String name, String position) {
        this.name = name;
        this.position = position;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
}