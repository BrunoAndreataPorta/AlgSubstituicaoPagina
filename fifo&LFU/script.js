let pageFault;
let posicao;
let tamanho;
let memoria;
let uso;
let pageFaultLinha;

function calcular() {
  pageFault = 0;
  posicao = 0;
  memoria = null;

  let algoritmo = document.querySelector('input[name="algoritmo"]:checked').value;

  tamanho = parseInt(document.getElementById("tamanho").value);
  memoria = new Array(tamanho).fill(-1);

  let str = document.getElementById("referencia").value;

  limparTabela();
  criarCabecalhoTabela(str, algoritmo);

  if (algoritmo == "fifo") {
    fifo(str);
  } else if (algoritmo == "lfu") {
    lfu(str);
  }
}

function lfu(str) {
  uso = new Array(tamanho).fill(0);

  for (let i = 0; i < str.length; i++) {
    pageFaultLinha = document.createElement("td");

    if (verificarPresenca(str[i]) == -1) {
      let aux = uso[0];
      let menor = 0;
      for (let j = 1; j < tamanho; j++) {
        if (aux > uso[j]) {
          aux = uso[j];
          menor = j;
        }
      }
      memoria[menor] = str[i];
      uso[menor]++;
      pageFault++;
      pageFaultLinha.innerText = "f";
    } else {
      uso[verificarPresenca(str[i])]++;
      pageFaultLinha.innerText = "-";
    }
    atualizarTabela(i, str, "lfu");

    adicionarLinhaPageFault();
  }
  document.getElementById("pageFault").innerText = pageFault;
}

function fifo(str) {
  for (let i = 0; i < str.length; i++) {
    pageFaultLinha = document.createElement("td");

    if (fimMemoria(posicao)) {
      posicao = 0;
    }
    if (verificarPresenca(str[i]) == -1) {
      memoria[posicao] = str[i];
      posicao++;
      pageFault++;
      pageFaultLinha.innerText = "f";
    } else {
      pageFaultLinha.innerText = "-";
    }
    atualizarTabela(i, str, "fifo");

    adicionarLinhaPageFault();
  }
  document.getElementById("pageFault").innerText = pageFault;
}

function fimMemoria(posicao) {
  return posicao == tamanho;
}

function verificarPresenca(char) {
  for (let i = 0; i < tamanho; i++) {
    if (char == memoria[i]) {
      return i;
    }
  }
  return -1;
}

function limparTabela() {
  document.getElementById("referencias").innerHTML = "";
  document.getElementById("memoriaCorpo").innerHTML = "";
}

function criarCabecalhoTabela(str, algoritmo) {
  let referenciaLinha = document.getElementById("referencias");
  for (let i = 0; i < str.length; i++) {
    let th = document.createElement("th");
    th.innerText = str[i];
    referenciaLinha.appendChild(th);
  }
  if (algoritmo == "lfu") {
    let thUso = document.createElement("th");
    thUso.innerText = "Usos";
    referenciaLinha.appendChild(thUso);
  }
}

function atualizarTabela(indice, str, algoritmo) {
  let corpoTabela = document.getElementById("memoriaCorpo");

  if (corpoTabela.rows.length < tamanho) {
    for (let i = corpoTabela.rows.length; i < tamanho; i++) {
      let linha = corpoTabela.insertRow();
      for (let j = 0; j < str.length + (algoritmo == "lfu" ? 1 : 0); j++) {
        linha.insertCell().innerText = "";
      }
    }
  }

  for (let i = 0; i < tamanho; i++) {
    let linhaTabela = corpoTabela.rows[i].cells[indice];
    if (memoria[i] == -1) {
      linhaTabela.innerText = "";
    } else {
      linhaTabela.innerText = memoria[i];
    }
    if (memoria[i] == str[indice]) {
      linhaTabela.style.backgroundColor = "yellow";
    } else {
      linhaTabela.style.backgroundColor = "white";
    }
    if (algoritmo == "lfu") {
      corpoTabela.rows[i].cells[str.length].innerText = uso[i];
    }
  }
}

function adicionarLinhaPageFault() {
  let corpoTabela = document.getElementById("memoriaCorpo");
  if (corpoTabela.rows.length < tamanho + 1) {
    corpoTabela.insertRow();
  }
  corpoTabela.rows[tamanho].appendChild(pageFaultLinha);
}