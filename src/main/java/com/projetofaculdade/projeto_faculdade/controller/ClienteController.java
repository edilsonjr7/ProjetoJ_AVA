package com.projetofaculdade.projeto_faculdade.controller;

import java.util.List;

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

import com.projetofaculdade.projeto_faculdade.domain.Cliente;
import com.projetofaculdade.projeto_faculdade.service.ClienteService;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    // Injeção de Dependência via Construtor
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // POST: Criar um novo cliente (Criação de Conta)
    // URI: POST /api/clientes
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cliente criarCliente(@RequestBody Cliente cliente) {
        return clienteService.save(cliente);
    }

    // GET: Listar todos os clientes
    // URI: GET /api/clientes
    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.findAll();
    }
    
    // GET: Buscar cliente por ID
    // URI: GET /api/clientes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Integer id) {
        return clienteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT: Atualizar cliente
    // URI: PUT /api/clientes/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizarCliente(@PathVariable Integer id, @RequestBody Cliente clienteAtualizado) {
        clienteAtualizado.setIdCliente(id);
        Cliente salvo = clienteService.save(clienteAtualizado);
        return ResponseEntity.ok(salvo);
    }

    // DELETE: Excluir cliente
    // URI: DELETE /api/clientes/{id}
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarCliente(@PathVariable Integer id) {
        clienteService.deleteById(id);
    }
}