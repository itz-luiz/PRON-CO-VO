document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://pron-co-vo.onrender.com/banco-dados-bairros';

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            exibirBairros(data);
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
            document.getElementById('bairros-container').innerHTML = `
                <div class="erro">
                    <p>Erro ao carregar os dados dos bairros.</p>
                    <p>Verifique se o json-server está rodando corretamente.</p>
                    <small>${error.message}</small>
                </div>
            `;
        });
});

function exibirBairros(bairros) {
    const container = document.getElementById('bairros-container');
    
    if (!bairros || bairros.length === 0) {
        container.innerHTML = '<p class="sem-dados">Nenhum bairro encontrado no banco de dados.</p>';
        return;
    }

    container.innerHTML = bairros.map(bairro => `
        <div class="bairro-card" data-id="${bairro.id}">
            <h2>${bairro.nome}</h2>
            <p><span class="info-label">Regional:</span> ${bairro.regional}</p>
            <p><span class="info-label">População Aproximada:</span> ${formatarPopulacao(bairro['populacao-aproximada'])}</p>
            <p class="observacao">${bairro.observacao}</p>
        </div>
    `).join('');
}

function formatarPopulacao(populacao) {
    const num = parseInt(populacao.replace(/\./g, ''));
    return num.toLocaleString('pt-BR');
}