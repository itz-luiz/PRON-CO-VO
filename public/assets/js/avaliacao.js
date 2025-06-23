// Lista com todas as perguntas do questionário e seus IDs
const criteriosDeAvaliacao = [
  { id: "seguranca", texto: "Você se sentiu seguro no bairro?" },
  { id: "escolas", texto: "Há escolas suficientes próximas?" },
  { id: "saude", texto: "O acesso à saúde é satisfatório?" },
  { id: "mobilidade", texto: "É fácil andar a pé pelo bairro?" },
  { id: "transporte", texto: "O transporte público atende bem?" },
  { id: "limpeza", texto: "O bairro é limpo e bem cuidado? " },
  { id: "iluminacao", texto: "A iluminação pública é adequada?" },
  { id: "lazer", texto: "Existem áreas de lazer e convivência?" }
];

// Elementos HTML importantes
const quizContainer = document.getElementById("quizContainer"); // Onde as perguntas serão colocadas
const mensagem = document.getElementById("mensagem"); // Para mostrar mensagens ao usuário
const API_URL = "https://pron-co-vo.onrender.com/respostas"; // Endereço da API para salvar as respostas

// Objeto para guardar as respostas do usuário
let respostas = {};

// Quando a página terminar de carregar, cria o quiz e verifica o servidor
document.addEventListener("DOMContentLoaded", () => {
  criarQuiz();
  verificarServidor();
});

// Cria o questionário na página
function criarQuiz() {
  quizContainer.innerHTML = ""; // Limpa o container

  // Para cada pergunta na lista...
  criteriosDeAvaliacao.forEach(criterio => {
    // Cria um grupo para a pergunta
    const grupo = document.createElement("div");
    grupo.classList.add("form-group");

    // Cria o texto da pergunta
    const label = document.createElement("label");
    label.textContent = criterio.texto;
    grupo.appendChild(label);

    // Cria o container das estrelas
    const estrelas = document.createElement("div");
    estrelas.classList.add("stars");

    // Cria 5 estrelas para cada pergunta
    for (let i = 1; i <= 5; i++) {
      const estrela = document.createElement("span");
      estrela.innerHTML = "★";
      estrela.classList.add("star");
      estrela.dataset.valor = i; // Guarda o valor da estrela (1-5)

      // Eventos para interação com as estrelas
      estrela.addEventListener("mouseover", () => destacarEstrelas(estrelas, i));
      estrela.addEventListener("mouseout", () => removerDestaque(estrelas));
      estrela.addEventListener("click", () => selecionarEstrelas(estrelas, i, criterio.id));

      estrelas.appendChild(estrela); // Adiciona a estrela ao container
    }

    grupo.appendChild(estrelas); // Adiciona as estrelas ao grupo
    quizContainer.appendChild(grupo); // Adiciona o grupo ao container principal
  });
}

// Faz as estrelas brilharem quando o mouse passa por cima
function destacarEstrelas(container, quantidade) {
  const children = container.children;
  for (let j = 0; j < quantidade; j++) {
    children[j].classList.add("hover"); // Adiciona classe de destaque
  }
}

// Remove o brilho quando o mouse sai
function removerDestaque(container) {
  const children = container.children;
  for (let j = 0; j < 5; j++) {
    children[j].classList.remove("hover"); // Remove classe de destaque
  }
}

// Seleciona as estrelas quando clicadas
function selecionarEstrelas(container, quantidade, criterioId) {
  respostas[criterioId] = quantidade; // Guarda a resposta (1-5)
  const children = container.children;
  
  // Atualiza o visual das estrelas
  for (let j = 0; j < 5; j++) {
    children[j].classList.remove("selected"); // Remove seleção de todas
    if (j < quantidade) {
      children[j].classList.add("selected"); // Seleciona até a quantidade clicada
    }
  }
}

// Quando o formulário é enviado
document.getElementById("quiz-form").addEventListener("submit", function(e) {
  e.preventDefault(); // Impede o comportamento padrão de enviar o formulário

  const bairro = document.getElementById("bairro").value.trim();
  
  // Validações
  if (!bairro) {
    mostrarMensagem("Por favor, selecione seu bairro.", "red");
    return;
  }

  // Verifica se todas perguntas foram respondidas
  const todasRespondidas = criteriosDeAvaliacao.every(c => respostas[c.id] !== undefined);
  if (!todasRespondidas) {
    mostrarMensagem("Responda todas as perguntas antes de enviar.", "red");
    return;
  }

  // Prepara os dados para enviar
  const feedback = {
    bairro: bairro,
    ...respostas, // Inclui todas as respostas das estrelas
    data: new Date().toISOString() // Adiciona data/hora
  };

  // Envia para o servidor
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback) // Converte para JSON
  })
  .then(response => {
    if (!response.ok) throw new Error("Erro ao salvar resposta");
    // Sucesso - mostra mensagem e redireciona
    mostrarMensagem("Obrigado pelo seu feedback! Redirecionando...", "green");
    setTimeout(() => {
      window.location.href = "resumoaval.html"; // Vai para a página de resumo
    }, 1500);
  })
  .catch(error => {
    console.error("Erro ao enviar:", error);
    mostrarMensagem("Falha ao enviar. Tente novamente.", "red"); // Mostra erro
  });
});

// Mostra mensagens para o usuário
function mostrarMensagem(texto, cor) {
  mensagem.textContent = texto;
  mensagem.style.color = cor;
}

// Verifica se o servidor está online
async function verificarServidor() {
  try {
    await fetch(API_URL);
    console.log("Conectado ao json-server");
  } catch {
    console.warn("json-server não está rodando - modo offline ativado");
  }
}