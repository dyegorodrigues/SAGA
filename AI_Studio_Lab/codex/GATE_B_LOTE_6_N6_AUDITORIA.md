# GATE B — LOTE 6 · Mega-auditoria de microprogressão N6

**Data:** 2026-08-19  
**Modo:** AUDIT-ONLY  
**Escopo curricular:** somente domínio `N6` (`N6.01`–`N6.04`)  
**Autoridade:** Issue #47 §0.2/§3 + Issue #48  
**Estado do Gate B:** ABERTO, **não fechado**  
**Regra:** nenhum achado deste documento autoriza correção de código, runtime, Matrix, canário, DAG, implementação de gates, ativação do Gate B′ ou início de Gates C–J.

## 0. Âncora e governança

A auditoria foi aberta a partir do HEAD remoto `fac6abb79200e3ae45493d17ea09f9bca41689e4`, com:

- PR #35 **open + draft + unmerged**;
- branch `codex/fechamento-curricular`;
- `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`, intocada;
- reviews: 0;
- review threads: 0;
- CI do Lote 5 `32260196527` — completed/success;
- Certificação transversal do Lote 5 `32260196519` — completed/success 9/9.

A auditoria permanece documental. Não foram alterados runtime, Matrix, canário, DAG, fichas, contratos ou testes.

## 0.1 Verificação externa pós-Lote 5

Antes de N6, foram registrados na Issue #48 os resultados externos pedidos pelo usuário.

### Contagem CLASS-002

A correção aritmética do Lote 5 foi confirmada como correta:

- **10 divergências de campo em 9 competências**;
- `GM.04` responde por 2 campos (`prereqs` + `faixa`);
- isolando GM.04, `CLASS-002` simples contém **8 casos**, não 9.

`CLASS-002` continua **FECHADA PARA DESCOBERTA / INVENTÁRIO REGISTRADO**, `CONFIRMADO-ATUAL`, via `CODIGO`, não reparada e sem gate implementado.

### DECISAO-001 / GM.04 — diagnóstico, não decisão

Comentário Issue #48: `5346694044`.

Estado preservado: `PENDENTE-DE-DECISÃO-HUMANA`.

Diagnóstico registrado:

- a divergência de metadata é sintoma;
- a ficha GM.04 contém o micro invasor **“avançar o tempo em frações de 15 minutos”**;
- esse conteúdo pertence semanticamente a GM.06, já existente no DAG como **“Horas e minutos; duração”**, `F2`, prereqs `[GM.04, AL.03]`;
- a ficha viva GM.06 ensina que cada número do mostrador vale 5 minutos e trabalha duração;
- a hipótese externa recomenda o DAG de GM.04 como tese correta para **hora cheia**: `F1`, prereq `[N1.06]`;
- minutos exigem a progressão de contagem por 5 e pertencem a GM.06.

Se o dono aprovar futuramente, a ordem registrada é obrigatória:

1. devolver GM.04 ao escopo de hora cheia;
2. somente depois alinhar faixa `F1` e prereqs `[N1.06]`;
3. verificar se GM.06 já cobre integralmente o micro removido.

**Não executar metadata isoladamente:** isso produziria uma ficha F1 com prereq de numerais ainda ensinando frações de 15 minutos.

Nenhum passo foi executado. Este diagnóstico deve entrar como evidência obrigatória quando o domínio GM for auditado.

---

## 1. Fontes revalidadas

Foram revalidados no HEAD de entrada:

- Issue #47 §0.2/§3 e Issue #48;
- `curriculum/N6.yaml`;
- `src/curriculum/grafo_saga.ts`;
- `src/curriculum/motores/composerCanaryIds.ts`;
- fichas vivas `N6.01.ts`, `N6.02.ts`, `N6.03.ts`, `N6.04.ts`;
- `decimalContract.ts` + `decimalProcedure.ts` + `DecimalStage.tsx`;
- `contasVirgulaContract.ts` + `contasVirgulaEvidence.ts` + `ContasVirgulaStage.tsx`;
- `porcentagemContract.ts` + `PorcentagemStage.tsx`;
- `razaoProporcaoContract.ts` + `razaoProporcaoEvidence.ts` + `RazaoProporcaoStage.tsx`;
- `FichaRenderer.tsx`, `GameLoop.tsx` e `progressEngine.ts` onde necessário para validar evidência/mastery;
- fichas canônicas F75, F76, F87 e F88;
- lotes anteriores apenas como histórico já revalidado.

Documentos antigos não foram usados como estado atual sem confirmação em fonte viva.

