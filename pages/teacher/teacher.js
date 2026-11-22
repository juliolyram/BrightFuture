const backBtns = document.querySelectorAll('.backBtn');
const btnChamar = document.querySelector(".chamar");
const btnAvaliar = document.querySelector(".avaliar");
const painelPresenca = document.querySelector(".presenca");
const painelNotas = document.querySelector(".avaliando");

// chamada
const selectSerieChamada = document.getElementById("serieChamada");
const selectTurmaChamada = document.getElementById("turmaChamada");
const campoData = document.getElementById("dataChamada");
const formChamada = document.getElementById("formChamada");
const corpoChamada = document.getElementById("corpoChamada");
const avisoChamada = document.getElementById("avisoChamada");
const btnSalvarChamada = document.getElementById("salvarChamada");

// notas
const selectSerieNotas = document.getElementById("serieNotas");
const selectTurmaNotas = document.getElementById("turmaNotas");
const formNotas = document.getElementById("formNotas");
const corpoNotas = document.getElementById("corpoNotas");
const avisoNotas = document.getElementById("avisoNotas");
const btnSalvarNotas = document.getElementById("salvarNotas");

backBtns.forEach(backBtn => {
    backBtn.addEventListener("click", function() {
        window.location.href = "/index.html";
    });
});

// mostrar o aviso de salvo (ok) ou de erro
function mostrarAviso(aviso, texto, tipo = "") {
    aviso.textContent = texto;
    aviso.className = "aviso " + tipo;
}

// data de hoje no formato aaaa-mm-dd (o formato sueco é igual ao do campo date)
function dataDeHoje() {
    return new Date().toLocaleDateString("sv-SE");
}

// data no formato dd/mm/aaaa
function formatarData(data) {
    return data.split("-").reverse().join("/");
}

// mostrar o painel escolhido (presenca ou notas)
function mostrarPainel(painel) {
    painelPresenca.classList.toggle("ativa", painel === "presenca");
    painelNotas.classList.toggle("ativa", painel === "notas");

    btnChamar.classList.toggle("ativa", painel === "presenca");
    btnAvaliar.classList.toggle("ativa", painel === "notas");
}

btnChamar.addEventListener("click", function() {
    mostrarPainel("presenca");
});

btnAvaliar.addEventListener("click", function() {
    mostrarPainel("notas");
});

// CHAMADA 

// mostrar os alunos da turma escolhida com a chamada da data
function montarChamada() {
    const serie = selectSerieChamada.value;
    const turma = selectTurmaChamada.value;
    const data = campoData.value;

    mostrarAviso(avisoChamada, "");

    if (serie === "" || turma === "" || data === "") {
        formChamada.classList.remove("ativa");
        return;
    }

    const turmaAlunos = alunosDaTurma(serie, turma);
    const chamada = buscarChamada(serie, turma, data);
    const registro = chamada ? chamada.presencas : {};

    corpoChamada.innerHTML = turmaAlunos.map(aluno => `
        <tr>
            <th>${aluno.matricula}</th>
            <th>${aluno.nome}</th>
            <th><input type="checkbox" class="presente" data-matricula="${aluno.matricula}" ${registro[aluno.matricula] === "P" ? "checked" : ""}></th>
            <th><input type="checkbox" class="faltou" data-matricula="${aluno.matricula}" ${registro[aluno.matricula] === "F" ? "checked" : ""}></th>
        </tr>`).join("") || '<tr><th colspan="4">Nenhum aluno nesta turma</th></tr>';

    if (chamada) {
        mostrarAviso(avisoChamada, "Chamada já registrada em " + formatarData(data) + ". Ao salvar, ela será substituída.");
    }

    btnSalvarChamada.disabled = turmaAlunos.length === 0;
    formChamada.classList.add("ativa");
}

// presente e faltou não podem ficar marcados ao mesmo tempo
corpoChamada.addEventListener("change", function(evento) {
    const check = evento.target;
    const outro = check.classList.contains("presente") ? ".faltou" : ".presente";

    if (check.checked) {
        check.closest("tr").querySelector(outro).checked = false;
    }
});

