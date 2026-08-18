# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** GitHub remoto, DAG, canário, Coverage Matrix e gates do SHA exato vencem memória de conversa, prompt antigo ou checkpoint.

## 1. Âncora remota obrigatória

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`, intocada pela fábrica
- Observação: a API do GitHub atualmente reporta `main` como `protected:false`; não fingir proteção técnica. A regra de governança vinculante permanece **não tocar `main`**.
- Ondas formalmente fechadas: **W1–W48**
- Última onda: **W48 · GM.11/F94 — Volume de Prismas — FECHADA tecnicamente**
- SHA técnico final W48: `adbb4317238ac7224e5e25466a007fb2d5018da2`
- CI final W48: `32156476415` — **completed/success**
- Certificação transversal final W48: `32156476430` — **completed/success**, 9/9
- Checkpoint vinculante: `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W48_GM_11_F94_FECHADA_2026-08-18.md`

O commit documental que atualiza checkpoint + Estado + esta porta também precisa de **CI + Certificação transversal próprios**. Nunca reutilize os recibos técnicos do `adbb431…` para certificar um HEAD documental posterior.

Antes de QUALQUER escrita:

1. reancore PR, branch, HEAD e `main` no remoto;
2. confirme reviews e review threads;
3. consulte CI + Certificação transversal do HEAD relevante;
4. confira canário, ledger/Matrix, runtime map e DAG;
5. se houver deriva, investigue — o remoto vence este arquivo;
6. nunca misture recibos entre SHAs nem invente contagens/deltas.

## 2. Estado vivo após W48

Coverage Matrix executável observada e certificada no SHA técnico final W48:

- **90 competências / 94 fichas autorais**
- **73 Composer**
- **15 legado**
- **2 fallback**
- **88 servidas**
- **11 divergências ficha↔screen**
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ausente conhecida: `Moedas` (dívida já explicitada em GM.03)

Fallbacks reais restantes:

- `PE.04` — F95, Estatística e Chance
- `N5.05` — F86, Multiplicar Frações

Os 15 legados, as 11 divergências e `Moedas` **não estão esquecidos nem artificialmente fechados**. São resíduos conhecidos da engenharia curricular e seguem registrados pela Matrix/auditorias e pela fase pós-fábrica.

## 3. W48 — cadeia vinculante

### Registro inter-onda do Observatório

SHA `5defb1a812221ee38987a880778ee1fc93e58ec4` registrou exclusivamente em documentação a existência da frente paralela de P&D. Não houve implementação da Foundry no runtime.

### Regression-first

SHA `e27e5c0f6890817aa802870f275a87263021d8bf`:

- transversal `32151661911` — success;
- CI `32151661956` terminou depois como cancelled por push posterior, porém o job `Gates do SAGA` já havia concluído com vermelho nominal;
- única falha nova: `GM.11` ausente em `JOURNEY_FICHAS` no contrato W48;
- **3.373 testes anteriores passaram e 1/3.374 falhou**;
- Matrix ainda `72/15/3/87/11`.

O contrato não foi relaxado e o vermelho não foi fabricado.

### Materialização inativa

F94 foi materializada reutilizando `ArrayGrid#3D` e a alfabetização isométrica da F92/GE.10. A escada preserva contar cubos → área da base → repetir pela altura → fórmula → dimensão faltante/prisma não retangular.

Misconceptions canônicas:

- `SOMA_DIMENSOES`;
- `CONFUNDE_COM_AREA`;
- `IGNORA_UNIDADE_CUBICA`.

A materialização preserva domínio 3/3 em 2 sessões, evidência de dimensão faltante, separação entre erro motor e misconception, RT fora da autoridade conceitual e ausência de crédito de mastery por ajuda/resolução assistida.

O primeiro candidato encontrou uma lacuna real no P13: o runtime já emitia `dimensao-faltante-f94`, mas o registro explícito de emissores do teste central ainda não incluía F94. O reparo adicionou prova positiva e prova negativa sem remover asserções.

