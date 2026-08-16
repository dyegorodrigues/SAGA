# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Fonte operacional de verdade para retomar o PR #35.**
> Leia este arquivo integralmente antes de editar. O remoto vence memória de conversa, prompt antigo e SHA histórico.

---

## 1. Âncora remota

Repositório: `dyegorodrigues/SAGA`  
PR: `#35` — deve permanecer **open + draft + unmerged**  
Branch: `codex/fechamento-curricular`  
Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`

Antes de editar:

1. confirme o HEAD remoto da branch e o estado do PR;
2. consulte os workflows do **SHA exato** que pretende usar como recibo;
3. se o SHA já tiver CI + transversal `success`, **não aguarde de novo: execute o próximo passo**;
4. reancore Matrix, DAG, ficha e runtime no estado vivo;
5. se houver deriva, investigue antes de escrever — o remoto vence este documento.

**Regra de evidência:** nunca registrar ID de run, SHA, contagem de testes ou delta de Matrix sem fonte que o prove. Número plausível não é recibo.

**Regra de classificação:** conclusão de workflow e evidência de job/log são fatos distintos. Workflow `cancelled` continua `cancelled` mesmo quando um job já terminou `failure`. Workflow `failure` só é chamado de `failure` quando a API global assim o classifica.

---

## 2. Documentos de continuidade

Ler, conforme a área:

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`;
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`;
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`;
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`;
- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md`;
- `AI_Studio_Lab/codex/ROADMAP_PRODUTO_E_EXPANSAO.md`;
- checkpoints fechados W20–W24 e W25–W29;
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W30_W34_EM_CURSO_2026-08-15.md`.

O checkpoint é recibo humano; **Coverage Matrix, canário, DAG e runtime vivos são a autoridade executável**.

---

## 3. Arquitetura operacional que não pode regredir

- `composerCanaryIds.ts`, `coverage_matrix_core.ts` e `ficha_runtime_map.cjs` são **declarativos**.
- Não criar mutação por efeito colateral de import para canário, ledger, Matrix ou mapa runtime.
- Registrar ficha no Composer **não ativa** competência.
- Promoção acontece somente no array declarativo do canário.
- Promoção e linha nominal do ledger caminham no **mesmo SHA**.
- A Matrix observa o delta real; baseline não mascara deriva.
- Não tocar nem mergear `main`.
- Não tocar Creature Engine/Tamagotchi neste fluxo.
- Não mergear `codex/w24-dominio-inteiros`.
- `codex/w31-promotion-staging` e branches temporárias de staging são rascunhos; **não mergear**.

### Design, cores e tipografia

A catraca de cores é vinculante:

- ficha/palco novo usa papéis de `src/styles/tokens.ts`;
- não introduzir cor literal nova;
- não regenerar baseline para silenciar a catraca;
- se faltar papel semântico, ampliar tokens deliberadamente.

Fredoka e Nunito permanecem exatamente as famílias escolhidas.

**Tipografia local está resolvida.** O commit `d1101e5db6147c50f3131996b1595005c9bf874b`, integrado no estágio inativo da W33, trouxe:

- quatro WOFF2 variáveis oficiais em `public/fonts/` — Fredoka/Nunito, subconjuntos latin e latin-ext;
- validação dos bytes mágicos `wOF2`;
- exceção estreita no `pr_text_guard.cjs` somente para `public/fonts/*.woff2`;
- `.woff2` fora da pasta e `.ttf` dentro da pasta continuam barrados;
- `src/index.css` sem `@import` do Google Fonts e com as mesmas famílias;
- build servindo as fontes em `dist/fonts/`.

Não reabrir download externo nem trocar as famílias. A dívida histórica de rede da fonte externa — 27 HTTP 404 em 27 navegações — permanece apenas como registro de causa.

---

## 4. Estado curricular vivo após W33

Ondas **W1–W33 fechadas**.

Coverage Matrix do SHA promovido W33:

- **58 Composer**
- **15 legado**
- **17 fallback**
- **73 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

O Gates da promoção W33 observou **220 arquivos / 3.106 testes**, com catálogo, fichas, conformidade, grafo, TypeScript, testes, build, guarda textual e guarda de binários verdes.

### Últimas ondas

- W29 `GE.04/F59`: promoção `3a705e28de30e6a785645864957727134c213256`; CI `31864419504` + transversal `31864419499`, `success`.
- W30 `N2.06/F38`: final `05b7787e7239db4c687b5fa7cc47ee0b4f256447`; CI `31883452067` + transversal `31883452082`, `success`.
- W31 `PE.03/F83`: promoção `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd`; CI `31908549456` + transversal `31908549471`, `success`, attempt 1.
- W32 `GM.09/F82`: promoção `40ef8eb13cd93d1a0b2e60375964853e62118e24`; CI `31913688446` + transversal `31913688438`, `success`, attempt 1.
- W33 `GE.07/F79`: promoção `5fa072c84e69687491a21d0e6f975d7b9da3fd44`; CI `31916781563` + transversal `31916781644`, `success`.

### Padrão vinculante de evidência

- W31/W33 demonstram por que conclusão global e job devem ser separados.
- Antes de qualquer “aguardando workflow”, consultar `fetch_commit_workflow_runs` ou API equivalente no **SHA exato**.
- Se os dois workflows já estiverem `completed/success`, execute imediatamente.

---

## 5. W31 — PE.03 / F83 — resumo fechado

Pré-requisitos `PE.02`, `N4.10`, `N5.02`; primitiva `SingaporeBars`; `MediaChanceStage` / `media-chance-f83`.

Regression `5a2831f6519456ffaf77e93dc6bcdd988f223149`:

- CI `31907540508`: `cancelled`;
- Gates `95067597810`: `failure`, exatamente os 2 testes W31 desenhados;
- 217 arquivos / 3.055 testes anteriores verdes;
- transversal `31907540753`: `success`.

Portão inativo `81ffa9b608ecc25a5579c7e906bafa8889dbf101`:

- CI `31908108818`: `success`;
- transversal `31908108833`: `success`.

Promoção `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd`: Matrix `56/15/19/71/11`; suíte 218 arquivos / 3.072 testes; CI `31908549456` + transversal `31908549471`, `success`.

**W31 fechada.**

---

## 6. W32 — GM.09 / F82 — resumo fechado

Pré-requisitos `GM.05`, `N4.08`, `N6.01`; primitivas `NumberLine + Balanca`; `ProblemasMedidaStage` / `problemas-medida-f82`.

Regression `fd05ef22ead9c01f8c274d69bba37e2e25422bd4`:

- conclusão global CI `31912881313`: **`failure`**;
- Gates `95080511297`: `failure`, exatamente os 2 testes W32;
- 218 arquivos / 3.072 testes anteriores verdes;
- transversal `31912881318`: `success`.

Portão inativo `ddaf40bfa1ac88ddd3c8c60046b058958963c0e5`:

- CI `31913279161`: `success`;
- transversal `31913279171`: `success`.

Promoção `40ef8eb13cd93d1a0b2e60375964853e62118e24`:

- canário + `W32-GM.09` + contrato Matrix no mesmo SHA;
- Matrix `57/15/18/72/11`;
- CI `31913688446` + transversal `31913688438`, `completed/success`.

**W32 fechada.**

---

## 7. W33 — GE.07 / F79 — Polígonos

Pré-requisitos canônicos: `GE.03`, `GE.06`.  
Primitivas: `ShapeCanvas + DragGroup`.  
Realização: `PoligonosStage` / `poligonos-f79`.

### Regression-first

SHA `139b1b077781c97bf76f7f5c157f9e2463373683`.

**Conclusão global:** CI `31914303708`: `cancelled`.

**Evidência do job:** Gates `95083874446`: `failure`, somente os 2 testes W33; 219 arquivos / 3.089 testes anteriores verdes. As duas falhas foram exatamente GE.07 ainda não registrada e ativação rejeitada antes de `COMPOSER_FICHAS`.

### Materialização inativa e infraestrutura

O primeiro inativo `702e62d8ec0f4f85d699ded8bb213dbdc95b32d3` passou CI `31914591177` + transversal `31914591199`, ambos `success`.

Ainda no estágio inativo:

- `d1101e5db6147c50f3131996b1595005c9bf874b` integrou as fontes locais verificadas;
- `af1e657ac72d5a353f7ea1416ee52aa183819f7e` adicionou a cadeia declarativa `ShapeCanvas + DragGroup → PoligonosStage` no runtime map.

Antes da promoção foi detectada uma divergência pedagógica que o CI estrutural não enxergava. A implementação inicial não seguia a F79 canônica. Ela foi corrigida em `04865f6a05a362110e035772bbd0b617cb55263c`.

### Contrato F79 canônico efetivamente certificado

1. classificar triângulos pelos lados;
2. classificar triângulos pelos ângulos;
3. classificar quadriláteros;
4. compreender hierarquia — `quadrado ⊂ retângulo ⊂ paralelogramo`;
5. classificar por propriedades combinadas.

Diagnósticos: `CATEGORIAS_EXCLUSIVAS`, `SO_UM_CRITERIO`, `ORIENTACAO_FIXA`.  
Domínio: **3/3 em 2 sessões**.  
Alternativa por toque preservada para interação motora.

Portão inativo canônico `04865f6a05a362110e035772bbd0b617cb55263c`:

- CI `31916409189`: `success`;
- transversal `31916409203`: `success`;
- Gates `95088772299`: `success`;
- GE.07 registrada e inativa;
- Matrix ainda `57/15/18/72/11`;
- suíte **220 arquivos / 3.093 testes**;
- fontes locais, runtime map, build, auditorias e guards verdes.

### Promoção atômica e fechamento

SHA `5fa072c84e69687491a21d0e6f975d7b9da3fd44`.

Entraram somente:

- GE.07 no canário declarativo;
- `W33-GE.07` no ledger;
- contrato Matrix para `58/15/17/73/11`.

**Evidência do job:** Gates `95089806659`: `success`; Matrix observada **58/15/17/73/11**; GE.07 `padrao-ouro`; suíte **220 arquivos / 3.106 testes**; catálogo, fichas, conformidade, grafo, TypeScript, testes, build e guarda textual verdes.

**Conclusão global do mesmo SHA:** CI `31916781563` + transversal `31916781644`, ambos `completed/success`.

**W33 fechada.**

---

## 8. Ledger, Matrix e runtime map

O ledger nominal em `AI_Studio_Lab/tools/coverage_matrix_core.ts` vai até **W33-GE.07**.

Regras:

- linha nova no array declarativo é atualização normal;
- canário + ledger entram no mesmo SHA da promoção;
- a Matrix observa o delta real;
- `ficha_runtime_map.cjs` descreve cadeia física comprovada;
- divergência só muda quando a fonte real justificar;
- nenhuma mutação por side effect/import.

---

## 9. Seleção fallback-first — estado pós-W33

Restam **17 fallbacks**:

`AL.07, AL.08, GE.08, GE.09, GE.10, GM.06, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

Elegibilidade: candidato somente quando **todos** os prereqs já estão servidos.

Valor de desbloqueio: contar apenas fallbacks adicionais que passam a ter todos os prereqs servidos após a promoção hipotética.

Pós-W33:

- 15 fallbacks estão imediatamente elegíveis;
- `AL.08` continua bloqueado por `AL.07 + N7.02`;
- `N5.05` continua bloqueado por `N5.04 + N6.04`;
- os 15 elegíveis têm ganho imediato **0**.

Desempate vinculante:

1. maior ganho imediato;
2. empate → ordem causal executável da Matrix/DAG (`causalWave` crescente, depois maior impacto downstream, depois ID);
3. empate residual → menor delta estrutural / continuidade local.

No estado pós-W33, **GE.08** é o primeiro elegível na ordem causal (`causalWave=5`).

Portanto, sem deriva remota, **W34 = `GE.08 / F80 — O Plano Cartesiano`**.

---

## 10. Contrato canônico já reancorado para W34

Competência: `GE.08`.  
Ficha: `F80 — O Plano Cartesiano`.  
Pré-requisitos: `GE.05`, `N1.12`.  
Primitiva: `ShapeCanvas` em modo grade.

Regra visual central: **primeiro anda no eixo x, depois sobe no eixo y**.

Escada:

1. ler ponto marcado;
2. colocar ponto;
3. caminho entre dois pontos;
4. desenhar figura por coordenadas;
5. identificar padrão em pontos alinhados.

Diagnósticos: `INVERTE_XY`, `IGNORA_ORIGEM`, `CONTA_MARCAS`.  
Domínio: **3/3 em 2 sessões**, incluindo pelo menos um exercício de colocar o ponto.  
Acessibilidade motora: F80 é ficha de exposição motora alta; preservar alternativa por toque + snap generoso.

A W34 deve nascer por regression-first; GE.08 não pode entrar no canário antes do portão inativo.

---

## 11. Protocolo de uma onda

1. Reancorar HEAD, PR, Matrix, DAG, ficha, runtime e workflows.
2. Recalcular seleção apenas se houver deriva; caso contrário siga a seleção provada.
3. Ler ficha canônica + DAG + runtime + análogo + design.
4. **Regression-first**: teste nominal, commit, observar falha desenhada.
5. **Materializar INATIVO**: ficha/builder/stage/renderer/runtime, sem ID no canário.
6. Rodar/observar auditorias, fichas, conformidade, grafo, TypeScript, suíte, Matrix, cores e build.
7. **Portão inativo**: CI + transversal verdes no mesmo SHA. Antes de aguardar, consultar API.
8. **Promover**: ID no canário.
9. **Ledger no mesmo SHA**: `{ composer:+1, fallback:-1, served:+1 }` salvo se a Matrix provar outra coisa.
10. Matrix observa o delta real.
11. **Certificar promoção/final**: CI + transversal verdes no SHA exato. Antes de aguardar, consultar API.
12. Documentar somente depois da prova.
13. Correção posterior de runtime cria novo recibo final e exige os dois workflows verdes.

---

## 12. Definition of Done

Uma onda só fecha quando:

- seleção está correta no DAG vivo;
- regression-first deixou evidência da falha pretendida;
- implementação inativa respeita ficha/runtime/design;
- nenhuma cor literal nova escapou;
- CI + transversal do SHA inativo estão verdes;
- promoção + ledger são atômicos;
- Matrix observou o delta real;
- CI + transversal da promoção/final estão verdes;
- documentação/porta de retomada está sincronizada;
- `main` continua intocada.

---

## 13. Restrições duras

- NÃO tocar `main`.
- NÃO mergear PR #35.
- NÃO marcar ready.
- NÃO habilitar auto-merge.
- NÃO tocar Creature Engine/Tamagotchi.
- NÃO mergear `codex/w24-dominio-inteiros`.
- NÃO mergear branches temporárias de staging.
- NÃO relaxar testes, Matrix, auditorias ou sondas para conseguir verde.
- NÃO promover ficha só porque foi registrada.
- NÃO criar ledger mutável por import.
- NÃO contar filho direto como desbloqueio sem verificar todos os prereqs.
- NÃO esperar verde no commit regression-first.
- NÃO chamar workflow `cancelled` de `failure`.
- NÃO introduzir cor literal nova.
- NÃO regenerar baseline de cores para silenciar a catraca.
- NÃO trocar Fredoka/Nunito.
- NÃO ampliar a exceção de binários além de `public/fonts/*.woff2`.
- NÃO inventar ID de run, SHA, contagem ou delta.

---

## 14. Autonomia e próximo passo

Há autonomia para executar o ciclo técnico completo sem pedir confirmação a cada microetapa.

### Próxima ação ao retomar

1. confirme HEAD/PR e workflows do SHA atual;
2. confirme Matrix viva em torno de **58/15/17/73/11**;
3. se nada derivou, abra **W34 `GE.08/F80`** por regression-first;
4. preserve `ShapeCanvas#grade`, a regra “primeiro anda, depois sobe”, alternativa por toque e os diagnósticos canônicos;
5. siga o protocolo integral, incluindo catraca de cores;
6. não reabra a tipografia: self-host Fredoka/Nunito já está integrado e validado;
7. ao fechar W34, atualizar checkpoint/PR/porta de retomada e recalcular a próxima onda.

Não transforme reancoragem em diagnóstico longo quando o próximo passo já está autorizado. Confirme o necessário e execute.
