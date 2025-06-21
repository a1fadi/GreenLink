package com.greenlink.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greenlink.model.Player;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    // This interface automatically gets save(), findAll(), findById(), delete() methods
}