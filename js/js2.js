let historico = JSON.parse(localStorage.getItem("historico")) || [];

// Função para registrar transações no histórico
function registrarAcao(tipo, valor, descricao = "Sem descrição") {
    let data = new Date().toLocaleString('pt-BR', { hour12: false });
    let novaAcao = {
        data,
        tipo,
        valor: `R$ ${valor.toFixed(2)}`,
        descricao
    };

    // Adiciona nova transação no início do array (mantendo a ordem inversa)
    historico.unshift(novaAcao);
    localStorage.setItem("historico", JSON.stringify(historico));
}

// Função para carregar e exibir o histórico
function carregarHistorico() {
    let lista = document.getElementById("listaHistorico");
    if (!lista) return; // Previne erro caso a página errada seja carregada

    lista.innerHTML = "";

    if (historico.length === 0) {
        lista.innerHTML = "<li>Nenhuma transação registrada.</li>";
    } else {
        historico.forEach(acao => {
            let item = document.createElement("li");
            let classe = acao.tipo === "Depósito" ? "deposito" : "retirada";
            item.innerHTML = `<span>${acao.data}</span> - <span class="${classe}">${acao.tipo}: ${acao.valor}</span> | ${acao.descricao}`;
            lista.appendChild(item);
        });
    }
}

// Atualiza histórico ao carregar a página
window.onload = carregarHistorico;
