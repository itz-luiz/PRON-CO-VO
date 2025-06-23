const API_URL = "http://localhost:3000/comentarios";
const ATUALIZAR_A_CADA = 5000;

function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
}

async function carregarDados() {
  try {
    const filtro = document.getElementById("filtro-bairro").value;
    let url = API_URL;
    
    if (filtro) {
      url += `?bairro=${encodeURIComponent(filtro)}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro na API");
    
    const comentarios = await response.json();
    exibirComentarios(comentarios);
    
  } catch (erro) {
    console.error("Falha ao carregar:", erro);
    document.getElementById("resumo").innerHTML = `
      <p class="erro">
        Não foi possível carregar os comentários. Tente recarregar a página.
      </p>
    `;
  }
}

function exibirComentarios(comentarios) {
  const resumoDiv = document.getElementById("resumo");
  if (comentarios.length === 0) {
    resumoDiv.innerHTML = "<p>Nenhum comentário encontrado.</p>";
    return;
  }

  // Agrupa comentários por bairro
  const porBairro = comentarios.reduce((grupos, comentario) => {
    if (!grupos[comentario.bairro]) grupos[comentario.bairro] = [];
    grupos[comentario.bairro].push(comentario);
    return grupos;
  }, {});

  let htmlFinal = '';
  
  for (const [bairro, comentariosBairro] of Object.entries(porBairro)) {
    htmlFinal += `
      <section class="bairro">
        <h2>${bairro}</h2>
        <div class="comentarios">
          ${comentariosBairro.map(comentario => `
            <div class="comentario">
              <div class="cabecalho-comentario">
                <span class="autor">${comentario.anonimo ? 'Anônimo' : comentario.nome || 'Anônimo'}</span>
                <span class="data">${formatarData(comentario.data)}</span>
              </div>
              <p class="texto-comentario">${comentario.comentario}</p>
            </div>
          `).join('')}
        </div>
      </section>
      <hr>
    `;
  }

  resumoDiv.innerHTML = htmlFinal;
}

// Configura filtro para atualizar quando mudar
document.getElementById("filtro-bairro").addEventListener("change", carregarDados);

// Inicia a carga dos dados
document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    // Configura atualização periódica
    setInterval(carregarDados, ATUALIZAR_A_CADA);
});