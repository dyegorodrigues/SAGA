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
| 8 | CLASS-007 — GE.09/F91 | `68c77d4` | `1b94ce1` | montagem, corte e rearranjo acontecem antes das alternativas em L1/L3/L5 |
| 9 | CLASS-007 — GE.04/F59 | `68c77d4` | `e922764` | a alternativa vira previsão e quem envia é o teste; o teste não roda sem previsão |
| 10 | CLASS-007 na casca | `dfd9799` | `dfd9799` | a barra genérica não duplica mais um palco que já responde |
| 11 | CLASS-007 — GE.07/F79 | `68c77d4` | `7732b64` | conferir cada figura contra cada critério antes de nomear a classe |
| 12 | N4.02/F98 — palco em branco | `68c77d4` | `8c02c4c` | o arranjo existe na tela; a partir de L2 o giro é exigido |
| 13 | CLASS-003 — instrumento | — | `eb667bd` | gate por descoberta de variedade de caso nos 75 canários, com catraca nos dois sentidos |
| 14 | CLASS-003 — N4.10/F69 | `7a26274` | `7a26274` | o caso do nível é sorteado; a invariante da escada, não |
| 15 | CLASS-009 — instrumento | `7a26274` | `7a26274` | o gate mede texto por elemento; rótulo numérico exige vizinhança não-dígito |

A linha 10 é a única cujo recibo vermelho e correção estão no mesmo commit: o
achado apareceu ao medir o efeito do reparo de GE.04, já dentro da frente, e
`portaDeFora.test.tsx` nasceu vermelho e foi para o commit junto com o
`answerPolicy.ts` que o fecha.

### A porta dos fundos da casca

Os portões das linhas 2, 3, 4, 8, 9 e 11 fecham as alternativas **dentro** do
palco. Medido no `GameLoopExerciseRenderer`, porém, `shouldRenderQuestionOptions`
desenhava uma segunda barra de alternativas por fora, sem portão nenhum: o mesmo
rótulo aparecia duas vezes na tela, e o de baixo estava sempre habilitado.

É a CLASS-007 medida na altura errada — a ação é executável, a ficha a trata
como probatória, e existia um caminho que enviava a resposta sem ela. E reabria
dois reparos já escritos aqui: a linha 3 (`GM.11/F94`) e o palco da linha 4
(`N2.07/F66`). Enquanto essa porta existisse, o portão do palco era enfeite.

O defeito não era inédito. O comentário de `pareamento`/`touchcount` em
`answerPolicy.test.ts` descreve exatamente esta porta, e ela tinha sido fechada
escrevendo dois nomes numa lista — a quarta lista de inclusão do projeto a
falhar pelo mesmo motivo (D068). Agora a lista continua, mas não é o detector:
`portaDeFora.test.tsx` renderiza a casca inteira e reprova quando o rótulo da
resposta aparece em dois botões, nomeando o `kind`. A direção perigosa também
virou asserção — `tabuada`, `area` e `deslocamento` só ilustram e continuam
recebendo a barra, porque suprimi-la ali deixaria a questão sem resposta
possível.

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

Duas correções de medição depois, o inventário real da classe é de **seis**
testemunhas — `N2.07, GE.04, GE.07, GE.09, GM.11, GM.12` (6/90 = 6,67%) —, e
todas as seis estão reparadas:

| Competência | Sub-forma | Fechada por |
|---|---|---|
| `GM.12` | ação opcional | linha 2 |
| `GM.11` | ação opcional | linha 3 + linha 10 |
| `N2.07` | (medição: era CLASS-009) | linha 4 + linha 10 |
| `GE.09` | ação opcional | linha 8 + linha 10 |
| `GE.04` | ação opcional | linha 9 + linha 10 |
| `GE.07` | callback morto | linha 11 + linha 10 |

`N4.02` sai do inventário pela medição registrada abaixo, não por reparo.

