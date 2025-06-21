package com.greenlink.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "club_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"club_id", "user_id"})
})
public class ClubMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.MEMBER;
    
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
    
    // Club roles
    public enum Role {
        OWNER,      // Club owner
        ADMIN,      // Club administrator  
        COACH,      // Team coach/manager
        MEMBER      // Regular member/player
    }
    
    // Constructors
    public ClubMember() {
        this.joinedAt = LocalDateTime.now();
    }
    
    public ClubMember(Club club, User user, Role role) {
        this();
        this.club = club;
        this.user = user;
        this.role = role;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    
    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}