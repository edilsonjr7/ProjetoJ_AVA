package com.projetofaculdade.projeto_faculdade.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.projetofaculdade.projeto_faculdade.domain.Produto;
import com.projetofaculdade.projeto_faculdade.service.ProdutoService;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    // Injeção de Dependência da camada Service.
    private final ProdutoService produtoService;

    @Autowired
    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // POST: Criar um novo produto (CRUD: CREATE)
    // URI: POST /api/produtos
    @PostMapping
    // @RequestBody: Mapeia o JSON do corpo da requisição para o objeto Produto.
    @ResponseStatus(HttpStatus.CREATED) // Retorna status 201 (Created) em caso de sucesso
    public Produto criarProduto(@RequestBody Produto produto) {
        return produtoService.save(produto);
    }

    // GET: Listar todos os produtos (CRUD: READ)
    // URI: GET /api/produtos
    @GetMapping
    public List<Produto> listarProdutos() {
        return produtoService.findAll(); // Cumpre o requisito listar produtos cadastrados[cite: 35].
    }

    // GET: Buscar produto por ID (CRUD: READ)
    // URI: GET /api/produtos/{id}
    // @PathVariable: Extrai o valor do ID da URL.
    public ResponseEntity<Produto> buscarPorId(@PathVariable Integer id) {
        // ResponseEntity: Permite customizar a resposta HTTP (ex: 200 OK ou 404 Not Found).
        return produtoService.findById(id)
                .map(produto -> ResponseEntity.ok(produto)) // Se encontrar, retorna 200 OK.
                .orElse(ResponseEntity.notFound().build()); // Se não encontrar, retorna 404 Not Found.
    }

    // PUT: Atualizar um produto existente (CRUD: UPDATE)
    // URI: PUT /api/produtos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Integer id, @RequestBody Produto produtoAtualizado) {
        // Garantimos que o ID do caminho seja usado no objeto a ser salvo
        produtoAtualizado.setIdProduto(id);
        Produto salvo = produtoService.save(produtoAtualizado);
        return ResponseEntity.ok(salvo);
    }

    // DELETE: Excluir um produto (CRUD: DELETE)
    // URI: DELETE /api/produtos/{id}
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Retorna status 204 (No Content) após a exclusão bem-sucedida.
    public void deletarProduto(@PathVariable Integer id) {
        produtoService.deleteById(id);
    }
}