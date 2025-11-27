package com.projetofaculdade.projeto_faculdade.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projetofaculdade.projeto_faculdade.domain.Cliente;
import com.projetofaculdade.projeto_faculdade.repository.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    // READ Listar todos os clientes
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    // READ Buscar por ID
    public Optional<Cliente> findById(Integer id) {
        return clienteRepository.findById(id);
    }

    // CREATE / UPDATE (Salvar ou atualizar um cliente)
    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente); 
    }

    // DELETE
    public void deleteById(Integer id) {
        clienteRepository.deleteById(id);
    }
}