SHA inativo final: `fbc80f764248ee18af87029fa89cda5a41d7e852`.

- CI `32154072299` — completed/success;
- transversal `32154072327` — completed/success 9/9.

Até esse portão, GM.11 permaneceu fora do canário e sem ledger/Matrix de promoção.

### Promoção atômica

SHA `4dd4a9a5e0ac6d26a23f50f423cb5d18abebb44c` tocou exatamente:

1. `src/curriculum/motores/composerCanaryIds.ts` — ativa `GM.11`;
2. `AI_Studio_Lab/tools/coverage_matrix_core.ts` — ledger `W48-GM.11`, delta `{ composer:+1, fallback:-1, served:+1 }`;
3. `src/curriculum/coverageMatrix.test.ts` — contrato `73/15/2/88/11`.

A transversal `32156057482` passou. O gate da Matrix recusou a promoção como verde porque observou 12 divergências: F94 entregava `ArrayGrid`, mas a tabela de conformidade ainda não qualificava seus modos como `3D`.

### Reparo observacional final

SHA `adbb4317238ac7224e5e25466a007fb2d5018da2` alterou somente o observador declarativo em `src/curriculum/conformidadeDeFichas.test.ts`:

- `volume-prismas-f94 → ArrayGrid`;
- `contar-cubos`, `camada-multiplicar`, `formula`, `dimensao-faltante`, `prisma-nao-retangular → 3D`.

O runtime já estava correto. O baseline **não** foi alterado. A Matrix voltou a observar as 11 divergências reais.

Recibos finais no mesmo SHA:

- CI `32156476415` — completed/success;
- transversal `32156476430` — completed/success 9/9;
- Gates: catálogo, fichas, conformidade, DAG, TypeScript, **242 arquivos / 3.390 testes**, build e guarda textual verdes;
- Sonda real Sensei, higiene e binários verdes.

**W48 não deve ser refeita sem causa nova observável.**

## 4. Autorização contínua para concluir a fábrica

A pausa humana entre W47 e W48 foi consumida. O usuário autorizou explicitamente a continuação autônoma, uma onda por vez, até:

- `fallback = 0`;
- `90/90 competências servidas`.

Não existe fila autoritativa pré-fixada. Depois de cada fechamento documental verde:

1. reancorar o remoto;
2. recalcular Matrix e DAG;
3. conferir prerequisitos, `causalWave`, downstream e desempates vigentes;
4. selecionar a próxima competência apenas pelo estado remoto;
5. executar uma única onda completa;
6. só então recalcular novamente.

O último recálculo técnico anterior ao fechamento documental W48 apontava `PE.04/F95` à frente de `N5.05/F86`. Isso é **somente candidata informativa**, não abertura de W49.

## 5. Protocolo obrigatório de cada onda residual

### A. Seleção

- confirmar fallback real na Matrix;
- conferir prerequisitos servidos;
- recalcular `causalWave`, downstream e desempates;
- ler integralmente a ficha canônica relevante;
- auditar reuse físico e contratos existentes antes de escrever.

### B. Regression-first

1. criar contrato executável em SHA próprio;
2. exigir vermelho nominal e exclusivamente causado pela ausência da materialização;
3. não relaxar teste para criar vermelho;
4. preservar os recibos do SHA exato.

### C. Materialização INATIVA

Materializar ficha/runtime completos conforme o cânone: builder/contract, kind/palco, renderer, resolução, Radar/misconceptions, evidências/P13, runtime map, answer policy, acessibilidade e testes conforme aplicável.

Durante esta etapa:

- competência fora do canário;
- sem ledger da onda;
- sem antecipar Matrix/baseline;
- reuse de primitivas existentes quando suficiente;
- nenhuma abstração paralela por conveniência.

Exigir no mesmo SHA inativo:

- CI success;
- Certificação transversal success 9/9.

### D. Promoção atômica

Somente após o portão inativo verde, no mesmo SHA:

1. canário;
2. ledger nominal da onda;
3. contrato da Coverage Matrix.