**A classe continua não reparada como classe.** As seis testemunhas fecharam,
mas o gate de prevenção que a descoberta exige (D068) só existe para a porta da
casca, em `portaDeFora.test.tsx`. Não existe ainda um gate que meça, por
competência, se a ação que a ficha declara probatória condiciona o envio da
resposta dentro do palco. Enquanto ele não existir, o inventário é fechado para
este HEAD e nada impede a próxima ficha de nascer com o mesmo defeito.

### Correção de medição em N4.02

O dimensionamento registrou N4.02 como sub-forma B: "o giro existe no runtime
legado, porém a resposta correta continua sendo a expressão da orientação
inicial; girar não é requisito para concluir". A forma estava certa no papel —
`gN4_02` chega a declarar `nlEnd: 1, // hack to show rotate button`.

A medição na tela mostrou outra coisa. A questão legada não carregava
`uiProps`; sem `uiProps` o `GameLoopExerciseRenderer` nem chama o
`FichaRenderer`, o `ArrayGrid` nunca era montado, e
`shouldRenderQuestionOptions` é `false` para `kind: "array"` justamente porque a
grade desenha as próprias alternativas. Nos cinco níveis a criança via uma tela
vazia: nem arranjo, nem alternativa, nem botão de girar.

Não era bypass de ação executável — a definição da classe exclui "ação canônica
completamente ausente do runtime". Era pior: a competência inteira injogável.
É o segundo caso em que ler o gerador e medir a tela dão respostas diferentes;
o primeiro foi N2.07.

### Fronteiras medidas nas testemunhas novas

- **GE.09/F91** — L2 e L4 não ganharam exigência de transformação: a figura já
  nasce transformada num e não há corte a fazer no outro. Exigir ali pediria um
  gesto que a tela não oferece.
- **GE.04/F59** — o experimento também ficou fechado até existir previsão. O
  `role=status` escreve "a superfície curva permite rolar", ou seja, responde a
  pergunta; com o teste aberto desde o início ele deixava de testar a criança e
  passava a informá-la. Fechar a CLASS-007 aqui fechou junto um vazamento que já
  estava na tela.
- **GE.07/F79** — a conferência exige que cada figura passe por cada critério,
  mas **não** exige acerto. Os critérios listados são propriedades que a figura
  tem, então conferir não escolhe classe nenhuma: produz a informação de que a
  resposta precisa sem imprimir o gabarito. Exigir a classificação correta antes
  de responder trocaria a CLASS-007 por um GAP-054, como em GM.11/L4.
- **GE.07/F79** — quem abre o portão é o `onAnswer` do `DragGroup`, não o
  `onProgress`. Com o portão no `onProgress`, apagar o `onAnswer` deixava a
  suíte verde — o callback morto continuaria morto e o reparo seria de fachada.
  A mutação que prova isso está fixada no teste.

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
mão (D068). As cinco fecharam na linha 7; o gate por descoberta é o `d774406`
da linha 5.

## 7. CLASS-010 — a resposta desenhada duas vezes

Aberta ao medir a porta dos fundos da casca (linha 10). Fechar os cinco `kind`
desta frente não fecha a classe: a varredura dos 75 canários do Composer, em
cinco níveis, encontrou **20 competências** em que o rótulo da resposta continua
aparecendo em dois botões da mesma tela — o do palco autoral e o da barra
genérica embaixo.

`AL.06`, `AL.07`, `GE.05`, `GE.06`, `GE.08`, `GE.10`, `GM.06`, `GM.08`,
`GM.09`, `GM.10`, `N2.06`, `N4.03`, `N4.11`, `N5.05`, `N6.03`, `N7.01`,
`N7.02`, `PE.02`, `PE.03`, `PE.04`.

Duas dessas são CLASS-007 vivas, não só duplicação: `N2.06` (L1–L2) e `N4.03`
(L2–L3) fecham as próprias alternativas no mount, e a barra de fora as reabre.
As outras dezoito desenham a resposta duas vezes sem portão a contornar — feio,
e ainda assim um segundo caminho de mastery que ninguém mediu.

