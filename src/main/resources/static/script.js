
const BASE_URL = 'http://localhost:8080/api'; 
let carrinho = []; 
let isLoggedIn = false; 
let isAdmin = false; 

// ===============================================
// FUNÇÕES DE PERSISTÊNCIA DE ESTADO
// ===============================================

function saveLoginState() {
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
    sessionStorage.setItem('isAdmin', isAdmin);
}

function loadLoginState() {
    isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    isAdmin = sessionStorage.getItem('isAdmin') === 'true';
}

document.addEventListener('DOMContentLoaded', () => {
    // 0. CARREGA O ESTADO DO LOGIN AO ABRIR QUALQUER PÁGINA
    loadLoginState(); 
    
    // 1. Inicializa o catálogo (principal)
    if (document.getElementById('product-list-container')) {
        initCatalogPage();
    }
    
    // 2. Inicializa o cadastro (cadastro.html)
    if (document.getElementById('cadastroForm')) {
        document.getElementById('cadastroForm').addEventListener('submit', registrarUsuario);
    }

    // 3. Inicializa o Admin (admin.html)
    if (document.getElementById('product-management')) {
        loadAdminProducts();
        document.getElementById('form-cadastro-produto').addEventListener('submit', cadastrarNovoProduto);
        document.getElementById('form-editar-produto').addEventListener('submit', handleEditSubmit);
    }
    
    // 4. Listeners para Login/Logout (no index.html)
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', handleLogin);
    }
    
    updateNavigation();
});

// ===============================================
// LÓGICA DE ADMIN/LOGIN/LOGOUT (Atualizada)
// ===============================================

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-user').value.toLowerCase();
    const statusDiv = document.getElementById('login-status');

    if (username === 'admin') {
        isLoggedIn = true;
        isAdmin = true;
        saveLoginState(); // Salva o estado ADM
        statusDiv.textContent = `✅ Login ADM realizado!`;
        statusDiv.style.color = 'var(--primary)';
        setTimeout(() => { closeModal('login-modal'); }, 800);
    } else if (username === 'cliente') {
        isLoggedIn = true;
        isAdmin = false;
        saveLoginState(); // Salva o estado Cliente
        statusDiv.textContent = `✅ Login Cliente realizado!`;
        statusDiv.style.color = 'var(--primary)';
        setTimeout(() => { closeModal('login-modal'); }, 800);
    } else {
        statusDiv.textContent = '❌ Usuário inválido (Simulação).';
        statusDiv.style.color = 'var(--destructive)';
    }
}

function logout() {
    if (confirm("Deseja realmente sair?")) {
        isLoggedIn = false;
        isAdmin = false;
        saveLoginState(); // Limpa o estado
        alert('Sessão encerrada. Voltando para o Catálogo.');
        // O redirecionamento e a atualização de navegação serão feitos automaticamente
        // na próxima execução do script (recarregar página ou ir para index.html)
        window.location.href = 'index.html'; 
    }
}



// ===============================================
// VISUALIZAÇÃO DE PRODUTOS (Catálogo - index.html)
// ===============================================

function listarProdutos() {
    const fallbackProducts = [
        { idProduto: 9991, nome: "PlayStation 5 Console", preco: 3499.99, estoque: 5, imagemUrl: "https://via.placeholder.com/250x220?text=PS5+Simulado" },
        { idProduto: 9992, nome: "Notebook Gamer Dell G15", preco: 7999.00, estoque: 3, imagemUrl: "https://via.placeholder.com/250x220?text=Dell+G15+Simulado" },
    ];

    fetch(`${BASE_URL}/produtos`)
        .then(response => {
            if (!response.ok) throw new Error("API Offline");
            return response.json();
        })
        .then(produtos => {
            renderProducts(produtos);
        })
        .catch(error => {
            console.error('Erro ao buscar produtos da API. Usando mockados.', error);
            renderProducts(fallbackProducts);
        });
}

