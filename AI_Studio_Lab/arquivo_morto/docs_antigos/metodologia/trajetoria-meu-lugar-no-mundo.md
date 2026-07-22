# 🌎 Trajetória: Meu Lugar no Mundo v2 — ✅ APROVADA E CONSTRUÍDA

> **STATUS (2026-07-17): NO AR.** O Zeus aprovou a trajetória com UMA modificação: **fora o
> motor de zoom complexo.** No lugar → **cenas prontas** (uma imagem bonita por lugar,
> `PlaceScene.tsx`) + **transição suave** (a nova cena ENTRA em cena, leve zoom-in+fade —
> `jr-emerge`; a sensação de "afastar e ver o lugar maior", sem física/câmera). A viagem é
> narrada (`JourneyScene.tsx`, kind `journey`). Provado no app real (casa→bairro→…→Terra,
> opções escondidas até o fim, `explain` gentil ao errar). Cenas plugáveis (`place-*`).

*Escrito pela receita de 6 passos do Método (`metodo-matemagica.md`), como manda a regra
nova (trilha nova = trajetória escrita ANTES do código). Incorpora a reformulação do Zeus:
não é "encaixe/matriosca", é **COMPOSIÇÃO** ("vários X formam um Y") + viagem narrada com
contornos reais. — Claude, 2026-07-16; construída 2026-07-17.*

---

## O erro que este redesign corrige (o post-mortem em 1 parágrafo)

As 4 tentativas anteriores trataram o conceito como **inclusão de classes** ("a cidade
CONTÉM a rua") — que é lógica abstrata, consolida por volta dos 7-9 anos (Piaget), e não
se ensina com cartões iguais lado a lado. A virada do Zeus: tratar como **composição
aditiva** ("MUITAS casas FORMAM um bairro"). Isso é concreto, contável, visível — a
criança de 4-6 anos JÁ entende "muitos" (é a trilha Muito ou Pouco, nosso pré-requisito).
O "maior" deixa de ser abstrato e vira **"feito de muitos"**.

---

## PASSO 1 — Objetivo do domínio (uma frase)

> A criança percebe que ela tem um LUGAR no mundo, e que os lugares se **compõem**: muitos
> lugares pequenos formam um maior (casa → bairro → cidade → estado → país → continente →
> planeta), numa viagem que ela pode ver, do quintal dela até a Terra vista do espaço.

Duas ideias, não uma: **pertencimento** ("é a MINHA casa, a MINHA cidade") + **composição**
("muitos formam um"). Pertencimento vem primeiro (afetivo, concreto); composição vem em
cima dele.

## PASSO 2 — Progressão natural (o degrau zero e a escada)

**Fontes:** BNCC Educação Infantil — campo *"Espaços, tempos, quantidades, relações e
transformações"* (identidade do lugar onde vive) · livro *"Me on the Map"* (Joan Sweeney,
o clássico do tema) · geografia por zoom (modelo Google Earth / "Powers of Ten" infantil).

**"O que vem ANTES disso?" (cavando até o degrau zero):**
- Antes de "o Brasil é um país" → "muitas cidades formam o Brasil".
- Antes disso → "minha cidade é feita de muitos bairros".
- Antes → "meu bairro é feito de muitas casas".
- Antes (degrau zero) → **"essa é a MINHA casa"** (reconhecer o próprio lugar).

**A escada (concreto → distante):**
`minha casa` → `meu bairro (muitas casas)` → `minha cidade (muitos bairros)` →
`meu estado (muitas cidades)` → `meu país / Brasil (muitos estados)` →
`meu continente (muitos países)` → `meu planeta (muitos continentes)` → `a Terra do espaço`.

**Princípio-chave (o que estava faltando):** cada degrau se ENXERGA — a tela mostra os
muitos pequenos se juntando no grande. Não se pergunta "qual contém qual" (abstrato); se
MOSTRA "olha quantas casas... isso é um bairro!" (concreto).

## PASSO 3 — Os 5 níveis (uma novidade por nível)

A experiência é uma **VIAGEM DE ZOOM NARRADA**: a câmera parte da casa e afasta devagar;
a cada parada, o que era a cena inteira vira um pontinho dentro da cena nova, e a voz
explica a composição. A criança PREVÊ e RECONHECE (não ordena, não julga tamanho).

