# Gate B′ — checkpoint de ativação e primeira prioridade

Data: 2026-08-21  
Fase: **Gate B′ — reparação das saídas CODIGO do Gate B**  
Base certificada: `c710719cbd50f0f1eef4cc82536a1264da7daf67`

> **Chegando agora?** A seção 13 diz onde a fase está: quais classes fecharam,
> quais gates vigiam o quê e as duas coisas que continuam abertas. As seções 1 a
> 3 são o começo desta fase e ficaram como estavam — o livro de reparos é
> append-only, e ler as decisões na ordem em que foram tomadas é o ponto dele.

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
| 16 | CLASS-003 — N4.12/F71 e N4.11/F70 | `c1989c7` | `c1989c7` | a conta e o número do crivo são sorteados; o quociente ímpar impede a estimativa virar resposta |
| 17 | CLASS-003 — N7.01/F84 e N7.02/F85 | `7463017` | `7463017` | ponto e conta sorteados com a invariante de sinal de cada nível |
| 18 | CLASS-003 — GM.10/F93 | `41411ca` | `41411ca` | a conversão é sorteada; o decimal só aparece onde a escada o pede |
| 19 | CLASS-003 — GM.07/F63 e GM.08/F81 | `2ca40fa` | `2ca40fa` | figura e região sorteadas; a área declarada volta a fechar com o desenho |
| 20 | CLASS-003 — GE.07/F79 | `cc38888` | `cc38888` | a CLASSE da figura é sorteada, e cada classe ganha traço próprio no SVG |
| 21 | CLASS-003 — GE.09/F91 e GE.04/F59 | `944fa37` | `944fa37` | medidas e sólido sorteados; a resposta segue o sólido, não a posição |
| 22 | CLASS-009 — instrumento | `2ae6cdf` | `2ae6cdf` | veredito por unanimidade entre amostras; parcial vira relatório com catraca de mão única |
| 23 | CLASS-003 — N2.07/F66 | `7dd15e9` | `7dd15e9` | o número é sorteado, e a abertura longe do MDC recusa o par inseguro na origem |
| 24 | CLASS-003 — GM.11/F94 | `c3e380a` | `c3e380a` | o prisma é sorteado; o teste do palco deixa de pedir spec e opções em duas chamadas |
| 25 | CLASS-003 — instrumento (digital) | `c528e8a` | `c528e8a` | serializador estável e profundo; `JSON.stringify(obj, chaves)` filtrava em vez de ordenar |
| 26 | CLASS-003 — N5.05/F86, GE.03/F58 | `b236e9a`, `cbf8e23` | `b236e9a`, `cbf8e23` | a conta é a própria grade; a forma e a malha saem de tabela-verdade |
| 27 | CLASS-003 — caso único fechada | `fc2a1cf` | `fc2a1cf` | zero a reparar na primeira dimensão; `N1.02` medida e classificada |
| 28 | CLASS-003 — GM.06/F62 | `60334c0` | `60334c0` | relógio e duração sorteados; o gate mede os dois ponteiros separados |
| 29 | CLASS-003 — instrumento (tela) | `d5dc891` | `d5dc891` | quem confirma o rótulo decorável é o render da casca; a categoria escrita à mão some |
| 30 | CLASS-003 — PE.02, PE.03, PE.04 | `b4aa5ee` | `b4aa5ee` | pesquisa, torres e experimento sorteados; três distratores que não pegavam ninguém corrigidos |
| 31 | CLASS-003 + CLASS-009 — GE.05, GE.06, GE.08, GE.10 | `b434b5e` | `b434b5e` | caso sorteado nas quatro; rótulo que se autodeclarava certo eliminado; três correções de medição na CLASS-009 |
| 32 | CLASS-003 — AL.05, AL.06, AL.07, GM.09 | `707e48d` | `707e48d` | balança, expressão, letra e problema sorteados; cada distrator passa a ser o resultado do erro que nomeia |
| 33 | CLASS-003 — resposta decorável fechada | `2149f93` | `2149f93` | N2.06, N4.12, N5.01, N5.03, N5.04; registro esvazia; dois palcos de produção param de ter barra por fora |
| 34 | CLASS-010 — fechada | `4e658c6` | `4e658c6` | dezessete palcos param de vender o acerto por dois caminhos; gate por comportamento, com prova de vida |
| 35 | CLASS-008 — fechada | `564cedd` | `564cedd` | emissão, transporte e aplicação da diversidade de famílias; oito níveis integradores, dois descobertos pelo gate |
| 36 | D068 — inventário de portões medido | `54f59f7` | `54f59f7` | a lista escrita à mão vira medição com catraca; ela já estava três entradas atrás |
| 37 | CLASS-004 — fechada | `8318a93` | `8318a93` | o lado certo deixa de ser sempre o mesmo em N6.01 L4; detector isolado e testado contra casos conhecidos |
| 38 | CLASS-001 — fechada | `f82742a` | `f82742a` | o L3 de N4.06 volta a existir: o apoio deixa de ser cobrado de quem não pode tê-lo |
| 39 | CLASS-002 — fechada exceto a DECISAO-001 | `7ce0e49` | `7ce0e49` | cinco fichas voltam a documentar os pré-requisitos que o DAG cobra; GM.04 fica com catraca |

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

## 7. CLASS-010 — a resposta desenhada duas vezes — **FECHADA**

Aberta ao medir a porta dos fundos da casca (linha 10) e fechada na linha 34.

O inventário de abertura contou **20 competências** em que o rótulo da resposta
aparecia em dois botões da mesma tela. Ele estava errado nos dois sentidos, e o
erro era do método: contar RÓTULO acusa um teclado numérico que legitimamente
tem o dígito da resposta, e acusa uma malha que tem a casa certa. `N4.03` e
`N4.11` entraram por isso.

A medição que fechou a classe é por COMPORTAMENTO. Cada botão é clicado num
render limpo — o primeiro clique pode desabilitar a tela inteira, e contar os
seguintes no mesmo render diria que só existe um caminho justamente onde há
dois — e conta-se quantos fazem o `handlePick` receber uma resposta que a
questão aceita. Deu **dois em todos os cinco níveis de dezessete `kind`**:

`primos-divisores-f70`, `multiplicar-fracoes-f86`, `porcentagem-f87`,
`reta-completa-f84`, `operar-negativos-f85`, `expressao-f77`,
`linguagem-letras-f89`, `mapa-tesouro-f60`, `angulos-f78`,
`plano-cartesiano-f80`, `horas-minutos-f62`, `area-f81`,
`problemas-medida-f82`, `conversao-unidades-f93`, `jornal-turma-f64`,
`media-chance-f83`, `estatistica-chance-f95`.