function renderProducts(products) {
    const container = document.getElementById('product-list-container');
    if (!container) return;
    
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p style="color:var(--muted-foreground);">Nenhum produto cadastrado.</p>';
        return;
    }

    products.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const imageUrl = produto.imagemUrl && produto.imagemUrl.startsWith('http') ? produto.imagemUrl : 
                         produto.imagemUrl && produto.imagemUrl.startsWith('/') ? produto.imagemUrl : 
                         'https://via.placeholder.com/250x220?text=' + produto.nome.replace(/\s/g, '+');

        // LÓGICA DE AÇÃO DO PRODUTO: Botão de Compra ou Link de Gerenciamento ADM
        const productAction = isAdmin
            ? `<a href="admin.html" style="display:block; margin-top:10px; color: var(--primary); font-weight:var(--font-weight-medium);">Gerenciar no Painel Admin</a>`
            : `<button onclick="adicionarAoCarrinho(${produto.idProduto}, '${produto.nome}', ${produto.preco}, ${produto.estoque})">Adicionar ao Carrinho</button>`;

        card.innerHTML = `
            <img src="${imageUrl}" alt="${produto.nome}" onerror="this.onerror=null; this.src='https://via.placeholder.com/250x220?text=Sem+Imagem';">
            <div class="badge">R$ ${produto.preco.toFixed(2)}</div>
            <h3>${produto.nome}</h3>
            <p style="color:var(--muted-foreground);">Estoque: ${produto.estoque}</p>
            ${productAction}
        `;
        container.appendChild(card);
    });
}

// ===============================================
// CRUD: CADASTRO DE CLIENTE (Usando o Backend Java)
// ===============================================

function registrarUsuario(event) {
    event.preventDefault();

    const form = event.target;
    
    const nome = form.querySelector('#nome').value;
    const email = form.querySelector('#email').value;
    const senha = form.querySelector('#senha').value;
    const endereco = form.querySelector('#endereco').value;
    
    const isAdminCheckbox = form.querySelector('#is-admin');
    const isCheckedAdmin = isAdminCheckbox ? isAdminCheckbox.checked : false;
    
    const statusDiv = document.getElementById('cadastro-message');

    const novoUsuario = { nome, email, senha, endereco };

    fetch(`${BASE_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario)
    })
    .then(response => {
        if (response.status === 201) {
            statusDiv.innerHTML = '<div class="message" style="color:var(--primary); border: 1px solid var(--primary); padding: 10px; border-radius: var(--radius);">✅ Registro concluído com sucesso!</div>';
            form.reset();
         if (isCheckedAdmin) {
                // Simula o login ADM após o registro bem-sucedido
                isLoggedIn = true;
                isAdmin = true;
                saveLoginState(); // <--- CHAME AQUI TAMBÉM
                updateNavigation();
                alert("Registro ADM concluído. Você está logado e pode acessar o Painel Admin.");
                window.location.href = 'index.html'; // Redireciona para o catálogo logado
            }
        } else {
            statusDiv.innerHTML = `<div class="message" style="color: var(--destructive); border: 1px solid var(--destructive); padding: 10px; border-radius: var(--radius);">❌ Falha. E-mail já pode existir ou erro no servidor. Status: ${response.status}.</div>`;
        }
    });
}

// ===============================================
// CRUD ADMIN: PRODUTOS (admin.html - Implementação Completa)
// ===============================================

function cadastrarNovoProduto(event) {
    event.preventDefault();
    const statusDiv = document.getElementById('admin-status');

    if (!isAdmin) {
        statusDiv.textContent = '❌ Acesso negado. Apenas Administradores podem cadastrar produtos.';
        statusDiv.style.color = 'var(--destructive)';
        return;
    }
    
    const form = document.getElementById('form-cadastro-produto');
    const novoProduto = {
        nome: form.querySelector('#p-nome').value,
        preco: parseFloat(form.querySelector('#p-preco').value),
        estoque: parseInt(form.querySelector('#p-estoque').value),
        categoria: form.querySelector('#p-categoria').value || 'Eletrônicos',
        descricao: form.querySelector('#p-descricao').value || 'Novo Produto',
        imagemUrl: form.querySelector('#p-imagem-url').value || 'placeholder.png',
    };

    fetch(`${BASE_URL}/produtos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProduto)
    })
    .then(response => {
        if (response.status === 201) {
            statusDiv.textContent = '✅ Produto cadastrado com sucesso!';
            statusDiv.style.color = 'var(--primary)';
            form.reset();
            loadAdminProducts(); // Recarrega o painel ADM
        } else {
            statusDiv.textContent = `❌ Falha ao cadastrar. Verifique o console. Status: ${response.status}.`;
            statusDiv.style.color = 'var(--destructive)';
        }
    })
    .catch(() => {
        statusDiv.textContent = `❌ Erro de conexão com a API. Verifique se o backend está rodando em ${BASE_URL}.`;
        statusDiv.style.color = 'var(--destructive)';
    });
}

