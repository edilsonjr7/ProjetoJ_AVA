package com.projetofaculdade.projeto_faculdade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projetofaculdade.projeto_faculdade.domain.Cliente;

@Repository
// Herda métodos CRUD para a entidade Cliente.

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {   
   
    Cliente findByEmail(String email);
}