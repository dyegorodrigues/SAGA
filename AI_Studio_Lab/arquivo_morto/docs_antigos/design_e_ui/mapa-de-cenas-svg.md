# 🗺️ Mapa de Cenas & Animações SVG — o manifesto de arte plugável

*Para o Zeus personalizar a arte FORA (na ferramenta de SVG bonito) e plugar aqui
SEM tocar em código. Espelha o pipeline dos mascotes. Atualizado 2026-07-16.*

---

## Como funciona o encaixe (a regra de ouro)

O app desenha cada cena em **SVG-código** (o fallback, feio-mas-funcional). Mas se
existir um **arquivo SVG seu** na pasta certa com o **nome certo**, o app usa o SEU
no lugar — automaticamente, sem mexer em nenhuma linha de código.

- **Loader:** `src/components/scenes/sceneAssets.ts` → `getSceneSvg(slot, estado)`.
- **Pasta:** `src/assets/scenes/` (crie-a; hoje ela ainda não existe = tudo é fallback).
- **Nome do arquivo:** `<slot>-<estado>.svg` (tabela abaixo). O loader casa por nome exato.
- **É o MESMO padrão dos mascotes** (`src/assets/mascotes/` + `mascotAssets.ts`), que já
  troca o dragão-SVG por um PNG só de largar o arquivo.

### Requisitos de cada SVG (inegociáveis)
1. **`viewBox="0 0 200 200"`** (quadrado; o app escala sozinho).
2. **Fundo TRANSPARENTE** (sem `<rect>` de fundo opaco — a moldura/cartão é do app).
3. **≤ 15 KB** por arquivo (Constituição, regra 4). Passar no **svgo** antes
   (`npx svgo arquivo.svg`) — ferramentas de desenho cospem SVG pesado/sujo.
4. **Cores próprias e vivas**, mas evite depender do tema (a cena é auto-contida).
5. Animação é opcional e pode vir DENTRO do SVG (CSS/SMIL embutido) — ver §Animações.

---

## ✅ CHECKLIST DE STATUS DA ARTE (o que já tem pronto — Claude mantém a cada rodada)

Legenda: **fallback** = meu desenho-código (funciona no app agora) · **arte externa** =
o SVG bonito que o Zeus vai gerar e plugar. *Atualizado 2026-07-16.*

| Slot / cena | Fallback de código | Qualidade do fallback | Arte externa (Zeus) |
|---|---|---|---|
| `place-casa` (Casa) 🌎 | ✅ | 🟢 boa (casa + quintal + árvore + sol + fumaça) | ⏳ pendente |
| `place-bairro` (Bairro) 🌎 | ✅ | 🟢 boa (5 casas coloridas + rua) | ⏳ pendente |
| `place-cidade` (Cidade) 🌎 | ✅ | 🟢 boa (prédios c/ grade de janelas + rua) | ⏳ pendente |
| `place-estado` (Estado) 🌎 | ✅ | 🟢 boa (região + cidades-ponto + capital ⭐) | ⏳ pendente |
| `place-brasil` (Brasil) 🌎 | ✅ | 🟡 ok (silhueta c/ cotovelo NE + bico sul + pino) | 🎯 alvo: mapa c/ estados |
| `place-americasul` (Am. do Sul) 🌎 | ✅ | 🟡 ok (contorno c/ bico sul + Brasil destacado) | 🎯 alvo: contorno real |
| `place-mundo` (Mundo) 🌎 | ✅ | 🟢 boa (mapa-múndi, continentes-bloco) | ⏳ pendente |
| `place-terra` (Terra) 🌎 | ✅ | 🟢 boa (planeta + nuvens + lua + estrelas) | ⏳ pendente |
| `weather-*` (clima ×4) | ✅ | 🟡 ok (personagem bean reage) | ⏳ pendente |
| `grow-*` (planta ×4) | ✅ | 🟢 boa (semente→árvore, anima) | ⏳ pendente |
| `daypart-*` (dia ×3) | ✅ | 🟡 ok (casa + céu muda) | ⏳ pendente |
| `emotion-*` (emoções ×4) | ✅ | 🟡 ok (rostinho) | ⏳ pendente |
| `lifestage-*` (fases ×4) | ✅ | 🟡 ok (bebê→idoso) | ⏳ pendente |
| `animal-*` (ciclo ×4) | ✅ | 🟡 ok (ovo→galinha) | ⏳ pendente |