function loadAdminProducts() {
    const tableBody = document.getElementById('admin-product-list');
    const messageDiv = document.getElementById('admin-message');

    if (!tableBody) return; 

    // Verificação de Admin para exibir a tabela
    if (!isAdmin) {
        tableBody.innerHTML = '<tr><td colspan="5" style="color:var(--destructive);">Acesso negado. Faça login como Administrador.</td></tr>';
        if (messageDiv) messageDiv.textContent = '';
        return;
    }
    
    if (messageDiv) messageDiv.textContent = 'Carregando...';

    fetch(`${BASE_URL}/produtos`)
        .then(response => response.json())
        .then(produtos => {
            renderAdminProducts(produtos);
            if (messageDiv) {
                messageDiv.textContent = `Lista de ${produtos.length} produtos carregada.`;
                messageDiv.style.color = 'var(--primary)';
            }
            listarProdutos(); // Garante que o catálogo principal seja atualizado
        })
        .catch(error => {
            console.error('Erro ao listar produtos para Admin:', error);
            tableBody.innerHTML = '<tr><td colspan="5" style="color:var(--destructive);">Erro ao carregar a lista de produtos. Verifique se o servidor está ativo.</td></tr>';
            if (messageDiv) {
                messageDiv.textContent = '❌ Falha na conexão com a API de Produtos.';
                messageDiv.style.color = 'var(--destructive)';
            }
        });
}

function renderAdminProducts(produtos) {
    const tableBody = document.getElementById('admin-product-list');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 

    if (produtos.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    produtos.forEach(produto => {
        const row = tableBody.insertRow();
        
        // CUIDADO: Passamos o objeto completo do produto (JSON) para a função showEditForm.
        // É necessário escapar as aspas para o HTML.
        const productJson = JSON.stringify(produto).replace(/"/g, '&quot;');

        row.innerHTML = `
            <td>${produto.idProduto}</td>
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.estoque}</td>
            <td>
                <button onclick="showEditForm('${productJson}')" style="background-color: var(--color-secondary);">Editar</button>
                <button onclick="deleteProduct(${produto.idProduto}, '${produto.nome}')">Excluir</button>
            </td>
        `;
    });
}

function showEditForm(productJson) {
    // Desserializa a string JSON escapada
    const produto = JSON.parse(productJson.replace(/&quot;/g, '"')); 
    
    document.getElementById('edit-product-section').style.display = 'block';
    
    document.getElementById('editing-product-id').textContent = `(#${produto.idProduto})`;
    document.getElementById('edit-id').value = produto.idProduto;
    document.getElementById('edit-nome').value = produto.nome;
    document.getElementById('edit-preco').value = produto.preco;
    document.getElementById('edit-estoque').value = produto.estoque;
    document.getElementById('edit-categoria').value = produto.categoria || '';
    document.getElementById('edit-descricao').value = produto.descricao || '';
    document.getElementById('edit-imagem-url').value = produto.imagemUrl || '';
    
    // Rola para a seção de edição
    document.getElementById('edit-product-section').scrollIntoView({ behavior: 'smooth' });
}

function hideEditForm() {
    document.getElementById('edit-product-section').style.display = 'none';
    document.getElementById('form-editar-produto').reset();
}

function handleEditSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const editedProduct = {
        idProduto: id,
        nome: document.getElementById('edit-nome').value,
        preco: parseFloat(document.getElementById('edit-preco').value),
        estoque: parseInt(document.getElementById('edit-estoque').value),
        categoria: document.getElementById('edit-categoria').value,
        descricao: document.getElementById('edit-descricao').value,
        imagemUrl: document.getElementById('edit-imagem-url').value,
    };
    
    fetch(`${BASE_URL}/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProduct)
    })
    .then(response => {
        if (response.status === 200) {
            alert(`✅ Produto #${id} (${editedProduct.nome}) atualizado com sucesso!`);
            hideEditForm();
            loadAdminProducts(); // Atualiza a tabela ADM
            listarProdutos(); // Atualiza o catálogo principal
        } else {
            alert(`❌ Falha ao atualizar. Status: ${response.status}. Verifique o console.`);
        }
    });
}

