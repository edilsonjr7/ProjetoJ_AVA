package com.projetofaculdade.projeto_faculdade.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projetofaculdade.projeto_faculdade.domain.Produto;
import com.projetofaculdade.projeto_faculdade.repository.ProdutoRepository;

// Indica que esta classe contém a lógica de negócio.
@Service
public class ProdutoService {

    // Injeção de Dependência: Traz a interface Repository para que possamos interagir com o DB.
    private final ProdutoRepository produtoRepository;

    // Construtor para injeção de dependência (forma recomendada).
    @Autowired
    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // 1. READ (Listar todos os produtos)
    public List<Produto> findAll() {
        return produtoRepository.findAll(); // Usa o método findAll do JpaRepository.
    }

    // 2. READ (Buscar por ID)
    public Optional<Produto> findById(Integer id) {
        return produtoRepository.findById(id); // Usa o método findById do JpaRepository.
    }

    // 3. CREATE / UPDATE (Salvar ou atualizar um produto)
    public Produto save(Produto produto) {
        return produtoRepository.save(produto); // faz o INSERT ou UPDATE.
    }

    // 4. DELETE (Excluir)
    public void deleteById(Integer id) {
        produtoRepository.deleteById(id); 
    }
}