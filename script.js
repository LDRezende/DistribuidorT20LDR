/* ========================================
   ATRIBUTOS
======================================== */

const atributos = [
  "Força",
  "Destreza",
  "Constituição",
  "Inteligência",
  "Sabedoria",
  "Carisma"
];


/* ========================================
   ESTADO
======================================== */

const estado = atributos.map(function (nome) {
  return {
    nome: nome,
    pontos: 0,
    racial: 0,
    outros: 0
  };
});


/* ========================================
   ELEMENTOS DA PÁGINA
======================================== */

const tabela =
  document.getElementById("tabelaAtributos");

const pontosBaseInput =
  document.getElementById("pontosBase");

const pontosDisponiveisElemento =
  document.getElementById("pontosDisponiveis");

const ignorarRestricoes =
  document.getElementById("ignorarRestricoes");

const avisoNaoConvencional =
  document.getElementById("avisoNaoConvencional");

const mensagemPontos =
  document.getElementById("mensagemPontos");

const botaoGerar =
  document.getElementById("gerarImagem");

const botaoReiniciar =
  document.getElementById("reiniciarTudo");

const previewArea =
  document.getElementById("previewArea");

const canvas =
  document.getElementById("canvasImagem");

const botaoBaixar =
  document.getElementById("baixarImagem");

const ctx =
  canvas.getContext("2d");


/* ========================================
   CONVERTER PARA NÚMERO
======================================== */

function obterNumero(valor) {

  if (valor === "") {
    return 0;
  }

  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return 0;
  }

  return Math.trunc(numero);
}


/* ========================================
   FORMATAR NÚMEROS
======================================== */

function formatarNumero(valor) {

  if (valor > 0) {
    return "+" + valor;
  }

  return String(valor);
}


/* ========================================
   CRIAR TABELA DO DISTRIBUIDOR

   ORDEM:
   Atributo | Pontos | Racial | Outros | Total
======================================== */

function criarTabela() {

  tabela.innerHTML = "";

  estado.forEach(function (atributo, index) {

    const linha =
      document.createElement("tr");

    linha.innerHTML = `

      <td class="nome-atributo">
        ${atributo.nome}
      </td>

      <td>
        <input
          type="number"
          class="input-pontos"
          data-index="${index}"
          value="0"
          min="-1"
          max="4"
          step="1"
        >
      </td>

      <td>
        <input
          type="number"
          class="input-racial"
          data-index="${index}"
          value="0"
          step="1"
        >
      </td>

      <td>
        <input
          type="number"
          class="input-outros"
          data-index="${index}"
          value="0"
          step="1"
        >
      </td>

      <td
        class="total"
        id="total-${index}"
      >
        0
      </td>

    `;

    tabela.appendChild(linha);
  });

  configurarEventosDosInputs();
}


/* ========================================
   SINCRONIZAR TABELA
======================================== */

function sincronizarValoresDaTabela() {

  document
    .querySelectorAll(".input-pontos")
    .forEach(function (input) {

      const index =
        Number(input.dataset.index);

      estado[index].pontos =
        obterNumero(input.value);

    });


  document
    .querySelectorAll(".input-racial")
    .forEach(function (input) {

      const index =
        Number(input.dataset.index);

      estado[index].racial =
        obterNumero(input.value);

    });


  document
    .querySelectorAll(".input-outros")
    .forEach(function (input) {

      const index =
        Number(input.dataset.index);

      estado[index].outros =
        obterNumero(input.value);

    });
}


/* ========================================
   EVENTOS DOS INPUTS
======================================== */

function configurarEventosDosInputs() {

  /* PONTOS */

  document
    .querySelectorAll(".input-pontos")
    .forEach(function (input) {

      input.addEventListener(
        "input",
        function () {

          const index =
            Number(this.dataset.index);

          let valor =
            obterNumero(this.value);


          if (!ignorarRestricoes.checked) {

            if (valor > 4) {
              valor = 4;
            }

            if (valor < -1) {
              valor = -1;
            }

          }


          estado[index].pontos =
            valor;

          atualizarAplicativo();
        }
      );


      input.addEventListener(
        "blur",
        function () {

          const index =
            Number(this.dataset.index);

          let valor =
            obterNumero(this.value);


          if (!ignorarRestricoes.checked) {

            if (valor > 4) {
              valor = 4;
            }

            if (valor < -1) {
              valor = -1;
            }

          }


          estado[index].pontos =
            valor;

          this.value =
            valor;

          atualizarAplicativo();
        }
      );

    });


  /* RACIAL */

  document
    .querySelectorAll(".input-racial")
    .forEach(function (input) {

      input.addEventListener(
        "input",
        function () {

          const index =
            Number(this.dataset.index);

          estado[index].racial =
            obterNumero(this.value);

          atualizarAplicativo();
        }
      );


      input.addEventListener(
        "blur",
        function () {

          const index =
            Number(this.dataset.index);

          const valor =
            obterNumero(this.value);

          estado[index].racial =
            valor;

          this.value =
            valor;

          atualizarAplicativo();
        }
      );

    });


  /* OUTROS */

  document
    .querySelectorAll(".input-outros")
    .forEach(function (input) {

      input.addEventListener(
        "input",
        function () {

          const index =
            Number(this.dataset.index);

          estado[index].outros =
            obterNumero(this.value);

          atualizarAplicativo();
        }
      );


      input.addEventListener(
        "blur",
        function () {

          const index =
            Number(this.dataset.index);

          const valor =
            obterNumero(this.value);

          estado[index].outros =
            valor;

          this.value =
            valor;

          atualizarAplicativo();
        }
      );

    });

}


