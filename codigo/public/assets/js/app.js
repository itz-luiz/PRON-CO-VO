// Dados de mobilidade urbana
const dadosMobilidade = {
    "mobilidade-urbana": [
        {
            "bairro": "Primeiro de Maio (Regional Norte)",
            "pontos-onibus": 12,
            "possui-metro": true,
            "possui-ciclovia": true,
            "quantidade-estacionamentos": 8
        },
        {
            "bairro": "Padre Eustáquio (Regional Noroeste)",
            "pontos-onibus": 15,
            "possui-metro": true,
            "possui-ciclovia": true,
            "quantidade-estacionamentos": 10
        },
        {
            "bairro": "São Gabriel (Regional Nordeste)",
            "pontos-onibus": 18,
            "possui-metro": true,
            "possui-ciclovia": true,
            "quantidade-estacionamentos": 12
        },
        {
            "bairro": "Santa Tereza (Regional Leste)",
            "pontos-onibus": 14,
            "possui-metro": true,
            "possui-ciclovia": true,
            "quantidade-estacionamentos": 9
        },
        {
            "bairro": "Prado (Regional Oeste)",
            "pontos-onibus": 10,
            "possui-metro": false,
            "possui-ciclovia": true,
            "quantidade-estacionamentos": 7
        },
        {
            "bairro": "Savassi (Regional Centro-Sul)",
            "pontos-onibus": 22,
            "possui-metro": true,
            "possui-ciclovia": true,
            "quantidade-estacionamentos": 25
        },
        {
            "bairro": "Barreiro de Baixo (Regional Barreiro)",
            "pontos-onibus": 16,
            "possui-metro": false,
            "possui-ciclovia": true,
            "quantidade-estacionamentos": 11
        },
        {
            "bairro": "Santa Amélia (Regional Pampulha)",
            "pontos-onibus": 9,
            "possui-metro": false,
            "possui-ciclovia": true,
            "quantidade-estacionamentos": 6
        },
        {
            "bairro": "Mantiqueira (Regional Venda Nova)",
            "pontos-onibus": 13,
            "possui-metro": true,
            "possui-ciclovia": true,
            "quantidade-estacionamentos": 8
        }
    ]
};

// Função para criar os cards
function criarCards(dados) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    dados.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const regional = item.bairro.match(/\((.*?)\)/)[1];
        
        card.innerHTML = `
            <h2>${item.bairro.split(' (')[0]}</h2>
            <div class="info-item">
                <span class="info-label">Regional:</span>
                <span class="info-value">${regional}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Pontos de Ônibus:</span>
                <span class="info-value">${item['pontos-onibus']}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Possui Metrô:</span>
                <span class="info-value ${item['possui-metro']}">${item['possui-metro'] ? 'Sim' : 'Não'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Possui Ciclovia:</span>
                <span class="info-value ${item['possui-ciclovia']}">${item['possui-ciclovia'] ? 'Sim' : 'Não'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Estacionamentos:</span>
                <span class="info-value">${item['quantidade-estacionamentos']}</span>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Função para filtrar os dados
function filtrarDados() {
    const regionalSelecionada = document.getElementById('filtro-regional').value;
    const filtroMetro = document.getElementById('filtro-metro').checked;
    const filtroCiclovia = document.getElementById('filtro-ciclovia').checked;
    
    let dadosFiltrados = dadosMobilidade['mobilidade-urbana'];
    
    // Aplicar filtros
    if (regionalSelecionada !== 'todos') {
        dadosFiltrados = dadosFiltrados.filter(item => 
            item.bairro.includes(regionalSelecionada)
        );
    }
    
    if (filtroMetro) {
        dadosFiltrados = dadosFiltrados.filter(item => item['possui-metro']);
    }
    
    if (filtroCiclovia) {
        dadosFiltrados = dadosFiltrados.filter(item => item['possui-ciclovia']);
    }
    
    criarCards(dadosFiltrados);
}

// Event listeners para os filtros
document.getElementById('filtro-regional').addEventListener('change', filtrarDados);
document.getElementById('filtro-metro').addEventListener('change', filtrarDados);
document.getElementById('filtro-ciclovia').addEventListener('change', filtrarDados);

// Inicializar a página com todos os cards
window.addEventListener('DOMContentLoaded', () => {
    criarCards(dadosMobilidade['mobilidade-urbana']);
});