### 1.1 Disciplina de evidência

Achado individual curricular:

- nasce `CANDIDATA`;
- recebe classe §0.2, normalmente `HIPÓTESE-A-PROVAR`;
- recebe via `CODIGO`, `SIMULACAO` ou `CRIANCA`;
- não é corrigido no mesmo lote audit-only.

Padrão estrutural repetido é registrado como `ACHADO-DE-CLASSE`, evitando multiplicar a mesma causa em GAPs por competência.

---

## 2. Resultado executivo N6

- competências auditadas: **4/4**;
- proveniência: **4 Composer / 0 legado / 0 fallback**;
- prereqs/faixas ficha↔DAG: coerentes nas quatro competências;
- nova classe estrutural: **`CLASS-004`**;
- `GAP-034` absorvido/reclassificado em `CLASS-004`, sem correção;
- `GAP-025` ampliado para incluir F76/N6.02, sem criar novo GAP;
- candidatas N6 novas: **3** — `GAP-036`–`GAP-038`;
- classe das três: `HIPÓTESE-A-PROVAR`;
- vias das três: **3 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- N6.04: nenhuma candidata nova;
- correções executadas: **0**.

Composer ativo confirmado para `N6.01`, `N6.02`, `N6.03`, `N6.04`.

---

## 3. CLASS-004 — viés posicional de gabarito em comparações

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

O padrão observado em `GAP-034 / N5.03` reaparece de modo independente em N6.01.

### N5.03 / F73

- L3: a fração maior fica sempre à **direita**;
- L4: a fração maior fica sempre à **esquerda**;
- L5: pares não são permutados e a distribuição continua enviesada.

### N6.01 / F75

Os quatro pares possíveis no L4 são:

- `0,5 × 0,25`;
- `0,4 × 0,35`;
- `0,7 × 0,62`;
- `0,3 × 0,28`.

Em **100%** dos casos, a esquerda é maior.

O problema é estrutural: o aluno pode aprender a posição correta do maior naquele nível sem provar comparação invariável à troca de lados.

`GAP-034` é absorvido/reclassificado nesta classe. Não foi corrigido, refutado nem promovido a dívida.

### Teste proposto — NÃO IMPLEMENTADO

Futura frente autorizada pode exigir que:

1. todo corpus comparativo gerável contenha ambos os lados como resposta correta;
2. o teste troque os operandos de cada caso;
3. a resposta correta troque de lado;
4. o diagnóstico conceitual permaneça semanticamente equivalente;
5. a falha identifique competência, nível e caso enviesado.

---

## 4. GAP-025 — ampliação para F76/N6.02

`GAP-025` permanece:

- estado `CANDIDATA`;
- classe §0.2 `HIPÓTESE-A-PROVAR`;
- via `CODIGO`;
- causa: divulgação progressiva normativa sem execução observada.

A ficha canônica F76 aparece explicitamente no adendo F3 como obrigada a declarar `revelacaoProgressiva: true`.

No HEAD atual:

- `N6.02.ts` não declara esse contrato;
- `contasVirgulaContract.ts` não materializa esse eixo;
- `ContasVirgulaStage.tsx` mostra, antes da resposta, a conta vertical e os `Quadrado100` simultaneamente.

Portanto F76/N6.02 amplia o escopo do mesmo GAP já aberto para F35/F39/F40. Nenhuma nova candidata foi criada apenas por essa causa.

---

## 5. Auditoria competência por competência

### N6.01 — Décimos e centésimos

- **Faixa/prereqs:** `F3`, `[N5.02, N2.04]`; coerente ficha↔DAG.
- **Conceito:** o sistema posicional continua após a vírgula; 1 coluna = 0,1 e 1 célula = 0,01.
- **Escada:** L1 décimos → L2 centésimos → L3 fração↔decimal → L4 comparação → L5 ordenação.
- **Diversidade:** L1–L3 possuem famílias variadas; L5 possui três conjuntos distintos.
- **L4:** quatro pares variados numericamente, mas todos com a resposta correta à esquerda — `CLASS-004`.
- **Mastery:** 3/3 ×2; o requisito canônico de ao menos uma comparação é protegido por `DECIMAL_COMPARACAO`, emitida em L4 e acumulada pelo motor.
- **L5/representação:** a suspeita “não há reta” foi **refutada**: `DecimalStage.tsx` renderiza `MiniReta` para `spec.ordenar`.
- **Resultado:** `CLASS-004`; nenhuma candidata individual nova.

### N6.02 — Contas com vírgula