// registrar a chamada
formChamada.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const serie = selectSerieChamada.value;
    const turma = selectTurmaChamada.value;
    const data = campoData.value;

    const presentes = corpoChamada.querySelectorAll(".presente:checked");
    const faltas = corpoChamada.querySelectorAll(".faltou:checked");
    const semMarcacao = alunosDaTurma(serie, turma).length - presentes.length - faltas.length;

    if (semMarcacao > 0) {
        mostrarAviso(avisoChamada, "Marque presente ou faltou para todos os alunos (faltam " + semMarcacao + ").", "erro");
        return;
    }

    const presencas = {};
    presentes.forEach(check => presencas[check.dataset.matricula] = "P");
    faltas.forEach(check => presencas[check.dataset.matricula] = "F");

    if (registrarChamada(serie, turma, data, presencas)) {
        mostrarAviso(avisoChamada, "Chamada de " + formatarData(data) + " registrada (presentes: " + presentes.length + ", faltas: " + faltas.length + ").", "ok");
    } else {
        mostrarAviso(avisoChamada, "Erro ao registrar a chamada. Tente novamente.", "erro");
    }
});

campoData.value = dataDeHoje();
campoData.max = dataDeHoje();

[selectSerieChamada, selectTurmaChamada, campoData].forEach(campo => {
    campo.addEventListener("input", montarChamada);
});

// NOTAS 

// mostrar o formulário de notas da turma escolhida
function montarNotas() {
    const serie = selectSerieNotas.value;
    const turma = selectTurmaNotas.value;

    mostrarAviso(avisoNotas, "");

    if (serie === "" || turma === "") {
        formNotas.classList.remove("ativa");
        return;
    }

    const turmaAlunos = alunosDaTurma(serie, turma);

    corpoNotas.innerHTML = turmaAlunos.map(aluno => `
        <tr>
            <th>${aluno.matricula}</th>
            <th>${aluno.nome}</th>
            ${[0, 1, 2, 3, 4].map(posicao => `
            <th><input type="number" placeholder="0,0" min="0" max="10" step="0.1" data-matricula="${aluno.matricula}" data-posicao="${posicao}" value="${(notas[aluno.matricula] || [])[posicao] ?? ""}"></th>`).join("")}
        </tr>`).join("") || '<tr><th colspan="7">Nenhum aluno nesta turma</th></tr>';

    btnSalvarNotas.disabled = turmaAlunos.length === 0;
    formNotas.classList.add("ativa");
}

// a nota deve ir de 0 a 10, com no máximo uma casa decimal (campo vazio vale)
function notaValida(campo) {
    const nota = Number(campo.value);

    return !campo.validity.badInput
        && (campo.value === "" || (nota >= 0 && nota <= 10 && Math.round(nota * 10) / 10 === nota));
}

// tirar o destaque de erro quando o campo for corrigido
corpoNotas.addEventListener("input", function(evento) {
    evento.target.classList.remove("invalido");
});

// salvar as notas
formNotas.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const campos = [...corpoNotas.querySelectorAll("input")];
    const invalidos = campos.filter(campo => !notaValida(campo));

    campos.forEach(campo => campo.classList.toggle("invalido", invalidos.includes(campo)));

    if (invalidos.length > 0) {
        mostrarAviso(avisoNotas, "Corrija as notas destacadas: use valores de 0 a 10, com no máximo uma casa decimal.", "erro");
        return;
    }

    campos.forEach(campo => {
        notas[campo.dataset.matricula] ??= [null, null, null, null, null];
        notas[campo.dataset.matricula][campo.dataset.posicao] = campo.value === "" ? null : Number(campo.value);
    });

    if (gravar(CHAVE_NOTAS, notas)) {
        mostrarAviso(avisoNotas, "Notas da " + selectSerieNotas.value + " " + selectTurmaNotas.value + " salvas.", "ok");
    } else {
        mostrarAviso(avisoNotas, "Erro ao salvar as notas. Tente novamente.", "erro");
    }
});

[selectSerieNotas, selectTurmaNotas].forEach(campo => {
    campo.addEventListener("input", montarNotas);
});

// carregar os dados dos arquivos JSON
carregarDados().catch(function() {
    alert("Não foi possível carregar os dados. Abra o projeto por um servidor (localhost).");
});
