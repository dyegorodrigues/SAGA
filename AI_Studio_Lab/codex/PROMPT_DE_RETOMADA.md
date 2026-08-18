# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** GitHub remoto, DAG, canário, Coverage Matrix e gates do SHA exato vencem memória de conversa, prompt antigo ou checkpoint.

## 1. Âncora remota obrigatória

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- Ondas formalmente fechadas: **W1–W47**
- Última onda: **W47 · N6.02/F76 — Contas com Vírgula — FECHADA**
- SHA técnico final W47: `f74b1f7711b34b11af98f882d19390a2258986db`
- CI final W47: `32147466564` — **completed/success**
- Certificação transversal final W47: `32147466708` — **completed/success**, 9/9
- Checkpoint vinculante: `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W47_N6_02_F76_FECHADA_2026-08-18.md`

Antes de QUALQUER escrita numa nova conversa:

1. reancore PR, branch, HEAD e `main` no remoto;
2. confirme reviews e review threads;
3. consulte workflows do SHA relevante;
4. se houver deriva, investigue — o remoto vence este arquivo;
5. nunca misture recibos entre SHAs nem invente contagens/deltas.

## 2. Estado vivo após W47

Coverage Matrix executável observada e certificada no SHA final W47:

- **90 competências / 94 fichas autorais**
- **72 Composer**
- **15 legado**
- **3 fallback**
- **87 servidas**
- **11 divergências ficha↔screen**
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ausente conhecida: `Moedas` (dívida já explicitada em GM.03)

Fallbacks reais restantes:

- `GM.11` — F94, Volume de Prismas
- `PE.04` — F95, Estatística e Chance
- `N5.05` — F86, Multiplicar Frações

Os 15 legados, as 11 divergências e `Moedas` **não estão esquecidos nem artificialmente fechados**. São resíduos conhecidos da engenharia curricular e seguem registrados pela Matrix/auditorias e pela fase pós-fábrica.

## 3. W47 — cadeia vinculante

### Regression-first

SHA `073bfab1469aeb86bdc0c3376634cba559880961`:

- CI `32095359960` — failure nominal, exclusivamente F76 ausente;
- transversal `32095359969` — success 9/9.

### Materialização inativa

A F76 foi materializada como palco composto `InteractiveVertical + Quadrado100`, ensinando operações decimais por **valor posicional**, não pela regra mecânica de “mover a vírgula”.

Reparos reais antes da certificação inativa:

- `rt_alvo` existe como telemetria de ficha; `rt_max_s` não governa domínio conceitual;
- o passo de ×10/×100 foi nomeado sem disparar falso positivo do guard anti-regra mecânica;
- axe continua auditando os cinco níveis, apenas com orçamento de execução explícito suficiente.

SHA inativo final: `23e5be94faa4fa1f15e73677c97a8a04963c1621`.

- CI `32135341005` — completed/success;
- transversal `32135340907` — completed/success 9/9.

### Promoção atômica

SHA `f74b1f7711b34b11af98f882d19390a2258986db` toca exatamente:

1. `src/curriculum/motores/composerCanaryIds.ts` — ativa `N6.02`;
2. `AI_Studio_Lab/tools/coverage_matrix_core.ts` — ledger `W47-N6.02` com delta `{ composer:+1, fallback:-1, served:+1 }`;
3. `src/curriculum/coverageMatrix.test.ts` — contrato `72/15/3/87/11`.

Recibos finais no mesmo SHA:

- CI `32147466564` — completed/success;
- transversal `32147466708` — completed/success 9/9;
- Gates: catálogo, fichas, conformidade, DAG, TypeScript, **241 arquivos / 3.373 testes**, build e guarda textual verdes;
- Sonda real Sensei, higiene e binários verdes.

**W47 está fechada. Não reabrir sem causa nova observável.**

## 4. PAUSA ENTRE ONDAS — autorização humana obrigatória

O usuário pediu explicitamente uma parada entre W47 e W48 para realizar uma autorização externa.

### Portanto, NÃO FAÇA ainda