- **Faixa/prereqs:** `F3`, `[N6.01, N3.11, N3.12]`; coerente ficha↔DAG.
- **Escada canônica:** L1 mesmas casas → L2 casas diferentes → L3 subtração → L4 reagrupamento → L5 ×10/×100.
- **Diversidade:** três casos por nível; não entra em `CLASS-003`.
- **Mastery L2:** a evidência `CONTAS_VIRGULA_CASAS_DIFERENTES_F76` é emitida corretamente em acerto L2 com casas diferentes.
- **Erro anterior:** palco adiciona `masteryDisqualifier` quando uma resposta correta foi precedida por misconception na mesma questão.
- **Divulgação progressiva:** ausente como contrato executável observado; amplia `GAP-025`.
- **Resultado:** `GAP-025` ampliado + `GAP-036`.

#### GAP-036 — L3 introduz reagrupamento antes do nível dedicado

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `SALTO-DE-DIFICULDADE`, `MICRONÍVEL-AUSENTE`, `RESOLUÇÃO-INSUFICIENTE`  
**Via:** `CODIGO`

Os três casos L3 são:

1. `5,75 − 2,3 = 3,45` — sem troca necessária;
2. `8,40 − 2,15 = 6,25` — exige empréstimo nos centésimos;
3. `10,0 − 3,46 = 6,54` — exige reagrupamento múltiplo.

Os casos 2 e 3 não carregam `reagrupa:true`; logo o palco não destaca a troca. A resolução L3 apenas instrui “subtrair por ordem”, enquanto a explicação de reagrupamento existe no branch L4.

Hipótese: em 2/3 do espaço L3, a criança pode enfrentar a operação conceitualmente reservada ao degrau seguinte antes de receber seu andaime/resolução.

Encerramento via `CODIGO`: classificar mecanicamente os casos L3 por necessidade real de empréstimo e reconciliar com a fronteira canônica L3/L4.

### N6.03 — Porcentagem

- **Faixa/prereqs:** `F4`, `[N6.01, N5.03]`; coerente ficha↔DAG.
- **Núcleo canônico:** quatro escritas de uma mesma quantidade — exemplo normativo `25% = 25/100 = 0,25 = 1/4`.
- **Escada:** L1 parte de 100 → L2 âncoras → L3 porcentagem de quantidade → L4 desconto/acréscimo → L5 percentual inverso.
- **Diversidade:** L1–L5 possuem famílias de casos; não entra em CLASS-003.
- **Resultado:** `GAP-037` + `GAP-038`.

#### GAP-037 — as quatro notações centrais não são exigidas como equivalentes

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `CONTEÚDO-SÓ-EXPLICADO`, `REPRESENTAÇÃO-AUSENTE`, `TRANSFERÊNCIA-AUSENTE`, `MISCONCEPTION-NÃO-COBERTA`  
**Via:** `CODIGO`

O cânone F87 declara como ideia central que porcentagem, fração sobre 100, decimal e fração simplificada representam a mesma quantidade.

A execução atual:

- L1/L2 pede apenas o percentual do quadro pintado;
- L3–L5 pede resultados numéricos de aplicação percentual;
- `PorcentagemStage` exibe `Quadrado100` ou barra fracionária, mas não exige que a criança selecione/construa a equivalência `% ↔ fração ↔ decimal ↔ fração simplificada`;
- `NOTACOES_SEPARADAS` pode ser atribuída a distratores numéricos sem que a tarefa tenha realmente discriminado entendimento entre notações.

Hipótese: o runtime ensina/aplica porcentagem, mas não prova o conceito central de equivalência notacional.

Encerramento via `CODIGO`: inventariar todas as respostas exigidas por F87 e demonstrar onde a criança precisa reconhecer explicitamente as notações equivalentes.

#### GAP-038 — L4 pode avançar sem exercitar acréscimo percentual

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipo:** `VARIEDADE-DE-MASTERY`  
**Via:** `CODIGO`

F87 define L4 como **desconto e acréscimo**. O contrato possui três casos:

- desconto de 25%;
- acréscimo de 10%;
- desconto de 20%.

A seleção é aleatória e não há requisito de diversidade que force ao menos um desconto e um acréscimo antes do avanço/mastery.

Hipótese: uma sequência suficiente pode ser composta apenas de descontos, deixando acréscimo sem evidência observada.

Encerramento via `CODIGO`: enumerar a janela real de avanço/mastery e decidir se a competência exige cobertura mínima de ambas as direções.

### N6.04 — Razão e proporcionalidade