**Como leio isto:** todos já têm fallback (o app nunca fica sem imagem). "Qualidade" é o
meu juízo honesto — 🟢 = leg­ível e bonitinho, 🟡 = funcional mas dá pra melhorar. Conforme
o Zeus manda a arte externa, eu troco a coluna final para ✅ e confirmo em screenshot.
Regra combinada: **mantemos as artes atuais e vamos ajeitando aos poucos, sem estresse.**

> ✅ **Nota (22ª rodada):** geografia DE VOLTA AO AR como VIAGEM NARRADA (kind `journey`,
> `PlaceScene.tsx`). As 8 cenas `place-*` são o novo slot (aposenta o `nest-*`). Fallback
> de código já bom e provado em tela; a arte externa que mais paga é `place-brasil` e
> `place-americasul` (contornos reais dão o toque). `place-brasil` = **mapa do Brasil com
> estados — NÃO bandeira** (a bandeira aqui é só um pino no mapa).

---

## Inventário das cenas (o que a ferramenta pode produzir)

Cada linha é um "slot". Gere um arquivo por ESTADO. Enquanto o arquivo não existir,
o desenho-código atual segue no ar.

### 🟢 Já plugáveis (loader fiado — é só largar o arquivo)

| Slot | Componente (fallback) | Estados → arquivos esperados |
|---|---|---|
| `weather` | `scenes/WeatherScene.tsx` | `weather-sol.svg` · `weather-calor.svg` · `weather-chuva.svg` · `weather-frio.svg` |
| `grow` | `scenes/GrowthScene.tsx` | `grow-1.svg` (semente) · `grow-2.svg` (broto) · `grow-3.svg` (arvorezinha) · `grow-4.svg` (árvore c/ frutos) |
| `daypart` | `scenes/DayPartScene.tsx` | `daypart-manha.svg` · `daypart-tarde.svg` · `daypart-noite.svg` |
| `emotion` | `scenes/EmotionScene.tsx` | `emotion-feliz.svg` · `emotion-triste.svg` · `emotion-bravo.svg` · `emotion-medo.svg` |
| `lifestage` | `scenes/PersonLifeScene.tsx` | `lifestage-1.svg` (bebê) · `lifestage-2.svg` (criança) · `lifestage-3.svg` (adulto) · `lifestage-4.svg` (idoso) |
| `animal` | `scenes/AnimalLifeScene.tsx` | `animal-1.svg` (ovo) · `animal-2.svg` (rachando) · `animal-3.svg` (pintinho) · `animal-4.svg` (galinha) |
| `place` 🌎 | `scenes/PlaceScene.tsx` | `place-casa.svg` · `place-bairro.svg` · `place-cidade.svg` · `place-estado.svg` · `place-brasil.svg` · `place-americasul.svg` · `place-mundo.svg` · `place-terra.svg` |
| `nest` (legado) | `scenes/NestScene.tsx` | *aposentado — substituído por `place`* |

> **Nota do `nest`:** cada peça é UM lugar visto de cima (mapa). A `casa` é a única com
> miolo cheio; `rua`/`cidade`/… aparecem como ANEL em volta da de dentro, então desenhe-as
> pensando que só a **faixa superior** fica visível (o centro é coberto pela camada de
> dentro). Fundo transparente — a cor de cada camada é aplicada pelo app por baixo.

### ⚪ Ainda SÓ código (fáceis de tornar plugáveis quando quiser — peça)

