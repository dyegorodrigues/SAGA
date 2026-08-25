# Gate B′ — checkpoint de ativação e primeira prioridade

Data: 2026-08-21  
Fase: **Gate B′ — reparação das saídas CODIGO do Gate B**  
Base certificada: `c710719cbd50f0f1eef4cc82536a1264da7daf67`

## 1. Motivo

Gate B foi encerrado e certificado: 90/90 competências auditadas, 54 candidatas individuais ativas (49 CODIGO / 1 SIMULACAO / 4 CRIANCA), oito classes estruturais e zero correções funcionais dentro da auditoria.

A instrução humana posterior autorizou continuar autonomamente o workflow depois da autoverificação do fechamento. A proposta de Gate B′ registrada na Issue #47 passa, portanto, a reger operacionalmente a fase de reparo, sem reescrever retrospectivamente o Gate B AUDIT-ONLY.

## 2. Regras

- CODIGO: provar/refutar antes de editar;
- defeito confirmado: regression-first → recibo vermelho → correção mínima → CI + transversal no SHA final;
- classes estruturais: gate por descoberta/medição, nunca allowlist positiva manual;
- SIMULACAO segue para Gate G; CRIANCA segue para Gate J;
- nenhuma candidata CODIGO chega aberta ao Gate J;
- `DECISAO-001/GM.04` permanece bloqueada por decisão humana;
- main, ready, auto-merge, merge e Creature Engine permanecem fora de escopo.

## 3. Primeira prioridade

`GAP-054 — GM.06/F62 — vazamento de resposta no enunciado/suporte`.

Rationale: defeitos que revelam o gabarito contaminam diretamente a validade de assessment/mastery e devem ser tratados antes de melhorias representacionais. O item é verificável por código e não depende de decisão semântica humana.

A abertura técnica de GAP-054 só ocorre depois deste checkpoint documental ser publicado e certificado no HEAD final.

## 4. Livro de reparos (append-only)

Cada linha só entra depois de: recibo vermelho publicado → correção mínima →
`tsc --noEmit` limpo → suíte inteira verde → mutação matando o teste novo.
A ordem é a ordem real dos commits; nada aqui é reescrito depois.

| # | Candidata / classe | Recibo vermelho | Correção | O que passou a ser exigido |
|---|---|---|---|---|
| 1 | GAP-054 — GM.06/F62 (vazamento) | `0be6973`, `57ef143` | `2b26bc2`, `74883c6` | enunciado e scaffold deixam de conter o gabarito |
| 2 | CLASS-007 — GM.12/F50 | `02579c8` | `60887e8`, `d32a092` | `CASO_CONTRAINTUITIVO` exige `verificou`; `dominou()` alinhado a `evidenciasDe()` |
| 3 | CLASS-007 — GM.11/F94 | `bbd2ce9` | `6635716` | alternativas fechadas até o prisma estar construído (L1 cubinhos, L2/L3/L5 camadas) |
| 4 | CLASS-007 + CLASS-009 — N2.07/F66 | `71daf98` | `44f215c` | a fábrica de retângulos vira operável; a lista de formações passa a ser o que a criança fechou |
| 5 | CLASS-009 — instrumento | — | `d774406` | gate por descoberta nas 75 fichas do Composer, com catraca nos dois sentidos |
| 6 | CLASS-009 — GM.10/F93 e GM.09/F82 | `7b7cf82` | `b0df165` | a conversão perguntada deixa de estar escrita na balança e no cabeçalho |
| 7 | CLASS-009 — F45, F72, F75, F83, F69 |  `92116df` + `f1917dc` | `0275dbe` | barra sem rótulo-resposta, ponte `4/10 = ?`, chance `?`, conta armada sem quociente |

### Fronteira medida em GM.11

L4 `dimensao-faltante` **não** ganhou exigência de construção, e isso é
deliberado: o nível não possui controle de empilhar camadas, e criá-lo
entregaria a altura — que é exatamente a pergunta. Exigir construção ali
trocaria um defeito CLASS-007 por um defeito GAP-054. O teste
`VolumePrismasStage.test.tsx` fixa essa fronteira como asserção, para que
uma sessão futura não a "conserte" por simetria.

## 5. Inventário CLASS-007 — estado de reparo

Descoberta fechada para o SHA medido em `41d4233`: `N2.07, N4.02, GE.04,
GE.07, GE.09, GM.11, GM.12` (7/90 = 7,78%).

- reparadas: `GM.12`, `GM.11`, `N2.07`;
- abertas: `GE.07` (sub-forma A, callback morto); `N4.02`, `GE.04`, `GE.09` (sub-forma B, ação opcional).

### Correção de medição em N2.07

O dimensionamento registrou N2.07 como "callback morto: `ArrayGrid` fica
habilitado e recebe `onAnswer={() => undefined}`". A forma estava certa, mas a
medição na tela mostrou que F66 passa `options: []` à grade — que por isso não
renderiza **alvo clicável nenhum**. O callback morto nunca chegava a ser
alcançável pela criança: era um cheiro de código, não um bypass vivo. O defeito
vivo em N2.07 era outro, e maior — CLASS-009, abaixo.

## 6. CLASS-009 — a tela declara a própria resposta

Aberta ao reparar N2.07. Dimensionada em
`GATE_B_CLASS_009_DIMENSIONAMENTO.md`: 7 vazamentos confirmados em 75 fichas
servidas pelo Composer (`GM.09`, `GM.10`, `N4.10`, `N5.01`, `N5.02`, `N6.01`,
`PE.03`), mais `GM.06` e `N2.07` já reparadas.

`GAP-054` deixa de ser um defeito individual e passa a ser a primeira
testemunha desta classe.

Classe reparada só quando as cinco restantes fecharem **e** existir um gate
por descoberta que reprove uma reincidência futura — não uma lista escrita à
mão (D068).
