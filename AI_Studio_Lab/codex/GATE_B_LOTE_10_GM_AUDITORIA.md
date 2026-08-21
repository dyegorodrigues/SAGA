# Gate B — Lote 10 — GM — auditoria Child-Ready

Data: 2026-08-20  
Modo: **AUDIT-ONLY**  
Âncora de entrada: `41d4233d7b5e06639b0e626684f695708d581966`  
Escopo: `GM.01–GM.12`

## 0. Veredito

**GM AUDITADO: 12/12 competências. Proveniência atual: 10 Composer / 2 legado / 0 fallback. Seis candidatas individuais CODIGO novas (`GAP-052–GAP-057`), `GAP-051` absorvido pela CLASS-008, seis ampliações de CLASS-003 e duas testemunhas CLASS-007 já dimensionadas. Nenhuma correção.**

`DECISAO-001/GM.04` permanece `PENDENTE-DE-DECISÃO-HUMANA`; esta auditoria não escolhe silenciosamente uma das autoridades divergentes.

## 1. Resultado por competência

| ID | Resultado do lote |
|---|---|
| GM.01 | sem candidata nova; ação de comparação/seriação é autoritativa e evidência de diferença pequena está costurada |
| GM.02 | CLASS-008; `GAP-051` absorvido |
| GM.03 | `GAP-052` + `GAP-053` |
| GM.04 | `DECISAO-001` preservada; sem nova numeração |
| GM.05 | sem candidata nova; régua/medição é contraexemplo CLASS-007 |
| GM.06 | `GAP-054` + membro CLASS-003 |
| GM.07 | `GAP-055` + membro CLASS-003 |
| GM.08 | membro CLASS-003; sem candidata individual adicional |
| GM.09 | `GAP-056` + membro CLASS-003 |
| GM.10 | `GAP-057` + membro CLASS-003 |
| GM.11 | membro CLASS-003 + testemunha CLASS-007 já registrada |
| GM.12 | testemunha CLASS-007 já registrada |

## 2. CLASS-003 — ampliação GM

Os contratos especializados abaixo usam um corpus canônico determinístico por nível enquanto o mastery exige repetição em sessões. Isso amplia a classe já existente “caso único por nível sob mastery repetida”, sem criar GAP individual só por essa causa:

- GM.06/F62;
- GM.07/F63;
- GM.08/F81;
- GM.09/F82;
- GM.10/F93;
- GM.11/F94.

## 3. CLASS-007 — membros GM já medidos

A varredura global anterior já registrou:

- GM.11/F94: construir cubos/camadas é executável, mas não condiciona a resposta que compra mastery;
- GM.12/F50: despejar/verificar é executável, mas `CASO_CONTRAINTUITIVO` pode ser emitido sem que `verificou` participe da condição.

Não nascem GAPs duplicados por essa causa.

## 4. CLASS-008 — GM.02 e GAP-051

GM.02 L5 sorteia entre quatro famílias — partes do dia, relativos temporais, semana e ordem de eventos — sob `4/5 × 2 sessões`, sem diversidade por família. `GAP-051` fica registrado e absorvido pela CLASS-008; não conta como candidata individual ativa.

## 5. Candidatas individuais GM

Todas ficam `HIPÓTESE-A-PROVAR`, via `CODIGO`, sem correção no Gate B.

### GAP-052 — GM.03/F53 — composição de dinheiro prescrita não existe no runtime

Tipos: `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO` / `INTERAÇÃO-AUSENTE` / `REPRESENTAÇÃO-AUSENTE`.

F53 prescreve níveis de composição de valor, com zona em que a criança monta valores usando moedas e mastery incluindo ao menos um caso de composição. O gerador legado `gGM_03` oferece reconhecimento/cálculo por alternativas e não materializa a composição física autoral.

Provar/refutar no Gate B′: demonstrar uma ação executável de montar o valor que alimente a resposta/evidência, ou materializar a primitiva de dinheiro correspondente.

### GAP-053 — GM.03/F54 — troco está fora da escada executável

