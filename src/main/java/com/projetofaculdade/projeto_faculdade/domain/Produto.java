package com.projetofaculdade.projeto_faculdade.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Lombok: Cria Getters, Setters, toString, hashCode e equals.
@Data
// Lombok: Cria um construtor com todos os argumentos.
@AllArgsConstructor
// Lombok: Cria um construtor vazio.
@NoArgsConstructor
// JPA: Mapeia esta classe para uma tabela no banco de dados.
@Entity
// JPA: Especifica o nome da tabela (opcional, mas boa prática).
@Table(name = "produto")
public class Produto {

    // JPA: Define a chave primária.
    @Id
    // JPA: Configura a geração automática do ID 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProduto;

    private String nome; 
    private String categoria; 
    private Integer estoque; 
    private Double preco; 
    private String descricao; 
    private String imagemUrl; 
    
    
}