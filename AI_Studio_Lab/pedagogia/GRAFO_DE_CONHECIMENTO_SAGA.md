# 🕸️ GRAFO DE CONHECIMENTO — SAGA (Matemática 4–12 anos)
**Versão 1.3 · Agosto 2026 · Documento-irmão da BÍBLIA DO SAGA (ler junto)**

> **v1.3 (ago/2026) — retificação GM.12.** O grafo tem **90 competências** e **13 trilhas de fluência**. A N1.13 já havia separado “produzir quantidade” de “contar até 20”; agora a GM.12 separa **massa/capacidade sem unidades** da GM.01 (dimensões diretamente visíveis), preservando também GM.02 (tempo cotidiano) e GM.05 (medidas padronizadas). IDs antigos permanecem estáveis; novos conceitos recebem novos IDs. O histórico 84→88 continua documentado na §15.8 da Bíblia.

Este documento substitui: `grafo_competencias.md` (legado), as listas de ilhas da `BIBLE_PEDAGOGICA_UNIFICADA.md`, o `curriculo-mestre.md` e qualquer outra lista de trilhas/competências. A partir daqui, **toda competência de Matemática existe se, e somente se, estiver neste grafo.**

---

## 1. COMO LER ESTE DOCUMENTO

**Hierarquia:** Domínio → Strand (fio condutor) → Competência → Microcompetência → Experiência → Sessão.

**ID novo:** `STRAND.NN` (ex.: `N3.07`). Microcompetências: letra minúscula (`N3.07b`). O ID é estável para sempre — o nome pode mudar, o ID nunca. Isso mata o caos atual (C0001 significa "Subitização" num doc e "Contar 1-a-1" no código).

**Faixas (F0–F4):** idade é *referência*, não trava. A criança navega pelo grafo por pré-requisito, não por aniversário. Um filho de 6 pode estar em F2 numa strand e F0 em outra. A mecânica completa (posicionamento inicial, resgate de lacunas, aceleração sem teto) está na Bíblia §11.3–11.6 — a faixa só calibra palpite inicial, duração de sessão e tom narrativo.

**O par deste documento é o `MANUAL_DIDATICO_SAGA.md`:** aqui mora a estrutura (o quê, ordem, pré-requisitos, distratores); lá mora o ensino (a escada CPA de cada assunto, a primeira explicação, a fala do tutor, os microtutoriais). Toda competência daqui tem seu assunto correspondente lá.

| Faixa | Idade guia | Equivalência escolar (BR) | Tema central |
|---|---|---|---|
| **F0** | 4–5 | Educação Infantil | Alfabetização matemática (o Zero Absoluto) |
| **F1** | 5–7 | 1º ano | Números até 100 e estrutura aditiva |
| **F2** | 7–9 | 2º–3º ano | Reagrupamento e mundo multiplicativo |
| **F3** | 9–11 | 4º–5º ano | Multiplicação/divisão completas, frações e decimais |
| **F4** | 11–12 | 6º–7º ano (início) | Proporcionalidade, inteiros e pré-álgebra |

**BNCC:** cada competência indica ano e unidade temática da BNCC ("BNCC: 2º ano — Números"). Referência aproximada e honesta: os códigos EF exatos (EF02MA05 etc.) devem ser conferidos na BNCC oficial antes de virar material para terceiros; para o motor do app, ano+unidade basta.

**Formato de cada competência:**
- **Objetivo** — a frase que define domínio.
- **Pré-req** — arestas do grafo (IDs). Sem pré-req = nó raiz.
- **Micros** — a escada interna, cada uma com *restrições de parâmetros* (é isso que o gerador consome; a IA nunca inventa faixa de números).
- **Erros típicos** — as misconceptions reais; viram *distratores* e *dicas* (Bíblia §8 e §12).
- **Kinds** — renderizadores aplicáveis (catálogo na Bíblia §9). `*` = kind ainda não existe no código.
- **Domínio** — critério objetivo (padrão: escada de 5 níveis da Bíblia §5; aqui só o que for específico).

**Regra de ouro do grafo:** desbloqueio quando **todos os pré-reqs estão em nível ≥ 3** (`maxLvl ≥ 3` ou `dom`, igual ao `dominated()` do composer atual). A criança nunca fica presa: sempre há 3+ strands abertas em paralelo (Bíblia §11).

---

## 2. MAPA DE DOMÍNIOS E STRANDS

| Strand | Nome | Cor de identidade | F0 | F1 | F2 | F3 | F4 |
|---|---|---|---|---|---|---|---|
| **N1** | Senso Numérico e Contagem | roxo | ●●●●●●●●● | ●●● | | | |
| **N2** | Sistema Decimal e Valor Posicional | rosa | | ●●● | ● | ● | |
| **N3** | Adição e Subtração | verde | | ●●●●●●●●●● | ●●● | | |
| **N4** | Multiplicação e Divisão | vermelho | | | ●●●●●●● | ●●●●● | |
| **N5** | Frações | laranja | | | ● | ●●● | ● |
| **N6** | Decimais, Porcentagem e Proporção | azul-petróleo | | | | ●● | ●● |
| **N7** | Números Inteiros (negativos) | grafite | | | | | ●● |
| **AL** | Álgebra e Padrões | amarelo | ●● | ● | ●● | ● | ●● |
| **GE** | Geometria e Espaço | ciano | ●● | | ●●● | ●●● | ●● |
| **GM** | Grandezas e Medidas | esmeralda | ●●● | ●● | ●●● | ●● | |
| **PE** | Probabilidade e Estatística | índigo | | ● | ● | ● | ● |

**Total: 90 competências.** *(88 no fechamento da reconciliação original; 89 após a N1.13; 90 após a GM.12.)* IDs novos são acrescentados sem renumerar os antigos. Cada ● é uma competência (uma "ilha" no mapa do app). Os mundos temáticos da SAGA correspondem às strands; a jornada do herói atravessa mundos em paralelo, nunca um corredor único.

---

## 3. TABELA DE MIGRAÇÃO DE IDs (o de-para que mata a bagunça)

Todo `graphId` antigo do código e todo ID dos docs legados aponta para exatamente um ID novo. IDs antigos ficam proibidos em código novo.

| Antigo (código/docs) | Trilha atual | Novo |
|---|---|---|
| C000A | canto (Canto Numérico) | **N1.02** |
| C000B | simbolos | **N1.06** |
| C000C (traçado, só doc) | — | **N1.06c** (micro) |
| C0001 | contar | **N1.01 + N1.04** (a trilha comprimia 2 competências) |
| C0001_B | olho (Olhômetro/flash) | **N1.03** |
| C0003 | moldura (Caixa Mágica) | **N1.08** |
| C0002/C0003/C0004 (doc legado: 1-a-1, cardinalidade, conservação) | — | **N1.01 / N1.04c / N1.05c** |
| C0005 | maismenos | **N1.05** |
| C0006 | vizinhos | **N1.07** |
| C0006_B | seq (Reta Numérica) | **N1.12** |
| C_LOG1 | formas | **GE.02** |
| C_LOG2 | padroes | **AL.02** |
| C_LOG3 | intruso | **AL.01** |
| C_LOG4 | problemas | **N3.10** |
| C_LOG5 | graficos | **PE.01** |
| C_ESP1 | onde | **GE.01** |
| C_TMP1 | calendario | **GM.02** |
| C_NUM1 | dezenas | **N2.01** |
| C_NUM2 | pular | **AL.03** |
| C_NUM3 | comp | **N2.03** |
| C_RL1 | dinheiro | **GM.03** |
| C_RL2 | horas | **GM.04** |
| C0101 | soma (pré) | **N3.01** |
| C0102 | soma (ano1) | **N3.03** |
| C0103 | amigos (pré) | **N1.11** |
| C0104 | amigos (ano1) | **N1.10** (+ estratégia N5 → **N3.07**) |
| C0105 (doc) | — | **N3.03d** (micro simbólico) |
| C0106 (não implementado) | — | **N3.11c** (micro: algoritmo vertical) |
| C0201 | tirar | **N3.02** |
| C0202 (doc) | — | **N3.04b** (subtrair comparando) |
| C0203 | sub (ano1) | **N3.04** |
| C0204 (doc) | — | **N3.05** |
| C0205 (doc) | — | **N3.08** |
| C0206 (não implementado) | — | **N3.12c** (micro) |

---

# FAIXA 0 — ALFABETIZAÇÃO MATEMÁTICA (4–5 anos)
*A criança que não lê, não conhece numerais e talvez nem saiba contar. Tudo aqui é áudio-first (Bíblia §10): o app fala, a criança toca. Nenhuma competência de F0 exige leitura.*

**BNCC:** Educação Infantil — campo "Espaços, tempos, quantidades, relações e transformações" + transição para o 1º ano.

---

### N1.01 — Correspondência um a um
**Objetivo:** parear cada objeto com exatamente um toque/um par, sem pular nem repetir.
**Pré-req:** nenhum (nó raiz). **Kinds:** count (com trava de objeto já tocado), plain, drag-match*.
**Micros:**
- a) parear objetos iguais 1↔1 (n ∈ [2,4]; ex.: dar um osso a cada cachorro)
- b) tocar uma vez em cada objeto com contador visual (n ∈ [2,5], alinhados)
- c) parear conjuntos diferentes e dizer se sobrou (n ∈ [3,6]) — ponte para N1.05
**Erros típicos:** tocar duas vezes no mesmo objeto; pular objeto; correr o dedo sem sincronizar com a fala. *Distrator/UX: objeto tocado escurece e trava (já implementado no Contar — manter como padrão-ouro).*
**Áudio:** "Dê um ossinho para cada cachorro!" · erro: "Esse cachorro já ganhou! Procure um sem osso."

