# Gate B — dimensionamento global da CLASS-007

Data: 2026-08-20  
Modo: **AUDIT-ONLY**  
Âncora de entrada: `173af7445613043b45536be4f57df1d7c460ceaf`  
PR: #35 · branch `codex/fechamento-curricular`

## 0. Veredito

**CLASS-007 DIMENSIONADA: 90/90 competências varridas; 7/90 = 7,78% são testemunhas atuais; 83/90 = 92,22% não são testemunhas. Nenhuma correção foi executada.**

A classe continua sendo um achado estrutural `CONFIRMADO-ATUAL`, via `CODIGO`, agora com inventário global medido. O dimensionamento não transforma cada membro em GAP individual quando a causa é a mesma classe.

Definição operacional:

> existe uma ação/interação conceitual que a ficha/contrato trata como probatória ou integrante da resolução, essa ação está visível e executável no runtime, mas a criança pode ignorá-la e ainda satisfazer a condição que envia a resposta/evidência capaz de comprar mastery.

Não entram na classe:

1. representação meramente estática;
2. primitiva com `disabled` literal usada como exibição;
3. ação canônica que está completamente ausente do runtime — isso pode ser GAP individual, mas não bypass de uma ação executável;
4. ação cuja própria conclusão alimenta `onAnswer`/evidência/mastery;
5. callback no-op de lifecycle/navegação sem affordance avaliativo, como `JourneyScene/onDone`.

## 1. Pré-condição — recibo final do Lote 9

O SHA documental `173af7445613043b45536be4f57df1d7c460ceaf` foi fechado antes desta varredura com recibos próprios:

- CI #1547 / run `32383809166` — `completed/success`;
- Certificação transversal #283 / run `32383809084` — `completed/success`, 9/9.

O recibo foi registrado na Issue #48 sem criar novo commit e sem reaproveitar certificação anterior.

## 2. Método R1–R4

### R1 — MEDIR, NÃO LER

Universo fixado pelo DAG/roadmap: 90 competências ativas. Para cada ID foi confrontado o ato que a ficha/cânone trata como prova/ação conceitual com o caminho que efetivamente chama `onAnswer`, produz evidência e pode satisfazer mastery. A unidade de prevalência é **competência**, não ocorrência de callback nem componente React.

### R2 — VARRER AS 90

A classificação abaixo contém todas as 90 competências. Um achado local só foi dimensionado depois de percorrer todos os domínios N1, N2, N3, N4, N5, N6, N7, AL, GE, GM e PE.

### R3 — SEM LISTA DE INCLUSÃO COMO GATE

A lista de sete membros abaixo é **resultado da medição**, não mecanismo de detecção. Nenhum gate de produção foi criado e nenhuma allowlist positiva foi introduzida.

### R4 — O MÉTODO TAMBÉM PODE ERRAR

O critério foi testado contra falsos positivos e contraexemplos:

- no-op com `disabled` literal em grids de exibição não entra;
- `JourneyScene/onDone` não entra porque não é affordance de resposta;
- `GE.10/F92` não entra: reconstrução/desenho é autoritativa;
- `GM.05/F61` não entra: medir/alinha/estimar condiciona as fases relevantes e há evidência `ALINHOU_ZERO` no nível que a exige;
- ausência de produção em AL.07 ou PE.02 não entra: a ação canônica não está executável para ser bypassada.

Nenhum gate novo foi tocado; portanto mutação de gate = **N/A**.

## 3. Resultado global

- universo: **90/90 competências**;
- testemunhas CLASS-007: **7/90 = 7,78%**;
- não testemunhas: **83/90 = 92,22%**;
- sub-forma A — primitiva habilitada + callback de resposta morto: **2 competências** (`N2.07`, `GE.07`);
- sub-forma B — ação executável/estado auxiliar não condiciona a resposta/evidência de mastery: **5 competências** (`N4.02`, `GE.04`, `GE.09`, `GM.11`, `GM.12`);
- correções Gate B: **0**.

### 3.1 Inventário medido das sete testemunhas