`N4.03` e `N4.11` saíram: nenhum clique isolado vendia acerto duas vezes ali. A
"CLASS-007 viva em N2.06 L1–L2 e N4.03 L2–L3" do inventário antigo também era
leitura do texto, não do comportamento.

Três palcos saíram da duplicação antes, durante a frente da CLASS-003, porque a
duplicata era o próprio defeito que se estava reparando: `volume-vistas-f92`
(linha 31), `divisao-dois-digitos-f71` e `draggroup` (linha 33). Nos dois
últimos a barra da casca desenhava NOMES DE ERRO como se fossem alternativas —
"quociente ajustado" estava num botão e acertava os cinco níveis da F71 sem
nenhuma estimativa.

Zero caminho não é defeito nesta classe. Onde a ficha exige construir o prisma,
rodar o experimento ou conferir os critérios, nenhum clique isolado vende nada,
e é exatamente isso que a CLASS-007 garantiu. Quem cobra a EXISTÊNCIA do
caminho é `portaDeFora.test.tsx`, do outro lado — e ele ganhou uma prova nova,
pela ausência: nos palcos de produção o rótulo da resposta não pode estar em
botão nenhum, e o teste também cobra que o botão de confirmar exista, senão
bastaria quebrar o palco para passar.

O gate novo (`respostaNaoSeCompraDuasVezes.test.tsx`) nasce com registro vazio.
Registro vazio tem um risco próprio: "ninguém duplica" e "não olhei" dão o mesmo
verde. Por isso ele afirma também quantas fichas vê vendendo por UM caminho — a
mutação que cega a contagem fica vermelha por causa dessa afirmação, e não por
causa da catraca.

## 8. CLASS-003 — um nível que é um caso só — **FECHADA NAS DUAS DIMENSÕES**

Prioridade 3 do roadmap (variedade/mastery estrutural). Aberta com instrumento e
inventário medido; fechada em zero a reparar nas duas dimensões que a medição
separou.

As fichas cobram 3 acertos de 3 em 2 sessões — algumas 4/4 em 3. Quando o
contrato devolve **um único caso determinístico** naquele nível, a criança
responde o mesmo item seis a doze vezes e o motor conclui domínio. Não é
prática distribuída: é memorizar um item.

### Dimensão 1 — o caso único

Medido sobre os 75 canários, 8 amostras consecutivas por (ficha, nível) a partir
de duas sementes: **31 competências e 151 pares**. O inventário documental
falava em **18 competências "conhecidas"**; a medição achou 13 a mais. É a
terceira vez nesta fase que um inventário escrito à mão fica atrás do medido.

Fechada na linha 27, em zero a reparar, depois de 15 contratos sorteados.

### Dimensão 2 — a resposta decorável

Sortear o caso não basta. Se o RÓTULO da alternativa certa é sempre o mesmo, a
criança decora o rótulo e vence o nível sem fazer a conta. Não é hipótese:
aconteceu em `GE.04`, onde a esfera estava sempre na rampa, e em `GE.07`, onde a
resposta era sempre "isósceles" em L1.

Aberta com **22 fichas** e fechada na linha 33 com **zero**. O caminho de 22 a
zero passou por uma correção do próprio instrumento (linha 29) que mudou o
veredito nos dois sentidos: `AL.01`, `N1.01`, `N1.02`, `GE.03` e `GM.12` saíram
porque ninguém desenha o rótulo delas, e `N4.12` ENTROU porque eu tinha escrito
à mão que a F71 não renderiza alternativas — e a casca renderizava.

### A dívida que esta frente criou, e o que aconteceu com ela

Cinco das fichas medidas — `GE.04`, `GE.07`, `GE.09`, `GM.11`, `N2.07` — eram
exatamente as que ganharam portão de ação nas linhas 3, 4, 8, 9 e 11. O portão
estava certo e continuava insuficiente: a criança o atravessava seis vezes com o
mesmo item. As cinco foram sorteadas nas linhas 20, 21, 23 e 24. A dívida foi
paga na mesma rodada em que foi registrada.

### O que sortear os casos revelou

Randomizar não foi só variar. Cada contrato aberto mostrou uma invariante que o
caso fixo escondia — e quase sempre um distrator que não descrevia ninguém:

- `GM.07/F63`: os lados de L3 desenhavam um L de área 11 e o spec declarava 8. O
  distrator `CONFUNDE_COM_AREA` não continha a conta que a criança faria.
- `PE.02/F64`: a tabela mostrava 0 para a barra que falta enquanto o enunciado
  afirmava "a tabela diz 7".
- `PE.03/F83`: em L5 o saco de maior chance também tinha mais bolas marcadas.
  Quem ignora o total — o erro que o nível existe para pegar — acertava.
- `PE.04/F95`: o palco desenhava os dois sacos de L2 com números escritos à mão,
  sem olhar o spec; e a tag `TUDO_CINQUENTA` estava no saco errado, porque quem
  acha que tudo é cinquenta por cento responde "iguais", não "Saco A".
- `GE.06/F78`: em L3 o ângulo maior tinha o lado mais comprido, e o nível existe
  para desmentir exatamente isso.
- `GE.10/F92`: em L4 nada garantia cubo escondido; e os rótulos de L3 e L5 se
  autodeclaravam ("Construção que reproduz as três vistas" ao lado de
  "Construção girada"). Ler português vencia a competência.
- `N5.01/F45`: L2 é "sobrepor" para CONFERIR, e as partes encaixavam sempre. Um
  teste que não pode dar negativo não é um teste.
- `N5.03/F73`: os três pares de L1 e L2 eram todos equivalentes. E em L3 a maior
  estava sempre à direita, em L4 sempre à esquerda — decoração POSICIONAL, que a
  varredura de rótulo não vê porque o rótulo traz a fração.
- `N4.12/F71`: com quociente múltiplo de 10 a estimativa inicial virava uma
  segunda resposta certa.

### Três correções de medição, e o que elas custaram ao registro

O gate da CLASS-009 errou nos dois sentidos, e as três correções encolheram o
registro dele em seis entradas — todas artefato da medição, não reparo de app:

1. **Texto colado** (linha 15): `textContent` concatena nós vizinhos sem
   separador. A reta numérica virava `024681012` e `3 × 2` seguido de `6` virava
   `3x26`. `N4.09` saiu; a justificativa antiga racionalizava o artefato.
2. **Fronteira de elemento para todo rótulo** (linha 31): `C1` era detectado
   dentro dos cabeçalhos `a b c 1 2 3` do mapa, que são células separadas.