Não foram reparadas aqui de propósito. Suprimir a barra em vinte competências é
mudança de tela em massa, e a direção perigosa do mesmo ajuste — deixar uma
questão sem caminho para responder — precisa ser medida por competência, não
presumida. A classe entra com inventário medido e sem reparo, como a CLASS-009
entrou; o próximo passo é o dimensionamento dela, e o gate de `portaDeFora`
já existe para recebê-lo.

## 8. CLASS-003 — um nível que é um caso só

Prioridade 3 do roadmap (variedade/mastery estrutural), aberta com instrumento
e inventário medido, sem reparo em massa.

As fichas cobram 3 acertos de 3 em 2 sessões — algumas 4/4 em 3. Quando o
contrato devolve **um único caso determinístico** naquele nível, a criança
responde o mesmo item seis a doze vezes e o motor conclui domínio. Não é
prática distribuída: é memorizar um item.

Medido sobre os 75 canários, 8 amostras consecutivas por (ficha, nível) a
partir de duas sementes: **31 competências e 151 pares**. O inventário
documental falava em **18 competências "conhecidas"**; a medição achou 13 a
mais — `N1.02`, `N2.06`, `N2.07`, `N5.03`, `AL.05`, `GE.03`, `GE.04`, `GE.05`,
`GE.06`, `GE.07`, `GE.08`, `GE.09`, `GE.10`. É a terceira vez nesta fase que um
inventário escrito à mão fica atrás do medido.

### A dívida que esta frente criou

Cinco dessas — `GE.04`, `GE.07`, `GE.09`, `GM.11`, `N2.07` — são exatamente as
que ganharam portão de ação nas linhas 3, 4, 8, 9 e 11. O portão está certo e
continua insuficiente: a criança o atravessa seis vezes com o mesmo item.
Fechar a CLASS-007 numa ficha não a torna avaliável enquanto o nível for um
caso só. Fica registrado como dívida desta frente, não como pendência de
terceiros.

### Primeiro reparo e o que ele revelou

`N4.10/F69` saiu do registro na linha 14, e a catraca cobrou a saída sozinha.
Fila em **30 competências / 146 pares**.

O reparo consumiu números aleatórios, deslocou o fluxo do PRNG e fez o gate da
CLASS-009 acusar `N6.03`. Não era vazamento: a resposta era `10` e o apoio fixo
diz `100% é o inteiro`. A causa é mais funda que um caso — `textContent` cola
nós vizinhos sem separador, então a reta numérica virava `024681012` e, em
`N4.09`, o `2` de "3 × 2" grudava no `6` seguinte formando `3x26`. **O gate
media texto que a criança não vê.**

Corrigido na linha 15: o suporte é remontado por elemento e rótulo numérico
exige vizinhança não-dígito. `N4.09` sai do registro da CLASS-009 — todas as
detecções dela eram artefato, e a justificativa antiga racionalizava o
artefato. `AL.03` e `N4.03` continuam detectadas, o que prova que a correção
não afrouxou nada; foi a própria catraca de entradas obsoletas que cobrou isso,
duas vezes, durante o conserto.

Consequência para o fechamento anterior: os **7 vazamentos reparados continuam
reparados**. O que estava inflado era a contagem de "21 fichas ecoam o rótulo,
14 legítimas" — parte das legítimas era ruído do instrumento.

## 9. Recibos desta rodada

- `tsc --noEmit`: limpo;
- suíte inteira: **3492/3492** em 263 arquivos;
- `npm run auditar`: invariantes canônicos, guard documental, palcos compostos e
  matriz de cobertura aprovados;
- mutação: cada correção derruba o teste novo quando revertida — 3 mutações em
  GE.09, 3 em GE.04, 5 em GE.07, 5 em N4.02, 6 na porta da casca, 5 no gate da
  CLASS-003 e 6 no reparo de N4.10. As três que sobrevivem estão nomeadas nos
  commits: a guarda redundante de `testar()` em GE.04, o `answerMode` de N4.02
  que nenhum renderizador lê, e `cobraRepeticao` no gate da CLASS-003, que não
  discrimina hoje porque toda ficha cobra repetição.