### N1.02 — Sequência oral de contagem (Canto Numérico)
**Objetivo:** recitar a ordem dos números de memória, sem objetos.
**Pré-req:** nenhum. **Kinds:** order (com áudio), plain, canto com música.
**Micros:**
- a) recitar até 5 (completar "um, dois, __") 
- b) recitar até 10
- c) recitar até 20 (atenção aos irregulares do PT: onze–quinze)
- d) continuar de um ponto qualquer ("...sete, oito, __?") — pré-req direto de N3.03
- e) recitar de trás para frente de 10 até 0 — pré-req de N3.04
**Erros típicos:** pular número (o clássico "…quatro, seis…"); "dezesseis/dezessete" trocados; não conseguir começar do meio (recomeça do 1 — sinal de recitação puramente decorada).
**Áudio:** sempre com voz cantada/ritmada; a criança completa a lacuna falando? Não — toca na opção que OUVE (audibleOptions), pois não lemos numerais ainda em (a).

### N1.03 — Subitização perceptual (Olhômetro)
**Objetivo:** reconhecer 1–5 num relance, sem contar.
**Pré-req:** nenhum. **Kinds:** flash (existente), tenframe.
**Micros:**
- a) flash de 1–3 (arranjos de dado)
- b) flash de 1–4 (arranjos variados)
- c) flash de 1–5 (inclui padrão de dedos da mão)
**Erros típicos:** tentar contar durante o flash (tempo curto ~2s impede — é proposital); chutar sempre o mesmo número. *Distratores: n±1.*
**Domínio específico:** acerto com rt < 3s (é a definição da habilidade).

### N1.04 — Contagem de objetos com cardinalidade
**Objetivo:** contar objetos um a um e responder "quantos são?" entendendo que o último número dito é o total.
**Pré-req:** N1.01, N1.02. **Kinds:** count (dedo-guia 👉 — padrão-ouro), plain.
**Micros:**
- a) contar até 3 tocando (alinhados)
- b) contar até 5 (alinhados)
- c) cardinalidade: após contar, "quantos são?" sem recontar (n ∈ [2,6]) — se recontar do zero, ainda não há cardinalidade
- d) produzir conjunto: "me dá N" (arrastar N itens para a cesta; n ∈ [2,5])
- e) contar até 10 em arranjos variados (círculo, espalhado — exige marcar por onde começou)
**Erros típicos:** recontar quando perguntado o total; perder o ponto de partida no círculo; contar mais rápido do que toca. *Distratores: n±1 (erro de contagem), primeiro número tocado.*
**Áudio:** "Conte as estrelas comigo: toque uma por uma!" · cardinalidade: "Então… quantas estrelas TEM?"

### N1.05 — Comparação de quantidades
**Objetivo:** dizer qual grupo tem mais/menos ou se têm a mesma quantidade — mesmo quando a aparência engana.
**Pré-req:** N1.04(a–b). **Kinds:** plain (2 grupos), conserv (existente), groups.
**Micros:**
- a) mais/menos com diferença gritante (3 vs 8), grupos organizados
- b) mais/menos com diferença de 1–2 (obriga a contar ou parear)
- c) **conservação**: fila espalhada vs compacta com a MESMA quantidade ("espalhou, mas continua 5") — o clássico de Piaget; o kind conserv anima o espalhamento
- d) "mesma quantidade" como resposta válida (igualdade)
**Erros típicos:** julgar pelo comprimento da fila/tamanho dos objetos, não pela quantidade (o erro central — c ataca ele de frente); confundir "menos" com "mais" por desatenção auditiva.
**Áudio:** "Quem tem MAIS bolinhas?" · erro em (c): "Elas só se espalharam! Conte de novo: continua sendo 5."

### N1.06 — Numerais 0–10 (símbolo ↔ quantidade ↔ nome)
**Objetivo:** reconhecer o desenho "7", saber que se chama "sete" e ligar às 7 coisas.
**Pré-req:** N1.02(b), N1.04(b). **Kinds:** plain, drag-match*, trace* (traçado — o antigo C000C).
**Micros:**
- a) ouvir "três" → tocar no numeral 3 (entre 3 opções; numerais 1–5)
- b) numerais 1–9 (4 opções)
- c) traçado do numeral com o dedo (guia animado; começa em 1–5) — motricidade + memória do símbolo
- d) ligar numeral ↔ quantidade (ver 6 maçãs → tocar "6"; e o inverso)
- e) o zero como "nenhum" (caixa vazia → 0)
**Erros típicos:** espelhar 2/5/6/9 no traçado; confundir 6↔9 e 1↔7 visualmente (usar como distratores); achar que zero "não é número".
**Áudio:** cada opção numeral tem 🔊 (audibleOptions) — a criança escolhe pelo som antes de saber ler.

### N1.07 — Ordem, sucessor e antecessor até 10
**Objetivo:** saber o que vem depois/antes e ordenar numerais.
**Pré-req:** N1.02(b), N1.06(b). **Kinds:** plain, order (existente), numberline*.
**Micros:**
- a) sucessor até 5 · b) sucessor até 10 · c) antecessor até 5 · d) antecessor até 10 (mais difícil — exige a recitação reversa N1.02e)
- e) ordenar 3–4 cartas numéricas (crescente)
**Erros típicos:** responder o próprio número; antecessor respondido como sucessor; ordenar por "aparência" do numeral. *Distratores: n, n±2.*

### N1.08 — Subitização conceitual (Caixa Mágica / moldura de 10)
**Objetivo:** enxergar quantidades como estrutura (5+n na moldura), sem contar de um em um.
**Pré-req:** N1.03, N1.04(b). **Kinds:** tenframe (existente).
**Micros:**
- a) "quantos você vê?" na moldura, 1–5 (fileira de cima)
- b) 5–10 ("fileira cheia é 5, mais os de baixo")
- c) "quantos faltam para 10?" (contar os vazios — a semente dos amigos do 10, N1.11)
**Erros típicos:** contar bolinha por bolinha ignorando a fileira cheia (a dica ataca isso: "a fileira cheia já é 5!"). *Distratores: n±1, 10−n (confusão cheios/vazios).*

### N1.09 — Contagem até 20 e a partir de qualquer número
> ⚠️ **Não confundir com a N1.13.** A ficha F04 ("Produzir Quantidade") dizia
> ser esta competência; não é. Quatro arestas — `N1.12`, `N2.01`, `N3.03`,
> `AL.03` — dependem de a N1.09 significar *contar além do dez*. Produzir uma
> quantidade ganhou nó próprio, a **N1.13**, e é o teste de saída da
> cardinalidade (o que este documento já dizia ao listá-lo como micro (d) da
> N1.04). Ver `codex/PLANO_DO_BLOCO_F0.md §13`.
**Objetivo:** estender a contagem além do 10 e continuar de onde parou.
**Pré-req:** N1.04(e), N1.02(c–d). **Kinds:** count, plain, order.
**Micros:**
- a) contar objetos 10–15 · b) 10–20 · c) "continue: 8, 9, __, __" · d) contagem regressiva 10→0 (foguete 🚀)
**Erros típicos:** os teens do PT ("catorze/quatorze", "dezesseis" vs "dezessete"); travar no 10 e recomeçar.
*Esta competência é a ponte direta para o counting on (N3.03).*

### N1.13 — Produzir quantidade ("me dá N")
**Objetivo:** transformar um número ouvido numa quantidade produzida — o inverso
de contar. **Ficha:** F04. **Pré-req:** N1.02, N1.04. **Kinds:** touchplace.
**Micros:** a) 1 a 3 com vagas fantasma pulsando · b) 1 a 5 com vagas visíveis ·
c) 1 a 5 só com contorno · d) 1 a 10 **sem vaga** (o salto) · e) 1 a 10 com o
pedido falado uma vez só.
**Erros típicos:** parar antes; tentar passar do pedido; despejar a bandeja
inteira; acertar com vaga e errar sem.
**Domínio específico:** pelo menos um acerto **sem vaga fantasma** — produzir com
o alvo visível não prova cardinalidade produtiva.

> **Por que tem nó próprio:** este documento já listava *"produzir conjunto: 'me
> dá N'"* como micro (d) da N1.04, e a intuição estava certa — produzir é o teste
> de saída da cardinalidade. Mas a N1.04 já tem os cinco degraus da F01 e ainda
> recebe a F03, e a F04 tem cinco próprios. Nó separado, prereq direto da N1.04.

### AL.01 — Classificação e o intruso
**Objetivo:** agrupar por atributo (cor, forma, tamanho, categoria) e achar o que não pertence.
**Pré-req:** nenhum. **Kinds:** plain (intruso — existente), groups, drag-group*.
**Micros:**
- a) intruso por diferença gritante (3 frutas + 1 carro) · b) por cor/tamanho · c) por categoria sutil (voa/não voa) · d) separar em 2 caixas por atributo (arrastar)
**Erros típicos:** classificar por associação pessoal ("o cachorro vai com a casa porque ele mora nela") — é fase, a dica nomeia o atributo: "olhe a COR".