| Nível | Foco | O que a criança VÊ | O que ela FAZ (interação) |
|---|---|---|---|
| **N1** Pertencimento | casa → bairro | Um bairro com várias casas; UMA está marcada (📍). A voz: "Cadê a SUA casa?" | **Toca na sua casa** (a marcada). Ensina "eu estou aqui" + "muitas casas = um bairro". |
| **N2** Composição | bairro → cidade | Vários bairros se juntando; viram uma cidade. Voz: "Muitos bairros formam a..." | **Toca em "Cidade"** entre 2 opções ilustradas. O visual já mostra a resposta (não é adivinhação). |
| **N3** Zoom perto | casa→bairro→cidade | A viagem de zoom animada, 3 paradas, câmera afastando. Voz narra cada uma. | No fim: "Quando a câmera subir MAIS, o que vem?" → reconhece a próxima (estado). |
| **N4** Zoom Brasil | cidade→estado→país | Zoom continua; aparece o **mapa do estado**, depois o **mapa do Brasil com os estados** (contornos reais). Voz: "Muitas cidades no estado, muitos estados no Brasil!" | Reconhece/nomeia o **Brasil** (toca no mapa certo entre Brasil e outro país). |
| **N5** Zoom planeta | país→continente→planeta | Brasil → **América do Sul** (Brasil destacado) → **mapa-múndi** → **Terra vista do espaço**. Voz: "Muitos países no continente, muitos continentes na Terra!" | Reconhece o **planeta Terra** / o continente. Fecha ligando na astronomia. |

**Régua anti-exaustão:** os 5 níveis são 5 EXPERIÊNCIAS distintas (achar-se → compor →
viajar perto → viajar Brasil → viajar planeta), não a mesma pergunta 5×.

## PASSO 4 — O kind (renderizador)

**Kind novo `zoom`** (câmera que afasta por camadas). Justifica-se pela regra 2 (2+ usos):
1. **Meu Lugar no Mundo** (este) — camadas geográficas.
2. **Escada do Tempo** (futuro) — segundo→minuto→hora→dia→mês→ano (o MESMO zoom, outra
   dimensão; já está previsto na arquitetura).
3. Reusa em **Corpo** (célula→órgão→corpo) se quisermos.

**Como funciona (simples, não sofisticado):** uma pilha de camadas SVG; a transição é um
**scale + fade** (a camada atual encolhe e some no ponto onde a próxima a "contém"; a
próxima entra por trás). `motion` (já instalado) faz isso com 2 propriedades. Respeita
`prefers-reduced-motion` (sem animação, vira corte seco entre camadas). Nada de física,
nada de WebGL — SVG + scale, como o resto do app.

## PASSO 5 — O gerador (esboço, sem código ainda)

`gMundoLugar(nível)` devolve uma questão `kind: "zoom"` com:
- `layers`: a sequência de camadas daquele nível (ex.: N3 = [casa, bairro, cidade]),
  cada uma = um slot de cena (`nest-casa`, `nest-bairro`, `nest-cidade`, `nest-estado`,
  `nest-brasil`, `nest-americasul`, `nest-mundi`, `nest-terra`) — **arte plugável** (a
  externa entra por cima; ver brief).
- `narra`: a fala de cada parada ("Muitas casas... isso é um bairro!").
- No fim, UMA pergunta de reconhecimento (`options` + `answer`) — leve, sem pegadinha.
- `howto`/`explain` no padrão.

Resposta única, distrator plausível (outro lugar claramente diferente), voz sempre.

## PASSO 6 — Conexões (o continuum)

- **Pré-requisitos:** `mundo_quant` (Muito ou Pouco) — a criança precisa sentir "muitos"
  antes de "muitos formam um". *(É por isso que a composição funciona e o encaixe não.)*
- **Fios (teia curricular):**
  - **Astronomia "Mundo e Universo"** — N5 entrega a Terra vista do espaço = a porta da
    astronomia (adotada do dossiê).
  - **Socioemocional/identidade** — "o MEU lugar" (pertencimento).
  - **Contagem** — "quantas casas? muitas!" reusa o senso de quantidade.
  - **Escada do Tempo** — compartilha o motor `zoom`.

---

## A ARTE que isto pede (atualiza o brief `nest-*`)

Contornos REAIS vetorizados (direção do Zeus), fundo transparente, viewBox 0 0 200 200:
- `nest-casa`, `nest-bairro` (muitas casas + ruas), `nest-cidade` (bairros/quarteirões),
  `nest-estado` (mapa do estado), `nest-brasil` (**mapa do Brasil com estados recortados**),
  `nest-americasul` (América do Sul, Brasil em destaque), `nest-mundi` (mapa-múndi com
  continentes), `nest-terra` (Terra vista do espaço). Cada uma pode ter o **nome escrito**
  (exceção à regra sem-texto — aqui ajuda a fixar). Transições suaves e simples.

---

## Resumo para decisão do Zeus

**A ideia:** trocar "qual é maior/contém" (abstrato, falhou) por **"muitos formam um"
numa viagem de zoom narrada** (concreto, visível, com contornos reais). A criança se acha
no mundo e viaja do quintal até o espaço, vendo a composição a cada passo.

**O que eu preciso construir:** o kind `zoom` (scale+fade em SVG, simples) + o gerador +
as artes de mapa (fallback meu, depois a sua arte linda por cima).

**Pergunto ao Zeus:** (1) essa trajetória está no caminho certo? (2) posso construir o
motor `zoom` seguindo isto? (3) a lista de camadas (casa→bairro→cidade→estado→Brasil→
América do Sul→mundo→Terra) está boa, ou você quer ajustar algum degrau?