| Competência | Ficha | Sub-forma | Medição/causa objetiva |
|---|---|---|---|
| N2.07 | F66 | callback morto | `ArrayGrid` fica habilitado e recebe `onAnswer={() => undefined}`; “sobrou/retângulo completo” é calculado, mas mastery vem de botões separados. |
| N4.02 | F98 | ação opcional | giro existe no runtime legado, porém a resposta correta continua sendo a expressão da orientação inicial; girar não é requisito para concluir. |
| GE.04 | F59 | ação opcional | experimento L3–L4 altera `testeFeito`, mas alternativas permanecem respondíveis sem o teste. |
| GE.07 | F79 | callback morto | `DragGroup` está habilitado, porém seu `onAnswer` é no-op; os botões separados compram a resposta em L1–L5. |
| GE.09 | F91 | ação opcional | transformação em L1/L3/L5 é executável, mas não condiciona a decisão que conclui a questão. |
| GM.11 | F94 | ação opcional | “Adicionar cubinho/camada” altera a construção 3D, mas as alternativas podem ser respondidas antes; `responder()` produz evidência/mastery sem testar quantidade de cubos/camadas construída. |
| GM.12 | F50 | ação opcional | em capacidade, “🫗 Despejar e comparar” é executável; `evidenciasDe()` concede `CASO_CONTRAINTUITIVO` por `acertou && contraintuitivo` e não consulta `verificou`. |

### 3.2 Confirmação da entrada externa N2.07

A hipótese externa foi confirmada na fonte atual. `FatoresRetangulosStage.tsx` declara a grade como “superfície física”, renderiza `ArrayGrid` com `onAnswer={() => undefined}` e `disabled={Boolean(disabled)}`; no fluxo normal, portanto, a primitiva está habilitada. O palco calcula sobra/completude, enquanto `choose(option)` envia a resposta efetiva. N2.07 entra como testemunha CLASS-007; não nasce GAP individual novo apenas por esta causa.

### 3.3 GM.11 — testemunha encontrada pela varredura 90/90

A ficha F94 manda preencher uma camada e repetir camadas. O palco mantém `cubos` e `camadas` e oferece botões habilitados de construção. Contudo, os botões de resposta permanecem independentes, e `responder(valor)` decide correção e emite `evidenciasVolumePrismasF94(...)` sem exigir que `cubos === volume` ou que as camadas necessárias tenham sido construídas. L4 dimensão-faltante não possui esse controle, por isso a classe é medida na competência pelo bypass presente em outros níveis, não como alegação de 5/5 níveis.

### 3.4 GM.12 — testemunha encontrada pela varredura 90/90

F50 declara, em capacidade, “despeje em recipientes iguais” como referência física. `Recipientes` oferece botão habilitado `data-recipientes-verify` / “Despejar e comparar”. A escolha dos recipientes, porém, também está habilitada antes dessa verificação. `MedidasStage` envia a ação ao motor, e `evidenciasDe()` concede a evidência de domínio `CASO_CONTRAINTUITIVO` quando `acertou(acao) && acao.contraintuitivo`; o campo `acao.verificou` não participa dessa condição. Logo a criança pode acertar o caso contraintuitivo sem executar o despejo e ainda satisfazer a evidência exigida pela ficha.

## 4. Matriz 90/90

Legenda de não-membro:

- `AUT` — a ação/resposta conceitual executável é autoritativa ou sua evidência participa do mastery;
- `AUS` — a ação mais rica declarada não existe de forma executável; pode ser GAP, mas não CLASS-007;
- `DISPLAY` — representação é estática ou explicitamente `disabled`, portanto não finge ação avaliativa habilitada.

### N1 — 13/13

| ID | CLASS-007 | Resultado |
|---|---:|---|
| N1.01 | não | AUT |
| N1.02 | não | AUT/AUS conforme micro; nenhum affordance probatório habilitado é bypassado |
| N1.03 | não | AUT |
| N1.04 | não | AUT |
| N1.05 | não | AUT |
| N1.06 | não | AUT |
| N1.07 | não | AUT |
| N1.08 | não | AUT |
| N1.09 | não | AUT |
| N1.10 | não | AUT |
| N1.11 | não | AUT |
| N1.12 | não | AUT |
| N1.13 | não | AUT |