### AL.02 — Padrões de repetição
**Objetivo:** perceber, continuar e criar padrões (a raiz da álgebra).
**Pré-req:** AL.01(a–b). **Kinds:** pattern (existente).
**Micros:**
- a) continuar ABAB (cores) · b) ABAB (formas/sons) · c) ABC · d) AABB · e) achar o ERRO no padrão (mais difícil que continuar)
**Erros típicos:** repetir o último elemento sempre; padrão certo mas deslocado. *Distrator: o elemento que continuaria um padrão ABAB quando o padrão é AABB.*

### GE.01 — Posição e localização espacial
**Objetivo:** em cima/embaixo, dentro/fora, na frente/atrás, perto/longe; esquerda/direita por último.
**Pré-req:** nenhum. **Kinds:** scene, plain (onde — existente).
**Micros:** a) em cima/embaixo · b) dentro/fora · c) na frente/atrás, entre · d) esquerda/direita (do próprio corpo — muito mais tarde a do outro) · e) seguir 2 instruções ("o que está EM CIMA da mesa e DENTRO da caixa?")
**Erros típicos:** esquerda/direita espelhadas (normal até ~7; nunca punir, só treinar); "atrás" do objeto vs da tela.

### GE.02 — Formas planas básicas
**Objetivo:** reconhecer círculo, quadrado, triângulo e retângulo em qualquer tamanho, cor e rotação.
**Pré-req:** AL.01(b). **Kinds:** shapes (existente), plain.
**Micros:** a) círculo/quadrado · b) + triângulo · c) + retângulo; formas rotacionadas (triângulo "de cabeça pra baixo" ainda é triângulo!) · d) formas no mundo real (roda=círculo, porta=retângulo) · e) contar lados e pontas (ponte para GE.03)
**Erros típicos:** o protótipo rígido — só reconhece triângulo equilátero "em pé" (micro c ataca com rotações e triângulos finos); quadrado girado 45° vira "losango, não quadrado".

### GM.01 — Comparação direta de grandezas
**Objetivo:** comparar dimensões diretamente visíveis — grande/pequeno, alto/baixo e comprido/curto — usando uma referência justa.
**Pré-req:** nenhum. **Kinds:** groups, scene.
**Micros:** a) grande/pequeno, alto/baixo · b) comprido/curto com os pontos de início alinhados · c) diferença pequena · d) objetos de identidades diferentes · e) seriação de três por tamanho.
**Erros típicos:** comparar comprimento sem alinhar o início; usar “maior” sem identificar o atributo; julgar pela dimensão errada.

### GM.12 — Massa e capacidade: comparação e conservação
**Objetivo:** comparar pesado/leve e capacidade/volume sem confiar no tamanho aparente e sem depender ainda de g/kg ou mL/L.
**Pré-req:** GM.01. **Kinds:** balance (comparação física), containers* (despejo em recipiente comum de referência).
**Micros:** a) peso com diferença óbvia · b) capacidade em recipientes iguais · c) capacidade em formatos diferentes, verificando por despejo · d) peso contraintuitivo (pequeno mais pesado) · e) ordenar três por massa ou capacidade.
**Erros típicos:** `JULGA_PELO_TAMANHO`; confundir peso com volume; achar que recipiente mais alto sempre “cabe mais”; ignorar a transformação de conservação.
**Ponte:** depois de comparar/conservar a grandeza sem número, GM.05 introduz ferramentas e unidades padronizadas.

### GM.02 — Tempo cotidiano
**Objetivo:** partes do dia, ontem/hoje/amanhã, dias da semana, ordem de eventos.
**Pré-req:** nenhum. **Kinds:** daypart (existente), order, story, plain (calendário — existente).
**Micros:** a) manhã/tarde/noite (sol nascendo/alto/lua) · b) antes/agora/depois (ordenar 3 cenas: acordar→escola→dormir) · c) ontem/hoje/amanhã · d) dias da semana (canto + ordem) · e) meses e aniversário
**Erros típicos:** "ontem" para qualquer passado; dias da semana decorados mas sem saber "o que vem depois de quinta" (mesma técnica do N1.02d: começar do meio).

---

# FAIXA 1 — NÚMEROS ATÉ 100 E ESTRUTURA ADITIVA (5–7 anos)
*O coração do 1º ano. Aqui mora o medo do "ficar um século na adição" — e a cura: a adição virou 10 competências pequenas, cada sessão fecha uma decisão mental visível. BNCC: 1º ano (e parte do 2º) — Números, Álgebra, Grandezas e Medidas, Probabilidade e Estatística.*

---

### N1.10 — Parte-todo (Amigos dos Números / number bonds)
**Objetivo:** ver um número como composto de partes: 5 é 2 e 3, é 4 e 1.
**Pré-req:** N1.04, N1.08. **Kinds:** bond (existente), tenframe, part-whole*.
**Micros:**
- a) decompor 5 com objetos (todas as duplas)
- b) decompor até 7 · c) decompor até 10
- d) parte oculta: "7 no total, 4 na mão aberta — quantos escondi?" (subtração disfarçada)
**Erros típicos:** somar as partes com o todo (responde 5+2+3=10); achar que só existe UMA decomposição. *Distratores: todo+parte, parte errada por ±1.*

### N1.11 — Amigos do 10
**Objetivo:** automatizar os pares que somam 10 (1+9, 2+8, …) — a base do cálculo mental para a vida toda.
**Pré-req:** N1.08(c), N1.10(c). **Kinds:** bond, tenframe, rapid-fire (nível 5).
**Micros:** a) na moldura: "quantos faltam para 10?" · b) pares diretos com apoio visual · c) sem apoio (símbolos) · d) fluência (dojo: rt < 3s)
**Erros típicos:** 7+4=10 (erro de ±1 — o distrator padrão); saber "de um lado só" (sabe 8+2 mas trava em 2+8 → comutar nos itens).

### N1.12 — Reta numérica até 20
**Objetivo:** usar a reta como modelo mental: números têm posição, distância e vizinhança.
**Pré-req:** N1.07, N1.09. **Kinds:** numberline* (PRIORIDADE 1 de kind novo — hoje a "reta" é texto), order, plain.
**Micros:** a) localizar um número na reta 0–10 · b) 0–20 · c) vizinhos e "entre" (que número mora entre 6 e 8?) · d) saltos de +1/−1 e +2/−2 na reta (animação de pulo)
**Erros típicos:** contar o ponto de partida como primeiro salto (o erro nº 1 da reta: 5+3 caindo no 7); ignorar o espaçamento (achar que 19 fica "perto do meio").

### N2.01 — Dezena e unidades
**Objetivo:** entender o 10 como grupo-unidade: 14 é 1 dezena e 4 soltos.
**Pré-req:** N1.09, N1.11. **Kinds:** tens (existente — material dourado), build-number*, plain.
**Micros:** a) formar uma dezena juntando 10 soltos (animação: 10 cubinhos viram 1 barra) · b) teens como 10+n (13 = 10 e 3) · c) dezenas puras (20, 30… "3 barras = 30") · d) compor/decompor D+U (47 = 40+7) · e) trocar 10 unidades por 1 dezena (a semente do reagrupamento N3.11)
**Erros típicos:** ler 14 como "1 e 4 soltos" sem valor posicional; escrever "quarenta e dois" como 402 (o erro clássico de transcrição — distrator obrigatório em d).

### N2.02 — Números até 100
**Objetivo:** ler, escrever, ordenar e localizar números até 100.
**Pré-req:** N2.01(c–d). **Kinds:** plain, order, numberline*, hundred-chart* (tabela 10×10).
**Micros:** a) ler/reconhecer até 50 · b) até 100 · c) ordenar 3–4 números · d) padrões na tabela de 100 (descer uma linha = +10) · e) reta 0–100 com marcos (localizar ~ o 73)
**Erros típicos:** "setenta e três" vs "trinta e sete" (inversão D↔U — o distrator espelhado 37/73 é obrigatório); achar 9 > 23 "porque 9 é grande".

### N2.03 — Comparação simbólica (>, <, =)
**Objetivo:** comparar números pelo valor posicional e usar os símbolos.
**Pré-req:** N2.02(a), N1.05. **Kinds:** plain (boca do jacaré 🐊 — já usada), math.
**Micros:** a) comparar até 10 com símbolo · b) até 100 (regra: olhe a dezena primeiro) · c) comparar somas (5+2 __ 6) · d) o = como "mesmo valor" (não "a resposta é") — ponte direta para AL.05
**Erros típicos:** jacaré para o lado errado (a dica âncora: "a boca come o MAIOR"); comparar unidades antes das dezenas (28 > 31 "porque 8 > 1").

### N3.01 — Adição concreta: juntar e acrescentar (até 10)
**Objetivo:** somar juntando dois grupos visíveis, contando tudo.
**Pré-req:** N1.04(c), N1.10(a). **Kinds:** sum (existente, com dedo-guia), groups, tenframe.
**Micros:** a) juntar com total ≤ 5 (params: a,b ≥ 1, a+b ≤ 5) · b) total ≤ 10 · c) acrescentar (+1, +2 dinâmico: os novos chegam animados) · d) frase matemática lida em voz: "3 mais 2 é igual a 5" (símbolos aparecem, mas a voz carrega)
**Erros típicos:** contar um grupo só; recontar errado (±1). *Distratores: a, b, a+b±1.*