3. **Fronteira de palavra** (linha 31): `reto` casava dentro de `correto`, apoio
   fixo da F78. Saíram `GE.08`, `GE.10`, `PE.03`, `PE.04` e `N2.06` — e a
   entrada de `N2.06` dizia, com todas as letras, que "paridade" continha "par"
   por acaso de substring. Justificativa que descreve um artefato é medição a
   corrigir, não exceção a manter.

Uma quarta correção foi do lado errado da mesma moeda: o rótulo era normalizado
sem espaços e a tela com eles, então "Saco A" virava "sacoa" e deixava de casar
com o "saco a" escrito ali. Falso negativo tão silencioso quanto o falso
positivo.

E o gate da própria CLASS-003 errou uma vez (linha 25): a digital usava
`JSON.stringify(obj, chaves)`, que FILTRA chaves em vez de ordenar, e o conteúdo
aninhado sumia. A contagem inflou de 16 para 31 competências. Os 13 reparos já
feitos foram reconferidos um a um: todos continuavam justificados.

### O acoplamento que a randomização expõe

Um padrão recorrente, digno de registro porque vai voltar: quase todo contrato
sorteado quebrou um teste que fixava o caso. `VolumePrismasStage`,
`FatoresRetangulosStage`, `poligonosW33`, `conversaoUnidadesW36`,
`divisaoDoisDigitosW43Stage`, `primosDivisoresW42Stage`,
`MultiplicarFracoesStage`, `horasMinutosW35`, `mediaChanceW31`,
`paresImparesW30`, `volumeVistasW41Stage` e `somarFracoesW44Stage`.

Nenhum foi afrouxado. Todos passaram a derivar a expectativa do spec — o que os
torna, de quebra, testes melhores: eles agora afirmam a REGRA, não o exemplo.

## 9. CLASS-008 — o nível integrador coroa uma família só — **FECHADA**

A auditoria confirmou a classe em seis competências e não implementou nada. O
mecanismo de reparo já existia — `evidenciasDistintas` no domínio da micro, e o
`progressEngine` já sabia segurar a evidência da ficha até o mínimo aparecer. O
que faltava era o caminho, e ele quebrava em três lugares distintos:

| elo | o que estava quebrado |
|---|---|
| emissão | ninguém gravava QUAL família a tentativa exercitou. O Composer sorteia a tabuada e a operação e jogava a informação fora; `N1.09` e `GM.02` têm uma variável `family` no builder, e ela morria ali |
| transporte | o serializador genérico do Composer copiava `acertos`, `de` e `sessoes` e deixava `evidenciasDistintas` para trás. Os dois builders autorais faziam o mesmo |
| aplicação | a casca chamava `evidenciasDaResposta(meta)` sem a questão, e a família nunca entrava na tentativa |

A evidência passa a se chamar `familia:<ficha>:<familia>`. O prefixo é por
competência de propósito: com um prefixo global, alternar entre duas
COMPETÊNCIAS satisfaria a diversidade de ambas sem ter alternado dentro de
nenhuma — e há mutação provando isso.

`evidenciasDaResposta` passou a exigir a questão. Deixá-la opcional era o
convite a esquecê-la no único lugar que chama a função, e aí o requisito viaja
até o motor sem nunca receber família nenhuma: a coroa não chegaria nunca, que é
o defeito espelhado do que a classe veio corrigir.

O gate mede as três coisas separadas, porque cada uma quebra sozinha, e decide
participação por COMPORTAMENTO do gerador — quantas famílias distintas ele
produz —, não por lista de nomes. Ele achou sozinho duas testemunhas que a
auditoria não listava por micro: `N4.04` L5 (`fluencia`) e `N4.07` L5
(`completa`), que também misturam tabuadas. Oito níveis integradores no total.

A catraca aperta dos dois lados. Nível que sorteia famílias e não exige
diversidade reprova; exigência que o gerador não consegue satisfazer também —
sem essa metade bastaria escrever a exigência em toda ficha para ficar verde, e
uma exigência impossível é uma coroa que nunca chega.

A prova de aplicação é comportamental, em todos os níveis integradores achados:
acertar de sobra em três sessões espaçadas, sempre na mesma família, não dá a
evidência da ficha; o mesmo esforço alternando famílias dá.

## 10. D068 — o portão medido, e a metade que continua aberta

A frente da CLASS-007 registrou a dívida: não existia gate por descoberta que
medisse, dentro do palco, se a ação probatória é contornável. Quem media era
`portaDeFora.test.tsx`, com **três listas escritas à mão** — quais palcos
desenham, quais têm portão, quais são de produção. Lista positiva decidindo
participação é o que o D068 proíbe.

### O que foi pago

A lista de portões virou medição: o rótulo da resposta está na tela e o clique
nele, no mount, não vende nada. Cada candidato é clicado num render limpo — o
primeiro clique pode desabilitar a tela inteira, e reaproveitar o render diria
que a porta está fechada justamente onde ela acabou de ser usada.

A medição cobrou o preço na hora: **a lista escrita à mão já estava três
entradas atrás.** `AL.03` L3 e `N2.06` L1 e L2 tinham portão e ninguém sabia.

Um segundo gate mede a outra metade do que é mensurável hoje. Onde a ficha
declara `exige.evidencia`, um clique no mount não pode entregar a prova quando
ela depende do que a criança fez. O critério separa condição de ação sem lista
nenhuma:

> evidência que acompanha TODA resposta certa do nível é propriedade do item —
> "comparou sem objetos", "a dimensão é a que falta". Não há o que contornar:
> responder certo ali É a demonstração. Evidência que acompanha algumas e não
> outras depende da ação, e aí um clique que a entregue é a ação sendo comprada.

Nas 88 fichas que declaram a exigência, hoje a evidência é sempre da primeira
espécie. O gate existe para o dia em que deixar de ser.

## 11. Recibos desta rodada

- `tsc --noEmit`: limpo;
- suíte inteira: **3665/3665** em 298 arquivos;
- `npm run auditar`: invariantes canônicos, guard documental, palcos compostos e
  matriz de cobertura aprovados;
- catraca de densidade documental: piso subido a cada arquivo de runtime que
  cruzou o limiar, nunca baixado;
- mutação: cada correção derruba o teste novo quando revertida. Nesta rodada, 5
  em GM.06, 4 no instrumento da CLASS-003, 11 nas fichas de PE, 11 nas de GE, 8
  em AL e GM.09, 9 nas últimas cinco da CLASS-003, 3 no gate da CLASS-010, 7 na
  CLASS-008, 4 no D068, 4 na CLASS-004, 3 na CLASS-001 e 3 na CLASS-002 —
  todas vermelhas.

