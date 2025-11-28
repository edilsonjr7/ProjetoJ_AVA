const BASE_URL = 'http://localhost:8080/api';
let carrinho = [];
let isAdmin = false; // Essa variavel controlar o acesso ADM

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tenta carregar os produtos ao iniciar
    listarProdutos();
    // 2. Adiciona listeners para os formulários
    document.getElementById('form-registro').addEventListener('submit', registrarUsuario);
    document.getElementById('form-cadastro-produto').addEventListener('submit', cadastrarNovoProduto);
});

// ===============================================
// FUNÇÕES DE UTILIDADE E MODAL
// ===============================================

function showModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    // Se o modal for de registro, verifica se o usuário se tornou ADM
    if (id === 'register-modal') {
        updateAdminView();
    }
}

// Fecha o modal se o usuário clicar fora dele
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        updateAdminView();
    }
}

function updateAdminView() {
    // O requisito 'ADm pode cadastrar novos produtos' é satisfeito mostrando a seção:
    const adminSection = document.getElementById('admin-area');
    adminSection.style.display = isAdmin ? 'block' : 'none';
}

function updateCartDisplay() {
    const count = carrinho.length;
    document.getElementById('cart-count').textContent = count;
    const ul = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-total');
    
    if (count === 0) {
        ul.innerHTML = '<li>Seu carrinho está vazio.</li>';
        totalElement.textContent = '(Total: R$ 0.00)';
        return;
    }
    
    ul.innerHTML = '';
    let total = 0;
    
    carrinho.forEach(item => {
        const li = document.createElement('li');
        const precoTotal = item.preco * item.quantidade;
        li.textContent = `${item.nome} x${item.quantidade} (R$ ${precoTotal.toFixed(2)})`;
        ul.appendChild(li);
        total += precoTotal;
    });
    
    totalElement.textContent = `(Total: R$ ${total.toFixed(2)})`;
}

// ===============================================
// CADASTRO/LOGIN (Requisito: Criar Conta - Cliente ou ADM)
// ===============================================

function registrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById('r-nome').value;
    const email = document.getElementById('r-email').value;
    const senha = document.getElementById('r-senha').value;
    const endereco = document.getElementById('r-endereco').value;
    const isCheckedAdmin = document.getElementById('is-admin').checked;
    const statusDiv = document.getElementById('registro-status');

    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha,
        endereco: endereco
    };

    fetch(`${BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoUsuario)
    })
    .then(response => {
        if (response.status === 201) {
            statusDiv.textContent = '✅ Registro concluído com sucesso!';
            statusDiv.style.color = 'green';
            document.getElementById('form-registro').reset();
            
        
            if (isCheckedAdmin) {
                isAdmin = true;
                statusDiv.textContent += ' (Logado como Administrador!)';
            }
        } else {
            statusDiv.textContent = `❌ Falha no registro. Verifique se o e-mail já existe. Status: ${response.status}.`;
            statusDiv.style.color = 'red';
        }
    });
}

// ===============================================
// PRODUTOS (Requisito: Listar Produtos / ADM Cadastrar)
// ===============================================

function listarProdutos() {
    fetch(`${BASE_URL}/produtos`)
        .then(response => response.json())
        .then(produtos => {
            const container = document.getElementById('product-list-container');
            container.innerHTML = '';

            if (produtos.length === 0) {
                container.innerHTML = '<p>Nenhum produto cadastrado. Cadastre um na Área Administrativa.</p>';
                return;
            }

            produtos.forEach(produto => {
                const card = document.createElement('div');
                card.className = 'product-card';
                
                // Imagem (Para apresentação, usamos uma imagem genérica ou link)
                card.innerHTML = `
                    <img src="${produto.imagemUrl || 'placeholder.jpg'}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    <p>R$ ${produto.preco.toFixed(2)} | Estoque: ${produto.estoque}</p>
                    <button onclick="adicionarAoCarrinho(${produto.idProduto}, '${produto.nome}', ${produto.preco})">
                        Adicionar ao Carrinho
                    </button>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erro ao listar produtos:', error);
            document.getElementById('product-list-container').innerHTML = `<p style="color:red;">Falha ao carregar produtos. Verifique o console do servidor.</p>`;
        });
}

function cadastrarNovoProduto(event) {
    event.preventDefault();
    if (!isAdmin) {
        alert('Acesso negado. Apenas Administradores podem cadastrar produtos.');
        return;
    }
    
    const novoProduto = {
        nome: document.getElementById('p-nome').value,
        preco: parseFloat(document.getElementById('p-preco').value),
        estoque: parseInt(document.getElementById('p-estoque').value),
        categoria: document.getElementById('p-categoria').value,
        descricao: document.getElementById('p-descricao').value,
        imagemUrl: document.getElementById('p-imagem-url').value,
    };

    fetch(`${BASE_URL}/produtos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProduto)
    })
    .then(response => {
        const statusDiv = document.getElementById('admin-status');
        if (response.status === 201) {
            statusDiv.textContent = '✅ Produto cadastrado com sucesso!';
            statusDiv.style.color = 'green';
            document.getElementById('form-cadastro-produto').reset();
            listarProdutos(); // Recarrega a lista para mostrar o novo produto
        } else {
            statusDiv.textContent = `❌ Falha ao cadastrar. Status: ${response.status}.`;
            statusDiv.style.color = 'red';
        }
    });
}

// ===============================================
// CARRINHO (Requisito: Carrinho de Compras)
// ===============================================

function adicionarAoCarrinho(id, nome, preco) {
    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1 });
    }
    
    updateCartDisplay();
    alert(`"${nome}" adicionado ao carrinho!`);
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('O carrinho está vazio.');
        return;
    }
    
    // Simulação da emissão da Nota Fiscal em PDF (Requisito: Nota fiscal da compra em PDF)
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    alert(`✅ Compra finalizada! Total: R$ ${total.toFixed(2)}. \n\nUm pedido foi gerado e a Nota Fiscal (PDF) foi enviada (simulação).`);
    
    // Limpar o carrinho após a finalização
    carrinho = [];
    updateCartDisplay();
    closeModal('cart-modal');
}