Tipos: `CONCEITO-AUSENTE` / `MICRONÍVEL-AUSENTE` / `INTERAÇÃO-AUSENTE`.

F54 é a continuação autoral de GM.03: contar para cima do preço ao pago, montar troco com moedas e verificar troco. O gerador legado GM.03 não contém essa família; nenhum de seus cinco níveis implementa a escada F54.

Provar/refutar: costurar F54 ao contrato executável e provar o domínio que inclui montagem de troco, sem confundir essa frente com simples reconhecimento de dinheiro.

### GAP-054 — GM.06/F62 — o próprio suporte revela a resposta

Tipos: `VAZAMENTO-DE-RESPOSTA` / `RESOLUÇÃO-DIVERGENTE`.

Nos níveis de leitura, o builder formula perguntas como “O ponteiro grande marca 25 minutos. Quantos minutos são?”, serializando o gabarito na própria pergunta. O palco também apresenta horário/target na reta; no nível de duração mostra a faixa até o resultado e escreve a decomposição `60 min + 15 min = 75 min` antes da decisão.

Provar/refutar: separar informação do estímulo da conclusão avaliada; o suporte pode ensinar a leitura sem escrever previamente a resposta pedida.

### GAP-055 — GM.07/F63 — percurso do perímetro declarado é apenas estático

Tipos: `REPRESENTAÇÃO-AUSENTE` / `CONTEÚDO-SÓ-EXPLICADO` / `RESOLUÇÃO-DIVERGENTE`.

O cânone trata o percurso do personagem pela borda, segmento a segmento, como a representação que dá sentido a perímetro. No palco atual, `ArrayGrid` é display `disabled`, `ShapeCanvas` é estático e a criança conclui por alternativas; o percurso contado/animado não é materializado.

Provar/refutar: tornar observável o percurso da borda — sem transformar precisão motora em pré-requisito — ou retificar o contrato se a intenção curricular tiver mudado.

### GAP-056 — GM.09/F82 — equivalência da conversão é exibida antes da resposta

Tipo: `VAZAMENTO-DE-RESPOSTA`.

`ProblemasMedidaStage` mostra no cabeçalho a igualdade `valor origem = valor convertido` antes da resposta. Nos níveis iniciais isso é exatamente o que a pergunta solicita, por exemplo converter metros para centímetros. A balança e a referência repetem a equivalência.

Provar/refutar: preservar a visualização “mesma quantidade, outra unidade” sem imprimir o valor-alvo antes de a criança produzi-lo.

### GAP-057 — GM.10/F93 — conversão completa aparece pronta no palco

Tipo: `VAZAMENTO-DE-RESPOSTA`.

`ConversaoUnidadesStage` imprime `origem = destino` com o valor convertido no cabeçalho, repete os dois lados na balança e volta a expor o destino na escala. A alternativa correta pode ser lida diretamente do próprio suporte em vez de derivada.

Provar/refutar: fazer a representação mostrar equivalência de escala sem serializar a conversão-alvo antes da tentativa.

## 6. GM.04 — DECISAO-001 preservada

As autoridades atuais continuam divergentes:

- `curriculum/GM.yaml`: GM.04 cobre horas exatas/meia hora e reserva minutos para GM.06;
- F55 canônica: horas exatas → meia hora → quartos → 5 em 5 → produção por ponteiros;
- ficha TS GM.04: contém micro de avançar 15 minutos e metadata/prereqs divergentes;
- gerador legado: horas exatas, meia hora, mistura, avanço por horas inteiras e leitura em palavras.

A auditoria registra o fato e **não escolhe** qual autoridade curricular deve vencer. A decisão humana continua pré-condição para eventual reparo de código.

## 7. Medição do lote

- competências: **12/12**;
- proveniência: **10 Composer / 2 legado / 0 fallback**;
- novas candidatas individuais ativas: **6**, todas CODIGO;
- item numerado absorvido: **GAP-051**, CLASS-008;
- ampliações CLASS-003: **6**;
- testemunhas CLASS-007 já conhecidas: **2**;
- nova classe descoberta dentro do lote: **CLASS-008**, dimensionada separadamente;
- correções: **0**.