Quatro mutações precisaram de um gate MELHOR antes de morrer, e elas dizem duas
coisas que valem mais que os reparos:

**Medir o par esconde a metade presa.** Congelar a hora do relógio em GM.06
ficava verde porque o minuto sorteado já fazia o par `hora:minuto` variar; fixar
a coluna do tesouro em GE.05, ou o índice da barra perguntada em PE.02, ficava
verde pelo mesmo motivo. Os três gates passaram a medir cada eixo separado, e a
POSIÇÃO além do nome.

**Registro vazio precisa de prova de vida.** Cegar a contagem do gate da
CLASS-010 passava, porque com registro vazio "ninguém duplica" e "não olhei" dão
o mesmo verde. O mesmo vale para o gate da evidência exigida, e lá a prova de
vida precisou de duas pontas: contar as fichas que declaram não bastava, porque
uma medição que parasse de separar "com prova" de "sem prova" zeraria os dois
lados e passaria calada.

As três sobreviventes antigas continuam nomeadas nos commits: a guarda
redundante de `testar()` em GE.04, o `answerMode` de N4.02 que nenhum
renderizador lê, e `cobraRepeticao` no gate da CLASS-003, que não discrimina
hoje porque toda ficha cobra repetição.

## 12. As três últimas — CLASS-001, CLASS-002 e CLASS-004

### CLASS-004 — viés posicional em comparação

Quando a pergunta é "qual dos dois?", a resposta não é um número: é um LADO. Se
o lado certo é sempre o mesmo, a criança aprende a apontar para lá e o nível
deixa de medir a comparação, mesmo com os objetos comparados mudando.

A varredura de rótulo não via isso, e não por descuido: **o rótulo varia**. Em
`N6.01` L4 a alternativa se chamava "0,5" ou "0,7", conforme o par; em `N5.03`
L3 ela se chamava "3/4 é maior". O que não variava era o `value` — `esquerda`,
`direita` —, que é o que diz para onde o dedo vai.

`N5.03` saiu do viés durante a CLASS-003. Faltava `N6.01` L4, onde os quatro
pares de decimais vinham com o maior sempre à esquerda. O par continua sendo o
que era — o maior é o de menos casas, para que ler "25" como maior que "5" siga
sendo o erro que o nível pega —; o que passa a ser sorteado é de que lado ele
cai.

O detector foi isolado do corpus para ser testado contra casos conhecidos: lado
preso acusa, lado que alterna absolve, número invariável é outra classe, e
rótulo preso junto com o lado é a CLASS-003 e não esta. Duas classes acusando o
mesmo caso dariam dois reparos para um defeito, e o registro de uma delas nunca
esvaziaria.

### CLASS-001 — gerador declara nível sem consumi-lo

Um caso nas 75 fichas: `N4.06` L2 e L3 davam questões idênticas, com a mesma
semente, em todas as sementes testadas.

A causa é fina e vale registrar inteira. O L3 promete *"passar da multiplicação
para a divisão dentro da mesma família"* e nunca entregava uma divisão, porque o
filtro cobrava apoio de TODA candidata — e uma pergunta de divisão não sobra
frase de apoio nenhuma: as outras três contas da família contêm o fator que é a
resposta, e mostrá-las seria escrever o gabarito ao lado da pergunta. Sem
candidata de divisão, o L3 caía sempre no vértice do produto e virava cópia
exata do L2.

Agora o apoio é condição de quem pergunta o PRODUTO. A divisão do L3 aparece sem
apoio, que é justamente o passo que o nível declara.

O gate compara níveis com a MESMA semente, e o par consigo mesmo é o controle:
sem semente fixa, dois sorteios diferentes quase nunca coincidem por acaso, e o
gate ficaria verde para sempre sem medir nada.

### CLASS-002 — conformance ficha ↔ DAG

Quem tranca a porta é o DAG: é dele que `unlockEngine` e `rescuePlanner` leem. O
`prereqs` da ficha é documentação — e documentação que discorda do que o app faz
é pior que documentação ausente, porque convence de uma coisa errada.

Seis fichas discordavam; cinco diziam MENOS do que o DAG cobra — `N3.10`,
`N4.03`, `N4.06`, `N4.07`, `N4.08` — e foram alinhadas.

A sexta é `GM.04`, e ela **não se resolve escrevendo código**. É a `DECISAO-001`:
o YAML reserva os minutos para GM.06, a F55 canônica os inclui, e a ficha TS traz
um micro de avançar 15 minutos. Alinhar ali seria escolher em silêncio qual
autoridade curricular vence e redistribuir escopo entre duas competências. Fica
registrada como pendência de decisão humana, com catraca: no dia em que as duas
concordarem, a entrada reprova pedindo para ser removida.

O NOME não entra na comparação, de propósito: na ficha é o que a criança vê — "O
Mapa do Tesouro" — e no DAG é o rótulo curricular — "Localização em malhas e
mapas". São dois registros da mesma coisa, e igualá-los perderia um dos dois.

### Uma lição de instrumento, de novo

O gate do inventário de portões media uma amostra ao acaso por nível, e o
`vertical` de `N3.09` ora desenhava o rótulo da resposta num botão ora não: o
inventário aparecia e sumia entre execuções. **Inventário que muda sozinho não é
catraca, é ruído.** Com sementes fixas a medição estabilizou e `N3.09` L4 entrou
— o teclado da conta armada tem o dígito da resposta, e tocá-lo sozinho não
envia nada.

## 13. Onde o Gate B′ está agora

| Classe | Estado |
|---|---|
| CLASS-001 (nível declarado e não consumido) | fechada, gate por descoberta com semente fixa |
| CLASS-002 (conformance ficha ↔ DAG) | fechada, exceto a `DECISAO-001/GM.04` |
| CLASS-003 (caso único / resposta decorável) | fechada nas duas dimensões, registros vazios |
| CLASS-004 (viés posicional em comparação) | fechada, detector com controle |
| CLASS-005, CLASS-006 | fechadas antes do Gate B′ |
| CLASS-007 (bypass da ação probatória) | fechada nas testemunhas medidas; inventário de portões medido; falta a ficha declarar a ação probatória |
| CLASS-008 (diversidade de famílias no mastery) | fechada, gate por descoberta e prova comportamental |
| CLASS-009 (a tela declara a resposta) | fechada, com três correções de medição |
| CLASS-010 (resposta comprada duas vezes) | fechada, registro vazio |

Doze gates por descoberta vigiam as 77 fichas do Composer, todos com catraca:

| gate | o que mede |
|---|---|
| `telaNaoDeclaraResposta` | o suporte não escreve a resposta |
| `nivelNaoRepeteOMesmoCaso` | o nível não é um caso só |
| `respostaNaoEDecoravel` | o rótulo certo não é sempre o mesmo |
| `vieseDeLadoNaComparacao` | o lado certo não é sempre o mesmo |
| `nivelDeclaradoEConsumido` | dois níveis não dão a mesma questão |
| `fichaConcordaComODag` | a ficha documenta o que o DAG cobra |
| `respostaNaoSeCompraDuasVezes` | um acerto, um caminho |
| `portaDeFora` | o inventário de portões não encolhe |
| `evidenciaExigidaNaoSeCompra` | a prova não vem junto com o clique |
| `nivelIntegradorExigeFamilias` | quem integra famílias exige mais de uma |
| `aulinhaDeclaradaChegaNaQuestao` | a estreia narrada na ficha chega na tela |
| `acaoProbatoriaDeclaradaTemPortao` | onde a ficha declara prova, a tela tem porta |

### O que continua aberto

Duas coisas, as duas nomeadas e nenhuma delas por falta de trabalho:

1. ~~**`DECISAO-001/GM.04`**~~ — **RESOLVIDA na seção 16.** A GM.04 é a hora
   cheia e a meia hora; os minutos são da GM.06. Decidida medindo as quatro
   autoridades, com caminho de volta escrito na ficha.
2. ~~**A outra metade do D068**~~ — **PAGA na seção 17.** A ficha declara em
   `niveis[n].acaoProbatoria` qual interação é probatória, e o portão
   `acaoProbatoriaDeclaradaTemPortao` cobra que a tela tenha a porta. Quinze
   níveis declaram.

Com as duas resolvidas, **o Gate B′ não tem mais pendência de cânone aberta.**
~~O que resta é trabalho de autoria: as 12 competências ainda sem ficha.~~
**Feito na seção 18 (W53 a W64): as 90 competências do DAG têm ficha.**

---

## 14. W51 — a promoção da N4.02 e a dívida que ela revelou

A N4.02/F98 existia como ficha desde sempre e **nunca fora registrada** em
`COMPOSER_FICHAS`. Não era rollback nem decisão: era ausência. Nenhum dos dez
gates a tinha olhado uma única vez, porque todos varrem o que está registrado.

Registrada, os dez aceitaram. O que a promoção quebrou foi mais interessante
que o que ela consertou:

| o que caiu | por quê | o que foi feito |
|---|---|---|
| `N5.04` nível 3 | registrar a N4.02 deslocou o PRNG e revelou `6/7 − 3/7 = 3/7`, com a resposta escrita como operando | reparo na fonte: `somaFracoesContract` recusa o caso em que `a − b === b` |
| `portaDeFora` | o portão de giro da N4.02 (`N4.02\|3`) entrou no inventário medido | registrado no inventário, junto com o `N3.09\|4` que três sementes fixas estabilizaram |
| `composerCanary.test.ts` | o teste fixava `"N4.02"` como exemplo de nó **sem** ficha | reescrito por descoberta: pergunta ao catálogo quem não tem ficha, mais um id sintético para nunca ficar cego |
| `visualOnboardingGate` | a N4.02 estreia o ArrayGrid e a ficha não declarava tutorial: **dívida nova de onboarding** | dívida paga, não anistiada — ver abaixo |

### A dívida de onboarding foi paga, não anistiada

O `visualOnboardingGate` diz no próprio comentário que a lista NÃO existe para
anistiar onboarding ausente. Acrescentar `"N4.02"` à baseline seria usar a
allowlist para exatamente o que ela proíbe. A N4.02 estreia o ArrayGrid — é a
primeira vez, em toda a linhagem dela, que a criança vê quadradinhos arrumados
em linhas — e agora a micro `contagem` declara a aulinha da estreia.

A fala não promete gesto que a tela não tem: no `ArrayGrid` os quadradinhos são
`aria-hidden` e não recebem toque, quem responde são os botões de baixo. Dizer
"toque nos quadradinhos" ensinaria a criança a tentar o que não funciona.

### O décimo primeiro gate — `aulinhaDeclaradaChegaNaQuestao`

Pagar a dívida expôs um buraco no próprio mecanismo do §6.36: o portão de
onboarding pergunta à **ficha** se ela declara tutorial, e a ficha é dado. Entre
o dado e a criança existem dois pontos de perda silenciosa:

1. `parseComposerParams` copia chave por chave — chave não listada é descartada
   sem erro (foi assim que a F27 declarou `modo: "ritmico"` e o canhão de balões
   saiu como peixinhos na tela);
2. `normalizeFichaTutorial` descarta passo sem `say`/`fala` de texto — escrever
   `{ texto: "..." }` por engano não quebra nada, o passo só não existe.

Nos dois casos a Coverage Matrix continuaria dizendo `onboarding=presente` e a
criança continuaria estreando a ferramenta sozinha: o portão ficaria verde
medindo intenção, não entrega.

A medição varreu as 76 fichas registradas: **147 pares (ficha, nível) declaram
aulinha e os 147 chegam intactos** em `tutorialSteps()`, que é a função que o
GameLoop chama para narrar. O gate fecha em zero defeitos, por descoberta —
promover uma ficha a coloca sob ele no mesmo instante, sem editar o arquivo.

Prova de vida: com a varredura cega, "ninguém perde passo" e "eu não olhei" são
a mesma tela verde. O teste afirma ter observado mais de 100 pares.

Mutação (quatro, todas vermelhas):

| mutação | resultado |
|---|---|
| `Composer` deixa de repassar `tutorial` | VERMELHO |
| `parseComposerParams` descarta a chave `tutorial` | VERMELHO |
| varredura cega (nenhum par observado) | VERMELHO — pela prova de vida |
| N4.02 volta a estrear o ArrayGrid sem aulinha | VERMELHO nos **dois** portões |

Recibo: suíte inteira **301 arquivos, 3694 testes, verde**; `tsc --noEmit`
limpo; `npm run auditar` aprovado; `grafo:check` sincronizado.

Coverage Matrix reconciliada: Composer 76, legado 14, fallback 0, servido 90,
divergências 11.

> Uma nota sobre o delta da migração `W51-N4.02`. Escrevi `divergences: -1` de
> primeira; a Matrix real mostrou 11 divergências e a N4.02 nunca esteve entre
> elas. Corrigi **o livro-razão, não a expectativa** — a mensagem do próprio
> teste manda investigar e reconciliar a fonte real em vez de ajustar o número
> até ficar verde.

