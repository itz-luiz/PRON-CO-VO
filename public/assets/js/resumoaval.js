// Configurações
const API_URL = "http://localhost:3000/respostas"; // Endpoint da API
const ATUALIZAR_A_CADA = 5000; // 5 segundos

// Mapeia os IDs para nomes amigáveis
const NOMES_CRITERIOS = {
  seguranca: "Segurança",
  escolas: "Escolas",
  saude: "Saúde",
  mobilidade: "Mobilidade dentro do bairro",
  transporte: "Transporte",
  limpeza: "Limpeza",
  iluminacao: "Iluminação",
  lazer: "Lazer"
};

/**
 * Formata a data para exibição amigável
 * Exemplo: "01/06/2023 14:30:00"
 */
function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
}

/**
 * Converte uma nota (1-5) em estrelas visuais
 * Exemplo: 3.5 vira "★★★½☆"
 */
function converterParaEstrelas(nota) {
  const cheias = Math.floor(nota);
  const temMeia = nota % 1 >= 0.5;
  const vazias = 5 - cheias - (temMeia ? 1 : 0);
  
  return '★'.repeat(cheias) + (temMeia ? '½' : '') + '☆'.repeat(vazias);
}

/**
 * Carrega os dados da API e exibe na tela
 */
async function carregarDados() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro na API");
    
    const todasRespostas = await response.json();
    exibirResultados(todasRespostas);
    
  } catch (erro) {
    console.error("Falha ao carregar:", erro);
    document.getElementById("resumo").innerHTML = `
      <p class="erro">
        Não foi possível carregar os dados. Tente recarregar a página.
      </p>
    `;
  }
}

/**
 * Processa e exibe os resultados na tela
 */
function exibirResultados(respostas) {
  const resumoDiv = document.getElementById("resumo");
  if (respostas.length === 0) {
    resumoDiv.innerHTML = "<p>Nenhuma avaliação registrada ainda.</p>";
    return;
  }

  // Agrupa respostas por bairro
  const porBairro = respostas.reduce((grupos, resposta) => {
    if (!grupos[resposta.bairro]) grupos[resposta.bairro] = [];
    grupos[resposta.bairro].push(resposta);
    return grupos;
  }, {});

  // Gera o HTML para cada bairro
  let htmlFinal = '';
  
  for (const [bairro, respostasBairro] of Object.entries(porBairro)) {
    // Calcula médias
    const sumario = Object.keys(NOMES_CRITERIOS).reduce((acc, criterio) => {
      acc[criterio] = { total: 0, quantidade: 0, media: 0 };
      return acc;
    }, {});

    // Processa cada resposta
    let htmlRespostas = '';
    respostasBairro.forEach((resposta, index) => {
      Object.keys(NOMES_CRITERIOS).forEach(criterio => {
        if (resposta[criterio]) {
          sumario[criterio].total += resposta[criterio];
          sumario[criterio].quantidade++;
        }
      });

      htmlRespostas += `
        <div class="resposta">
          <h3>Avaliação ${index + 1}</h3>
          <ul>
            ${Object.entries(NOMES_CRITERIOS)
              .filter(([criterio]) => resposta[criterio])
              .map(([criterio, nome]) => `
                <li>
                  <strong>${nome}</strong>: 
                  ${'★'.repeat(resposta[criterio])} 
                  (${resposta[criterio]}/5)
                </li>
              `).join('')}
            <li class="data">${formatarData(resposta.data)}</li>
          </ul>
        </div>
      `;
    });

    // Calcula médias finais
    Object.keys(sumario).forEach(criterio => {
      if (sumario[criterio].quantidade > 0) {
        sumario[criterio].media = sumario[criterio].total / sumario[criterio].quantidade;
      }
    });

    // HTML das médias
    const htmlMedias = `
      <div class="medias">
        <h3>Médias do Bairro</h3>
        <ul>
          ${Object.entries(NOMES_CRITERIOS)
            .map(([criterio, nome]) => `
              <li>
                <strong>${nome}</strong>:
                ${converterParaEstrelas(sumario[criterio].media)}
                (${sumario[criterio].media.toFixed(2)})
              </li>
            `).join('')}
        </ul>
      </div>
    `;

    // Adiciona ao HTML final
    htmlFinal += `
      <section class="bairro">
        <h2>${bairro}</h2>
        ${htmlMedias}
        <div class="respostas">
          <h3>Avaliações Individuais (${respostasBairro.length})</h3>
          <div class="lista-respostas">${htmlRespostas}</div>
        </div>
      </section>
      <hr>
    `;
  }

  // Insere tudo na página
  resumoDiv.innerHTML = htmlFinal;
}

// Inicia a carga dos dados e a atualização periódica quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    setInterval(carregarDados, ATUALIZAR_A_CADA);
});