### N3.02 — Subtração concreta: tirar (até 10)
**Objetivo:** subtrair vendo objetos saírem/se esconderem.
**Pré-req:** N3.01(b). **Kinds:** subvis (existente — esconder), groups.
**Micros:** a) tirar de total ≤ 5 · b) total ≤ 10 · c) −1/−2 dinâmico · d) frase: "5 menos 2 é igual a 3"
**Erros típicos:** contar os que SAÍRAM em vez dos que ficaram (distrator: b); somar em vez de subtrair (distrator: a+b).

### N3.03 — Contar a partir do maior (counting on)
**Objetivo:** abandonar o "contar tudo": 2+7 → "sete… oito, nove!".
**Pré-req:** N3.01, N1.09, N1.05
**Micros:** a) +1/+2 a partir do maior, com apoio visual (o grupo maior vira um NÚMERO fechado, só o menor mostra objetos) · b) +3 · c) comutar primeiro (2+7 → pensa 7+2) · d) simbólico até 10 (o antigo C0105) · e) na reta: saltar do maior
**Erros típicos:** começar a contagem NO número (7+2 → "sete, oito" = 8 — o erro off-by-one central; a animação da reta corrige); voltar a contar tudo sob pressão (sinal de fluência frágil, não de erro conceitual).

### N3.04 — Subtração: contar para trás e completar
**Objetivo:** duas estratégias — voltar passinhos (9−2) e contar PARA FRENTE quando os números são próximos (9−7 → "de 7 até 9 são 2").
**Pré-req:** N3.02, N1.02(e), N1.12. **Kinds:** numberline*, subvis, plain.
**Micros:** a) −1/−2 contando para trás · b) −3 na reta · c) **completar**: "de 6 para 10 faltam __" (é a subtração que o cérebro prefere) · d) subtrair COMPARANDO (o antigo C0202: "Ana tem 8, Léo tem 5 — quantos a mais?") · e) escolher a estratégia: voltar ou completar? (metacognição — 9−2 vs 9−7)
**Erros típicos:** off-by-one ao contar para trás; em (d), responder o total de um dos grupos em vez da diferença.

### N3.05 — Família de fatos (relação + ↔ −)
**Objetivo:** ver que 3+4=7, 4+3=7, 7−3=4 e 7−4=3 são a MESMA história parte-todo.
**Pré-req:** N1.10(d), N3.03, N3.04. **Kinds:** bond, math, fact-family*.
**Micros:** a) montar a família a partir do bond · b) dado um fato, achar o irmão (7−4=? sabendo 4+3=7) · c) o triângulo de fatos com um canto oculto
**Erros típicos:** inverter para subtração "porque sim" sem ancorar no todo (dica: "quem é o número INTEIRO da família?").

### N3.06 — Dobros e quase-dobros
**Objetivo:** automatizar 3+3, 4+4… e derivar 4+5 = "dobro de 4 mais 1".
**Pré-req:** N3.03. **Kinds:** groups (espelhado), plain, rapid-fire.
**Micros:** a) dobros até 5+5 com imagem espelhada (borboleta 🦋) · b) dobros até 10+10 · c) quase-dobros (n+(n+1)) derivando em voz alta
**Erros típicos:** quase-dobro resolvido como dobro (distrator: 2n quando a resposta é 2n+1).

### N3.07 — Fazer 10 (adição atravessando a dezena)
**Objetivo:** a estratégia-rainha: 8+5 → 8+2=10, sobram 3 → 13. Já existe no código (gMatBond N5) — aqui vira competência própria.
**Pré-req:** N1.11(c), N1.10(c), N2.01(b). **Kinds:** tenframe (com animação das bolinhas migrando), bond, math.
**Micros:** a) com moldura dupla animada (params: a ∈ [6,9], b tal que a+b ∈ [11,18]) · b) com bond (decompor o b) · c) simbólico, verbalizando os 3 passos · d) fluência
**Erros típicos:** decompor o número errado; parar no 10 e esquecer o resto (distrator: 10); somar tudo nos dedos (não é erro — é o sinal de que (a) precisa de mais tempo).

### N3.08 — Voltar pelo 10 (subtração atravessando a dezena)
**Objetivo:** 13−5 → 13−3=10, 10−2=8.
**Pré-req:** N3.07, N3.04(c). **Kinds:** tenframe, numberline*, math.
**Micros:** a) na moldura dupla (tira até esvaziar a de baixo, depois da cheia) · b) na reta (dois saltos: até o 10, depois o resto) · c) simbólico · d) alternativa: completar para cima (13−9 → de 9 a 13 são 4) · e) fluência
**Erros típicos:** subtrair a unidade menor da maior ignorando posição (13−5 → "5−3=2… 12"? — o embrião do erro que explode no algoritmo N3.12; atacar AQUI com o modelo visual).

### N3.09 — Somar e subtrair até 100 (sem reagrupamento)
**Objetivo:** operar com dezenas inteiras e D+U sem "vai um".
**Pré-req:** N2.01(d), N3.07. **Kinds:** tens, math, plain.
**Micros:** a) dezenas inteiras (30+20; params: múltiplos de 10, total ≤ 100) · b) DU + U sem reagrupar (34+5) · c) DU ± dezenas (34+20, 57−30) · d) DU ± DU sem reagrupar (34+25)
**Erros típicos:** somar dezena com unidade (34+5=84 — distrator obrigatório); alinhar mentalmente errado.

### N3.10 — Problemas aditivos (as 4 situações)
**Objetivo:** resolver histórias de juntar, transformar (ganhar/perder), comparar e completar — com dados na fala e na cena.
**Pré-req:** N3.03, N3.04(d). **Kinds:** story (existente, 100% narrado), scene.
**Micros:** a) juntar/separar diretos · b) transformar (tinha 5, ganhou 3) · c) comparar ("quantos a mais?") · d) valor inicial oculto ("ganhei 3, fiquei com 8 — quantos eu tinha?" — o mais difícil) · e) dados irrelevantes na história · f) 2 passos
**Erros típicos:** caçar números e somar tudo (o "number grabbing" — (e) existe para quebrar isso); em (c–d), escolher a operação pela palavra-gatilho ("ganhou" = soma? não em d!).

### AL.03 — Contagem por saltos (2, 5, 10)
**Objetivo:** contar de 2 em 2, 5 em 5, 10 em 10 — a ponte rítmica para a multiplicação.
**Pré-req:** N1.09, N2.01, AL.02
**Micros:** a) de 2 em 2 até 20 (+ pares e ímpares como identidade visual: "tem par ou sobra um?") · b) de 5 em 5 até 50 (mãos!) · c) de 10 em 10 até 100 · d) começando de qualquer número (23, 33, 43…)
**Erros típicos:** decorar a sequência mas não conseguir continuar do meio (mesmo teste de sempre); pular de 5 começando do 2.

### GM.03 — Sistema monetário (Real)
**Objetivo:** reconhecer moedas/cédulas, juntar valores, dar troco simples.
**Pré-req:** N2.01(d), N3.09(a). **Kinds:** money (existente).
**Micros:** a) reconhecer moedas · b) cédulas · c) juntar cédulas (10+10+5) · d) notas+moedas · e) "quanto falta para comprar?" (completar — reusa N3.04c) · f) centavos (adiado para F3 com decimais — aqui só 50c+50c=1 real)
**Erros típicos:** julgar valor pelo TAMANHO ou quantidade de moedas (5 moedas de 10c "valem mais" que 1 de 1 real).

### GM.04 — Horas (relógio de ponteiros e digital)
**Objetivo:** horas exatas e meia hora nos dois relógios.
**Pré-req:** N1.06, GM.02
**Micros:** a) o ponteiro pequeno (só horas exatas, ponteiro grande fixo no 12) · b) horas exatas analógico · c) horas exatas digital e o pareamento entre os dois · d) meia hora ("o grande no 6, o pequeno no MEIO do caminho") · e) montar a hora pedida arrastando o ponteiro
**Erros típicos:** ler o ponteiro grande como hora; na meia hora, ler o pequeno "já no próximo número" (7:30 lido como 8:30 — distrator obrigatório).

### PE.01 — Pictogramas e tabelas simples
**Objetivo:** ler e comparar dados em pictogramas, tabelas de marquinhas e blocos.
**Pré-req:** N1.04(e), N1.05. **Kinds:** picto (existente).
**Micros:** a) "qual tem mais?" no pictograma · b) "quantos X?" (ler valor) · c) tabela de marquinhas (|||| = 5) · d) somar duas categorias · e) coletar: a criança TOCA para registrar votos e o gráfico cresce
**Erros típicos:** contar as CATEGORIAS em vez dos itens; ignorar a legenda (1 desenho = 2 votos — só no fim de F2).

---

# FAIXA 2 — REAGRUPAMENTO E MUNDO MULTIPLICATIVO (7–9 anos)
*BNCC: 2º–3º ano. Aqui nasce a segunda estrutura (multiplicativa) e o algoritmo vertical — sempre DEPOIS do modelo concreto, nunca antes.*

---

### N2.04 — Centena e números até 1000
**Objetivo:** estender o valor posicional: 10 dezenas viram 1 centena.
**Pré-req:** N2.02, N2.01(e). **Kinds:** tens (estender p/ placas de 100), build-number*, plain, order.
**Micros:** a) formar 100 (10 barras → 1 placa, animado) · b) ler/escrever C+D+U · c) compor/decompor (347 = 300+40+7) · d) comparar e ordenar até 1000 · e) o zero intercalado (405 vs 45 — o vilão)
**Erros típicos:** escrever "trezentos e quarenta e sete" como 300407 (transcrição literal); ignorar o zero posicional (405 lido "quarenta e cinco").

