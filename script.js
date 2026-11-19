/* =========================================================
   script.js
   O único trabalho deste arquivo: desenhar o gráfico da trajetória.

   Os dados vêm da lista <ol class="trajetoria-lista"> do index.html.
   Para mudar o gráfico, edite a lista, não este arquivo.

   Layout:
   - tela larga  → linha do tempo horizontal, uma faixa para estudo e outra para trabalho
   - tela estreita → mesma ideia, na vertical
   ========================================================= */

(function () {
  'use strict';

  var area = document.querySelector('.trajetoria-area');
  var lista = area && area.querySelector('.trajetoria-lista');
  if (!lista) return;

  var NS = 'http://www.w3.org/2000/svg';
  var LARGURA_MINIMA_HORIZONTAL = 600; // abaixo disso, desenha na vertical
  var TRILHAS = ['estudo', 'trabalho'];

  // Lê cada <li> da lista e transforma em um objeto simples
  var passos = Array.prototype.map.call(lista.children, function (li) {
    return {
      nome:      texto(li, '.t-nome'),
      detalhe:   texto(li, '.t-detalhe'),
      quando:    texto(li, '.t-quando'),
      trilha:    li.dataset.trilha === 'trabalho' ? 'trabalho' : 'estudo',
      andamento: li.hasAttribute('data-andamento')
    };
  });

  // O SVG fica escondido do leitor de tela, que lê a lista
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'trajetoria-grafico');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  area.insertBefore(svg, lista);

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var larguraAnterior = 0;

  desenhar(true);

  // Redesenha só quando a largura muda (girar o celular, redimensionar a janela)
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () {
      if (Math.round(area.clientWidth) !== larguraAnterior) desenhar(false);
    }).observe(area);
  }


  /* ---------- Desenho ---------- */

  function desenhar(primeiraVez) {
    var w = Math.round(area.clientWidth);
    larguraAnterior = w;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    if (w >= LARGURA_MINIMA_HORIZONTAL) horizontal(w);
    else vertical(w);

    // Animação de entrada só na primeira vez, e só se a pessoa não pediu menos movimento
    if (primeiraVez && !semMovimento) {
      svg.classList.add('desenhar');
      setTimeout(function () { svg.classList.remove('desenhar'); }, 2000);
    }
  }

  // Versão horizontal: x = ordem dos passos, y = faixa (estudo em cima, trabalho embaixo)
  function horizontal(w) {
    var margemEsq = 84;            // espaço para "estudo" / "trabalho"
    var reservaRotulo = 200;       // espaço para o texto do último passo
    var hojeX = w - 1;
    var y = { estudo: 92, trabalho: 196 };
    var altura = 218;
    var n = passos.length;
    var intervalo = (w - reservaRotulo - margemEsq) / Math.max(n - 1, 1);
    var xDe = function (i) { return margemEsq + i * intervalo; };

    tamanho(w, altura);

    // Faixas pontilhadas e seus nomes
    TRILHAS.forEach(function (t) {
      linha(margemEsq - 10, y[t], hojeX, y[t], 'tj-trilha');
      textoSvg(0, y[t] + 4, t, 'tj-legenda');
    });

    // Linha do "hoje"
    linha(hojeX, 20, hojeX, altura - 6, 'tj-hoje');
    textoSvg(hojeX - 6, 14, 'hoje', 'tj-legenda', 'end');

    passos.forEach(function (p, i) {
      var x0 = xDe(i);
      var yy = y[p.trilha];
      var x1 = p.andamento ? hojeX : xDe(i + 1) - 14;

      segmento(x0, yy, x1, yy, p.andamento, i);
      if (!p.andamento) linha(x1, yy - 5, x1, yy + 5, 'tj-fim'); // traço de "encerrado"
      ponto(x0, yy, p.andamento);

      textoSvg(x0 - 5, yy - 46, p.nome, 'tj-nome');
      textoSvg(x0 - 5, yy - 27, p.detalhe, 'tj-detalhe');
      textoSvg(x0 - 5, yy - 11, p.quando, 'tj-quando' + (p.andamento ? ' ativo' : ''));
    });
  }

  // Versão vertical: y = ordem dos passos, x = faixa (estudo à esquerda, trabalho à direita)
  function vertical(w) {
    var x = { estudo: 9, trabalho: 31 };
    var textoX = 52;
    var topo = 84;                 // espaço para os nomes das faixas, escritos na vertical
    var passo = 82;
    var n = passos.length;
    var hojeY = topo + n * passo - 10;
    var altura = hojeY + 8;
    var yDe = function (i) { return topo + i * passo; };

    tamanho(w, altura);

    TRILHAS.forEach(function (t) {
      linha(x[t], topo - 10, x[t], hojeY, 'tj-trilha');
      var rotulo = textoSvg(x[t] + 4, topo - 18, t, 'tj-legenda');
      rotulo.setAttribute('transform', 'rotate(-90 ' + (x[t] + 4) + ' ' + (topo - 18) + ')');
    });

    linha(0, hojeY, x.trabalho + 12, hojeY, 'tj-hoje');
    textoSvg(textoX, hojeY + 4, 'hoje', 'tj-legenda');

    passos.forEach(function (p, i) {
      var y0 = yDe(i);
      var xx = x[p.trilha];
      var y1 = p.andamento ? hojeY : yDe(i + 1) - 14;

      segmento(xx, y0, xx, y1, p.andamento, i);
      if (!p.andamento) linha(xx - 5, y1, xx + 5, y1, 'tj-fim');
      ponto(xx, y0, p.andamento);

      textoSvg(textoX, y0 + 5, p.nome, 'tj-nome');
      textoSvg(textoX, y0 + 24, p.detalhe, 'tj-detalhe');
      textoSvg(textoX, y0 + 42, p.quando, 'tj-quando' + (p.andamento ? ' ativo' : ''));
    });
  }


  /* ---------- Pequenos ajudantes ---------- */

  function tamanho(w, h) {
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
  }

  function el(nome, attrs) {
    var e = document.createElementNS(NS, nome);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    svg.appendChild(e);
    return e;
  }

  function linha(x1, y1, x2, y2, classe) {
    return el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': classe });
  }

  // Segmento de um passo. pathLength=1 permite a animação de "desenhar" a linha
  function segmento(x1, y1, x2, y2, ativo, ordem) {
    var s = linha(x1, y1, x2, y2, 'tj-seg' + (ativo ? ' ativo' : ''));
    s.setAttribute('pathLength', '1');
    s.style.setProperty('--i', ordem);
    return s;
  }

  function ponto(cx, cy, ativo) {
    return el('circle', { cx: cx, cy: cy, r: 4.5, 'class': 'tj-ponto' + (ativo ? ' ativo' : '') });
  }

  function textoSvg(x, y, conteudo, classe, ancora) {
    var t = el('text', { x: x, y: y, 'class': classe });
    if (ancora) t.setAttribute('text-anchor', ancora);
    t.textContent = conteudo;
    return t;
  }

  function texto(pai, seletor) {
    var alvo = pai.querySelector(seletor);
    return alvo ? alvo.textContent.trim() : '';
  }
})();