function deleteProduct(id, nome) {
    if (confirm(`Tem certeza que deseja DELETAR o produto #${id} - ${nome}?`)) {
        fetch(`${BASE_URL}/produtos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                alert(`✅ Produto #${id} excluído com sucesso!`);
                loadAdminProducts(); // Atualiza a tabela ADM
                listarProdutos(); // Atualiza o catálogo principal
            } else {
                 alert(`❌ Falha ao excluir. Status: ${response.status}. Verifique o console.`);
            }
        });
    }
}

// ===============================================
// CARRINHO E FINALIZAÇÃO DE COMPRA (CORRIGIDO)
// ===============================================

function updateCartDisplay() {
    const tableBody = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-total-value');
    const cartCountElement = document.getElementById('cart-count'); 
    
    if (!tableBody || !totalElement || !cartCountElement) return; 

    if (carrinho.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Seu carrinho está vazio.</td></tr>';
        totalElement.textContent = 'R$ 0,00';
        cartCountElement.textContent = '0'; 
        return;
    }
    
    tableBody.innerHTML = '';
    let total = 0;
    let totalItems = 0; 
    
    carrinho.forEach(item => {
        const precoTotal = item.preco * item.quantidade;
        total += precoTotal;
        totalItems += item.quantidade; 
        
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${item.nome}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${precoTotal.toFixed(2)}</td>
            <td>
                <button onclick="removerDoCarrinho(${item.id})">Remover 1</button>
            </td>
        `;
    });
    
    totalElement.textContent = `R$ ${total.toFixed(2)}`;
    cartCountElement.textContent = totalItems.toString(); 
}

function adicionarAoCarrinho(id, nome, preco, estoque) {
    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        if (itemExistente.quantidade < estoque) {
            itemExistente.quantidade += 1;
        } else {
            alert(`❌ Limite de estoque (${estoque}) atingido para "${nome}".`);
            return;
        }
    } else {
        if (estoque > 0) {
            carrinho.push({ id, nome, preco, quantidade: 1, estoque: estoque });
        } else {
            alert(`❌ Produto "${nome}" está fora de estoque.`);
            return;
        }
    }
    
    alert(`"${nome}" adicionado/aumentado no carrinho!`);
    
    // Atualiza o contador do ícone
    document.getElementById('cart-count').textContent = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    
    // Se o modal estiver aberto, atualiza a exibição da lista
    if (document.getElementById('cart-modal').style.display === 'block') {
        updateCartDisplay();
    }
}

function removerDoCarrinho(id) {
    const index = carrinho.findIndex(item => item.id === id);
    
    if (index !== -1) {
        // Reduz a quantidade em 1
        carrinho[index].quantidade -= 1;
        
        // Se a quantidade for zero ou menos, remove o item da lista
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1); 
        }
    }
    
    // Atualiza o contador do ícone e o display do modal
    const totalItems = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    document.getElementById('cart-count').textContent = totalItems;
    updateCartDisplay();
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('O carrinho está vazio.');
        return;
    }
    
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    alert(`✅ Compra finalizada! Total: R$ ${total.toFixed(2)}. \n\nUm pedido foi gerado e a Nota Fiscal (PDF) foi enviada (simulação).`);
    
    // Limpar o carrinho
    carrinho = [];
    document.getElementById('cart-count').textContent = 0;
    updateCartDisplay();
    closeModal('cart-modal');
}