### N3.11 — Adição com reagrupamento
**Objetivo:** somar quando as unidades passam de 10 — do material ao algoritmo.
**Pré-req:** N2.01(e), N3.07, N3.09(d). **Kinds:** tens (troca animada), vertical* (PRIORIDADE 1: conta armada interativa, dígito a dígito), math.
**Micros:** a) com material: juntar, trocar 10 soltos por 1 barra ("a troca mágica") · b) registro lado a lado (material + conta) · c) algoritmo vertical DU+DU (o "vai um" com significado: é uma DEZENA que sobe) · d) CDU+CDU com um reagrupamento · e) dois reagrupamentos · f) estimar antes de calcular ("vai dar perto de quanto?")
**Erros típicos:** escrever 12 na coluna das unidades (614 em 38+26 — distrator clássico); esquecer o "vai um"; somar em colunas desalinhadas.

### N3.12 — Subtração com reagrupamento
**Objetivo:** subtrair "desmanchando" uma dezena — o algoritmo mais mal-ensinado do mundo, feito direito.
**Pré-req:** N3.11(c), N3.08. **Kinds:** tens (desmanchar animado), vertical*, math.
**Micros:** a) com material: desmanchar 1 barra em 10 soltos para poder tirar · b) lado a lado (material + conta) · c) algoritmo DU−DU · d) CDU com um empréstimo · e) com zero no meio (405−128 — o chefão) · f) checar com a operação inversa (N3.05 voltando com força)
**Erros típicos:** **subtrair o menor do maior em cada coluna, ignorando posição** (42−38 = 16 — O erro nº 1 da matemática elementar; distrator obrigatório em toda instância); esquecer que a dezena emprestada diminuiu.

### N3.13 — Cálculo mental e estimativa aditiva
**Objetivo:** escolher estratégia (compensar, arredondar, decompor) em vez de armar sempre.
**Pré-req:** N3.11, N3.12, N3.06
**Micros:** a) +9/+11 via +10∓1 · b) decompor (46+37 = 46+30+7) · c) compensação (99+47 = 100+47−1) · d) estimativa por arredondamento ("398+205 dá mais ou menos…?")
**Erros típicos:** compensar para o lado errado (+1 quando é −1).

### N4.01 — Multiplicação: grupos iguais
**Objetivo:** entender 3×4 como "3 grupos de 4" e como adição repetida.
**Pré-req:** N3.03, AL.03. **Kinds:** groups (existente), plain, math.
**Micros:** a) contar grupos prontos ("3 cestas com 4 maçãs — quantas?", contando) · b) por salto (4, 8, 12) · c) escrever a multiplicação da cena (e a adição 4+4+4 equivalente) · d) montar a cena da multiplicação dada (arrastar para formar 2 grupos de 5)
**Erros típicos:** somar os fatores (3×4=7 — distrator obrigatório); contar os GRUPOS em vez do total.

### N4.02 — Arranjos retangulares e comutatividade
**Objetivo:** ver a multiplicação como retângulo — e descobrir que 3×5 = 5×3 girando-o.
**Pré-req:** N4.01. **Kinds:** array* (PRIORIDADE 2: grade interativa), groups.
**Micros:** a) contar arranjos (linhas×colunas) · b) girar o arranjo e ver a comutatividade (animação de 90°) · c) dobro e triplo como linguagem · d) decompor o arranjo (6×4 = 5×4 + 1×4 — a semente da distributiva e das tabuadas derivadas)
**Erros típicos:** contar linha por linha de um em um para sempre (a dica empurra o salto); linhas vs colunas trocadas (irrelevante pela comutatividade — dizer isso!).

### N4.03 — Tabuadas do 2, 5 e 10
**Objetivo:** primeiros fatos automatizados, ancorados nos saltos (AL.03).
**Pré-req:** N4.01(b), AL.03. **Kinds:** math, rapid-fire, array*.
**Micros:** a) ×2 como dobro · b) ×10 (o padrão do zero — COM valor posicional: 3×10 = 3 dezenas) · c) ×5 (metade do ×10; termina em 0 ou 5) · d) misto e fluência
**Erros típicos:** "×10 é só colocar zero" decorado sem sentido (quebra nos decimais em F3 — ancorar em dezenas AGORA).

### N4.04 — Tabuadas do 3 e do 4
**Objetivo:** estender com estratégias, não decoreba: ×4 = dobro do dobro; ×3 = dobro + mais um grupo.
**Pré-req:** N4.03. **Kinds:** math, array*, rapid-fire.
**Micros:** a) ×3 derivando · b) ×4 derivando · c) fatos misturados 2,3,4,5,10 · d) fluência
**Erros típicos:** vizinho da tabuada (3×4=16, colisão com 4×4 — distratores: fatos vizinhos, não números aleatórios).

### N4.05 — Divisão: repartir e medir
**Objetivo:** os dois sentidos: repartir igualmente (12 balas ÷ 3 amigos) e medir quantos grupos cabem (12 balas, saquinhos de 3).
**Pré-req:** N4.01, N3.02, N3.10
**Micros:** a) repartir concreto, um a um, divisões exatas (params: total ≤ 20, divisor ∈ [2,4]) · b) medir/agrupar concreto · c) escrever a divisão da cena · d) e quando SOBRA? (resto concreto, sem símbolo ainda)
**Erros típicos:** distribuir desigualmente e não conferir; confundir divisor com quociente na fala ("12 dividido em 3" vs "por 3" — a voz sempre encena a história).
**Didática:** os dois rostos (partição arrasta-um-a-um; medida laça-grupos) — Manual §Divisão, Nível 0-1. Primeira explicação ("piratas e baús") está lá.

### N4.06 — Relação × ↔ ÷ e famílias multiplicativas
**Objetivo:** 3×4=12 ⇒ 12÷3=4 e 12÷4=3 — a família de fatos, agora multiplicativa.
**Pré-req:** N4.03, N4.05(c). **Kinds:** fact-family*, array* (o MESMO retângulo conta as 4 histórias), math.
**Micros:** a) família a partir do arranjo · b) achar o fato irmão · c) divisão respondida "pensando na tabuada" (12÷4 → "4 vezes quanto dá 12?")
**Erros típicos:** achar que divisão é "conteúdo novo" desconectado (esta competência existe para impedir isso).
**Didática:** triângulo da família de fatos + lado oculto do retângulo — Manual §Divisão, Nível 2-3. Microtutorial "Detetive do Número que Falta".

### N4.07 — Tabuadas do 6 ao 9
**Objetivo:** fechar os fatos com estratégias derivadas: ×9 = ×10−1 grupo; ×6 = ×5+1 grupo; quadrados como âncoras.
**Pré-req:** N4.04, N4.06. **Kinds:** math, array* (decomposição visível), rapid-fire.
**Micros:** a) ×9 derivando (+ padrão dos dedos) · b) ×6 · c) ×7 e ×8 pelas âncoras (7×8 = 7×7+7…) · d) TODOS os fatos, fluência progressiva (o Dojo assume — Bíblia §11.4)
**Erros típicos:** os fatos-colisão famosos: 7×8=54/56/48, 6×9 vs 7×8 (distratores = respostas de fatos vizinhos, sempre).

### N5.01 — Metade, terço e quarto
**Objetivo:** partes IGUAIS de um todo (pizza, barra, coleção) — a fundação de frações.
**Pré-req:** N4.05(a). **Kinds:** frac-shade* (pintar/partir — PRIORIDADE 2), groups, plain.
**Micros:** a) metade de figuras (e o teste: "isto está partido ao meio?" com partes desiguais como pegadinha) · b) metade de coleções pares · c) quartos · d) terços · e) metade de 10, 20 (mental)
**Erros típicos:** aceitar partes DESIGUAIS como metade (o erro central — a pegadinha em (a) é obrigatória); achar que "maior número de pedaços = mais" (semente do erro 1/8 > 1/3, atacada já aqui).

### AL.04 — Sequências e regra de formação
**Objetivo:** descobrir e aplicar a regra de sequências numéricas (+2, +5, −3, ×2).
**Pré-req:** AL.03, N3.09. **Kinds:** order, pattern, plain.
**Micros:** a) continuar sequência aditiva · b) achar o termo faltando NO MEIO · c) dizer a regra ("vai de quanto em quanto?") · d) sequências decrescentes e ×2
**Erros típicos:** usar a diferença dos dois primeiros termos e não conferir no resto.

### AL.05 — Igualdade como equilíbrio
**Objetivo:** o "=" significa "os dois lados valem o mesmo" — não "a resposta vem aí".
**Pré-req:** N2.03(d), N3.05. **Kinds:** balance* (PRIORIDADE 2: balança que inclina), math.
**Micros:** a) balança com objetos (equilibrar) · b) 5+3 = __+4 (o item que separa quem entendeu) · c) verdadeiro ou falso: "7 = 7"? "4+2 = 2+4"? · d) símbolo ≠
**Erros típicos:** responder 8 em "5+3 = __+4" (o erro operacional universal — TODA sessão de AL.05 contém esse item; a balança animada mostra o lado pesado).