- **Faixa/prereqs:** `F4`, `[N6.03, N4.06]`; coerente ficha↔DAG.
- **Escada:** dobrar → triplicar → escala geral → razão como fração → regra de três por fator comum.
- **Diversidade:** três casos por nível; não entra em `CLASS-003`.
- **L3:** todos os fatores são não inteiros (`1,5`, `1,5`, `2,5`), e acerto emite `ESCALA_NAO_INTEIRA_F88`.
- **Palco:** barras vinculadas; o par escalado não é revelado antes da resposta; ambas escalas aparecem juntas após o acerto.
- **L4:** preserva explicitamente ordem primeira/segunda.
- **L5:** resolve por fator causal, sem exigir multiplicação cruzada decorada.
- **Resultado:** nenhuma candidata nova.

---

## 6. Falsos positivos / achados recusados

### 6.1 “N6.01 L5 promete reta mas não a executa” — REFUTADO

`DecimalStage.tsx` possui `MiniReta` e a renderiza quando `spec.ordenar` existe. O nível 5 não ficou apenas em `Quadrado100`.

### 6.2 “N6.02 não protege casas diferentes na mastery” — REFUTADO

A ficha exige evidência específica no L2; o contrato passa `exigeEvidencia`; o palco emite a evidência quando há acerto com casas diferentes. O motor acumula a evidência para a coroa.

### 6.3 “N6.04 não prova escala não inteira” — REFUTADO

Todos os casos L3 usam fator não inteiro e o emissor de evidência registra `ESCALA_NAO_INTEIRA_F88` em acerto. A exigência da ficha está ligada à pergunta executável.

### 6.4 “N6.02 entra em CLASS-003” — REFUTADO

Cada nível possui três casos, selecionados por RNG. O padrão de caso único por nível não se aplica.

---

## 7. Resumo por classe e por via

### Classes / achados não individuais

- `CLASS-001` — `CONFIRMADO-ATUAL`, via `CODIGO`, inalterada;
- `CLASS-002` — **FECHADA PARA DESCOBERTA**, `CONFIRMADO-ATUAL`, via `CODIGO`, não reparada;
- `CLASS-003` — `CONFIRMADO-ATUAL`, via `CODIGO`, sem novo membro N6;
- `CLASS-004` — **nova**, `CONFIRMADO-ATUAL`, via `CODIGO`; membros observados N5.03 + N6.01; absorve `GAP-034`;
- `DECISAO-001 / GM.04` — `PENDENTE-DE-DECISÃO-HUMANA`; diagnóstico registrado em `5346694044`.

### Candidatas individuais N6

- `GAP-036` — `HIPÓTESE-A-PROVAR` — CODIGO;
- `GAP-037` — `HIPÓTESE-A-PROVAR` — CODIGO;
- `GAP-038` — `HIPÓTESE-A-PROVAR` — CODIGO.

`GAP-025` foi ampliado para F76/N6.02, sem novo ID.

**Vias novas N6:** 3 CODIGO / 0 SIMULACAO / 0 CRIANCA.

---

## 8. Estado acumulado após N6

Sem promover hipóteses a dívidas:

- competências auditadas: **54/90**;
- candidatas individuais: **33**;
- vias individuais: **28 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes estruturais: **4** — `CLASS-001` a `CLASS-004`;
- `DECISAO-001/GM.04` separada e pendente humana;
- correções executadas pelo Gate B: **0**.

A contagem parte de 31 após N5, absorve `GAP-034` em CLASS-004 (-1) e adiciona `GAP-036`–`GAP-038` (+3).

---

## 9. Registro vivo e recibos

Comentários Issue #48 deste lote:

- diagnóstico GM.04: `5346694044`;
- classes/reclassificações/candidatas N6: `5346763254`.

O snapshot documental deste lote deve possuir **CI success + Certificação transversal success 9/9 no mesmo SHA**. O recibo final deve ser registrado na Issue #48 somente após ambos os workflows terminarem verdes no SHA exato.

---

## 10. Governança e parada

Neste lote:

- não tocar `main`;
- não marcar PR ready;
- não habilitar auto-merge;
- não mergear;
- não corrigir código;
- não implementar gates de CLASS-001/002/004 ou qualquer outro;
- não ativar Gate B′;
- não iniciar Gates C–J;
- não tocar Creature Engine/Tamagotchi;
- não iniciar N7.

**Próximo domínio natural, não iniciado:** `N7`.

Depois da certificação do mesmo SHA, confirmar PR/main e **PARAR em N6**.