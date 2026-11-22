const backBtns = document.querySelectorAll('.backBtn');
const campoBusca = document.getElementById("busca");
const selectSerie = document.getElementById("serie");
const selectTurma = document.getElementById("turma");
const btnOrdenar = document.getElementById("ordenar");
const corpoLista = document.getElementById("corpoLista");

// critério da ordenação: "media" ou "frequencia"
let criterio = "media";

// valores abaixo disso ficam em destaque
const meida_minima = 6;
const frequencia_minima = 75;

backBtns.forEach(backBtn => {
    backBtn.addEventListener("click", function() {
        window.location.href = "/index.html";
    });
});

// tirar acentos e maiúsculas para a busca
function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// classe da célula: baixo (vermelho), ok (azul) ou nenhuma se não houver dado
function destaque(valor, minimo) {
    if (valor === null) {
        return "";
    }

    return valor < minimo ? "baixo" : "ok";
}

// buscar, filtrar, ordenar e mostrar os alunos
function montarLista() {
    const busca = normalizar(campoBusca.value.trim());
    const lista = alunos
        .filter(aluno => (normalizar(aluno.nome) + " " + aluno.matricula).includes(busca)
            && (selectSerie.value === "" || aluno.serie === selectSerie.value)
            && (selectTurma.value === "" || aluno.turma === selectTurma.value))
        .map(aluno => ({
            aluno: aluno,
            media: calcularMedia(notas[aluno.matricula]),
            frequencia: calcularFrequencia(aluno.matricula)
        }))
        // menor valor primeiro, quem não tem dado vai para o final
        .sort((a, b) => (a[criterio] ?? 999) - (b[criterio] ?? 999) || a.aluno.nome.localeCompare(b.aluno.nome));

    if (lista.length === 0) {
        corpoLista.innerHTML = '<tr><th colspan="5">Nenhum aluno encontrado</th></tr>';
        return;
    }

    corpoLista.innerHTML = lista.map(({ aluno, media, frequencia }) => `
        <tr>
            <th>${aluno.matricula}</th>
            <th>${aluno.nome}</th>
            <th>${aluno.serie} ${aluno.turma}</th>
            <th class="${destaque(media, meida_minima)}">${media === null ? "-" : formatarNumero(media)}</th>
            <th class="${destaque(frequencia, frequencia_minima)}">${frequencia === null ? "-" : formatarNumero(frequencia) + "%"}</th>
        </tr>`).join("");
}

// alternar entre menores notas e menor frequência
btnOrdenar.addEventListener("click", function() {
    criterio = criterio === "media" ? "frequencia" : "media";
    btnOrdenar.textContent = criterio === "media" ? "Ordenar: Menores notas" : "Ordenar: Menor frequência";

    montarLista();
});

// refazer a lista ao digitar na busca ou trocar série e turma
[campoBusca, selectSerie, selectTurma].forEach(campo => {
    campo.addEventListener("input", montarLista);
});

// carregar os dados e mostrar a lista
function iniciar() {
    return carregarDados().then(montarLista);
}

// atualizar quando o professor lançar algo em outra aba
window.addEventListener("storage", iniciar);

iniciar().catch(function() {
    alert("Não foi possível carregar os dados. Abra o projeto por um servidor (localhost).");
});
