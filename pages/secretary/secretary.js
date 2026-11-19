
const backBtns = document.querySelectorAll('.backBtn');
const etapas = document.querySelectorAll(".etapa");

let etapaAtual = 0;

// função para preencher os dados da confirmação
function preencherConfirmacao() {
    // dados do aluno
    const nomeDoAluno = document.getElementById('nome').value;
    const cpfDoAluno = document.getElementById('cpf').value;
    const dataDoAluno = document.getElementById('data-nascimento').value;

    // dados do responsável
    const nomeResponsavel = document.getElementById('responsavel').value;
    const telefone = document.getElementById('telefone').value;

    // colocando os dados na confirmação
    document.getElementById('outNome').textContent = nomeDoAluno;
    document.getElementById('outCpf').textContent = cpfDoAluno;
    document.getElementById('outData').textContent = dataDoAluno;
    document.getElementById('outNomeResp').textContent = nomeResponsavel;
    document.getElementById('outTelefoneResp').textContent = telefone;
}

// botão sair
backBtns.forEach(backBtn => {
    backBtn.addEventListener("click", function () {
        window.location.href = "/index.html";
    });
});

// mostrar a etapa atual
function mostrarEtapas() {
    etapas.forEach((etapa, index) => {
        etapa.classList.remove("ativa");

        if (index === etapaAtual) {
            etapa.classList.add("ativa");
        }
    });
}

// avançar etapa
function proximaEtapa() {
    if (etapaAtual < etapas.length - 1) {

        if (etapaAtual === 1) {
            preencherConfirmacao();
        }

        etapaAtual++;
        mostrarEtapas();
    }
}

// voltar etapa
function voltarEtapa() {
    if (etapaAtual > 0) {
        etapaAtual--;
        mostrarEtapas();
    }
}

function finalizar() {

}