## 15. W52 — a N3.11 e o degrau que só existia no papel

Mesma história da N4.02: ficha completa — cinco micros, aulinha da troca
declarada, distratores nomeados — nunca registrada em `COMPOSER_FICHAS`, nunca
vista por portão nenhum.

Registrada, a CLASS-001 acusou no primeiro sopro: **L1 e L2 declaravam params
idênticos byte a byte**. O único campo que os separava era o `andaime` —
`mao_fantasma` no L1, `alto` no L2 — e `andaime` é prosa da ficha: nenhuma
primitiva `vertical` lê esse campo. A criança subia de degrau e a tela não
mudava; o nível que ela "venceu" não mediu o que prometia medir.

O reparo não foi inventado: veio da **N3.09**, a ficha irmã que já atravessou
todos os portões. A escada CPA dela diz onde mora a diferença — no L1 o
algoritmo escrito fica escondido (`show_algorithm: false`) e só o material
conta a troca; do L2 em diante o registro escrito aparece ao lado do material,
e é isso que a criança passa a ligar. O L2 da N3.11 deixou de esconder o
algoritmo. Os onze portões aceitaram.

### Dois testes que morreram de velhice, não de defeito

A promoção matou duas afirmações escritas à mão, as duas do mesmo gênero:

| afirmação | por que morreu | o que ficou no lugar |
|---|---|---|
| `expect(COMPOSER_CANARIES.has("N3.11")).toBe(false)` | a N3.11 foi promovida | pergunta ao catálogo quem está fora do conjunto e exige `legacy` de quem tem legado próprio, `fallback` de quem nunca teve |
| `curriculumLegacy`: "usa N3.09 como único canário e preserva N3.11 no legado" | idem | a propriedade que não envelhece: **enquanto um nó estiver no legado, produção entrega exatamente o que o gerador legado dele entrega** |

`geradorLegadoDe()` já existia justamente para isso — descobrir o legado em vez
de declarar o nome dele. Um teste que nomeia o estado atual do catálogo morre em
toda promoção legítima, e ensina quem lê a "consertar" o teste sem pensar.

### O que a varredura dos treze legados achou de brinde

A versão antiga do teste de paridade fixava `Math.random` numa **constante**
(`0.4242`) e funcionava porque olhava um nó só. Varrendo os treze, trava: o
`numOpts` do `generatorsF1` sorteia distratores num `while` até juntar três
distintos, e com fonte constante o mesmo valor sai para sempre.

Com RNG de verdade o laço termina com probabilidade 1 — **não é travamento de
produção**, e por isso o `numOpts` legado não foi reescrito nesta rodada; é
hazard registrado, não defeito servido. O que mudou foi a ferramenta do teste:
semente LCG em sequência, o mesmo idioma dos outros portões, três sementes.

Mutação (três, todas vermelhas):

| mutação | resultado |
|---|---|
| a ponte troca o legado pelo fallback | VERMELHO |
| varredura cega (nenhum legado observado) | VERMELHO — pela prova de vida |
| N3.11 volta a ter L1 e L2 idênticos | VERMELHO na CLASS-001 |

Recibo: suíte inteira **301 arquivos, 3708 testes, verde**; `tsc --noEmit`
limpo; `npm run auditar` aprovado; `grafo:check` sincronizado.

Matrix reconciliada: **Composer 77, legado 13**, fallback 0, servido 90,
divergências 11.

## 16. DECISAO-001 — RESOLVIDA: a GM.04 é a hora, a GM.06 são os minutos

A decisão estava registrada como `PENDENTE-DE-DECISÃO-HUMANA` desde o Lote 6, e
o dono delegou a escolha. Ela foi tomada **medindo as quatro autoridades**, não
escolhendo uma por preferência.

| autoridade | escopo da GM.04 | faixa | pré-req |
|---|---|---|---|
| DAG (`grafo_saga`) | "Horas (ponteiros e digital)" | F1 | `[N1.06]` |
| `curriculum/GM.yaml` | "horas exatas e meia hora"; nota explícita: *ler minutos exige contagem de 5 em 5 — por isso fica para GM.06* | F1 | `[N1.06]` |
| ficha canônica F55 | 5 níveis: hora exata → meia hora → **quartos** → **5 em 5** → produzir | F1 | `[N1.06]` |
| ficha TS viva, antes | horas exatas + **avançar 15 minutos** | **F2** | **`[N2.01, AL.01]`** |

### Decisão

**A GM.04 é a hora cheia e a meia hora, F1, pré-req `[N1.06]`. Os minutos —
quartos em diante — são da GM.06.**

Quatro razões, todas verificáveis em código hoje:

1. **O DAG é a autoridade operante.** É dele que `unlockEngine` e
   `rescuePlanner` leem os pré-requisitos — é o DAG que tranca a porta. A
   `prereqs` da ficha é documentação, e o próprio portão CLASS-002 diz isso.

2. **A F55 se contradiz, e a contradição aponta a saída.** O nível 4 dela diz
   "usa contagem por saltos (AL.03)" — pré-requisito que o bloco de identidade
   da própria F55 não lista. Uma GM.04 em F1 com `[N1.06]` ensinando 5 em 5
   cobraria da criança um salto que o DAG só concede na GM.06.

3. **O app já se comporta assim.** O `gGM_04`, que serve esta competência em
   produção, tem cinco níveis e nenhum sai da hora cheia e da meia hora: L1
   hora cheia, L2 meia hora, L3 mistura, L4 problema de horas inteiras, L5 em
   palavras ("três e meia"). O micro invasor **não servia criança nenhuma** —
   era prosa divergindo do que roda.

4. **A GM.06 já entrega o resto, e testada.** A F62, promovida na W35 e
   aprovada pelos onze portões, tem exatamente a escada da F55 do nível 3 em
   diante: quartos (15/30/45) → 5 em 5 → minuto a minuto → duração.

A F55 não foi descartada. Recebeu **nota normativa** dizendo onde cada degrau
mora: níveis 1–2 na GM.04, níveis 3–5 na GM.06. A escada é a mesma; o que a
decisão resolve é onde ela é servida.

### Ordem de execução — a que o diagnóstico do Lote 6 tinha registrado

O diagnóstico antigo avisava: *"não executar metadata isoladamente: isso
produziria uma ficha F1 com prereq de numerais ainda ensinando frações de 15
minutos"*. A ordem foi obedecida:

1. escopo primeiro — o micro `b` deixou de ser "avançar 15 minutos" e passou a
   ser "ler a meia hora, quando o ponteiro das horas fica entre dois números";