### GE.03 — Atributos de figuras e simetria
**Objetivo:** lados, vértices, ângulos "de canto certo"; eixo de simetria.
**Pré-req:** GE.02. **Kinds:** shapes, plain, symmetry* (completar o espelho).
**Micros:** a) contar lados e vértices · b) classificar por nº de lados (pentágono, hexágono) · c) achar/traçar o eixo de simetria · d) completar a metade espelhada de um desenho na grade
**Erros típicos:** contar vértices e lados como a mesma coisa; simetria confundida com "metades parecidas".

### GE.04 — Sólidos geométricos
**Objetivo:** cubo, bloco, esfera, cilindro, cone, pirâmide — e sua relação com as formas planas (a face do cubo é um quadrado).
**Pré-req:** GE.02. **Kinds:** plain, scene, drag-match*.
**Micros:** a) reconhecer no mundo (dado=cubo, bola=esfera) · b) rola ou empilha? (propriedades) · c) faces: que forma plana aparece? · d) contar faces/vértices dos simples
**Erros típicos:** chamar sólido pelo nome da face ("o cubo é um quadrado").

### GE.05 — Localização em malhas e mapas
**Objetivo:** seguir e dar caminhos (frente, vire) e localizar em grade (casa B3).
**Pré-req:** GE.01. **Kinds:** grid* (grade interativa — PRIORIDADE 3), scene.
**Micros:** a) seguir um caminho narrado na grade · b) coordenada informal (linha/coluna, batalha-naval simplificada) · c) traçar o caminho pedido · d) o ponto de vista do personagem (a esquerda DELE)
**Erros típicos:** esquerda/direita do personagem vs da criança (d existe para isso).

### GM.05 — Medidas padronizadas (cm/m, g/kg, mL/L)
**Objetivo:** medir com régua virtual e escolher a unidade sensata.
**Pré-req:** GM.12, N2.02. **Kinds:** measure* (régua arrastável — PRIORIDADE 3), plain, story.
**Micros:** a) medir com régua começando no ZERO (o erro clássico é começar no 1 — a régua do app pisca se desalinhar) · b) cm vs m: o que mede o quê? · c) g vs kg, mL vs L (escolha sensata: "um elefante pesa 4 __?") · d) comparar medidas (2 m __ 150 cm — exige converter!)
**Erros típicos:** régua a partir do 1 ou da ponta quebrada; achar que kg serve pra tudo pequeno "porque quilo é comum".

### GM.06 — Horas e minutos; duração
**Objetivo:** ler qualquer horário (de 5 em 5 min) e calcular quanto tempo passou.
**Pré-req:** GM.04, AL.03(b). **Kinds:** clock, clock-set*, numberline* (linha do tempo).
**Micros:** a) minutos de 5 em 5 (o ponteiro grande × tabuada do 5!) · b) e meia/e quinze/quinze para · c) duração dentro da mesma hora · d) duração cruzando a hora (das 9:40 às 10:20) na linha do tempo
**Erros típicos:** ler o número apontado pelo ponteiro grande como minuto literal (aponta o 3 = "3 minutos"); duração por subtração cega (10:20−9:40 = "80").

### GM.07 — Perímetro
**Objetivo:** o contorno: somar os lados.
**Pré-req:** GM.05(a), N3.11. **Kinds:** grid*, measure*, plain.
**Micros:** a) contar o contorno na malha quadriculada (a formiguinha anda em volta) · b) somar lados dados · c) lado oculto no retângulo ("se este lado é 5, aquele é…") · d) perímetro vs "tamanho da figura" (duas figuras diferentes, mesmo perímetro)
**Erros típicos:** contar QUADRADINHOS internos em vez do contorno (a colisão com área — que só chega em F3 justamente por isso).

### PE.02 — Gráficos de barras; possível e provável
**Objetivo:** ler/construir barras e conversar sobre acaso (impossível, possível, certo).
**Pré-req:** PE.01, N2.02. **Kinds:** picto, bar-build* (arrastar a barra até o valor), plain, story.
**Micros:** a) ler barras com escada de 1 · b) escala de 2 em 2 (ler "entre as linhas") · c) construir a barra do dado narrado · d) impossível/possível/certo (sorteios com a roleta do app) · e) "qual é mais provável?" (roleta com áreas desiguais — só intuição, sem número)
**Erros típicos:** ler a barra pela ORDEM e não pela altura; achar que "possível" = "vai acontecer".

---

# FAIXA 3 — MULTIPLICATIVO COMPLETO, FRAÇÕES E DECIMAIS (9–11 anos)
*BNCC: 4º–5º ano. Formato compacto: micros em linha; erros só os estruturais. A entrada de leitura já é confortável, mas o áudio segue disponível em tudo (botão 🔊 universal).*

### N2.05 — Números grandes e arredondamento
**Pré-req:** N2.04. **Kinds:** plain, order, build-number*, numberline*.
**Micros:** a) até 10.000 · b) até 100.000+ (classe dos milhares na leitura) · c) arredondar para 10/100/1000 (na reta: de qual marco está mais perto?) · d) compor/decompor com zeros intercalados.
**Erros:** zeros intercalados (dez mil e cinco = 10005, não 100005); arredondar sempre para cima.

### N4.08 — Multiplicação por 1 dígito e por 10/100
**Pré-req:** N4.07, N2.04, N3.11. **Kinds:** vertical*, array* (modelo de área), math.
**Micros:** a) DU×U pela decomposição (23×4 = 20×4 + 3×4, visível no modelo de área) · b) algoritmo com reagrupamento · c) CDU×U · d) ×10/×100 como deslocamento posicional (não "acrescentar zero").
**Erros:** esquecer a parcela das dezenas; reagrupamento somado antes de multiplicar.

### N4.09 — Multiplicação com 2 dígitos
**Pré-req:** N4.08. **Kinds:** area-model* (grade 2×2 de parcelas), vertical*, math.
**Micros:** a) modelo de área 2×2 (34×26 em 4 retângulos) · b) algoritmo longo · c) estimar antes (30×30≈900 confere o absurdo).
**Erros:** esquecer o deslocamento da segunda linha (o zero-fantasma); somar as parciais errado.

### N4.10 — Divisão com resto e algoritmo
**Pré-req:** N4.06, N4.05(d), N3.12. **Kinds:** drag-group*, vertical* (modo divisão), math, story.
**Micros:** a) algoritmo com resultado EXATO, sem sobra, divisor de 1 dígito (DU÷U) — a mecânica pura primeiro: divide, multiplica, subtrai, desce o próximo · b) agora com sobra: resto com material e o registro (13÷4 = 3 resto 1) · c) CDU÷U com resto (inclui zero no quociente) · d) interpretar o resto no problema (sobe ou desce? "4 por barco, 13 pessoas → 4 barcos") · e) checagem: q×d+r.
**Erros:** zero no meio do quociente engolido (816÷4 = 24); resto maior que o divisor; interpretação cega do resto em (d).
**Didática:** o resto como coisa física + a "Chave Viva" (algoritmo sincronizado com blocos dourados, passo a passo) — Manual §Divisão, Nível 4-5. Sincronia papel↔bloco no mesmo frame é inegociável.

### N4.11 — Múltiplos, divisores e primos
**Pré-req:** N4.07, N4.10
**Micros:** a) múltiplos como "a tabuada continua" · b) divisores via arranjos possíveis (12 = 1×12, 2×6, 3×4) · c) par/ímpar, critérios de 2, 5, 10 (e 3 como curiosidade) · d) primos: o número que só forma UMA fileira (crivo na tabela de 100).
**Erros:** confundir múltiplo com divisor (a fala ancora: múltiplo é MAIOR ou igual, divisor CABE dentro); 1 como primo.

### N4.12 — Divisão com divisor de 2 dígitos
**Pré-req:** N4.10, N2.04. **Kinds:** vertical* (modo divisão, divisor grande), math, story.
**Micros:** a) estimar o quociente por tentativa e números compatíveis ("quantas vezes 23 cabe em 96? chuta 4, testa") · b) algoritmo com divisor de 2 dígitos sem ajuste (DDU÷DD exato ou resto pequeno) · c) algoritmo com ajuste (quando a tentativa estourou o dividendo parcial ou sobrou demais — sobe/desce 1 no quociente) · d) checagem: q×d+r · e) problemas com divisor de 2 dígitos (repartir turma, embalagens, etc).
**Erros:** estimar sem testar de volta (multiplicar e conferir); "descer" o próximo algarismo na coluna errada; não ajustar o quociente quando o produto passa do dividendo parcial — o degrau que separa a divisão de 1 dígito da de verdade.

### N5.02 — Fração: parte-todo, da coleção e na reta
**Pré-req:** N5.01, N4.05. **Kinds:** frac-shade*, numberline*, groups.
**Micros:** a) ler/pintar a/b de figura (denominador = em quantas partes IGUAIS) · b) fração de coleção (3/4 de 12 objetos, repartindo) · c) fração NA RETA 0–1 (a virada conceitual: fração é um NÚMERO com endereço, não só pedaço de pizza) · d) frações maiores que 1 na reta (5/4 existe!).
**Erros:** partes desiguais aceitas; contar as partes pintadas como denominador; achar que fração "mora só dentro da pizza" (c e d existem para isso).

### N5.03 — Equivalência e comparação de frações
**Pré-req:** N5.02
**Micros:** a) equivalência visual (1/2 = 2/4 sobrepondo) · b) gerar equivalentes (×2, ×3 em cima e embaixo — com o porquê visual) · c) comparar mesmo denominador · d) comparar mesmo NUMERADOR (1/3 vs 1/8 — quanto maior o de baixo, MENOR o pedaço) · e) comparar com âncoras (maior ou menor que 1/2?).
**Erros:** **1/8 > 1/3 "porque 8 > 3"** — o erro-chefão de frações; distrator obrigatório, e a barra visual responde.

