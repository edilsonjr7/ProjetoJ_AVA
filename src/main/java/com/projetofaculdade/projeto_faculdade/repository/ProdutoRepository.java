package com.projetofaculdade.projeto_faculdade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projetofaculdade.projeto_faculdade.domain.Produto;

// @Repository: Indica ao Spring que esta interface é um componente de persistência.
@Repository

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
}