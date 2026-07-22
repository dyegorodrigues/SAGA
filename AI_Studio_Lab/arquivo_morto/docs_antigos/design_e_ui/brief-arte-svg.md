# 🎨 Brief de Arte SVG — o que pedir para a ferramenta (asset por asset)

*Este é o roteiro para você pedir os desenhos na sua ferramenta de SVG e plugar aqui
SEM erro. Cada asset tem: o NOME EXATO do arquivo, as regras técnicas, a descrição do
que desenhar e um PROMPT pronto pra copiar. Leia a PARTE 0 primeiro — ela vale para
TODOS.* — Claude, 2026-07-16.

> Como plugar depois: salve cada arquivo em **`src/assets/scenes/`** com o nome exato
> abaixo. O app troca o meu desenho pelo seu automaticamente (loader `sceneAssets.ts`).
> Detalhes técnicos do encaixe em `docs/mapa-de-cenas-svg.md`.

---

## PARTE 0 — REGRAS GLOBAIS (obrigatórias em TODOS os arquivos)

Cole este bloco no começo de CADA pedido à ferramenta (é o "molde"):

> **Formato de saída:** um arquivo **SVG** válido, com **`viewBox="0 0 200 200"`** e
> `xmlns="http://www.w3.org/2000/svg"`. **Fundo 100% TRANSPARENTE** (NÃO desenhe retângulo
> de fundo — o app já põe o cartão branco atrás). Todo o desenho dentro da área 200×200,
> com margem de segurança de ~8px (nada encostando na borda).
>
> **Estilo:** ilustração **vetorial flat, infantil e fofa** (público 4-7 anos). Formas
> **arredondadas**, contornos **escuros e grossos** (~2,5px, cor #1E293B), cores **vivas e
> alegres**, sombreamento mínimo (chapado; no máximo um degradê suave no céu). **Sem texto,
> sem letras, sem números** na imagem. **Sem fotorrealismo.** Leal ao mesmo "mundo" entre
> as variações de uma mesma cena (mesmo personagem/casa/câmera).
>
> **Peso:** SVG limpo e leve (**≤ 15 KB**). Sem metadados de editor, sem `<image>` embutida,
> sem base64. Depois de gerar, passar no otimizador **svgo**.
>
> **Paleta-base do app** (use como referência p/ casar com a interface):
> verde #2ED573 · azul #1E90FF · amarelo #FFC531 · vermelho/coral #FF6B6B · roxo #7C5CFF ·
> tinta escura (contornos/olhos) #1E293B.

**Checklist por arquivo (confira antes de me mandar):** ☐ viewBox 0 0 200 200 ☐ fundo
transparente ☐ sem texto ☐ ≤15KB ☐ nome do arquivo exato ☐ mesmo estilo dos "irmãos".

---

## PARTE 1 — CLIMA (slot `weather`) · 4 arquivos

Um **personagem "bean" fofo** (corpo oval + cabeça redonda, bochechas rosadas, olhinhos
pretos — o MESMO nos 4) reagindo ao clima, num cenário com céu e chão. Mantenha o
personagem idêntico entre os 4; só muda o clima e a reação.

| Arquivo | O que desenhar (prompt pronto) |
|---|---|
| `weather-sol.svg` | Dia de **sol**: céu azul claro, sol amarelo grande com raios no canto superior. O personagem feliz, olhos em arco sorridente, de braços relevados. Chão verde. |
| `weather-calor.svg` | **Calor**: céu amarelado/alaranjado, sol GRANDE e forte com muitos raios. Personagem suando (2-3 gotinhas azuis), boca aberta ofegante, meio "derretendo". Chão amarelado seco. |
| `weather-chuva.svg` | **Chuva**: céu cinza, nuvem grande soltando fios de chuva azul. Personagem segurando um **guarda-chuva** colorido, sorriso tranquilo. Chão verde com poça. |
| `weather-frio.svg` | **Frio**: céu azul pálido, flocos de neve ❄ caindo. Personagem tremendo, com **cachecol vermelho**, corpo azulado, carinha encolhida. Chão claro (neve). |

---

## PARTE 2 — CICLO DA PLANTA (slot `grow`) · 4 arquivos

A MESMA cena (terra marrom embaixo com CORTE que mostra a raiz, céu azul, sol amarelo no
canto) em 4 momentos de crescimento. Câmera fixa; só a planta muda de tamanho.

| Arquivo | O que desenhar |
|---|---|
| `grow-1.svg` | **Semente**: uma sementinha marrom enterrada na terra, uma gotinha d'água caindo. Nada verde ainda. |
| `grow-2.svg` | **Broto**: caule verde fininho saindo da terra com 2 folhinhas; raiz pequena visível embaixo da linha da terra. |
| `grow-3.svg` | **Arvorezinha**: tronco fino, uma copa verde pequena (3 tufos), raiz maior embaixo. |
| `grow-4.svg` | **Árvore com frutos**: tronco grosso, copa verde grande e cheia, **frutinhas vermelhas**, raiz forte e espalhada embaixo. |

---

## PARTE 3 — PARTES DO DIA (slot `daypart`) · 3 arquivos

A MESMA casinha no MESMO morro; só o CÉU muda. Casa idêntica nas 3 (telhado vermelho,
porta, 2 janelas). Ensina a passagem do tempo pela mesma cena.

| Arquivo | O que desenhar |
|---|---|
| `daypart-manha.svg` | **Manhã**: céu rosa/alaranjado (amanhecer), sol nascendo baixo no horizonte à direita. Janelas apagadas. |
| `daypart-tarde.svg` | **Tarde**: céu azul vivo, sol a pino (bem no alto, centro) com raios. Dia claro. |
| `daypart-noite.svg` | **Noite**: céu azul-escuro/roxo, **lua** e várias **estrelas**, as **janelas da casa acesas** (amarelas). |

---

## PARTE 4 — EMOÇÕES (slot `emotion`) · 4 arquivos

Um **rostinho redondo grande** (mesmo formato nos 4), expressão bem clara e exagerada
(pra criança ler fácil). Só a cabeça/rosto, centralizado.

| Arquivo | O que desenhar |
|---|---|
| `emotion-feliz.svg` | **Feliz**: rosto amarelo, olhos em arco pra cima, sorriso grande, bochechas rosadas. |
| `emotion-triste.svg` | **Triste**: rosto azulado, sobrancelhas caídas, boca pra baixo, uma **lágrima** escorrendo. |
| `emotion-bravo.svg` | **Bravo**: rosto avermelhado, sobrancelhas franzidas pra baixo (em V), boca tensa/reta, talvez vaporzinho de raiva. |
| `emotion-medo.svg` | **Medo**: rosto pálido/roxo-claro, **olhos bem arregalados**, boca aberta em "O", gotinha de susto. |

---

## PARTE 5 — FASES DA VIDA / PESSOA (slot `lifestage`) · 4 arquivos

A MESMA pessoa envelhecendo (mesmo tom de pele, estilo), centralizada, corpo inteiro
simples. Fundo transparente (sem cenário).

| Arquivo | O que desenhar |
|---|---|
| `lifestage-1.svg` | **Bebê**: pequenininho, cabeça grande, engatinhando ou sentado, uma mecha de cabelo, chupeta opcional. |
| `lifestage-2.svg` | **Criança**: em pé, sorridente, roupa colorida, proporção infantil. |
| `lifestage-3.svg` | **Adulto**: mais alto, postura reta, talvez um detalhe (barba curta ou roupa de adulto). |
| `lifestage-4.svg` | **Idoso**: cabelos e sobrancelhas **branco/cinza**, levemente curvado, sorriso gentil, bengala opcional. |

---

## PARTE 6 — CICLO ANIMAL / GALINHA (slot `animal`) · 4 arquivos

O ciclo ovo→galinha, cada fase centralizada, fundo transparente (ou um chãozinho mínimo).

| Arquivo | O que desenhar |
|---|---|
| `animal-1.svg` | **Ovo**: um ovo branco/creme inteiro, liso, com leve sombra embaixo. |
| `animal-2.svg` | **Ovo rachando**: o ovo com uma **rachadura** e um biquinho ou olhinho do pintinho aparecendo. |
| `animal-3.svg` | **Pintinho**: pintinho amarelo fofo, olhos pretos, biquinho laranja, patinhas. |
| `animal-4.svg` | **Galinha**: galinha adulta branca/marrom, crista vermelha, bico e patas laranja, corpo maior. |

---

## PARTE 7 — LUGARES / GEOGRAFIA (slot `nest`) · 6 arquivos  ⭐ PRIORIDADE

**Este é o que ficou ruim no meu desenho — o mais importante de refazer bonito.** Cada
lugar é uma **cena ÚNICA, quadrada, cheia e clara** (NÃO são caixas dentro de caixas — cada
arquivo é uma cena inteira independente). Ideia pedagógica: "cada lugar mora dentro de um
maior". Para reforçar o encaixe, quando fizer sentido, **inclua uma versão pequena do lugar
menor dentro do maior** (a casa aparece pequena na cena da rua; a rua/casas na cena da
cidade). Estilo mapa/ilustração fofa, visão levemente de cima ou de frente — o que ficar
mais bonito e claro.

| Arquivo | O que desenhar (prompt pronto) |
|---|---|
| `nest-casa.svg` | **Casa**: uma casinha fofa e caprichada (telhado, porta, 2 janelas, chaminé opcional) num **quintal verde**, com um caminho até a porta, talvez uma arvorezinha ou flor. É o "lar", acolhedor. |
| `nest-rua.svg` | **Rua**: uma **rua de bairro** clara — **asfalto cinza com faixa amarela tracejada no meio**, **calçadas** dos dois lados, um **poste de luz**, e **1-2 casinhas** pequenas na beira (mostrando que as casas ficam na rua). |
| `nest-cidade.svg` | **Cidade**: um **conjunto de prédios** coloridos de alturas diferentes com janelinhas, uma rua com faixa passando na frente, talvez um carrinho. Skyline alegre. |
| `nest-pais.svg` | **Brasil** (direção do Zeus — NÃO usar bandeira sozinha, criança não associa símbolo a lugar): o **MAPA do Brasil** — a silhueta reconhecível do país em verde, idealmente com os **estados recortados** em tons de verde/amarelo variados; OU o **globo com zoom na América do Sul** com o Brasil em destaque colorido e o resto neutro. Pode ter a palavra **"Brasil"** escrita (exceção à regra sem-texto — ajuda a fixar o nome). O objetivo: a criança aprender COMO É o Brasil. |
| `nest-mundo.svg` | **Mundo**: o **globo terrestre** fofo — esfera com **oceanos azuis e continentes verdes**, brilho suave. Opcional: 2 carinhas/mãozinhas ao redor (o mundo todo). |
| `nest-espaco.svg` | **Espaço**: fundo do **espaço** (azul-escuro), um **planeta com anel** (tipo Saturno), **estrelas**, e a **Terra pequena** ao longe. Mágico, curioso. |

---

## PARTE 8 — CHECKLIST DE ENTREGA (pra não dar erro)

Para CADA arquivo, confirme:
1. ☐ É `.svg` com **`viewBox="0 0 200 200"`** (não 512, não 1024).
2. ☐ **Fundo transparente** (nenhum `<rect>` cobrindo tudo).
3. ☐ **Sem texto/letras/números** dentro da arte.
4. ☐ Desenho dentro da área, com margem (~8px), **centralizado**.
5. ☐ **Nome do arquivo EXATO** da tabela (ex.: `weather-sol.svg`, `nest-casa.svg`).
6. ☐ Otimizado no **svgo**, **≤ 15 KB**.
7. ☐ Estilo consistente com os "irmãos" do mesmo grupo.
8. ☐ Me mandar os arquivos (ou colar o conteúdo SVG) → eu salvo em `src/assets/scenes/`,
   confirmo em screenshot no app e ajusto se algo escapar da moldura.

**Ordem sugerida de prioridade:** PARTE 7 (lugares) → PARTE 2 (planta) → PARTE 1 (clima) →
PARTE 4 (emoções) → resto.

---

## APÊNDICE — O molde técnico (o "código" que a ferramenta deve seguir)

O arquivo tem que sair exatamente nesta casca (só o miolo muda):

```svg
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- SEM retângulo de fundo. Todo o desenho aqui, dentro de 0..200 nos dois eixos. -->
  <!-- formas com contorno escuro grosso, cores chapadas vivas, cantos arredondados -->
</svg>
```

**Referência do que existe hoje (o fallback que a sua arte vai substituir):** os desenhos
atuais em código estão em `src/components/scenes/` (`WeatherScene.tsx`, `GrowthScene.tsx`,
`DayPartScene.tsx`, `EmotionScene.tsx`, `PersonLifeScene.tsx`, `AnimalLifeScene.tsx`,
`NestScene.tsx`). Todos já usam `viewBox 0 0 200 200` — é só manter a mesma "câmera" pra
encaixar perfeito. Se a ferramenta aceitar um SVG de referência, pode colar o conteúdo
desses arquivos; se aceitar só texto, use os prompts das PARTES 1-7.