### N5.04 — Adição e subtração de frações
**Pré-req:** N5.03
**Micros:** a) mesmo denominador, visual · b) mesmo denominador, simbólico · c) denominadores "amigos" (um múltiplo do outro: 1/2+1/4) · d) resultado como número misto informal (5/4 = 1 e 1/4).
**Erros:** **somar em cima e embaixo (1/4+2/4 = 3/8)** — distrator obrigatório em toda instância; o visual (as partes são do MESMO tamanho, só conta em cima) é a cura.

### N6.01 — Décimos e centésimos (fração ↔ decimal)
**Pré-req:** N5.02, N2.04. **Kinds:** frac-shade* (quadrado 10×10), numberline*, build-number*, money.
**Micros:** a) décimos: 0,3 = 3/10 no quadrado e na reta · b) centésimos e o quadrado 100 · c) ler/escrever com vírgula (padrão BR!) · d) comparar decimais (0,5 vs 0,45 — quem manda é a posição) · e) dinheiro como decimal (R$ 2,35).
**Erros:** **0,45 > 0,5 "porque 45 > 5"** — o erro-chefão dos decimais; distrator obrigatório; "2,7 vem depois de 2,69" na reta resolve.

### N6.02 — Operações com decimais
**Pré-req:** N6.01, N3.11, N3.12. **Kinds:** vertical* (com vírgula alinhada), money, math.
**Micros:** a) +/− com vírgula ALINHADA (o app trava o desalinhamento e mostra por quê) · b) contexto de dinheiro e troco · c) ×10/÷10 como deslocamento da vírgula (com o material: cada casa é 10× a da direita) · d) decimal × inteiro pequeno (0,5 × 4 com barras) · e) decimal ÷ inteiro (7,5 ÷ 5 — contexto de troco: repartir uma quantia entre pessoas) · f) decimal ÷ decimal (igualar as casas multiplicando os dois pelo mesmo ×10/×100, depois dividir como inteiro: 4,8 ÷ 0,4 vira 48 ÷ 4).
**Erros:** alinhar pela DIREITA como nos inteiros (2,5 + 0,25 = 5,0); "×10 acrescenta zero" (2,5 → 2,50 — a herança do atalho decorado em N4.03b, cobrada aqui); em (e), dividir só a parte inteira e esquecer o resto decimal (7,5÷5 respondido "1"); em (f), dividir decimal por decimal sem igualar as casas primeiro.

### AL.06 — Expressões, propriedades e a incógnita
**Pré-req:** AL.05, N4.06. **Kinds:** balance*, math, plain.
**Micros:** a) ordem das operações com parênteses (só + − × ÷ simples) · b) propriedades nomeadas em ação (comutativa/associativa/distributiva como truques de cálculo) · c) o valor oculto: ☐ × 3 = 12 (balança) · d) traduzir historinha em sentença com ☐.
**Erros:** resolver da esquerda pra direita ignorando ×; distributiva "pela metade" (4×(10+2) = 40+2).

### GE.06 — Ângulos e retas
**Pré-req:** GE.03. **Kinds:** angle* (transferidor virtual — PRIORIDADE 3), plain, scene.
**Micros:** a) reto/agudo/obtuso (o canto da folha como gabarito) · b) medir com transferidor virtual (encaixe guiado) · c) paralelas e perpendiculares no mundo (trilhos, cruzamentos) · d) giro como ângulo (¼ de volta = 90°).
**Erros:** ler a escala errada do transferidor (60° vs 120° — o duplo-arco); "ângulo maior = lados mais compridos".

### GE.07 — Polígonos: triângulos e quadriláteros
**Pré-req:** GE.03, GE.06(a). **Kinds:** shapes, plain, drag-match*.
**Micros:** a) classificar triângulos por lados (equi/isós/escaleno) · b) por ângulos (retângulo/acut/obtus) · c) a família dos quadriláteros (quadrado É retângulo É paralelogramo — o diagrama de "quem mora dentro de quem") · d) regulares vs irregulares.
**Erros:** recusar que quadrado é retângulo (a hierarquia inclusiva é O ponto de c); "losango não é quadrado girado" mal resolvido desde GE.02.

### GE.08 — Plano cartesiano (1º quadrante)
**Pré-req:** GE.05, N1.12. **Kinds:** grid* (com eixos), plain.
**Micros:** a) ler (x, y) — SEMPRE anda antes de subir · b) marcar o ponto pedido · c) caça ao tesouro (sequência de pontos forma desenho) · d) deslocamento ("2 para a direita, 3 para cima" vira +2, +3).
**Erros:** inverter (x, y) — o erro único e universal; a fala âncora: "primeiro ANDA, depois SOBE".

### GM.08 — Área
**Pré-req:** GM.07, N4.02. **Kinds:** grid*, array*, plain.
**Micros:** a) contar quadradinhos internos (agora sim!) · b) retângulo = base × altura (a ponte explícita com o arranjo N4.02) · c) figuras compostas (dividir em retângulos) · d) mesmo perímetro, áreas diferentes (o experimento que separa os dois conceitos de vez).
**Erros:** confundir com perímetro (d é o antídoto); multiplicar TODOS os lados.

### GM.09 — Conversões e problemas de medida
**Pré-req:** GM.05, N4.08, N6.01, GM.06
**Micros:** a) m↔cm, kg↔g, L↔mL (×1000/÷1000 pelo deslocamento — coerente com N6.02c) · b) km para distâncias · c) problemas com unidades misturadas (2 m − 40 cm) · d) tempo: h↔min (cuidado: base 60, NÃO desloca vírgula!).
**Erros:** converter tempo como decimal (1h30 = 1,3h — distrator obrigatório em d); direção da conversão invertida.

### PE.03 — Média e probabilidade como fração
**Pré-req:** PE.02, N4.10, N5.02. **Kinds:** bar-build* (nivelar as barras = média visual), plain, story.
**Micros:** a) média como "nivelar" (as barras se redistribuem animadas) · b) calcular média (soma÷quantidade) · c) probabilidade como fração (2 vermelhas em 5 bolas → 2/5) · d) comparar probabilidades de dois sorteios.
**Erros:** média = valor mais frequente; probabilidade "favoráveis/desfavoráveis" (2/3 em vez de 2/5 — distrator obrigatório).

---

# FAIXA 4 — PROPORCIONALIDADE, INTEIROS E PRÉ-ÁLGEBRA (11–12 anos)
*BNCC: 6º–7º ano (início). Fecha o escopo do SAGA. Formato compacto.*

### N6.03 — Porcentagem
**Pré-req:** N6.01, N5.03
**Micros:** a) % como "de cada 100" no quadrado (50% = 1/2 = 0,5 — a trinca sempre junta) · b) 10%, 25%, 50% de quantias por raciocínio (10% = ÷10) · c) compor (30% = 3×10%) · d) desconto e aumento em contexto de compra.
**Erros:** 50% de 80 = 40… mas 25% respondido como "−25"; % tratada como valor absoluto.

### N6.04 — Razão e proporcionalidade
**Pré-req:** N6.03, N4.06
**Micros:** a) razão como comparação (3 azuis para 2 vermelhas) · b) tabela de proporção (receita: dobra tudo) · c) valor unitário ("se 3 custam 12, 1 custa…") · d) escala em mapas simples · e) reconhecer o que NÃO é proporcional (idade×altura).
**Erros:** resolver proporção por ADIÇÃO (+4 em vez de ×2 — o erro estrutural; a tabela visual denuncia); aplicar regra de três onde não há proporcionalidade (e existe para isso).

### N5.05 — Multiplicação e divisão de frações
**Pré-req:** N5.04, N6.04(c). **Kinds:** frac-shade* (área de fração de fração), numberline*, math.
**Micros:** a) fração de quantidade (2/3 de 12) revisitada como × · b) fração × fração pelo modelo de área (1/2 de 1/3) · c) divisão por fração pela pergunta "quantos cabem?" (2 ÷ 1/2 = 4 metades cabem em 2) · d) a regra (inverte e multiplica) só DEPOIS do porquê.
**Erros:** "multiplicar sempre aumenta / dividir sempre diminui" — quebrado visualmente em b–c (é o luto conceitual central da faixa).

### N7.01 — Números negativos e a reta completa
**Pré-req:** N1.12, N3.04
**Micros:** a) contextos: temperatura, saldo, elevador (andar −1) · b) a reta espelhada e o zero como centro · c) comparar (−5 < −2 — quanto mais à esquerda, menor) · d) oposto e distância até o zero (módulo informal).
**Erros:** **−5 > −2 "porque 5 > 2"** — o erro-chefão dos inteiros; o termômetro/elevador responde.

### N7.02 — Operações com inteiros
**Pré-req:** N7.01, N3.13
**Micros:** a) somar/subtrair como movimento na reta (ganhar/perder, subir/descer) · b) o modelo de fichas (par +1/−1 se anula) · c) subtrair negativo ("tirar uma dívida é ganhar") · d) regras de sinal na × e ÷ — por padrão observado, não decreto.
**Erros:** −3 + 5 tratado como −(3+5); "menos com menos dá menos" na soma (−2 + −3 = +5?); decorar a regra da multiplicação e aplicá-la na ADIÇÃO (o vazamento clássico).