/* ========================================
   CALCULAR PONTOS DISPONÍVEIS
======================================== */

function calcularPontosDisponiveis() {

  const pontosBase =
    obterNumero(pontosBaseInput.value);

  let pontosDistribuidos = 0;


  estado.forEach(function (atributo) {

    pontosDistribuidos +=
      atributo.pontos;

  });


  /*
    Exemplo:

    Base = 10
    Força = -1

    10 - (-1) = 11

    Portanto valores negativos
    devolvem pontos.
  */

  return pontosBase - pontosDistribuidos;
}


/* ========================================
   ATUALIZAR APLICATIVO
======================================== */

function atualizarAplicativo() {

  /* TOTAL DE CADA ATRIBUTO */

  estado.forEach(function (atributo, index) {

    const total =
      atributo.pontos +
      atributo.racial +
      atributo.outros;


    document.getElementById(
      "total-" + index
    ).textContent =
      formatarNumero(total);

  });


  /* PONTOS DISPONÍVEIS */

  const disponiveis =
    calcularPontosDisponiveis();


  pontosDisponiveisElemento.textContent =
    disponiveis;


  /* DISTRIBUIÇÃO COMPLETA */

  if (disponiveis === 0) {

    pontosDisponiveisElemento.style.color =
      "#7ee787";


    mensagemPontos.textContent =
      "Distribuição completa. Você pode gerar a imagem.";


    botaoGerar.disabled =
      false;
  }


  /* AINDA SOBRAM PONTOS */

  else if (disponiveis > 0) {

    pontosDisponiveisElemento.style.color =
      "#ff6b6b";


    mensagemPontos.textContent =
      "Ainda restam " +
      disponiveis +
      " ponto(s) para distribuir.";


    botaoGerar.disabled =
      true;
  }


  /* ULTRAPASSOU */

  else {

    pontosDisponiveisElemento.style.color =
      "#ff6b6b";


    mensagemPontos.textContent =
      "Você ultrapassou o limite em " +
      Math.abs(disponiveis) +
      " ponto(s).";


    botaoGerar.disabled =
      true;
  }


  /* ATUALIZA PRÉVIA AUTOMATICAMENTE */

  if (
    !previewArea.classList.contains("escondido") &&
    disponiveis === 0
  ) {

    desenharImagem();

  }
}


/* ========================================
   ALTERAR PONTOS BASE
======================================== */

pontosBaseInput.addEventListener(
  "input",
  function () {

    sincronizarValoresDaTabela();

    atualizarAplicativo();
  }
);


pontosBaseInput.addEventListener(
  "blur",
  function () {

    this.value =
      obterNumero(this.value);

    sincronizarValoresDaTabela();

    atualizarAplicativo();
  }
);


/* ========================================
   IGNORAR RESTRIÇÕES
======================================== */

ignorarRestricoes.addEventListener(
  "change",
  function () {

    const inputs =
      document.querySelectorAll(
        ".input-pontos"
      );


    /* ATIVAR */

    if (this.checked) {

      avisoNaoConvencional
        .classList
        .remove("escondido");


      inputs.forEach(function (input) {

        input.removeAttribute("min");
        input.removeAttribute("max");

      });
    }


    /* DESATIVAR */

    else {

      avisoNaoConvencional
        .classList
        .add("escondido");


      inputs.forEach(
        function (input, index) {

          input.min = "-1";
          input.max = "4";


          let valor =
            obterNumero(input.value);


          if (valor > 4) {
            valor = 4;
          }


          if (valor < -1) {
            valor = -1;
          }


          estado[index].pontos =
            valor;

          input.value =
            valor;
        }
      );
    }


    sincronizarValoresDaTabela();

    atualizarAplicativo();
  }
);


/* ========================================
   GERAR IMAGEM
======================================== */

botaoGerar.addEventListener(
  "click",
  function () {

    sincronizarValoresDaTabela();

    atualizarAplicativo();


    if (
      calcularPontosDisponiveis() !== 0
    ) {
      return;
    }


    desenharImagem();


    previewArea
      .classList
      .remove("escondido");
  }
);


/* ========================================
   DESENHAR IMAGEM

   ORDEM DA IMAGEM:
   Atributo | Total | Pontos | Racial | Outros
======================================== */

