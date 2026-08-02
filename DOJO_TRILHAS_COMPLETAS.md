# 🥋 TRILHAS DO DOJO — AS FAIXAS COMPLETAS
**Versão 1.0 · Agosto 2026 · documento-irmão do `DOJO_SAGA.md`**

> **O que este documento é.** O `DOJO_SAGA.md` diz **por que** o Dojo existe e **como** ele se
> comporta (força por fato, recuo, socorro visual, faixas, ritual). Este aqui diz **o que aparece na
> tela em cada faixa** — a lista literal das contas, faixa por faixa, trilha por trilha.
>
> **Regra de ouro deste documento: é simples de propósito.** O Dojo não é aula. Não tem roteiro
> cinematográfico, não tem Mão Fantasma, não tem microtutorial. É treino. A criança abre, vê contas,
> responde, fecha. Toda complexidade que tentarem enfiar aqui está no lugar errado — o lugar dela é
> a Jornada.

---

# §1. O QUE MUDA E O QUE NÃO MUDA EM RELAÇÃO AO QUE JÁ RODA

O Dojo Sensei já foi construído e já roda com adição, subtração, multiplicação e divisão em 10
níveis. **Esse desenho está certo e está preservado inteiro aqui.** Este documento faz três coisas:

1. **Escreve o que já existia só em código**, para que ninguém precise ler `dojo_add.ts` para saber
   o que a faixa 7 treina — e para que a próxima IA não invente uma escada diferente.
2. **Completa as trilhas que faltavam:** frações/decimais.
3. **Amarra cada faixa à trilha canônica** (FD/PD do Grafo), para o `unlockEngine` continuar
   funcionando sem mudança.

**Bug conhecido e corrigido nesta spec:** aparecia conta de dois algarismos na faixa 1. A faixa 1 é
**um algarismo com um algarismo, soma até 5**, e ponto. A tabela do §3 é a fonte da verdade; se o
gerador produzir algo fora do intervalo declarado, é bug do gerador.

---

# §2. A ARQUITETURA EM UMA PÁGINA

## 2.1 Três lugares, não um

| Lugar | Para quem | O que é |
|---|---|---|
| **🌱 Jardim do Dojo** | 4 a 6 anos, não leitor | JD1 a JD5 — fluência **antes** do símbolo (olhômetro, mão, moldura, próximo passo, ver e imaginar). Tem ficha completa de 9 seções, porque ainda é ensino. Ver `FICHAS_F0_COMPLETAS.md`. |
| **🥋 Dojo Sensei** | 6 a 12 anos | **5 trilhas de operação × 10 faixas.** É o que este documento especifica. Treino puro. |
| **📜 Trilhas canônicas FD/PD** | o motor | a camada de dados. O `unlockEngine` e o `dojoEngine` trabalham nelas. A criança nunca vê "FD3.4" — ela vê "Adição, faixa 4". |

## 2.2 Como as três se ligam

```
    O QUE A CRIANÇA VÊ              O QUE O MOTOR LÊ
    ──────────────────              ────────────────
    Dojo Sensei
      ├── Adição      faixa 1..10  ──►  FD1, FD2, FD3, PD-A
      ├── Subtração   faixa 1..10  ──►  FD3, PD-S
      ├── Multiplicação faixa 1..10 ─►  FD4, FD5, PD-M
      ├── Divisão     faixa 1..10  ──►  FD6, PD-D
      └── Frações e Decimais 1..10 ──►  FD7, FD8, PD-Dec
```

Uma trilha de operação é um **corte vertical** que atravessa as trilhas canônicas: começa em fato
(FD) e termina em procedimento armado (PD). É por isso que a criança sente uma escada só — porque
para ela é uma escada só. A separação FD/PD é contabilidade interna, não experiência.

## 2.3 A janelinha de faixas *(a tela que o Zeus já usava)*

Ao tocar numa trilha (Adição, por exemplo), **abre um painel com as 10 faixas antes de começar**.
Isso não é enfeite: é o que deixa a criança e o pai saberem o que vem pela frente.

