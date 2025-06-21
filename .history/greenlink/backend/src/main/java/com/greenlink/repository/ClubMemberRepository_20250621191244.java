package com.greenlink.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greenlink.model.Club;
import com.greenlink.model.ClubMember;
import com.greenlink.model.User;

@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
    
    // Find club membership
    Optional<ClubMember> findByClubAndUser(Club club, User user);
    
    // Find all clubs a user belongs to
    List<ClubMember> findByUser(User user);
    
    // Find all members of a club
    List<ClubMember> findByClub(Club club);
    
    // Check if user is member of club
    boolean existsByClubAndUser(Club club, User user);
    
    // Find members by role
    List<ClubMember> findByClubAndRole(Club club, ClubMember.Role role);
}