### N2 — 7/7

| ID | CLASS-007 | Resultado |
|---|---:|---|
| N2.01 | não | AUT |
| N2.02 | não | AUT |
| N2.03 | não | AUT |
| N2.04 | não | AUT/legado; nenhuma ação auxiliar probatória habilitada bypassada |
| N2.05 | não | AUS/legado |
| N2.06 | não | AUT |
| **N2.07** | **SIM** | callback morto em ArrayGrid habilitado; resposta válida vem de botões |

### N3 — 13/13

| ID | CLASS-007 | Resultado |
|---|---:|---|
| N3.01 | não | AUT |
| N3.02 | não | AUT — gesto de retirada alimenta resposta/meta |
| N3.03 | não | AUT |
| N3.04 | não | AUS/legado |
| N3.05 | não | AUS/legado |
| N3.06 | não | AUS/legado |
| N3.07 | não | AUS/legado |
| N3.08 | não | AUS/legado |
| N3.09 | não | AUT |
| N3.10 | não | AUT |
| N3.11 | não | AUT/legado |
| N3.12 | não | AUT/legado |
| N3.13 | não | AUT/legado |

### N4 — 12/12

| ID | CLASS-007 | Resultado |
|---|---:|---|
| N4.01 | não | AUT |
| **N4.02** | **SIM** | giro habilitado não condiciona a resposta/comutatividade |
| N4.03 | não | AUT |
| N4.04 | não | AUT |
| N4.05 | não | AUS/legado |
| N4.06 | não | AUT |
| N4.07 | não | AUT/AUS; estratégia ausente em parte da escada não é ação habilitada bypassada |
| N4.08 | não | AUT |
| N4.09 | não | AUT/DISPLAY |
| N4.10 | não | AUT |
| N4.11 | não | AUT/DISPLAY |
| N4.12 | não | AUT |

### N5 — 5/5

| ID | CLASS-007 | Resultado |
|---|---:|---|
| N5.01 | não | AUT — produção/evidência de partição é vinculante |
| N5.02 | não | AUT |
| N5.03 | não | AUT |
| N5.04 | não | AUT/DISPLAY |
| N5.05 | não | AUT/DISPLAY |

### N6 — 4/4

| ID | CLASS-007 | Resultado |
|---|---:|---|
| N6.01 | não | AUT/DISPLAY |
| N6.02 | não | AUT |
| N6.03 | não | AUS/DISPLAY |
| N6.04 | não | AUT/DISPLAY |

### N7 — 2/2

| ID | CLASS-007 | Resultado |
|---|---:|---|
| N7.01 | não | DISPLAY — reta interativa é explicitamente desabilitada; há GAP próprio de interação ausente |
| N7.02 | não | AUT |

### AL — 8/8

| ID | CLASS-007 | Resultado |
|---|---:|---|
| AL.01 | não | AUT |
| AL.02 | não | AUT |
| AL.03 | não | AUT |
| AL.04 | não | AUT |
| AL.05 | não | AUS/DISPLAY — construção física da igualdade não está executável |
| AL.06 | não | AUS — transformação declarada não é materializada |
| AL.07 | não | AUS — produção/generalização não está materializada |
| AL.08 | não | AUT/DISPLAY — escolha de transformação é a resposta; animação física residual é ausência representacional |

### GE — 10/10

| ID | CLASS-007 | Resultado |
|---|---:|---|
| GE.01 | não | AUT — produção espacial vinculante |
| GE.02 | não | AUT |
| GE.03 | não | AUT |
| **GE.04** | **SIM** | experimento L3–L4 executável, porém opcional para responder |
| GE.05 | não | AUS — produção linguística rica não está executável |
| GE.06 | não | AUS — instrumento de medição não está executável |
| **GE.07** | **SIM** | DragGroup habilitado com callback morto |
| GE.08 | não | AUT/AUS — endpoint é autoritativo; desenho completo ausente |
| **GE.09** | **SIM** | transformação executável não condiciona a resposta |
| GE.10 | não | AUT — reconstrução/desenho precisa ocorrer |

