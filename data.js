// chaves do armazenamento local do navegador
const CHAVE_NOTAS = "bf_notas";
const CHAVE_CHAMADAS = "bf_chamadas";

// dados carregados dos arquivos JSON da pasta /data
let alunos = [];
let notas = {};      // matrícula -> [unidade 1, unidade 2, unidade 3, unidade 4, recuperação]
let chamadas = [];   // lista com data, série, turma e presencas (matrícula -> "P" ou "F")

// ler um arquivo JSON
function lerJson(caminho) {
    return fetch(caminho).then(resposta => resposta.json());
}

// gravar um valor no navegador (retorna false se der erro)
function gravar(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch (erro) {
        return false;
    }
}

// carregar os dados: o que foi salvo no navegador vale mais que os arquivos JSON
async function carregarDados() {
    const chamadasNavegador = JSON.parse(localStorage.getItem(CHAVE_CHAMADAS));

    alunos = await lerJson("/data/alunos.json");
    notas = JSON.parse(localStorage.getItem(CHAVE_NOTAS)) || await lerJson("/data/notas.json");
    chamadas = Array.isArray(chamadasNavegador) ? chamadasNavegador : await lerJson("/data/chamadas.json");
}

// procurar a chamada de uma turma em uma data
function buscarChamada(serie, turma, data) {
    return chamadas.find(chamada => chamada.serie === serie && chamada.turma === turma && chamada.data === data);
}

// registrar uma chamada (substitui se já existir na data) e salvar
function registrarChamada(serie, turma, data, presencas) {
    const chamada = buscarChamada(serie, turma, data);

    if (chamada) {
        chamada.presencas = presencas;
    } else {
        chamadas.push({ data, serie, turma, presencas });
    }

    return gravar(CHAVE_CHAMADAS, chamadas);
}

// alunos de uma série e turma, em ordem alfabética
function alunosDaTurma(serie, turma) {
    return alunos
        .filter(aluno => aluno.serie === serie && aluno.turma === turma)
        .sort((a, b) => a.nome.localeCompare(b.nome));
}

// média das unidades lançadas (a recuperação substitui a menor nota se for maior)
function calcularMedia(notasDoAluno = []) {
    const unidades = notasDoAluno.slice(0, 4).filter(nota => nota !== null);

    if (unidades.length === 0) {
        return null;
    }

    const menor = Math.min(...unidades);

    if (notasDoAluno[4] > menor) {
        unidades[unidades.indexOf(menor)] = notasDoAluno[4];
    }

    const soma = unidades.reduce((total, nota) => total + nota, 0);

    return Math.round(soma / unidades.length * 10) / 10;
}

// frequência em % de um aluno (null se ainda não houver chamada)
function calcularFrequencia(matricula) {
    const aulas = chamadas.filter(chamada => chamada.presencas[matricula]);
    const presencas = aulas.filter(chamada => chamada.presencas[matricula] === "P");

    if (aulas.length === 0) {
        return null;
    }

    return Math.round(presencas.length / aulas.length * 1000) / 10;
}

// número com vírgula, como no padrão brasileiro
function formatarNumero(numero) {
    return numero.toFixed(1).replace(".", ",");
}
