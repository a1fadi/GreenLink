package com.greenlink.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greenlink.model.Club;
import com.greenlink.model.User;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    
    // Find club by club code
    Optional<Club> findByClubCode(String clubCode);
    
    // Check if club code exists
    boolean existsByClubCode(String clubCode);
    
    // Find clubs owned by a specific user
    List<Club> findByOwner(User owner);
    
    // Find clubs by name (case insensitive)
    List<Club> findByNameContainingIgnoreCase(String name);
}