| Cena | Arquivo | Observação |
|---|---|---|
| Sílabas (fusão) | `scenes/SyllableScene.tsx` | animação própria; muda muito |
| Amigos dos Números | `Mascot.tsx` → `NumberBond` | diagrama paramétrico |
| Moldura de 10 | `Mascot.tsx` → `TenFrame` | grade 2×5 |
| Dezenas | `Mascot.tsx` → `TensDots` | tem destaque guiado |
| Formas | `Mascot.tsx` → `ShapeSVG` | ícones de forma |
| Dinheiro | `Mascot.tsx` → `MoneyNote` / `MoneyCoin` | cédulas/moedas BRL |
| Cena de objetos | `Mascot.tsx` → `SceneSVG` | posiciona itens (espaço) |

> Esses não estão no loader ainda porque são muito paramétricos (o número muda a cada
> questão). Dá pra plugar fundo/moldura/peças — me peça e eu fio o slot.

### 🦖 Mascotes (pipeline irmão, já existente)
- **Pasta:** `src/assets/mascotes/` · **Loader:** `mascotAssets.ts` · **README lá dentro.**
- **PNG** (não SVG): transparência real, 512×512. Nomes `{tema}-{estagio}-{nome}.png`
  (ex.: `dragao-1-ovo.png`). Sprite sheets viram PNG via `scripts/chroma-sprites.py`.

---

## Onde moram as ANIMAÇÕES

- **Global (código):** bloco `<style>` em `src/App.tsx` (~linha 260-300). Keyframes `mk*`
  (mkPop, mkFloat, mkPulse, mkSway, mkDrift, mkTwinkle…) e as classes utilitárias
  `.mk-pop/.mk-float/.mk-pulse/…`.
- **Cenas vivas (SVG-safe):** classes `.sc-rise` (nasce), `.sc-pulse` (pulsa), `.sc-float`
  (flutua), `.sc-sway` (balança) — com `transform-box:fill-box` pra funcionar em nó SVG.
  Aplicadas em GrowthScene/WeatherScene/DayPartScene. **Regra:** só em elemento SEM
  `transform` de posição (senão a animação sobrescreve o posicionamento — a armadilha SVG+CSS).
- **Acessibilidade:** `@media (prefers-reduced-motion: reduce)` desliga TUDO (já no App.tsx).
- **Componentes com animação própria:** `SyllableScene` (sylPulse), `mascots/MascotRenderer`
  (pkFloat/pkEgg/pkWalk/pkHappy/blink).
- **Sua arte pode trazer animação embutida** (CSS `@keyframes` ou SMIL `<animate>` dentro
  do .svg) — o app respeita. Mantenha sutil e honre o reduced-motion se puder.

---

## Fluxo de trabalho recomendado (você + a ferramenta)

1. Escolha um slot na tabela (ex.: `weather`). Gere 1 SVG por estado, `viewBox 0 0 200 200`,
   fundo transparente.
2. Otimize: `npx svgo weather-sol.svg` (repita para cada). Confirme ≤ 15 KB.
3. Salve em `src/assets/scenes/` com o nome exato (`weather-sol.svg` …).
4. Rode o app: a cena já aparece com a SUA arte. Sem código, sem PR obrigatório.
5. Me avise o slot que você cobriu — eu confirmo em screenshot e ajusto se algo escapar
   da moldura/proporção.

**Prioridade sugerida** (maior impacto visual primeiro): `nest` (casa/rua/cidade — o que
você criticou), `grow`, `weather`, `emotion`. Depois `daypart`, `lifestage`, `animal`.

---

## Governança
Doc **vivo** (eu atualizo quando um slot novo entra no loader). Fonte da verdade do
encaixe = `sceneAssets.ts` (cenas) e `mascotAssets.ts` (mascotes). Ver `sala-de-situacao.md`
(frente 3 = Arte) e `arquitetura-pedagogica.md` (§animação em 3 camadas).