```
   ADIÇÃO                                    faixa atual: 4
   ┌────────────────────────────────────────────────────┐
   │ 1  ●●●●●  3 + 2          um e um, até 5      ✓ 100%│
   │ 2  ●●●●●  7 + 2          um e um, até 10     ✓  95%│
   │ 3  ●●●●●  6 + 4          amigos do 10        ✓  90%│
   │ 4  ●●●○○  8 + 7          atravessa o dez    ►  60%│
   │ 5  ○○○○○  50 + 5         dezena e unidade    🔒     │
   │ 6  ○○○○○  25 + 3         dois e um, sem vai  🔒     │
   │ ...                                                │
   └────────────────────────────────────────────────────┘
                    [ TREINAR ]
```

**Regras do painel:**
- Cada linha mostra **um exemplo real** da faixa, gerado na hora. É o que faz o pai entender em 2
  segundos o que o filho vai encontrar.
- Faixa fechada mostra 🔒 e **mostra o exemplo mesmo assim** — saber o que vem é motivação, não
  spoiler.
- A precisão de cada faixa fica visível. Sem comparação com outras crianças (§8 do `DOJO_SAGA.md`).
- Tocar numa faixa já vencida **treina aquela faixa** (revisão livre, sempre permitida).
- Tocar numa faixa fechada mostra o que falta destravar, sem sermão.

---

# §3. AS 5 TRILHAS, FAIXA POR FAIXA

> **Como ler as tabelas.** `1a` = um algarismo. `2a` = dois algarismos. "s/vai" = sem reagrupamento.
> A coluna **Canônica** diz de qual trilha do Grafo aquela faixa tira os itens — é o que o
> `unlockEngine` consulta. A coluna **Destrava** diz qual competência da Jornada precisa estar em
> nível ≥ 4 para a faixa abrir.

## 3.1 ➕ ADIÇÃO

| Faixa | O que treina | Exemplos | Canônica | Destrava |
|---:|---|---|---|---|
| **1** | 1a + 1a, soma até 5 | 3+2 · 1+4 · 2+2 | FD3.0 | N3.01 ≥ 4 |
| **2** | 1a + 1a, soma até 10 | 7+2 · 4+5 · 6+3 | FD3.1 | N3.01 ≥ 4 |
| **3** | amigos do 10 (soma exata 10) | 6+4 · 8+2 · 3+7 | **FD1** | N1.11 ≥ 4 |
| **4** | 1a + 1a atravessando o dez | 8+7 · 9+5 · 6+8 | **FD3** | N3.07 ≥ 4 |
| **5** | dezena exata + 1a | 50+5 · 30+8 · 70+2 | FD3.7 | N2.01 ≥ 4 |
| **6** | 2a + 1a, sem vai-um | 25+3 · 41+6 · 72+4 | **PD-A**.1 | N3.11 ≥ 4 |
| **7** | 2a + 1a, com vai-um | 27+5 · 48+6 · 36+9 | **PD-A**.2 | N3.11 ≥ 4 |
| **8** | dezena exata + dezena exata | 40+30 · 20+60 | PD-A.2 | N3.11 ≥ 4 |
| **9** | 2a + 2a, sem vai-um | 34+25 · 61+27 | **PD-A**.3 | N3.11 ≥ 4 |
| **10** | 2a + 2a, com vai-um | 38+47 · 56+29 | **PD-A**.4 | N3.11 ≥ 4 |

**Dobros e quase-dobros (FD2)** entram distribuídos: ~20% dos itens das faixas 2 e 4 são
`n+n` e `n+(n+1)`. Não viram faixa própria porque não são um degrau de dificuldade — são um
**atalho de estratégia** que precisa aparecer misturado para virar reflexo.

**Comutatividade (§4-bis.2 do `DOJO_SAGA.md`):** a partir da faixa 2, todo par `a+b` tem o seu
inverso `b+a` no mesmo round, separado por 2-3 itens. Ver §5.2 deste documento para a regra de
medição, que corrige uma contradição do documento-mãe.

## 3.2 ➖ SUBTRAÇÃO

