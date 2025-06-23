// Elementos HTML importantes
const mensagem = document.getElementById("mensagem");
const API_URL = "https://pron-co-vo.onrender.com/comentarios";

// Quando a página terminar de carregar, verifica o servidor
document.addEventListener("DOMContentLoaded", () => {
  verificarServidor();
});

// Quando o formulário é enviado
document.getElementById("comentario-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const bairro = document.getElementById("bairro").value.trim();
  const nome = document.getElementById("nome").value.trim();
  const comentario = document.getElementById("comentario").value.trim();
  const anonimo = document.getElementById("anonimo").checked;
  
  // Validações
  if (!bairro) {
    mostrarMensagem("Por favor, selecione seu bairro.", "red");
    return;
  }

  if (!comentario) {
    mostrarMensagem("Por favor, escreva seu comentário.", "red");
    return;
  }

  // Prepara os dados para enviar
  const dados = {
    bairro: bairro,
    comentario: comentario,
    anonimo: anonimo,
    data: new Date().toISOString()
  };

  // Adiciona nome apenas se não for anônimo e se foi fornecido
  if (!anonimo && nome) {
    dados.nome = nome;
  } else {
    dados.nome = "Anônimo";
  }

  // Envia para o servidor
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  })
  .then(response => {
    if (!response.ok) throw new Error("Erro ao salvar comentário");
    // Sucesso - mostra mensagem e redireciona
    mostrarMensagem("Obrigado pelo seu comentário! Redirecionando...", "green");
    setTimeout(() => {
      window.location.href = "resumo.html";
    }, 1500);
  })
  .catch(error => {
    console.error("Erro ao enviar:", error);
    mostrarMensagem("Falha ao enviar. Tente novamente.", "red");
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