A Matrix deve observar o delta real. Se surgir divergência inesperada, diagnosticar runtime versus observador e reparar a fonte correta. **Nunca alterar baseline para fabricar verde.**

### E. Fechamento

Exigir no SHA técnico final:

- CI success;
- transversal success 9/9;
- Gates;
- Sensei;
- build;
- higiene;
- binários;
- Matrix coerente.

Então:

1. criar checkpoint da onda;
2. atualizar `ESTADO_DO_FECHAMENTO.md`;
3. atualizar este `PROMPT_DE_RETOMADA.md`;
4. atualizar corpo do PR #35;
5. certificar o HEAD documental posterior com seus próprios workflows;
6. reancorar;
7. recalcular a próxima onda.

## 6. Quando `fallback = 0`

Quando a Matrix executável observar `90/90 servidas` e `fallback=0`, **não iniciar automaticamente nenhuma nova grande frente**.

Fazer o fechamento formal da Fábrica Curricular:

1. checkpoint final da fábrica;
2. estado final da Coverage Matrix;
3. esta porta reconciliada;
4. corpo do PR atualizado;
5. recibos completos do último SHA técnico e do fechamento documental;
6. CI + transversal verdes;
7. registrar explicitamente os resíduos que continuarem reais: 15 legados se ainda observados, divergências ficha↔screen, `Moedas`, hardening/performance e demais dívidas reais;
8. preservar Issue #47, Issue #48 e a frente Observatório na Research Foundry.

`fallback=0` significa **fábrica curricular principal concluída**, não “produto Child-Ready”.

Depois do fechamento final verde, **parar antes de iniciar a fase pós-90/90**.

## 7. Regras invioláveis do PR #35

- GitHub remoto vence memória, checkpoint e esta porta;
- `main` não é área de trabalho;
- PR permanece draft + open + unmerged;
- nunca marcar ready, habilitar auto-merge ou mergear;
- não tocar Creature Engine/Tamagotchi;
- uma onda por vez e um único writer ativo na branch;
- não misturar recibos entre SHAs;
- não relaxar testes, P13, Matrix, Radar, DAG, contratos ou sondas para obter verde;
- não editar baseline para encobrir observação real;
- promoção = canário + ledger + contrato Matrix no mesmo SHA;
- canário, Matrix, ledger e runtime map são declarativos, sem mutação por efeito colateral de import;
- runtime map/evidências/catálogos compartilhados são aditivos: preservar rationale/histórico;
- erro motor não vira misconception conceitual;
- RT conceitual não compra/reprova mastery salvo contrato específico de fluência;
- ajuda/resolução assistida não compra mastery independente;
- uma onda não reutiliza recibos de outra;
- dívida real não é apagada só porque a fábrica termina.

## 8. Pós-90/90 preservado

Não confundir `fallback=0` com produto Child-Ready.

- Issue #47 — **Integração Sistêmica e Child-Ready**;
- Issue #48 — **lacunas microcurriculares/microprogressão**.

A fase pós-90/90 só começa com nova autorização/contexto depois do fechamento formal da fábrica.

## Frente paralela — Observatório (P&D, não runtime)

Existe uma frente registrada na `SAGA-Research-Foundry`, fora desta fila curricular e sem autoridade sobre ela:

- documento: `03_architecture/OBSERVATORIO_E_AUDITORIA.md`
- decisões diretamente correlatas: D057–D065 no `05_decisions/DECISION_LEDGER.md`
- o mesmo Ledger está em v0.99 e contém também D066, referente ao manifesto histórico
- status: `PRE-CANONICAL` · `implementation_authorized: false`

Escopo: Recibo de Sessão, avaliação de aprendizagem fora do motor adaptativo, sete auditorias de motor, personas sintéticas e costuras de expansão.

Nada dela entra no runtime sem autorização explícita do usuário conforme `00_governance/WORKFLOW.md`. Ela não altera onda, canário, Matrix, ledger curricular nem runtime map. Não interromper a fila curricular por causa dela.