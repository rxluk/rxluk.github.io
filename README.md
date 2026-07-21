# Portfólio dinâmico, bilíngue e 100% estático

Cada seção do site lê o conteúdo direto de pastas, e o site inteiro funciona **sem servidor** —
basta abrir o `index.html` clicando duas vezes (funciona em `file://`).

```
portfolio/
├── index.html              ← shell da página (navbar, hero, skills, certificados, footer)
│                              + 3 containers preenchidos via JS: about, experience, projects
├── css/style.css
├── js/
│   ├── i18n-strings.js      ← textos estáticos da interface em PT e EN (nav, hero, títulos...)
│   └── main.js               ← lê data/content.js e renderiza tudo + troca de idioma
├── build.js                  ← varre as pastas abaixo e gera data/content.js
├── data/content.js           ← gerado automaticamente, NÃO editar à mão
│
├── about/
│   ├── index-pt.md           ← texto + foto + tags da seção "Sobre Mim" em português
│   └── index-en.md           ← mesma seção em inglês
│
├── experiences/
│   ├── Estagio-Engenharia-de-Software/
│   │   ├── index-pt.md       ← frontmatter (title, company, period, stacks, current, order) + descrição
│   │   └── index-en.md
│   └── Pesquisador-IC-Robotica-e-IA/
│       ├── index-pt.md
│       └── index-en.md
│
└── projects/
    ├── SIGV/
    │   ├── index-pt.md       ← título, descrição, stack e links do projeto (frontmatter + corpo)
    │   ├── index-en.md
    │   └── images/            ← screenshots do carrossel (jpg/png/webp/gif) — não precisa de versão por idioma
    ├── CERCEG/
    ├── ELLP-Oficina-Manager/
    ├── Mander-Robo-de-Mesa/
    ├── Laboratorio-ESP32/
    └── Prototipagem-Impressao-3D/
```

## Por que funciona sem servidor

`build.js` não gera um `manifest.json` para ser buscado com `fetch()` (isso é bloqueado por
CORS quando você abre um arquivo local direto no navegador). Em vez disso, ele gera
**`data/content.js`**, um arquivo JavaScript de verdade que só define uma variável:

```js
window.SITE_CONTENT = { pt: {...}, en: {...} };
```

Como é carregado com `<script src="data/content.js">` (e não com `fetch`), funciona igual a
qualquer outro `.js` do site — não importa se é `file://` ou um servidor de verdade.

## Como usar

1. Edite o conteúdo nas pastas (`about/`, `projects/*`, `experiences/*`).
2. Rode:
   ```bash
   node build.js
   ```
   (ou `npm run build`, se preferir)
3. Abra `index.html` no navegador (duplo clique funciona). Pronto.

Se quiser, `npm run watch` fica rodando `node build.js` automaticamente a cada mudança de arquivo
(rode em um terminal separado e só recarregue a página no navegador quando quiser ver o resultado).

## Bilíngue (PT/EN)

Cada pasta de conteúdo tem **dois arquivos**: `index-pt.md` e `index-en.md`. O botão **PT / EN**
no canto da navbar troca o idioma instantaneamente (sem recarregar a página), incluindo:

- Sobre mim, experiências e projetos (conteúdo das pastas)
- Textos fixos da interface: menu, hero, títulos de seção, certificações, footer

Se uma pasta tiver só um dos dois arquivos, o build usa o que existir como fallback para o outro
idioma e avisa no terminal (`[build] AVISO: falta index-en.md em ...`) — então o site nunca quebra
por faltar tradução, mas você fica sabendo o que falta traduzir.

A preferência de idioma escolhida pelo usuário é lembrada via `localStorage` (em navegadores que
permitem `localStorage` em `file://`; se não permitirem, o site simplesmente detecta o idioma do
navegador a cada visita, sem quebrar nada).

### Adicionar um projeto novo

1. Crie `projects/NomeDoProjeto/index-pt.md` e `index-en.md`:

```
order: 7
accent: copper
title: Nome do Projeto
stack: Tecnologia 1, Tecnologia 2
github: https://github.com/...
demo: https://meusite.com
demo_label: Ver Demo
---
Descrição curta do que o projeto faz. Pode usar **negrito** e *itálico*.
```

- `accent`: copper | olive | indigo | blue | yellow | zinc
- Tipos de link aceitos como chave: `github`, `demo`, `live`, `video`, `gallery` (cada um ganha um
  ícone e um rótulo padrão automaticamente — mas você pode sobrescrever o rótulo com `<tipo>_label`)

2. Coloque as imagens do carrossel em `projects/NomeDoProjeto/images/` (mesma pasta serve pros dois
   idiomas — ordem alfabética pelo nome do arquivo; use prefixos `1-`, `2-` se quiser controlar a ordem).
3. Rode `node build.js`.

### Adicionar uma experiência nova

`experiences/Nome-Da-Experiencia/index-pt.md` e `index-en.md`:

```
title: Cargo / Função
company: Nome da Empresa
period: 2025 - Presente
stacks: Tecnologia A, Tecnologia B
current: true
order: 1
---
Descrição do que você fez.
```

`current: true` deixa o ponto da timeline destacado (cor copper, pulsando) — use só na atual.
`order` controla a posição (menor = mais recente/topo).

### Editar o "Sobre Mim"

Edite `about/index-pt.md` / `about/index-en.md`. Coloque uma foto real em `about/foto.jpg`
(se não existir, cai num placeholder automaticamente). Tags de interesse no frontmatter:

```
tags: IA & Machine Learning:ph-brain:olive, Kotlin & Java:ph-file-code, PostgreSQL:ph-database
```

Formato de cada tag: `Rótulo:icone-phosphor:cor` (cor é opcional; use `olive` ou `copper`, ou
deixe em branco pra cor padrão). Ícones vêm do [Phosphor Icons](https://phosphoricons.com/).

### Editar textos fixos da interface (menu, hero, certificações, footer)

Edite `js/i18n-strings.js` — é um objeto simples `{ pt: {...}, en: {...} }` com uma chave por texto.
