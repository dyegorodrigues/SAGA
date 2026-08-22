# Gate B — CLASS-008 — diversidade de famílias no mastery

Data: 2026-08-20  
Modo: **AUDIT-ONLY**  
Âncora de entrada: `41d4233d7b5e06639b0e626684f695708d581966`  
PR: #35 · branch `codex/fechamento-curricular`

## 0. Veredito

**CLASS-008 CONFIRMADA: 6/90 competências = 6,67% são testemunhas atuais da assinatura “nível integrador sorteia entre famílias, mas mastery é cega à diversidade de família”. Nenhuma correção foi implementada.**

Definição operacional:

> um mesmo nível/micro declara integrar duas ou mais famílias conceitualmente distinguíveis, o gerador escolhe entre essas famílias ao produzir as tentativas, mas a regra de domínio conta somente acertos/janela/sessões; assim, uma criança pode satisfazer o mastery tendo demonstrado apenas uma das famílias que o nível existe para integrar.

A unidade de contagem é **competência**, não quantidade de famílias, micro-IDs nem ocorrências textuais de “misto”.

## 1. Correção da entrada externa pelo HEAD

A hipótese externa de classe foi confirmada, mas a afirmação de que as quatro testemunhas iniciais usavam todas `4/5 × 2 sessões` foi **refutada** pelo código atual:

- `N1.09/misto`: `4/5 × 2`;
- `GM.02/misto`: `4/5 × 2`;
- `N3.09/misto`: **`3/3 × 2`**;
- `N4.07/dificeis`: **`8/10 × 3`**.

O invariante da classe não depende do mesmo threshold numérico. O defeito é a **cegueira à identidade da família** na janela que compra mastery.

## 2. R2 complementar — além da busca textual

A entrada externa era explicitamente uma cota inferior. A varredura foi complementada por busca de contratos que expressem integração sem depender apenas da palavra `misto`, seguida de leitura do procedimento gerador.

Resultado atual: **6 testemunhas confirmadas**.

| ID | Nível/micro integrador | Famílias observadas | Regra atual | `evidenciasDistintas` |
|---|---|---|---|---|
| `N1.09` | L5 `misto` | contar objetos · continuar de N · contagem regressiva | 4/5 × 2 | ausente |
| `N3.09` | L5 `misto`, `operation: mixed` | adição · subtração | 3/3 × 2 | ausente |
| `N4.03` | L4/L5 `misturadas` | tabuadas ×2 · ×5 · ×10 | 8/10 × 3 | ausente |
| `N4.04` | L4/L5 `misturadas` | estratégias/fatos ×3 · ×4 e depois ×2/×3/×4/×5/×10 | 8/10 × 3 | ausente |
| `N4.07` | L4/L5 `dificeis` | ×6 · ×7 · ×8 · ×9; depois conjunto completo | 8/10 × 3 | ausente |
| `GM.02` | L5 `misto` | partes do dia · ontem/hoje/amanhã · semana · ordem de eventos | 4/5 × 2 | ausente |

Prevalência medida nesta auditoria: **6/90 = 6,67%**.

### 2.1 Testemunhas adicionais encontradas pela leitura contratual

`N4.03/F42` e `N4.04/F43` não estavam na cota textual externa. As fichas declaram níveis finais misturados e os procedimentos confirmam que cada tentativa pode vir de famílias diferentes. A regra de domínio, porém, não exige que mais de uma dessas famílias apareça entre as tentativas válidas.

Isso demonstra por que a detecção da classe não pode ser uma allowlist nominal nem uma busca por uma única palavra.

## 3. Casos descartados

Não entram na CLASS-008:

- `GE.06`, `N3.10`, `PE.04`: linguagem ampla/prosa não corresponde a um nível gerador que sorteia famílias distintas sob mastery cega;
- `N7.01`, `N7.02`: mistura de positivos/negativos permanece dentro de um único conceito, não é diversidade de famílias independentes;
- níveis que alternam casos ou operandos dentro da mesma família conceitual não entram apenas por terem variedade.

## 4. GAP-008 e GAP-051

- `GAP-008 / N1.09`: **ABSORVIDO PELA CLASS-008**. O achado individual antigo era manifestação da classe agora identificada; deixa de contar como candidata individual ativa.
- `GAP-051 / GM.02`: registrado neste fechamento como trilha de auditoria da descoberta GM, mas **imediatamente ABSORVIDO PELA CLASS-008**; não entra na contagem de candidatas individuais ativas.

### GAP-051 — GM.02 — nível misto pode coroar uma única família

Estado: `ABSORVIDO-POR-CLASS-008`  
Via: `CODIGO`  
Fato atual: o L5 sorteia uma entre quatro famílias e usa `4/5 × 2 sessões` sem diversidade por família. A causa é estrutural e, portanto, fica governada pela CLASS-008 em vez de duplicada como reparo individual.

## 5. O mecanismo de reparo já existe

`FichaDominio` já possui:

`evidenciasDistintas?: { prefixo: string; minimo: number; descricao?: string }`

O `progressEngine` já sabe normalizar esse requisito e só completar a evidência multidimensional quando o número mínimo de evidências distintas com o prefixo exigido foi visto.

Há precedente interno em produção nas fichas AL, incluindo:

- `AL.03`: mínimo 2;
- `AL.04`: mínimo 1;
- `AL.05`: mínimo 2.

Portanto CLASS-008 não é ausência de mecanismo de mastery; é **aplicação e transporte incompletos**.

## 6. Proposta de reparo — NÃO IMPLEMENTADA

Para futura frente autorizada:

1. cada builder misto deve emitir uma evidência de identidade da família realmente exercitada, usando prefixo estável por competência;
2. o micro integrador deve declarar `evidenciasDistintas` com mínimo coerente com o número de famílias que precisa ser demonstrado;
3. o `Composer` genérico e os builders especializados devem transportar `evidenciasDistintas` para `Question.masteryRule` — hoje vários caminhos serializam somente `acertos/de/sessoes`;
4. testes devem provar que repetição de uma única família **não** compra mastery e que a diversidade exigida **sim** compra;
5. nenhum gate futuro deve usar lista positiva escrita à mão para descobrir membros; descoberta deve vir da estrutura da ficha/contrato e do comportamento gerável.

Nada disso foi implementado no Gate B.

## 7. Autoverificação

- universo da alegação: **90 competências**;
- testemunhas atuais: **6**;
- prevalência: **6,67%**;
- lista é resultado da medição, não mecanismo de gate;
- runtime, DAG, Matrix, canários, Radar, schema e progressEngine: **intocados**;
- correções Gate B: **0**.