| Faixa | O que treina | Exemplos | Canônica | Destrava |
|---:|---|---|---|---|
| **1** | até 5 | 5−2 · 4−1 · 3−3 | FD3.0 | N3.02 ≥ 4 |
| **2** | até 10 | 9−4 · 8−5 · 10−6 | FD3.1 | N3.02 ≥ 4 |
| **3** | amigos do 10 reversos | 10−3 · 10−7 · 10−4 | **FD1** | N1.11 ≥ 4 |
| **4** | atravessando o dez | 12−3 · 15−8 · 14−6 | **FD3**.6 | N3.08 ≥ 4 |
| **5** | dezena exata − 1a | 20−3 · 50−4 · 70−8 | FD3.7 | N2.01 ≥ 4 |
| **6** | 2a − 1a, sem empréstimo | 25−3 · 48−6 · 79−4 | **PD-S**.1 | N3.12 ≥ 4 |
| **7** | 2a − 1a, com empréstimo | 23−5 · 42−7 · 61−4 | **PD-S**.2 | N3.12 ≥ 4 |
| **8** | dezena exata − dezena exata | 70−40 · 90−30 | PD-S.2 | N3.12 ≥ 4 |
| **9** | 2a − 2a, sem empréstimo | 58−23 · 76−41 | **PD-S**.3 | N3.12 ≥ 4 |
| **10** | 2a − 2a, com empréstimo | 52−28 · 63−37 | **PD-S**.4 | N3.12 ≥ 4 |

**O caso do zero no meio** (`100−45`, `403−158`) **não entra aqui.** É o degrau `PD-S.4` canônico e
é notoriamente difícil — pertence a uma faixa 11 futura ou ao treino específico da Oficina. Enfiar
na faixa 10 quebraria a curva. *(Decisão registrada; ver §7.)*

## 3.3 ✖️ MULTIPLICAÇÃO

| Faixa | O que treina | Exemplos | Canônica | Destrava |
|---:|---|---|---|---|
| **1** | tabuada do 2 (dobros) | 2×6 · 2×9 | **FD4** | N4.03 ≥ 4 |
| **2** | tabuada do 5 | 5×4 · 5×8 | **FD4** | N4.03 ≥ 4 |
| **3** | tabuada do 10 | 10×7 · 10×3 | **FD4** | N4.03 ≥ 4 |
| **4** | tabuadas 2, 5, 10 misturadas | 5×6 · 2×8 · 10×4 | **FD4** | N4.03 ≥ 4 |
| **5** | tabuadas do 3 e do 4 | 3×7 · 4×6 | **FD5** | N4.07 ≥ 4 |
| **6** | tabuadas do 6 e do 7 | 6×8 · 7×4 | **FD5** | N4.07 ≥ 4 |
| **7** | tabuadas do 8 e do 9 | 8×7 · 9×6 | **FD5** | N4.07 ≥ 4 |
| **8** | tabuada completa misturada | qualquer `a×b`, a,b ≤ 10 | **FD5** | N4.07 ≥ 4 |
| **9** | dezena exata × 1a | 20×3 · 40×7 | **PD-M**.3 | N4.08 ≥ 4 |
| **10** | 2a × 1a armada | 24×3 · 47×6 | **PD-M**.1-2 | N4.08 ≥ 4 |

**A ordem por padrão, não numérica, é decisão pedagógica** (Manual): 2 → 5 → 10 primeiro porque têm
padrão visível no quadro de 100; depois 3 e 4; por último 6-9, que são as que realmente exigem
memória. Não reordenar por "ficar bonito de 2 a 9".

**Comutatividade em multiplicação é onde a economia é maior** — corta a tabuada praticamente pela
metade. Regra igual à da adição, a partir da faixa 5.

## 3.4 ➗ DIVISÃO

| Faixa | O que treina | Exemplos | Canônica | Destrava |
|---:|---|---|---|---|
| **1** | dividir por 2 | 12÷2 · 18÷2 | **FD6** | N4.06 ≥ 4 |
| **2** | dividir por 5 | 25÷5 · 40÷5 | **FD6** | N4.06 ≥ 4 |
| **3** | dividir por 10 | 60÷10 · 90÷10 | **FD6** | N4.06 ≥ 4 |
| **4** | por 2, 5, 10 misturado | 35÷5 · 16÷2 | **FD6** | N4.06 ≥ 4 |
| **5** | dividir por 3 e por 4 | 21÷3 · 32÷4 | **FD6** | N4.06 ≥ 4 |
| **6** | dividir por 6 e por 7 | 42÷6 · 49÷7 | **FD6** | N4.06 ≥ 4 |
| **7** | dividir por 8 e por 9 | 56÷8 · 63÷9 | **FD6** | N4.06 ≥ 4 |
| **8** | fatos de divisão misturados | qualquer, divisor ≤ 10 | **FD6** | N4.06 ≥ 4 |
| **9** | ÷1a exata, quociente 2a | 96÷3 · 84÷4 | **PD-D**.2 | N4.10 ≥ 4 |
| **10** | ÷1a com resto | 58÷5 · 47÷6 | **PD-D**.3 | N4.10 ≥ 4 |