### AL.07 — Linguagem algébrica e generalização
**Pré-req:** AL.06, AL.04. **Kinds:** pattern (com termo geral), math, plain.
**Micros:** a) do ☐ para a letra (x é o mesmo mistério) · b) traduzir frases ("o dobro de um número mais 3" → 2x+3) · c) padrão de figuras → termo geral simples (a sequência de palitos) · d) avaliar expressão para um valor dado.
**Erros:** 2x lido como "2 e x" (2+x); x sumindo na conta ("3x com x=4 dá 34").

### AL.08 — Equações do 1º grau
**Pré-req:** AL.07, N7.02(a). **Kinds:** balance* (agora formal: tirar dos dois lados), math, story.
**Micros:** a) resolver na balança (x+3 = 7 tirando 3 dos DOIS lados, animado) · b) 2x = 10 (repartir os dois lados) · c) ax+b = c em dois passos · d) montar a equação do problema e resolver.
**Erros:** operar num lado só (a balança inclina na cara da criança — é o kind ensinando); mover termo "trocando de lado" decorado sem o porquê (a balança É o porquê).

### GE.09 — Círculo e áreas de triângulos/paralelogramos
**Pré-req:** GM.08, GE.06. **Kinds:** geo-transform* (recortar e rearranjar animado), grid*, plain.
**Micros:** a) raio, diâmetro, e π descoberto medindo (contorno ÷ diâmetro ≈ 3,14 em vários círculos — experimento, não decreto) · b) paralelogramo vira retângulo (recorte animado → b×h) · c) triângulo = metade do paralelogramo (b×h÷2) · d) circunferência 2πr aplicada.
**Erros:** trocar raio por diâmetro nas fórmulas; usar o LADO inclinado como altura do paralelogramo.

### GE.10 — Volume e vistas
**Pré-req:** GE.04, GM.08. **Kinds:** blocks-3d* (empilhar cubinhos — PRIORIDADE 3), plain.
**Micros:** a) contar cubinhos (inclusive os escondidos atrás!) · b) paralelepípedo = c×l×a · c) litro ↔ dm³ (a ponte com GM) · d) vistas: de cima, de frente, de lado.
**Erros:** contar só os cubos VISÍVEIS (o erro de a — o kind gira a pilha para revelar); confundir volume com área da frente.

### PE.04 — Estatística e probabilidade com contagem
**Pré-req:** PE.03, N6.03
**Micros:** a) gráfico de linhas (variação no tempo) · b) gráfico de setores lido com % (a ponte N6.03) · c) moda e mediana informais · d) probabilidade por contagem de possibilidades (2 moedas: por que "1 cara" é mais provável que "2 caras") · e) amostra: "perguntar só pros amigos vale?"
**Erros:** ler setores por "tamanho psicológico"; achar que resultados equiprováveis onde não são (d desmonta com a árvore de possibilidades).

---

## APÊNDICE A — TRILHAS DE FLUÊNCIA (o combustível do Dojo 🥋)

O Dojo (rapid-fire) não é uma strand — é o modo de automatizar o que JÁ foi compreendido nas aulas. Tem **duas famílias de trilha**, porque fluência tem duas formas (spec completa em `DOJO_SAGA.md`):

**A.1 — Trilhas de FATO (FD): recordação atômica.** Saber `7×8=56` na hora, sem calcular. Cada trilha destrava quando a competência-mãe atinge nível 4.

| ID | Fatos | Destrava com | Meta de rt |
|---|---|---|---|
| FD1 | Amigos do 10 | N1.11 ≥ 4 | < 3s |
| FD2 | Dobros e quase-dobros | N3.06 ≥ 4 | < 3s |
| FD3 | +/− até 20 (fazer 10 / voltar pelo 10) | N3.07 e N3.08 ≥ 4 | < 4s |
| FD4 | Tabuadas 2, 5, 10 | N4.03 ≥ 4 | < 4s |
| FD5 | Tabuadas 3, 4, 6–9 | N4.07 ≥ 4 | < 5s |
| FD6 | Fatos de divisão | N4.06 ≥ 4 | < 5s |
| FD7 | Complementos de 100 e +/− mental | N3.13 ≥ 4 | < 6s |
| FD8 | Trinca fração↔decimal↔% comuns | N6.03 ≥ 4 | < 6s |

**A.2 — Trilhas de PROCEDIMENTO (PD): o algoritmo armado, liso e sem erro.** Executar a conta de vários dígitos com fluidez — a espinha das folhas do Kumon, que o Dojo faz adaptativa. Medida por precisão + tempo (não por "força de fato"). Destrava quando a competência-mãe do algoritmo atinge nível 4. Simbólica por natureza → só a partir de F2 (antes disso, o Jardim do Dojo trata o pré-simbólico).

| ID | Procedimento | Destrava com | Progressão interna (degraus) |
|---|---|---|---|
| PD-A | Adição armada | N3.11 ≥ 4 | 2díg s/reserva → 2díg c/reserva → 3díg → 4díg → várias parcelas |
| PD-S | Subtração armada | N3.12 ≥ 4 | 2díg s/troca → c/troca → 3díg → com zeros (100−45) → 4díg |
| PD-M | Multiplicação armada | N4.08 e N4.09 ≥ 4 | ×1díg → ×1díg c/reserva → ×10/100 → ×2díg → ×3díg |
| PD-D | Divisão armada | N4.10 ≥ 4 | ÷1díg exata → c/resto → zero no quociente → ÷2díg (N4.12 ≥ 4) → decimais (N6.02 ≥ 4) |
| PD-Dec | Operações com decimais armadas | N6.02 ≥ 4 | +/− alinhando vírgula → ×díg → ÷ → ×/÷ por 10/100 |

**Regra sagrada do Dojo:** velocidade só sobre compreensão. Fluência antes do conceito cria "papagaios de tabuada" — o oposto do SAGA. Vale para as duas famílias: nenhuma trilha (FD ou PD) abre antes da mãe em nível 4.

## APÊNDICE B — LISTA DE ARESTAS (resumo para o unlock_engine)
A versão executável é o `grafo_saga.yaml` (mesmo conteúdo, machine-readable). Regra: nó destravado ⇔ todos os pré-reqs com `maxLvl ≥ 3` ou `dom`. Nós raiz (sempre abertos): N1.01, N1.02, N1.03, AL.01, GE.01, GM.01, GM.02.

---

## 🆕 COMPETÊNCIAS ACRESCENTADAS (v1.1) — 11 nós

*Adicionadas após a análise de lacunas cruzando IXL (Pre-K a Grade 5), Common Core e BNCC. O grafo passa de 84 para 88 nós.*

> **[Retificado em ago/2026 · Bíblia v3.1]** Das 11 candidatas analisadas, **4 foram absorvidas** — `N2.06` pares e ímpares, `N2.07` fatores, `GM.10` conversão de unidades, `GM.11` volume de prismas — e **7 foram rejeitadas** por duplicarem nós já existentes. **84 + 4 = 88.** O registro completo, com o teste de duplicação, está na **§15.8 da Bíblia**.

<!-- IDS_REJEITADOS_INICIO · NÃO SÃO NÓS DESTE GRAFO · excluir da contagem automática (§15.8) -->

| ~~Candidata rejeitada~~ | Já era coberta por |
|---|---|
| ~~N2.08~~ Múltiplos | `N4.11` múltiplos, divisores e primos |
| ~~N5.06~~ Somar frações (mesmo denom.) | `N5.04` adição e subtração de frações |
| ~~N5.07~~ Frações equivalentes | `N5.03` equivalência e comparação de frações |
| ~~N5.08~~ Comparar frações | `N5.03` (o nome já inclui comparação) |
| ~~N7.03~~ Razão e proporção | `N6.04` razão e proporcionalidade |
| ~~N7.04~~ Porcentagem | `N6.03` porcentagem |
| ~~PE.05~~ Probabilidade e chance | `PE.03` + `PE.04` |

<!-- IDS_REJEITADOS_FIM -->

### N2.06 — Pares e ímpares
**Strand:** N2 · **Faixa:** F2 · **Pré-req:** N2.03
Reconhecer se uma quantidade forma pares exatos ou sobra um. Definição visual: par é o que dá para arrumar em duplas sem sobrar.
**Kinds:** array, groups, plain · **Erros típicos:** confundir com "número grande/pequeno"; achar que zero é ímpar

### N2.07 — Fatores de um número
**Strand:** N2 · **Faixa:** F3 · **Pré-req:** N4.02, N2.06
De quantas formas diferentes um número pode ser arrumado em retângulo. Cada retângulo revela um par de fatores.
**Kinds:** array, plain · **Erros típicos:** esquecer o 1 e o próprio número; parar antes de esgotar

### GM.10 — Conversão de unidades
**Strand:** GM · **Faixa:** F4 · **Pré-req:** GM.05, N2.04, N2.05
Trocar entre cm/m, g/kg, ml/l. A mesma quantidade com números diferentes.
**Kinds:** numberline, plain · **Erros típicos:** multiplicar quando deveria dividir

### GM.11 — Volume de prismas
**Strand:** GM · **Faixa:** F4 · **Pré-req:** GM.09, N4.02
Encher a caixa de cubinhos. Contar uma camada e multiplicar pela altura.
**Kinds:** array, plain · **Erros típicos:** somar as três dimensões em vez de multiplicar
