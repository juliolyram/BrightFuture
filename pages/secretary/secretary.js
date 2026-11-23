const backBtns = document.querySelectorAll('.backBtn');
const etapas = document.querySelectorAll(".etapa");

let etapaAtual = 0;

function preencherConfirmacao() {

    const nomeDoAluno = document.getElementById('nome').value;
    const cpfDoAluno = document.getElementById('cpf').value;
    const dataDoAluno = document.getElementById('data-nascimento').value;

    const nomeResponsavel = document.getElementById('responsavel').value;
    const telefone = document.getElementById('telefone').value;

    document.getElementById('outNome').textContent = nomeDoAluno;
    document.getElementById('outCpf').textContent = cpfDoAluno;
    document.getElementById('outData').textContent = dataDoAluno;
    document.getElementById('outNomeResp').textContent = nomeResponsavel;
    document.getElementById('outTelefoneResp').textContent = telefone;
}

backBtns.forEach(backBtn => {
    backBtn.addEventListener("click", function () {
        window.location.href = "/index.html";
    });
});

function mostrarEtapas() {
    etapas.forEach((etapa, index) => {
        etapa.classList.remove("ativa");

        if (index === etapaAtual) {
            etapa.classList.add("ativa");
        }
    });
}

function proximaEtapa() {
    if (etapaAtual < etapas.length - 1) {

        if (etapaAtual === 1) {
            preencherConfirmacao();
        }

        etapaAtual++;
        mostrarEtapas();
    }
}

function voltarEtapa() {
    if (etapaAtual > 0) {
        etapaAtual--;
        mostrarEtapas();
    }
}

function finalizar() {
    const nomeDoAluno = document.getElementById('nome').value;
    document.getElementById('outNomeBoasVindas').textContent = nomeDoAluno;

    etapaAtual++;
    mostrarEtapas();
}

function novaMatricula() {
    document.querySelector('.formulario').reset();

    etapaAtual = 0;
    mostrarEtapas();
}