function desenharImagem() {

  sincronizarValoresDaTabela();


  const naoConvencional =
    ignorarRestricoes.checked;


  canvas.width =
    620;


  canvas.height =
    naoConvencional
      ? 420
      : 380;


  /* FUNDO */

  ctx.fillStyle =
    "#171a21";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  /* TÍTULO */

  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "bold 24px Arial";


  ctx.fillText(
    "Distribuição de Pontos T20",
    22,
    38
  );


  let cabecalhoY =
    80;


  /* AVISO NÃO CONVENCIONAL */

  if (naoConvencional) {

    ctx.fillStyle =
      "#ffc46b";

    ctx.font =
      "bold 16px Arial";


    ctx.fillText(
      "Distribuição de pontos não convencional",
      22,
      76
    );


    cabecalhoY =
      115;
  }


  /* ========================================
     POSIÇÃO DAS COLUNAS DA IMAGEM

     ATRIBUTO | TOTAL | PTS | RACIAL | OUTROS
  ======================================== */

  const coluna = {

    atributo: 22,

    total: 250,

    pontos: 335,

    racial: 430,

    outros: 530
  };


  /* CABEÇALHO */

  ctx.fillStyle =
    "#aeb5c2";

  ctx.font =
    "bold 13px Arial";


  ctx.fillText(
    "ATRIBUTO",
    coluna.atributo,
    cabecalhoY
  );


  ctx.fillText(
    "TOTAL",
    coluna.total,
    cabecalhoY
  );


  ctx.fillText(
    "PTS",
    coluna.pontos,
    cabecalhoY
  );


  ctx.fillText(
    "RACIAL",
    coluna.racial,
    cabecalhoY
  );


  ctx.fillText(
    "OUTROS",
    coluna.outros,
    cabecalhoY
  );


  let y =
    cabecalhoY + 38;


  /* ATRIBUTOS */

  estado.forEach(
    function (atributo) {

      const total =
        atributo.pontos +
        atributo.racial +
        atributo.outros;


      /* LINHA DIVISÓRIA */

      ctx.strokeStyle =
        "#353a47";

      ctx.lineWidth =
        1;

      ctx.beginPath();


      ctx.moveTo(
        22,
        y + 13
      );


      ctx.lineTo(
        598,
        y + 13
      );


      ctx.stroke();


      /* NOME DO ATRIBUTO */

      ctx.fillStyle =
        "#ffffff";

      ctx.font =
        "bold 17px Arial";


      ctx.fillText(
        atributo.nome,
        coluna.atributo,
        y
      );


      /* TOTAL
         Fica em destaque
      */

      ctx.font =
        "bold 19px Arial";


      ctx.fillText(
        formatarNumero(total),
        coluna.total,
        y
      );


      /* PONTOS */

      ctx.font =
        "17px Arial";


      ctx.fillText(
        formatarNumero(
          atributo.pontos
        ),
        coluna.pontos,
        y
      );


      /* RACIAL */

      ctx.fillText(
        formatarNumero(
          atributo.racial
        ),
        coluna.racial,
        y
      );


      /* OUTROS */

      ctx.fillText(
        formatarNumero(
          atributo.outros
        ),
        coluna.outros,
        y
      );


      y += 42;
    }
  );
}


/* ========================================
   BAIXAR PNG
======================================== */

botaoBaixar.addEventListener(
  "click",
  function () {

    sincronizarValoresDaTabela();

    desenharImagem();


    const link =
      document.createElement("a");


    link.download =
      "distribuicao-pontos-t20.png";


    link.href =
      canvas.toDataURL("image/png");


    link.click();
  }
);


/* ========================================
   REINICIAR
======================================== */

botaoReiniciar.addEventListener(
  "click",
  function () {

    /* VOLTA PARA 10 PONTOS */

    pontosBaseInput.value =
      10;


    /* DESATIVA MODO NÃO CONVENCIONAL */

    ignorarRestricoes.checked =
      false;


    avisoNaoConvencional
      .classList
      .add("escondido");


    /* ZERA ESTADO */

    estado.forEach(
      function (atributo) {

        atributo.pontos = 0;

        atributo.racial = 0;

        atributo.outros = 0;
      }
    );


    /* ZERA PONTOS */

    document
      .querySelectorAll(".input-pontos")
      .forEach(function (input) {

        input.value = 0;

        input.min = "-1";

        input.max = "4";
      });


    /* ZERA RACIAL */

    document
      .querySelectorAll(".input-racial")
      .forEach(function (input) {

        input.value = 0;
      });


    /* ZERA OUTROS */

    document
      .querySelectorAll(".input-outros")
      .forEach(function (input) {

        input.value = 0;
      });


    /* FECHA A PRÉVIA */

    previewArea
      .classList
      .add("escondido");


    /* LIMPA CANVAS */

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    /* RECALCULA */

    sincronizarValoresDaTabela();

    atualizarAplicativo();
  }
);


/* ========================================
   INICIAR
======================================== */

criarTabela();

sincronizarValoresDaTabela();

atualizarAplicativo();