**Divisão longa de verdade** (dividendo de 3 dígitos, zero no quociente, divisor de 2 dígitos,
quociente decimal) são os degraus `PD-D.4` a `PD-D.10` do documento-mãe. **Não cabem em 10 faixas
junto com os fatos.** Ficam numa segunda trilha, "Divisão Longa", que abre com `N4.12 ≥ 4`.
*(Decisão registrada; ver §7.)*

## 3.5 ½ FRAÇÕES E DECIMAIS

*Trilha nova. É o "até frações" que faltava.*

| Faixa | O que treina | Exemplos | Canônica | Destrava |
|---:|---|---|---|---|
| **1** | metade, terço, quarto de quantidade | metade de 8 · quarto de 12 | FD7 | N5.01 ≥ 4 |
| **2** | ler a fração da figura | ▰▰▱▱ = ? | FD8 | N5.02 ≥ 4 |
| **3** | frações equivalentes comuns | 1/2 = 2/4 = 3/6 | **FD8** | N5.03 ≥ 4 |
| **4** | somar frações, mesmo denominador | 1/4 + 2/4 | **FD8** | N5.04 ≥ 4 |
| **5** | comparar frações | 2/3 ou 3/4? | **FD8** | N5.03 ≥ 4 |
| **6** | décimos: fração ↔ decimal | 3/10 = 0,3 | **FD8** | N6.01 ≥ 4 |
| **7** | centésimos e a trinca comum | 1/2 = 0,5 = 50% | **FD8** | N6.03 ≥ 4 |
| **8** | somar e subtrair decimais | 2,4 + 1,3 · 5,6 − 2,1 | **PD-Dec**.1 | N6.02 ≥ 4 |
| **9** | ×10 e ÷10 com vírgula | 3,4 × 10 · 25 ÷ 10 | **PD-Dec**.4 | N6.02 ≥ 4 |
| **10** | porcentagens comuns de um valor | 50% de 80 · 25% de 40 | **FD8** | N6.03 ≥ 4 |

**Complementos de 100 e cálculo mental (FD7)** entram distribuídos nas faixas 1 e 8, e na trilha de
Adição a partir da faixa 8. Não viram trilha própria: são estratégia, não conteúdo.

---

# §4. O QUE APARECE NA TELA

## 4.1 A tela de treino, e só isso

```
                                          ⏸  ✏️
   ┌──────────────────────────────────────────┐
   │                                          │
   │              8  +  7  =  ?               │
   │                                          │
   ├──────────────────────────────────────────┤
   │     [ 14 ]      [ 15 ]      [ 16 ]       │
   └──────────────────────────────────────────┘
             ▓▓▓▓▓▓▓░░░  7 de 10
```

**Não tem:** mascote falando, animação de entrada, microtutorial, Mão Fantasma, narração do
enunciado, cenário temático, história.
**Tem:** a conta, as alternativas, o progresso do round, o botão de pausa e o botão da prancheta.

## 4.2 Áudio: praticamente nenhum

| Situação | Som |
|---|---|
| Enunciado | **nenhum.** A conta está escrita; o Dojo é para quem já lê número. |
| Acerto | tick curto, ≤ 200ms |
| Erro | tom suave descendente, ≤ 300ms. **Nunca** som de buzina, nunca som "errado" agressivo. |
| Fim do round | acorde curto de conclusão |
| Faixa nova conquistada | jingle de faixa, 1,5s, uma vez só |

**Exceção — Jardim do Dojo (4-6 anos):** ali o áudio é obrigatório, porque a criança não lê. Mas o
Jardim é outro lugar, com fichas próprias.

