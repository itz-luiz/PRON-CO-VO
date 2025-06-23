// assets/js/bairros-detalhes.js
document.addEventListener('DOMContentLoaded', function() {
    // Obtém o NOME do bairro da URL (ex: ?nome=Savassi)
    const urlParams = new URLSearchParams(window.location.search);
    const bairroNome = urlParams.get('nome');
    
    // Se não houver nome de bairro na URL, volta para a página principal
    if (!bairroNome) {
        window.location.href = 'proncovo.html';
        return;
    }
    
    // Carrega todas as informações do bairro usando o nome
    loadBairroData(bairroNome);
    loadEquipamentos(bairroNome);
    loadAvaliacoes(bairroNome);
    loadComentarios(bairroNome);
    
    // Configura o botão de adicionar comentário
    document.getElementById('btn-adicionar-comentario').addEventListener('click', function() {
        // Redireciona para a página de comentários, já com o bairro selecionado
        window.location.href = `comentario.html?bairro=${encodeURIComponent(bairroNome)}`;
    });
});

// Carrega os dados básicos (população, regional, etc.)
function loadBairroData(bairroNome) {
    // Busca no banco de dados de bairros pelo nome
    fetch(`http://localhost:3000/banco-dados-bairros?nome=${encodeURIComponent(bairroNome)}`)
        .then(response => response.json())
        .then(bairros => {
            if (bairros.length > 0) {
                const bairro = bairros[0]; // Pega o primeiro resultado correspondente
                document.getElementById('bairro-nome').textContent = bairro.nome;
                document.getElementById('bairro-regional').textContent = bairro.regional;
                document.getElementById('bairro-populacao').textContent = bairro['populacao-aproximada'];
                document.getElementById('bairro-observacao').textContent = bairro.observacao;
            } else {
                throw new Error('Bairro não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados do bairro:', error);
            document.getElementById('bairro-nome').textContent = "Bairro não encontrado";
        });
}

// Carrega a lista de equipamentos públicos
function loadEquipamentos(bairroNome) {
    fetch(`http://localhost:3000/equipamentosPublicos?properties.bairro=${encodeURIComponent(bairroNome)}`)
        .then(response => response.json())
        .then(equipamentos => {
            const container = document.getElementById('equipamentos-container');
            if (equipamentos.length === 0) {
                container.innerHTML = '<p>Nenhum equipamento público cadastrado para este bairro.</p>';
                return;
            }
            container.innerHTML = equipamentos.map(equip => `
                <div class="equipamento-card">
                    <h3>${equip.properties.name}</h3>
                    <p><strong>Tipo:</strong> ${formatCategory(equip.properties.category)}</p>
                    <p>${equip.properties.description || ''}</p>
                    <p><strong>Endereço:</strong> ${equip.properties.address}</p>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Erro ao carregar equipamentos:', error);
            document.getElementById('equipamentos-container').innerHTML = '<p>Erro ao carregar equipamentos públicos.</p>';
        });
}

// **FUNÇÃO CORRIGIDA: Carrega e CALCULA A MÉDIA das avaliações**
function loadAvaliacoes(bairroNome) {
    fetch(`http://localhost:3000/respostas?bairro=${encodeURIComponent(bairroNome)}`)
        .then(response => response.json())
        .then(avaliacoesDoBairro => {
            const container = document.querySelector('.avaliacoes');
            if (avaliacoesDoBairro.length === 0) {
                container.innerHTML += '<p>Nenhuma avaliação disponível para este bairro.</p>';
                return;
            }

            const criterios = ['seguranca', 'escolas', 'saude', 'mobilidade', 'transporte', 'limpeza', 'iluminacao', 'lazer'];
            const medias = {};

            // Inicializa o objeto de médias
            criterios.forEach(criterio => {
                medias[criterio] = { total: 0, count: 0 };
            });

            // Soma as notas de cada avaliação
            avaliacoesDoBairro.forEach(avaliacao => {
                criterios.forEach(criterio => {
                    if (typeof avaliacao[criterio] === 'number') {
                        medias[criterio].total += avaliacao[criterio];
                        medias[criterio].count++;
                    }
                });
            });

            // Calcula a média final e atualiza as estrelas no HTML
            criterios.forEach(criterio => {
                const media = medias[criterio].count > 0 ? medias[criterio].total / medias[criterio].count : 0;
                // O HTML já deve ter os elementos com os IDs corretos (ex: seguranca-rating)
                const ratingElement = document.getElementById(`${criterio}-rating`);
                if (ratingElement) {
                    createRating(ratingElement, media);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar avaliações:', error);
        });
}


// Carrega a lista de comentários
function loadComentarios(bairroNome) {
    fetch(`http://localhost:3000/comentarios?bairro=${encodeURIComponent(bairroNome)}`)
        .then(response => response.json())
        .then(comentarios => {
            const container = document.getElementById('comentarios-container');
            if (comentarios.length === 0) {
                container.innerHTML = '<p>Nenhum comentário disponível para este bairro.</p>';
                return;
            }
            container.innerHTML = comentarios.map(com => `
                <div class="comentario-card">
                    <h3>${com.nome || 'Anônimo'}</h3>
                    <p class="comentario-data">${new Date(com.data).toLocaleDateString()}</p>
                    <p class="comentario-texto">${com.comentario}</p>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Erro ao carregar comentários:', error);
            document.getElementById('comentarios-container').innerHTML = '<p>Erro ao carregar comentários.</p>';
        });
}

// Funções auxiliares para criar estrelas e formatar categorias
function createRating(container, rating) {
    container.innerHTML = '';
    const notaNumerica = parseFloat(rating);
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        if (i <= notaNumerica) {
            star.classList.add('filled');
        }
        star.innerHTML = '★';
        container.appendChild(star);
    }
}

function formatCategory(category) {
    // Mapeia os slugs para nomes amigáveis
    const categories = { 'biblioteca': 'Biblioteca', 'escola': 'Escola', 'posto-saude': 'Posto de Saúde', 'delegacia': 'Delegacia', 'centro-cultural': 'Centro Cultural', 'hospital': 'Hospital', 'upa': 'UPA', 'cras': 'CRAS', 'ubs': 'UBS', 'centro-comunitario': 'Centro Comunitário', 'parque': 'Parque', 'juventude': 'Centro de Juventude', 'farmacia': 'Farmácia', 'restaurante': 'Restaurante', 'mecanica': 'Mecânica', 'lazer': 'Lazer', 'shopping': 'Shopping', 'hotel': 'Hotel' };
    return categories[category] || category.charAt(0).toUpperCase() + category.slice(1);
}