2. **só então** faixa `F1` e pré-req `[N1.06]`;
3. conferido que a GM.06 cobre o micro removido — o L1 dela sorteia entre
   `15, 30, 45`, que são os quartos.

O `nome` também mudou: "Relógio: Horas e Minutos" prometia à criança minutos
que a competência não ensina mais. Agora é "Relógio: a Hora e a Meia Hora".

### Como reverter

Está escrito no cabeçalho da própria `GM.04.ts`, perto de quem for mexer nela:
editar o **DAG primeiro** (GM.04 vira F2 e ganha AL.03), só então a ficha e a
nota do YAML, e por último retirar da GM.06 o que subiu — senão as duas ensinam
a mesma escada, e a GM.06 é servida pelo Composer sob onze portões.

### A CLASS-002 fecha em zero

`PENDENTE_DE_DECISAO_HUMANA` agora é `{}`. A catraca dos dois lados foi
mutada e reprova nas duas direções:

| mutação | resultado |
|---|---|
| GM.04 volta a divergir do DAG nos prereqs | VERMELHO |
| o registro volta a listar GM.04 já resolvida | VERMELHO — a catraca pede a remoção |

Recibo: suíte inteira **301 arquivos, 3708 testes, verde**; `tsc --noEmit`
limpo; `npm run auditar` aprovado, guard documental canônico incluído.

### O que continua aberto, sem eufemismo

Os dois gates descobrem onde EXISTE portão. Nenhum descobre onde DEVERIA
existir. Para isso a ficha precisaria declarar, de forma legível por máquina,
qual interação ela trata como probatória — e `exige.evidencia`, que é o que mais
se aproxima, significa outra coisa, como a medição acima mostra.

Declarar a ação probatória é decisão de cânone e não se toma por conta própria.
Até lá, a catraca do inventário é o que impede um portão de sumir sem que
alguém seja avisado.

---

## 17. D068 — a outra metade paga: a ficha declara a ação probatória

A dívida estava escrita no fim do `portaDeFora.test.tsx`, sem eufemismo: *"o
inventário descobre onde EXISTE portão. Ele não descobre onde DEVERIA existir:
para isso seria preciso a ficha declarar, de forma legível por máquina, qual
interação ela trata como probatória."* Era a segunda decisão de cânone
delegada, e foi tomada.

### O campo

`niveis[n].acaoProbatoria = { id, porque }` em `FichaNivel`:

- **`id`** — a ação em uma palavra: `girar`, `construir`, `transformar`,
  `conferir`, `experimentar`, `formar-duplas`;
- **`porque`** — por que responder sem executá-la não demonstra o que o nível
  ensina. Não é ornamento: o portão cobra mais de 40 caracteres, porque
  "porque sim" não é cânone.

`dominio.exige.evidencia` foi considerado e recusado com medição, não com
opinião: nas 88 fichas que o declaram, a evidência acompanha **toda** resposta
certa do nível. É condição do item ("comparou sem objetos"), não ação a
executar. Os dois campos falam de coisas diferentes e precisavam de nomes
diferentes.

### O portão que torna a declaração vinculante

`acaoProbatoriaDeclaradaTemPortao.test.tsx` inverte a direção da prova: **a
ficha promete a porta, a medição cobra que a porta exista.** Para cada nível
que declara, em três sementes fixas: o rótulo da resposta está na tela e
nenhum clique nele, no mount, entrega o acerto.

Quinze níveis declaram hoje, todos com a ação medida no palco antes de ser
escrita na ficha:

| ficha | níveis | ação | o que a tela exige |
|---|---|---|---|
| `GE.04` | 3, 4 | `experimentar` | prever e então rodar o teste na rampa / no empilhamento |
| `GE.07` | 1–5 | `conferir` | conferir cada figura contra cada critério |
| `GE.09` | 1, 3, 5 | `transformar` | montar as cópias, cortar e encaixar, rearranjar os setores |
| `GM.11` | 1, 2, 3, 5 | `construir` | encher o prisma, construir as camadas |
| `N2.06` | 1, 2 | `formar-duplas` | formar as duplas antes de dizer par ou ímpar |
| `N4.02` | 3 | `girar` | girar o arranjo antes de responder |

### O que NÃO foi cobrado, e por quê

A recíproca — todo portão medido tem de estar declarado — **mentiria**, e a
medição mostra por quê. Os pares do inventário são de três espécies, e o
clique sozinho não as separa:

| espécie | exemplo medido | como se apresenta no mount |
|---|---|---|
| a barra recusa até a ação | `GE.09`, `GM.11`, `GE.07`, `N2.06`, `N4.02` | botão da resposta **desabilitado** |
| o clique existe, mas significa outra coisa | `GE.04` | botão **habilitado**: o toque é a previsão, o experimento vem depois |
| o rótulo caiu fora do caminho de resposta | `AL.03\|3`, `N3.09\|4` | marca de reta, dígito de teclado — coincidência de texto |

Uma regra por "desabilitado no mount" acusaria a `AL.03` (marca de reta
desabilitada, e não há prova nenhuma a fazer ali) e perderia a `GE.04` (portão
real, botão habilitado). Erraria nas duas direções. E forçar declaração na
terceira espécie escreveria no cânone uma prova que a criança não precisa
fazer — pior que não declarar nada.

Então a recíproca fica com o inventário de `portaDeFora`, catraca nos dois
sentidos sobre o que É medido; e o portão novo cobra o que é DECLARADO. Juntos:
nenhum portão some sem aviso, e nenhuma promessa de ficha fica sem porta.

### Mutação

| mutação | resultado |
|---|---|
| `CirculoAreas` para de exigir a transformação | VERMELHO |
| declara prova num nível sem portão (`N2.06` L3) | VERMELHO — **é a metade nova funcionando** |
| varredura cega (nenhuma declaração lida) | VERMELHO — pela prova de vida |
| `ArrayGrid` deixa de exigir o giro | VERMELHO |

> Nota de método sobre a última. Duas tentativas anteriores ficaram **verdes** e
> não por cegueira: o `ArrayGrid` tranca a porta em dois lugares independentes —
> o `disabled` do botão e a guarda dentro do `choose`. Remover um deixava o
> outro segurando. Só a mutação na fonte única (`requireRotate`) abre as duas e
> o portão acusa. Mutação que sobrevive nem sempre é gate cego; às vezes é
> defesa em profundidade, e vale distinguir os dois casos antes de "consertar"
> um teste que está certo.

### O que continua aberto depois desta

