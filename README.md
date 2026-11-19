# Portfólio · Vinicius Jaime Scola

Site estático (HTML, CSS e JavaScript puro). Não precisa de build.

## Estrutura

```
index.html                  conteúdo da página
style.css                   todo o visual (cores e fontes nas variáveis do topo)
script.js                   desenha o gráfico da trajetória a partir da lista no HTML
assets/
  curriculo-vinicius-scola.pdf   currículo para download (sem telefone)
  favicon.svg
  fonts/                    Newsreader e IBM Plex Mono (licença OFL)
```

## Ajustes comuns

- **Cores e fontes:** bloco `:root` no começo do `style.css`. O modo escuro fica logo abaixo.
- **Estudos de caso:** troque os textos entre `[COLCHETES]` no `index.html` e apague o `<span class="vazio">` em volta.
- **Trajetória:** edite a lista `<ol class="trajetoria-lista">` no `index.html`. O gráfico acompanha.
- **Foto:** veja o comentário "FOTO OPCIONAL" no cabeçalho do `index.html`.
- **Currículo:** substitua `assets/curriculo-vinicius-scola.pdf` mantendo o nome do arquivo.

## Publicar no GitHub Pages

1. Crie um repositório público chamado `viniscola.github.io`.
2. Envie todos os arquivos desta pasta para a raiz do repositório (botão "Add file › Upload files", ou `git push`).
3. Em Settings › Pages, em "Build and deployment", escolha "Deploy from a branch", branch `main`, pasta `/ (root)`, e salve.
4. Em um ou dois minutos o site estará em `https://viniscola.github.io`.
5. Coloque esse link no LinkedIn (seção Destaque e campo Site) e no currículo.
