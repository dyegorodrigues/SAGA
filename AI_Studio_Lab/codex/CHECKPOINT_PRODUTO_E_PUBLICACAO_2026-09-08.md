# Checkpoint — o app vira produto e ganha um endereço · 2026-09-08

> Este checkpoint é sobre **produto**, não currículo. O currículo não mudou uma
> vírgula: 90 competências, `npm run simular` sem beco sem saída, mediana de 5
> missões para coroar. O que mudou foi tudo aquilo que fica entre o currículo e
> a criança.

## O estado, medido

| medida | valor |
|---|---|
| suíte | 321 arquivos, **4005 testes**, verde |
| `npm run passeio` | **19 verificações, 0 falhas** |
| `npm run simular` | nenhum beco sem saída; mediana 5 missões (faixa 4-11) |
| arquivo único | **3,67 MB**, passeio 19/19 rodando dele |
| ícones desenhados | **41**, todos com portão de existência em disco |

## As quatro coisas que este ciclo resolveu

### 1. O app não tinha como chegar num tablet

Havia noventa competências e nenhum endereço. Agora há **dois caminhos**, e o
`PUBLICAR.md` na raiz explica os dois para quem não é técnico:

- **arquivo único** (`node scripts/gerar-arquivo-unico.mjs`) — o app inteiro
  num `.html`, sem servidor, offline, publicável em qualquer lugar;
- **GitHub Pages** (`.github/workflows/publicar.yml`) — endereço definitivo,
  publicação automática a cada mudança, com a suíte inteira como portão.
  Falta um clique humano em Settings → Pages, fora do alcance de qualquer
  agente.

### 2. Emoji do sistema como identidade visual

`🦊 🗺️ 🥋 🔧` são glifos do SISTEMA OPERACIONAL: um desenho da Apple no iPad,
outro do Google no Android. A tentativa de desenhar tudo à mão em SVG de traço
**ficou pior que o emoji** — categoria errada, e a comparação lado a lado não
deixou dúvida. Adotado o **Fluent Emoji da Microsoft (MIT)**, copiado para
`public/icones/` com crédito e licença.

O portão (`todaIlhaTemDesenho.test.tsx`) mede o **disco**, não o DOM: em JSDOM
`<img>` nunca carrega nada, e o sintoma de um arquivo que não subiu é a imagem
quebrada na cara da criança.

### 3. A interface estava escrita para o autor do currículo

Estava no ar, para uma criança de 1º ano: *"Roteiro Pedagógico Guiado"*,
*"Prescrição do Sensei"*, *"Base Perceptual"*, *"recuperar automaticidade"*,
*"revisão/reconstrução no radar"*, *"Prática Espaçada"*, *"Tempo Estimado: 31h
15m restantes"*.

O portão `vozDaCasaDaCrianca.test.tsx` varre a casa, a porta da frente e a
missão — por descoberta de pasta, não por lista — e reprova emoji na cópia e
quinze palavras de adulto, cada uma com a tradução que entrou no lugar. A
isenção de emoji é ESTRUTURAL (o valor de um campo `icon:`/`emoji:` é
conteúdo), e a mutação que põe emoji decorativo na mesma linha de um `icon:`
foi morta.

### 4. Três defeitos que só apareceram medindo

- **A casa rolava sozinha e comia o cabeçalho.** 1056px de documento numa
  janela de 940: a página descia 64px e levava nome, ofensiva e moedinhas para
  fora da tela. `telaDeAppInteiro()` põe a casa na mesma família da missão.
- **O rótulo "Travada" media 2,56:1** no branco — pouco mais da metade do piso
  WCAG. Era efeito colateral de dizer o estado com `opacity-50`, que existia
  porque emoji não aceita cor.
- **O nível 5 sumia do seletor** nas noventa competências (corrigido no ciclo
  anterior, citado aqui porque é da mesma família: defeito de produto invisível
  para a suíte curricular).

## O que continua faltando — em ordem de impacto

1. **A conta Google nunca foi exercitada.** O passeio nunca alcançou o Firebase
   nesta máquina. Hoje o progresso é do APARELHO.
2. **As regras do Firestore não estão publicadas.** `deploy-rules.yml` existe e
   espera credencial (ver `AI_Studio_Lab/PUBLICAR_REGRAS_FIRESTORE.md`).
3. **A arte dos mascotes nunca foi feita.** `src/assets/mascotes/` tem só o
   README. O encaixe do `mascotAssets.ts` funciona e usa o PNG assim que ele
   existir. **Não fabricar substituto com figuras avulsas**: uma evolução de
   cinco estágios montada assim fica pior que o desenho de emergência. E 20 dos
   26 temas são personagens licenciados — não é lugar para inventar arte.
4. **567 commits fora da `main`.** Tudo isto vive em
   `claude/gate-b-class-007-witnesses-q5i062`. `main` e o PR #35 não foram
   tocados, por instrução explícita do dono.
5. **Nenhuma criança usou** (Gate J). Tudo o que se sabe vem de teste e
   simulação.

## Lições que valem para a próxima sessão

- **Trocar um símbolo errado por um desenho errado não é progresso.** O cartão
  do álbum de figurinhas ganhou um MAPA por ícone numa varredura minha, e só
  apareceu olhando a tela depois de construir.
- **Teste amarrado a glifo quebra na primeira mudança de estética.** O passeio
  reconhecia o botão de sair pelo `✕` e passou a clicar em sair quando virou
  `×`. A correção certa não foi no instrumento: foi dar `aria-label` aos
  botões — que é promessa do app a quem usa leitor de tela e por isso não muda
  por causa de design.
- **O portão pega o próprio autor.** A primeira publicação reprovou porque eu
  escrevi `node-version: 20` num repositório que usa 22 em todos os outros
  workflows. Nada foi ao ar, que é exatamente o desenho.
