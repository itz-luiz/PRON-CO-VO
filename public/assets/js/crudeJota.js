//CRUDE DO JOTA
// Elementos do DOM
const selectBairro = document.getElementById('selectBairro');
const btnBuscar = document.getElementById('btnBuscar');
const resultado = document.getElementById('resultado');
const nomeBairro = document.getElementById('nomeBairro');
const listaServicos = document.getElementById('listaServicos');
const btnAdicionar = document.getElementById('btnAdicionar');
const adicionarModal = new bootstrap.Modal(document.getElementById('adicionarModal'));
const btnConfirmarAdicao = document.getElementById('btnConfirmarAdicao');
const novoBairroSelect = document.getElementById('novoBairro');

// Variável para armazenar os dados
let dados = {
    bairros: []
};

// Carrega os dados do JSON
async function carregarDados() {
    try {
        const response = await fetch('dados.json');
        dados = await response.json();
        popularSelectBairros(dados.bairros);
        popularSelectAdicionarBairros(dados.bairros);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar os dados. Por favor, tente novamente.');
    }
}

function popularSelectBairros(bairros) {
    selectBairro.innerHTML = '<option value="" selected disabled>Selecione um bairro</option>';
    bairros.forEach(bairro => {
        const option = document.createElement('option');
        option.value = bairro.id;
        option.textContent = bairro.nome;
        selectBairro.appendChild(option);
    });
}

function popularSelectAdicionarBairros(bairros) {
    novoBairroSelect.innerHTML = '<option value="" selected disabled>Selecione um bairro</option>';
    bairros.forEach(bairro => {
        const option = document.createElement('option');
        option.value = bairro.id;
        option.textContent = bairro.nome;
        novoBairroSelect.appendChild(option);
    });
}

// Exibe os serviços do bairro selecionado
async function exibirServicos() {
    const bairroId = selectBairro.value;

    if (!bairroId) {
        alert('Por favor, selecione um bairro');
        return;
    }

    // Encontra o bairro selecionado
    const bairroSelecionado = dados.bairros.find(b => b.id === bairroId);

    if (!bairroSelecionado) {
        alert('Bairro não encontrado');
        return;
    }

    // Atualiza o nome do bairro
    nomeBairro.textContent = `Serviços no bairro ${bairroSelecionado.nome}`;

    // Limpa a lista de serviços
    listaServicos.innerHTML = '';

    // Verifica se existem serviços
    if (!bairroSelecionado.servicos || Object.keys(bairroSelecionado.servicos).length === 0) {
        listaServicos.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    Nenhum serviço cadastrado para este bairro
                </div>
            </div>
        `;
    } else {
        // Para cada categoria de serviço
        for (const [categoria, servicos] of Object.entries(bairroSelecionado.servicos)) {
            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'servico-categoria col-12 mb-4';

            const categoriaTitulo = document.createElement('h3');
            categoriaTitulo.className = 'text-primary mb-3';
            categoriaTitulo.textContent = categoria;
            categoriaDiv.appendChild(categoriaTitulo);

            // Cria uma linha para os serviços desta categoria
            const servicosRow = document.createElement('div');
            servicosRow.className = 'row';

            // Para cada serviço na categoria
            servicos.forEach(servico => {
                const servicoCol = document.createElement('div');
                servicoCol.className = 'col-md-6 mb-3';

                const servicoCard = document.createElement('div');
                servicoCard.className = 'servico-item card h-100';

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const nome = document.createElement('h4');
                nome.className = 'card-title';
                nome.textContent = servico.nome;
                cardBody.appendChild(nome);

                const endereco = document.createElement('p');
                endereco.className = 'card-text servico-info';
                endereco.innerHTML = `<strong>Endereço:</strong> ${servico.endereco}`;
                cardBody.appendChild(endereco);

                const telefone = document.createElement('p');
                telefone.className = 'card-text servico-info';
                telefone.innerHTML = `<strong>Telefone:</strong> ${servico.telefone}`;
                cardBody.appendChild(telefone);

                servicoCard.appendChild(cardBody);
                servicoCol.appendChild(servicoCard);
                servicosRow.appendChild(servicoCol);
            });
            
            categoriaDiv.appendChild(servicosRow);
            listaServicos.appendChild(categoriaDiv);
        }
    }

    // Exibe o resultado
    resultado.classList.remove('d-none');
    resultado.scrollIntoView({ behavior: 'smooth' });
}

// Adiciona um novo serviço
function adicionarServico() {
    adicionarModal.show();
}

// Confirma a adição de um novo serviço
async function confirmarAdicao() {
    const bairroId = novoBairroSelect.value;
    const categoria = document.getElementById('novaCategoria').value;
    const nome = document.getElementById('novoNome').value;
    const endereco = document.getElementById('novoEndereco').value;
    const telefone = document.getElementById('novoTelefone').value;

    if (!bairroId || !categoria || !nome || !endereco || !telefone) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    // Encontra o bairro selecionado
    const bairroSelecionado = dados.bairros.find(b => b.id === bairroId);

    if (!bairroSelecionado) {
        alert('Bairro não encontrado');
        return;
    }

    // Inicializa o objeto de serviços se não existir
    if (!bairroSelecionado.servicos) {
        bairroSelecionado.servicos = {};
    }

    // Inicializa a categoria se não existir
    if (!bairroSelecionado.servicos[categoria]) {
        bairroSelecionado.servicos[categoria] = [];
    }

    // Adiciona o novo serviço
    bairroSelecionado.servicos[categoria].push({
        nome,
        endereco,
        telefone
    });

    console.log('Novo serviço adicionado:', {
        bairro: bairroSelecionado.nome,
        categoria,
        nome,
        endereco,
        telefone
    });

    // Atualiza a exibição
    adicionarModal.hide();
    document.getElementById('formServico').reset();
    
    // Recarrega os dados para mostrar o novo serviço
    if (selectBairro.value === bairroId) {
        exibirServicos();
    }
}

// Event Listeners
btnBuscar.addEventListener('click', exibirServicos);
btnAdicionar.addEventListener('click', adicionarServico);
btnConfirmarAdicao.addEventListener('click', confirmarAdicao);

// Inicialização
document.addEventListener('DOMContentLoaded', carregarDados);
