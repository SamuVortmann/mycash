const apiKey = "fb7b8220a61e46ed7facf04b";
const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

let saldo = parseFloat(localStorage.getItem("saldo"));
if (isNaN(saldo)) saldo = 0;

let emDolar = localStorage.getItem("emDolar") === "true";
const taxaCambio = 5.0;

let historico = JSON.parse(localStorage.getItem("historico")) || [];

async function atualizarSaldo() {
    let saldoElemento = document.getElementById("saldo");

    if (emDolar) {
        try {
            const taxaDolar = await obterCotacaoDolar();
            let saldoConvertido = (saldo / taxaDolar).toFixed(2).replace('.', ',');
            saldoElemento.innerHTML = `$ ${saldoConvertido}`;
        } catch (error) {
            console.error("Erro ao obter a cotação do dólar:", error);
            saldoElemento.innerHTML = `Erro ao carregar a cotação do dólar`;
        }
    } else {
        saldoElemento.innerHTML = `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    localStorage.setItem("saldo", saldo.toFixed(2));
    localStorage.setItem("emDolar", emDolar.toString());
}

function obterCotacaoDolar() {
    return fetch(url)
        .then(response => response.json())
        .then(data => data.conversion_rates.BRL)
        .catch(error => {
            console.error("Erro ao obter a cotação do dólar:", error);
            return taxaCambio;
        });
}

function registrarAcao(tipo, valor, descricao = "") {
    let data = new Date().toLocaleString('pt-BR');
    let novaAcao = {
        data,
        tipo,
        valor: `R$ ${valor.toFixed(2)}`,
        descricao
    };

    historico.push(novaAcao);
    localStorage.setItem("historico", JSON.stringify(historico));
}

function depositar() {
    let valor = parseFloat(prompt("Digite o valor a depositar:"));
    if (!isNaN(valor) && valor > 0) {
        let descricao = prompt("Digite uma descrição para o depósito:");
        saldo += valor;
        registrarAcao("Depósito", valor, descricao);
        atualizarSaldo();
        alert("Depósito realizado com sucesso!");
    } else {
        alert("Valor inválido!");
    }
}

function retirar() {
    let valor = parseFloat(prompt("Digite o valor a retirar:"));
    if (!isNaN(valor) && valor > 0 && valor <= saldo) {
        let descricao = prompt("Digite uma descrição para a retirada:");
        saldo -= valor;
        registrarAcao("Retirada", valor, descricao);
        atualizarSaldo();
        alert("Retirada realizada com sucesso!");
    } else {
        alert("Valor inválido ou saldo insuficiente!");
    }
}

function trocarMoeda() {
    let descricao = prompt("Digite uma descrição para a troca de moeda:");
    emDolar = !emDolar;
    registrarAcao("Troca de moeda", saldo, descricao);
    atualizarSaldo();
}

function editarDados() {
    alert("Funcionalidade de edição de dados em breve!");
}

function associarConta() {
    alert("Funcionalidade de associação de conta em breve!");
}

window.onload = atualizarSaldo;