**Botão de repetir áudio não existe no Dojo Sensei.** Não há o que repetir.

## 4.3 Modo de resposta

| Modo | Como funciona | Estado |
|---|---|---|
| **Alternativas** | 3 opções, uma correta. **Padrão hoje, em todas as faixas.** | ✅ é o que roda |
| **Escrita à mão** | a criança escreve o resultado no espaço da conta; reconhecimento converte em número e compara | 🔜 §6 |
| **Teclado numérico** | teclado estruturado, resposta inteira | 🔜 opcional, para quem prefere |

**Os distratores das alternativas não são aleatórios.** Regra fixa:

| Distrator | De onde vem | Tag |
|---|---|---|
| resposta ± 1 | erro de contagem | `OFF_BY_ONE` |
| resposta sem o vai-um / sem o empréstimo | `27+5 → 22` | `IGNORA_VAI_UM` / `IGNORA_EMPRESTIMO` |
| operação trocada | `8+7 → 1` | `OPERACAO_TROCADA` |
| dígitos invertidos | `23−5 → 22` (fez 5−3 na unidade) | `SUBTRAI_INVERTIDO` |
| tabuada vizinha | `7×8 → 49` | `TABUADA_VIZINHA` |
| denominador somado | `1/4+2/4 → 3/8` | `SOMA_DENOMINADOR` |

**Isto é novo e é importante:** até aqui, errar no Dojo só custava `−1 força`. Uma criança que
responde `8+7=16` três vezes está mostrando um padrão diagnóstico que o sistema jogava fora. Com
distrator tagueado, **o erro do Dojo alimenta o Radar** igual ao erro da Jornada — com o peso
probabilístico da Bíblia §11.4-bis.

---

# §5. AS REGRAS DO MOTOR *(o que o dojoEngine faz)*

## 5.1 Subir, descer, socorrer

| Situação | O que acontece |
|---|---|
| ~90% dos itens da faixa com força ≥ 4 | **sobe de faixa** |
| 2 rounds seguidos com precisão < 60% | **desce uma faixa**, sem aviso e sem "você caiu" |
| 2 erros consecutivos no mesmo item | **socorro visual**: o item seguinte aparece com apoio concreto, mesma faixa (§4-bis.3 do documento-mãe) |
| 2 acertos com apoio | o apoio **some sozinho**, sem aviso |
| persiste depois do socorro e do recuo | **Missão de Resgate** na Oficina |

## 5.2 ⚠️ Correção de uma contradição do `DOJO_SAGA.md`

O §3-A do documento-mãe diz que comutativos **compartilham o mesmo registro** de força
(`mul:7x6` e `6x7` = um `FactStrength` só). O §4-bis.2 diz que o sistema **mede se `5+3` é tão
rápido quanto `3+5`**. **As duas não podem ser verdade ao mesmo tempo** — se compartilham um
registro, não há dois tempos para comparar.

**Resolução canônica:** o `FactStrength` é **compartilhado** (é um fato só, e o objetivo pedagógico
é exatamente esse), mas guarda **dois tempos separados**:

```
FactStrength {
  fact_id          // "add:3+5" — a forma canônica é sempre menor+maior
  forca: 0-5       // compartilhada
  rt_direto        // média móvel de 3+5
  rt_invertido     // média móvel de 5+3
  ultima_vez
  erros_seguidos
}
```

**Sinal de que a comutatividade pegou:** `rt_invertido` se aproxima de `rt_direto`. Enquanto a
diferença for maior que 40%, ela ainda está **calculando** o invertido em vez de **recuperar** —
e o degrau de pares invertidos continua ativo.

## 5.3 O inventário de fatos *(o que faltava para "90% dos fatos" ser computável)*

O documento-mãe diz que a trilha sobe quando "~90% dos fatos do degrau estão em força ≥ 4". Isso só
é computável se existir a lista. Ela é **gerada, nunca escrita à mão**:

| Faixa | Fórmula do inventário | Nº de fatos |
|---|---|---|
| Adição 1 | todo `a+b`, a,b ≥ 1, a+b ≤ 5 | 10 |
| Adição 2 | todo `a+b`, a,b ≥ 1, 6 ≤ a+b ≤ 10 | 20 |
| Adição 3 | todo `a+b` com a+b = 10 | 9 |
| Adição 4 | todo `a+b`, a,b ≤ 9, 11 ≤ a+b ≤ 18 | 36 |
| Multiplicação 8 | todo `a×b`, 2 ≤ a,b ≤ 10 | 45 *(com comutativos compartilhados)* |
| Divisão 8 | todo `a÷b` exato, b ≤ 10, quociente ≤ 10 | 45 |

**Faixas de procedimento (PD) não têm inventário fechado** — são infinitas por construção. Elas
sobem por **precisão em N itens consecutivos**, não por cobertura de fatos: 8 de 10 corretos em 2
rounds seguidos.

**O script que gera o inventário é obrigatório** e roda no auditor. Sem ele, "90% dos fatos" é frase
solta.

## 5.4 Telemetria — o que o Dojo escreve

```
FactStrength   { fact_id, forca, rt_direto, rt_invertido, ultima_vez, erros_seguidos }
ProcStrength   { proc_id, precisao, passo_fraco, tempo_medio, forca, ultima_vez }
DojoTrackState { trilha, faixa_atual, faixa_max, precisao_por_faixa[], ultima_sessao }
DojoSession    { trilha, faixa, itens[], acertos, rt_medio, fila_quente_restante, usou_prancheta }
DojoErrorEvent { fact_id, resposta_dada, tag, faixa, timestamp }   ← NOVO (§4.3)
```

`DojoErrorEvent` é o que liga o Dojo ao Radar. Sem ele, o Dojo é um silo.

**O que o pai vê:** por trilha, a faixa atual, a precisão da faixa e o tempo médio. Nada mais.
Sem ranking, sem comparação, sem "abaixo da média da idade".

---

# §6. A PRANCHETA — rascunho à mão por cima da tela

> Isto é uma **primitiva nova** e vale para o app inteiro, não só para o Dojo. A especificação
> canônica está na **Bíblia §9.3**; aqui fica o comportamento dentro do Dojo.

## 6.1 O que é

Uma **camada transparente por cima do exercício**, onde a criança rabisca a conta como faria no
caderno. Botão ✏️ no canto superior. Abre, ela risca, fecha, responde.

**Por que importa:** conta armada de vários dígitos **não se faz de cabeça**. Uma criança que não
pode rascunhar ou faz de cabeça (e erra por sobrecarga, não por não saber) ou desiste. O rascunho é
parte do procedimento, não muleta.

## 6.2 Regras duras

| Regra | Porquê |
|---|---|
| A prancheta **nunca** captura toque destinado ao exercício | ela é uma camada; enquanto está fechada não existe para o input |
| Fechar a prancheta **não apaga** o rascunho | a criança volta e continua |
| O rascunho é descartado ao mudar de item | é rascunho, não histórico |
| Funciona com **dedo, caneta e mouse**, sem diferença | tablet e desktop têm de se comportar igual |
| **Usar a prancheta nunca conta como ajuda** | não afeta a dimensão *independência* do domínio. Rascunhar é fazer conta, não pedir socorro. |
| A sessão registra `usou_prancheta` | dado, não julgamento — serve para saber quando a conta ficou pesada demais para a cabeça |

## 6.3 Ferramentas

Mínimo viável: **lápis** (3 cores: grafite, azul, vermelho) · **borracha** · **limpar tudo** ·
**desfazer**. Sem formas, sem régua, sem texto — isso é caderno, não editor.

## 6.4 Quando aparece

| Onde | Prancheta |
|---|---|
| Dojo, faixas de fato (1a com 1a) | disponível, raramente usada |
| Dojo, faixas de procedimento (2a com 2a, divisão) | **disponível e incentivada** — aparece piscando na primeira vez da faixa |
| Jornada, níveis 1-2 | não aparece (a criança manipula material) |
| Jornada, níveis 3-5 de conta armada | disponível |
| Jardim do Dojo | **não existe** — 4 anos não rascunha |

---

# §7. COMO MEXER NISTO SEM BAGUNÇAR TUDO

Esta seção existe porque a pergunta vai voltar daqui a três meses e a resposta precisa estar escrita.