Nada de cânone. O mecanismo existe, é cobrado, e vale automaticamente para
qualquer ficha nova que declare. Usar o campo numa ficha que precisa dele
passou a ser **disciplina de autoria**, não lacuna de mecanismo — e uma ficha
que declara e não entrega agora fica vermelha sozinha.

Recibo: suíte inteira **302 arquivos, 3710 testes, verde**; `tsc --noEmit`
limpo; `npm run auditar` aprovado; `grafo:check` sincronizado.

---

## 18. As doze que não tinham ficha — W53 a W64

Quando as duas decisões de cânone fecharam, o que restava não era mecanismo:
era autoria. Doze competências do DAG tinham gerador legado servindo criança e
**nenhuma ficha autoral** — logo, nenhuma delas jamais passara por portão
algum, porque todos os portões varrem o que está registrado.

As doze foram escritas na ordem topológica do DAG, transcrevendo as fichas
canônicas que já existiam nos documentos de pedagogia. Nenhuma foi inventada:
todas as doze tinham F-ficha escrita, e o trabalho foi levá-las a contrato,
palco, registro e portão.

| onda | competência | ficha | o que ela traz de novo |
|---|---|---|---|
| W53 | `N3.04` | F31 Voltar Contando | os dois caminhos da subtração; escolher é a competência |
| W54 | `N3.06` | F32 Dobros e Quase-Dobros | usar um fato sabido para descobrir outro |
| W55 | `N3.07` | F33 Fazer Dez | onde os amigos do dez viram ferramenta |
| W56 | `N3.05` | F16 Família de Fatos | um trio, quatro contas |
| W57 | `N3.08` | F34 Voltar pelo Dez | o espelho da F33, cruzando a dezena |
| W58 | `PE.01` | F56 O Contador de Animais | o começo da estatística: ler dado de outra pessoa |
| W59 | `GM.03` | F53 O Tesouro do Pirata | **primitiva nova `Moedas`**: valor não se lê no objeto |
| W60 | `N2.04` | F37 A Centena | a dezena um nível acima, no mesmo material |
| W61 | `N4.05` | F99 Repartir e Medir | os dois rostos da divisão, no mesmo componente |
| W62 | `N2.05` | F65 Números Grandes | arredondar como decisão de precisão |
| W63 | `N3.12` | F40 A Dezena Desmonta | perceber a falta antes de agir |
| W64 | `N3.13` | F41 Cálculo Mental | estimativa como mecanismo de autocorreção |

**Resultado: as 90 competências do DAG têm ficha.** A Matrix fecha em Composer
89, legado 1 — só a `GM.04` segue no legado, e por decisão registrada, não por
esquecimento.

### O que os portões cobraram antes de cada promoção

Nenhuma das doze entrou limpa. A lista abaixo é o que a medição pegou **antes**
de a ficha servir criança, e é o argumento mais forte que este checkpoint tem
para a existência dos portões:

| ficha | o que caiu | o que era |
|---|---|---|
| `N3.04` | o L1 perguntava "qual caminho é mais curto?" sem oferecer caminho | enunciado mentindo sobre o próprio nível |
| `N3.04` | L3, L4 e L5 sorteavam totais abaixo de dez | o degrau de alcance existia só no papel |
| `N3.04` | CLASS-009 acusou **GE.04 L3** | defeito ANTERIOR, exposto pelo deslocamento do PRNG: o enunciado perguntava "o {sólido} rola na rampa?" com "rola" na barra logo abaixo |
| `N3.06` | com âncora 1, o L1 ficava com duas alternativas | cara ou coroa não mede nada |
| `N3.07` | o L4 mandava fechar uma caixa que não estava na tela | apontar para o que não existe |
| `N3.05` | o apoio escrevia o vértice oculto — `3 − 1 = ?` ao lado de `1 + 2 = ?` | CLASS-009 pela porta dos fundos |
| `N3.08` | com total 19 ou 20 não havia unidade solta a tirar | a decomposição da ficha não existia naquele caso |
| `N3.08` | evidência de família emitida em níveis sem escolha | afirmar estratégia que a criança não escolheu |
| `PE.01` | duas linhas podiam empatar | "leu a linha errada" deixava de ser diagnosticável |
| `GM.03` | o mapa declarava `Moedas` apontando para decoração do mascote | contradição escrita em três lugares ao mesmo tempo |
| `N2.04` | as três ordens podiam repetir dígito | "leu a ordem errada" coincidia com a resposta |
| `N2.05` | erros de arredondamento se cancelavam: `62+68` estima 130 e vale 130 | a falha intermitente, identificada e fechada |
| `N3.12` | inverter as unidades dava exatamente o minuendo | um número com dois significados não diagnostica nenhum |
| `N3.13` | desvio negativo derrubava a alternativa certa | **a CLASS-006 disse "perdeu o gabarito durante a serialização"** |

### A falha intermitente, e por que ela não era flake

Uma execução da suíte acusou um teste falhando e a saída foi truncada antes de
nomeá-lo; duas execuções seguintes ficaram verdes. Ficou registrado como tarefa
em vez de ser chamado de flake — e a decisão se pagou: era a `N2.05` L5, onde
os dois arredondamentos se cancelam e a estimativa dá o exato. Dependia do
sorteio, aparecia em menos de meio por cento dos casos, e o teste nominal da
própria ficha foi quem a pegou. O mesmo cancelamento existia na `N3.13` e foi
fechado junto.

### Duas primitivas de composição que não existiam

- **`Moedas`** (W59) — nenhuma primitiva servia: dinheiro não é quantidade
  contínua, nem agrupamento posicional, nem coleção homogênea. Os diâmetros
  seguem o dinheiro real, que **não** é a ordem dos valores: a de 25 é maior
  que a de 50. Desenhá-las iguais faria o erro sumir da tela; proporcionais ao
  valor, a tela ENSINARIA o erro.
- Com ela, o repositório ficou **sem nenhuma primitiva pela metade**: 26 de 26
  executáveis, e `PRIMITIVAS_PENDENTES` vazio — dívida paga, não apagada.

### Cinco palcos compostos novos

`dobros-f32` (ArrayGrid + TenFrame), `voltar-pelo-dez-f34` (TenFrame +
InteractiveNumberLine), `centena-f37` (MaterialDourado + Quadrado100),
`numeros-grandes-f65` (InteractiveNumberLine + Quadrado100) e
`dezena-desmonta-f40` (InteractiveVertical + MaterialDourado), todos
registrados no auditor de palcos compostos, que cobra os imports de verdade.

Recibo final: suíte inteira **314 arquivos, 3949 testes, verde em duas
execuções seguidas**; `tsc --noEmit` limpo; `npm run auditar` aprovado;
`grafo:check` sincronizado.

