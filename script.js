const lista = document.querySelector(".receitas-lista");
const btnDireita = document.querySelector(".botao-direita");
const btnEsquerda = document.querySelector(".botao-esquerda");

const scrollAmount = 300;

btnDireita?.addEventListener("click", () => {
  lista.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

btnEsquerda?.addEventListener("click", () => {
  lista.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

let total = 0;
let pedidos = [];

/* =========================
SELEÇÃO DE ITEM
========================= */

document.querySelectorAll(".comprar").forEach(botao => {

  botao.addEventListener("click", function () {

    this.classList.toggle("ativo");

    atualizarCarrinho();

  });

});

/* =========================
QUANTIDADE
========================= */

document.querySelectorAll(".receita").forEach(receita => {

  const btnMais = receita.querySelector(".mais");
  const btnMenos = receita.querySelector(".menos");
  const quantidadeSpan = receita.querySelector(".quantidade");

  if (!btnMais || !btnMenos || !quantidadeSpan) return;

  let quantidade = 1;

  btnMais.addEventListener("click", () => {
    quantidade++;
    quantidadeSpan.innerText = quantidade;
    atualizarCarrinho();
  });

  btnMenos.addEventListener("click", () => {
    if (quantidade > 1) {
      quantidade--;
      quantidadeSpan.innerText = quantidade;
      atualizarCarrinho();
    }
  });

});

/* =========================
CARRINHO
========================= */

function atualizarCarrinho() {

  total = 0;
  pedidos = [];

  document.querySelectorAll(".comprar.ativo").forEach(botao => {

    const nome = botao.dataset.nome;
    const preco = Number(botao.dataset.preco);

    const quantidade = Number(
      botao.parentElement.querySelector(".quantidade").innerText
    );

    const subtotal = preco * quantidade;

    total += subtotal;

    pedidos.push({
      nome,
      preco,
      quantidade,
      subtotal
    });

  });

  /* -------- ATUALIZA CONTADOR -------- */

  const contador = document.getElementById("contador-carrinho");

  if (contador) {
    let totalItens = 0;
    pedidos.forEach(item => totalItens += item.quantidade);
    contador.innerText = totalItens;
  }

  /* -------- MOSTRAR ITENS NO PAINEL -------- */

  const lista = document.getElementById("lista-carrinho");
  const totalSpan = document.getElementById("total");

  if (!lista) return;

  lista.innerHTML = "";

  if (pedidos.length === 0) {
    lista.innerHTML = "<p>Seu carrinho está vazio 😊</p>";
  } else {

    pedidos.forEach(item => {

      lista.innerHTML += `
        <div class="item-carrinho">
          <strong>${item.nome}</strong>
          <p>Qtd: ${item.quantidade}</p>
          <p>Subtotal: R$ ${item.subtotal.toFixed(2).replace(".", ",")}</p>
        </div>
        <hr>
      `;

    });

  }

  if (totalSpan) {
    totalSpan.innerText = "R$ " + total.toFixed(2).replace(".", ",");
  }

  verificarSelecao();
}

/* =========================
ENTREGA / RETIRADA
========================= */

document.querySelectorAll('input[name="entrega"]').forEach(radio => {

  radio.addEventListener("change", function () {

    const campoEndereco = document.querySelector(".campo-endereco");

    if (!campoEndereco) return;

    if (this.value === "Entrega") {
      campoEndereco.classList.add("ativo");
    } else {
      campoEndereco.classList.remove("ativo");
    }

  });

});

/* =========================
MOSTRAR OPÇÃO ENTREGA
========================= */

function verificarSelecao() {

  const entregaBox = document.querySelector(".tipo-entrega");
  const pagamentoBox = document.querySelector(".tipo-pagamento");
  const campoEndereco = document.querySelector(".campo-endereco");

  if (entregaBox) {
    entregaBox.style.display = pedidos.length > 0 ? "block" : "none";
  }

  if (pagamentoBox) {
    pagamentoBox.style.display = pedidos.length > 0 ? "block" : "none";
  }

  // Se esvaziar o carrinho, também esconde o endereço
  if (pedidos.length === 0 && campoEndereco) {
    campoEndereco.classList.remove("ativo");
  }

}

/* =========================
WHATSAPP
========================= */

function enviarWhats() {

  if (pedidos.length === 0) {
    alert("Selecione pelo menos um item 😊");
    return;
  }

  const tipoSelecionado = document.querySelector('input[name="entrega"]:checked');

  if (!tipoSelecionado) {
    alert("Selecione Entrega ou Retirada 😊");
    return;
  }

  const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');

  if (!pagamentoSelecionado) {
    alert("Selecione a forma de pagamento 😊");
    return;
  }

  const tipoEntrega = tipoSelecionado.value;

  let enderecoTexto = "";

  if (tipoEntrega === "Entrega") {

    const endereco = document.getElementById("endereco")?.value.trim() || "";
    const bairro = document.getElementById("bairro")?.value.trim() || "";

  if (!endereco || !bairro) {
    alert("Preencha o endereço para entrega 😊");
    return;
  }

  enderecoTexto = "Endereço: " + endereco + " - " + bairro + "\n\n";
}

  let mensagem = "✦  Novo Pedido  ✦\n\n";
  mensagem += "Forma de recebimento: " + tipoEntrega + "\n";

  if (enderecoTexto) mensagem += enderecoTexto;

  mensagem += "──────────────\n\n";

  pedidos.forEach(item => {

    const subtotal = item.preco * item.quantidade;

    mensagem += "• " + item.nome + "\n";
    mensagem += "   ˚ Qtd: " + item.quantidade + "\n";
    mensagem += "   ˚ Unid: R$ " + item.preco.toFixed(2).replace(".", ",") + "\n";
    mensagem += "   ˚ Subtotal: R$ " + subtotal.toFixed(2).replace(".", ",") + "\n\n";

  });

  mensagem += "──────────────\n";
  mensagem += "Total: R$ " + total.toFixed(2).replace(".", ",") + "\n";
  mensagem += "Forma de pagamento: " + pagamentoSelecionado.value + "\n";

  const numero = "5541999209841";
  const url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensagem);

  window.open(url, "_blank");
}

function abrirCarrinho() {
  document.querySelector(".painel-carrinho").classList.add("ativo");
  document.querySelector(".overlay").classList.add("ativo");
}

function fecharCarrinho() {
  document.querySelector(".painel-carrinho").classList.remove("ativo");
  document.querySelector(".overlay").classList.remove("ativo");
}

const formularioFeedback = document.getElementById('form-feedback');

// O '?' ou o 'if' evitam que o código quebre se o formulário não for encontrado
if (formularioFeedback) {
  formularioFeedback.addEventListener('submit', async function(event) {
    event.preventDefault();

    const botao = this.querySelector('.btn-enviar');
    const textoOriginal = botao.innerText;
    
    botao.innerText = "Enviando...";
    botao.disabled = true;

    const dados = new FormData(this);

    try {
      const response = await fetch(this.action, {
        method: this.method,
        body: dados,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        alert('Oba! Recebemos seu feedback. Muito obrigado!');
        this.reset();
      } else {
        alert('Ops! Algo deu errado no envio.');
      }
    } catch (error) {
      alert('Erro de conexão. Verifique sua internet.');
    } finally {
      botao.innerText = textoOriginal;
      botao.disabled = false;
    }
  });
}