## 7.1 Os quatro tipos de mudança

| Tipo | Exemplo | O que fazer |
|---|---|---|
| **A · Ajustar o intervalo de uma faixa** | "a faixa 6 está fácil demais, subir para 2a+2a" | edita a linha na tabela do §3 **e** o gerador. Roda o auditor. **Nunca só o código.** |
| **B · Trocar a ordem de duas faixas** | "tabuada do 3 antes da do 5" | ⚠️ **Cuidado.** A ordem é pedagógica, não estética. Exige justificativa no changelog e revisão do Manual. |
| **C · Acrescentar faixa a uma trilha** | faixa 11 de subtração, com zero no meio | ✅ permitido. **Sempre no fim**, nunca no meio — inserir no meio renumera tudo e invalida o progresso salvo de toda criança. |
| **D · Criar trilha nova** | "Potências" | passa pelo **§15 da Bíblia** (protocolo de expansão) e pelo teste de duplicação do §15.8. |

## 7.2 A regra que não se quebra

> **Faixa nunca muda de número.** Se a faixa 6 da Adição é "2a + 1a sem vai-um" hoje, ela é isso
> para sempre. Uma criança que salvou "Adição, faixa 6" tem de encontrar a mesma coisa amanhã.
> Conteúdo novo entra como faixa **11, 12, 13**. Conteúdo ruim é **aposentado** (marcado
> `deprecated: true`, some da UI, continua existindo para os saves antigos) — **nunca deletado**.

Isto é a §14 da Bíblia aplicada ao Dojo: nada é fisicamente apagado.

## 7.3 As duas decisões já tomadas *(não reabrir)*

1. **Subtração com zero no meio** (`100−45`, `403−158`) não entra na faixa 10. Vira faixa 11 quando
   for construída, ou fica no treino específico da Oficina. Motivo: exige dois empréstimos
   encadeados e quebraria a curva da trilha inteira.
2. **Divisão longa** (dividendo de 3 dígitos, zero no quociente, divisor de 2 dígitos, quociente
   decimal) **não cabe** nas 10 faixas de Divisão junto com os fatos. Vira uma segunda trilha,
   **"Divisão Longa"**, que abre com `N4.12 ≥ 4` e usa os degraus `PD-D.4` a `PD-D.10` do
   documento-mãe.

## 7.4 Checklist para qualquer alteração

- [ ] a tabela do §3 foi editada **antes** do código
- [ ] o número da faixa não mudou de significado
- [ ] o inventário de fatos (§5.3) ainda fecha
- [ ] nenhum save existente aponta para faixa que mudou de conteúdo
- [ ] `npm run auditar` verde, com **saída bruta de terminal** (Bíblia §14.1)
- [ ] changelog deste documento atualizado com data e motivo

---

# §8. O QUE ESTE DOCUMENTO NÃO COBRE

Honestidade sobre os limites, para ninguém presumir que está pronto:

| Item | Estado |
|---|---|
| Trilha "Divisão Longa" (segunda trilha de divisão) | **especificada em §7.3, não detalhada em faixas** |
| Faixa 11+ de qualquer trilha | não existe ainda, e está certo assim |
| Modo Mestre (desafio cronometrado, §2 do documento-mãe) | comportamento definido lá, faixas usam as mesmas deste documento |
| Reconhecimento de escrita à mão | Bíblia §12.11-ter — direção documentada, não construída |
| Como o Sensei **antecipa** a semana | ver `PLANO_DE_HORIZONTE` na lista de pendências do Diário |

---

*Changelog: v1.0 (ago/2026) — documento inaugural. Formaliza as 4 trilhas de operação que já
rodavam em código (adição, subtração, multiplicação, divisão) sem alterar o desenho delas;
acrescenta a 5ª trilha (Frações e Decimais); especifica a janelinha de faixas; define os distratores
tagueados do Dojo e o `DojoErrorEvent` que liga o Dojo ao Radar; resolve a contradição do registro
comutativo (§5.2); define o inventário de fatos gerado (§5.3); especifica a Prancheta (§6); e
escreve o protocolo de alteração (§7). Corrige o bug relatado de conta de dois algarismos aparecendo
na faixa 1.*