### GM — 12/12 para a propriedade CLASS-007

Esta seção **não conta como auditoria curricular do lote GM**; é somente a varredura R2 da propriedade estrutural.

| ID | CLASS-007 | Resultado |
|---|---:|---|
| GM.01 | não | AUT — toque/seriação é a resposta |
| GM.02 | não | AUT — escolha/ordenação é a tarefa, sem ação auxiliar bypassada |
| GM.03 | não | DISPLAY/legado — dinheiro é apresentado e a resposta vem da escolha; nenhuma ação física habilitada paralela |
| GM.04 | não | DISPLAY/legado — relógio visual + escolhas; a divergência pedagógica DECISAO-001 é outra questão |
| GM.05 | não | AUT — fases de medir/alinha/estimar são vinculantes onde prescritas |
| GM.06 | não | DISPLAY — relógios/reta são suportes visuais; `Relogio` não recebe `interactive=true` |
| GM.07 | não | DISPLAY — ArrayGrid é explicitamente `disabled`; opções compram resposta |
| GM.08 | não | DISPLAY — ArrayGrid explicitamente `disabled`; opções compram resposta |
| GM.09 | não | DISPLAY — NumberLine/Balança são referências estáticas, não affordances de resposta habilitadas |
| GM.10 | não | DISPLAY — Balança/NumberLine são referências estáticas |
| **GM.11** | **SIM** | construção por cubinhos/camadas é habilitada, mas não condiciona `responder()`/evidência |
| **GM.12** | **SIM** | despejo/verificação é habilitado, mas `CASO_CONTRAINTUITIVO` ignora `verificou` |

### PE — 4/4 para a propriedade CLASS-007

Esta seção **não conta como auditoria curricular do lote PE**; é somente a varredura R2 da propriedade estrutural.

| ID | CLASS-007 | Resultado |
|---|---:|---|
| PE.01 | não | DISPLAY/legado — pictograma é lido e a resposta vem da escolha |
| PE.02 | não | AUS — `bar-build` declarado não é ação executável no palco atual; gráfico é estático |
| PE.03 | não | AUS — nivelar barras declarado não é ação executável; torres são estáticas |
| PE.04 | não | AUS/DISPLAY — grade/barras são representações, não construção interativa avaliativa |

**Checksum da matriz: 13 + 7 + 13 + 12 + 5 + 4 + 2 + 8 + 10 + 12 + 4 = 90.**

## 5. Consequência para CLASS-007

Inventário global atual:

`N2.07, N4.02, GE.04, GE.07, GE.09, GM.11, GM.12`

Prevalência medida:

`7 / 90 = 0,077777... = 7,78%`

O inventário é fechado **para o HEAD medido**, não significa classe reparada. Estado:

- descoberta: concluída para este SHA;
- prevalência: dimensionada;
- reparo: **NÃO**;
- gate de prevenção: **NÃO criado**;
- Gate B: continua **AUDIT-ONLY**.

Uma futura frente de reparo deve preferir descoberta comportamental/medição da relação ação→resposta/evidência em vez de uma allowlist dos sete IDs.

## 6. Autoverificação exigida

Antes de registrar o recibo deste documento:

1. `diff` contra `173af7445613043b45536be4f57df1d7c460ceaf` deve tocar somente este arquivo;
2. `main` deve permanecer `106dfe0d796babebe40ebc36e5a84d4a80b9a858`; PR #35 deve permanecer open + draft + unmerged;
3. CI e transversal citados como recibos deste relatório devem ter `head_sha` igual ao SHA documental deste relatório;
4. alegação principal medida: **90/90**, **7/90 = 7,78%**, **83/90 = 92,22%**;
5. gate tocado: **não**; mutação: **N/A**.

## 7. Próximo passo sob D069

Depois de dois recibos verdes próprios deste SHA documental, retomar o **Lote GM** como auditoria curricular normal. A varredura R2 acima não antecipa candidatos GM/PE nem os contabiliza como competências auditadas no Gate B. Aplicam-se as condições de STOP de D069, inclusive `DECISAO-001/GM.04` se continuar exigindo julgamento humano quando alcançada.
