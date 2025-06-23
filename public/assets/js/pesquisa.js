document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.hero-search input');
    const searchButton = document.getElementById('hero-search-btn');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    let todosBairros = []; // Array para guardar a lista de bairros

    // 1. Busca a lista de bairros uma única vez quando a página carrega
    fetch('https://pron-co-vo.onrender.com/banco-dados-bairros')
        .then(response => response.json())
        .then(data => {
            todosBairros = data; // Armazena a lista
        })
        .catch(error => {
            console.error('Erro ao carregar a lista de bairros:', error);
        });

    // 2. Adiciona um listener para o evento 'input' (a cada tecla digitada)
    searchInput.addEventListener('input', function() {
        const termo = searchInput.value.trim().toLowerCase();
        
        if (termo === '') {
            suggestionsContainer.innerHTML = ''; // Limpa sugestões se o campo estiver vazio
            return;
        }

        // Filtra a lista de bairros já carregada
        const sugestoes = todosBairros.filter(bairro => 
            bairro.nome.toLowerCase().includes(termo)
        );

        exibirSugestoes(sugestoes);
    });

    // 3. Função para exibir as sugestões na tela
    function exibirSugestoes(sugestoes) {
        suggestionsContainer.innerHTML = ''; // Limpa as sugestões anteriores

        sugestoes.forEach(sugestao => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = sugestao.nome;
            
            // Adiciona um evento de clique para cada sugestão
            item.addEventListener('click', function() {
                searchInput.value = sugestao.nome; // Coloca o nome do bairro no input
                suggestionsContainer.innerHTML = ''; // Limpa as sugestões
                handleSearch(); // Executa a pesquisa
            });

            suggestionsContainer.appendChild(item);
        });
    }

    // Fecha as sugestões se o usuário clicar fora da área de pesquisa
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.hero-search')) {
            suggestionsContainer.innerHTML = '';
        }
    });

    // A função de pesquisa original, agora chamada ao clicar no botão ou na sugestão
    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm === '') {
            showPopup('Por favor, digite o nome de um bairro');
            return;
        }

        // Encontra o bairro na lista já carregada
        const bairroEncontrado = todosBairros.find(bairro => 
            bairro.nome.toLowerCase() === searchTerm.toLowerCase()
        );
        
        if (bairroEncontrado) {
            window.location.href = `bairros-detalhes.html?nome=${encodeURIComponent(bairroEncontrado.nome)}`;
        } else {
            showPopup('Nenhum bairro encontrado, tente novamente');
        }
    }

    // Listeners para o botão de busca e a tecla Enter
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Função de popup
    function showPopup(message) {
        const existingPopup = document.querySelector('.search-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        const popup = document.createElement('div');
        popup.className = 'search-popup';
        popup.textContent = message;
        
        popup.style.position = 'fixed';
        popup.style.top = '20px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.backgroundColor = '#ff4444';
        popup.style.color = 'white';
        popup.style.padding = '10px 20px';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        popup.style.zIndex = '1000';
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            if (popup) popup.remove();
        }, 3000);
    }
});