package com.importacionessanjose.repository;

import com.importacionessanjose.entity.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SedeRepository extends JpaRepository<Sede, Integer> {

    List<Sede> findByActivoTrue();
}