- não crie regression-first W48;
- não materialize F94;
- não altere canário, ledger ou Matrix para W48;
- não faça commit técnico da próxima onda;
- não interprete a seleção abaixo como autorização de execução.

### Próxima candidata recalculada, somente informativa

Com W47 removida dos fallbacks, todos os prerequisitos dos três fallbacks restantes estão servidos. Pelo critério vigente (ganho imediato → menor `causalWave` → maior downstream → desempate residual):

- `GM.11` — causalWave 15, downstream residual 0;
- `PE.04` — causalWave 15, downstream residual 0;
- `N5.05` — causalWave 16.

O empate residual entre GM.11 e PE.04 seleciona por ID:

**W48 candidata: `GM.11 / F94 — Volume de Prismas`**, ficha canônica em `AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md`, primitiva `ArrayGrid` em modo 3D.

**Estado: SELECIONADA, MAS NÃO ABERTA. AGUARDAR AUTORIZAÇÃO EXPLÍCITA DO USUÁRIO EM NOVA CONVERSA.**

## 5. Protocolo quando a autorização chegar

Somente após autorização explícita:

1. reancorar o remoto e reler integralmente este arquivo;
2. recalcular Matrix/DAG novamente — a seleção acima não vence deriva remota;
3. se GM.11/F94 continuar vencendo, criar regression-first executável e publicar SHA próprio;
4. exigir vermelho nominal e exclusivo da ausência da ficha/materialização;
5. materializar completa e **INATIVA**;
6. exigir CI + transversal verdes no mesmo SHA inativo;
7. só então promover atomicamente **canário + ledger + contrato Matrix**;
8. exigir CI + transversal verdes no mesmo SHA final;
9. checkpoint + estado + porta + PR body;
10. recalcular a onda seguinte.

## 6. Regras invioláveis do PR #35

- `main` não é área de trabalho;
- PR permanece draft + open + unmerged;
- nunca marcar ready, habilitar auto-merge ou mergear;
- não tocar Creature Engine/Tamagotchi;
- não relaxar testes, P13, Matrix, Radar, contratos ou sondas para obter verde;
- não editar baseline para encobrir observação real;
- promoção e ledger entram juntos, no mesmo SHA;
- canário, Matrix e ledger são declarativos — sem mutação por efeito colateral de import;
- runtime map/evidências/catálogos compartilhados são aditivos: preservar rationale/histórico;
- erro motor não vira misconception conceitual;
- RT conceitual não compra/reprova mastery salvo contrato específico de fluência;
- ajuda/resolução assistida não compra mastery independente;
- uma onda não reutiliza recibos de outra.

## 7. Pós-90/90 preservado

Não confundir `fallback=0` com produto Child-Ready.

- Issue #47 — **Integração Sistêmica e Child-Ready**;
- Issue #48 — **lacunas microcurriculares/microprogressão**, incluindo hipóteses como “segundos?” classificadas antes de virar dívida.

Essas frentes não interrompem a fábrica W48–W50, mas entram em uso forte após o fechamento da última onda.

## 8. Fonte de retomada

Na nova conversa, o comando correto é: reancorar o remoto, ler este arquivo integralmente e **parar se a autorização inter-onda ainda não tiver sido dada**.

## Frente paralela — Observatório (P&D, não runtime)

Existe uma frente registrada na `SAGA-Research-Foundry`, fora desta fila curricular e sem autoridade sobre ela:

- documento: `03_architecture/OBSERVATORIO_E_AUDITORIA.md`
- decisões diretamente correlatas: D057–D065 no `05_decisions/DECISION_LEDGER.md`
- o mesmo Ledger está em v0.99 e contém também D066, referente ao manifesto histórico
- status: `PRE-CANONICAL` · `implementation_authorized: false`

Escopo: Recibo de Sessão, avaliação de aprendizagem fora do motor adaptativo, sete auditorias de motor, personas sintéticas e costuras de expansão.

Nada dela entra no runtime sem autorização explícita do usuário conforme `00_governance/WORKFLOW.md`. Ela não altera onda, canário, Matrix, ledger curricular nem runtime map. Não interromper a fila curricular por causa dela.
