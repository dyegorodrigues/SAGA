# Estado do Fechamento Curricular — SAGA

**Data de abertura desta linha:** 11/08/2026  
**Última atualização:** 12/08/2026 — W9 fechada / contrato de resolução costurado antes da W10  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — draft, open, unmerged  
**Fonte de verdade:** GitHub remoto + gates executáveis. Este arquivo é checkpoint de retomada; a evidência remota do mesmo SHA prevalece.

## Estado operacional

HEAD de produto comprovado antes deste checkpoint: `4dec3ad576d8ae57490f535b58bd9103282758d9`.  
CI desse HEAD: #1177 / run `31628659208` — **success em 6/6 jobs**, incluindo Gates do SAGA, Sensei/F13/F15 em Chrome real, transversal 320/900 e transversal `390px × 8 sementes`.  
Bloco 0 — **CONCLUÍDO**.  
Bloco 1 — **EM EXECUÇÃO**. W7, W8 e W9 fechadas.  
Matrix pós-W9: `34 Composer / 18 legado / 38 fallback / 52 servidas / 15 divergências / 12 swaps / 44 estreias`.  
Ondas fechadas nesta linha: W7 `N2.02/F36`; W8 `N3.01/F13`; W9 `N3.02/F15`.  
Próxima sequência operacional: **R0-A (Contrato de Resolução, sem delta de Matrix) → W10 `N3.03/F14` → W11 `AL.03/F30` → W12 `N4.01/F97`**.

## Recibo do Bloco 0

1. PR #29 foi reancorado no remoto em `5d3daa1b5735be725319e0d463af13f0f5d17fce` com CI #1085 / run `31548303226` integralmente verde.
2. W6 `N2.03/F29` estava fechada e retificada; nenhum review thread permanecia aberto.
3. O merge do PR #29 foi autorizado pelo autor e executado por merge commit, com `expected_head_sha`; merge commit `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.
4. A branch histórica `codex/integrar-bloco-f0` foi preservada e `codex/fechamento-curricular` nasceu exatamente do merge.
5. O flake pós-merge da fixture F19 foi reparado somente na nova branch, sem alterar runtime ou expectativa pedagógica.
6. O PR #35 foi aberto em draft no primeiro diff legítimo e continua sendo a única linha desta fábrica.

## W7 — N2.02 / F36 — FECHADA

- `Quadrado100` ganhou owner executável por specialized builder local e `Quadrado100Stage`.
- Onboarding explícito; +1 horizontal, +10 vertical, +5, vizinhos e lacunas preservados.
- Promoção somente após suíte, Chrome 320/390/900 e transversal 390×8 verdes.
- Recibo: HEAD `88fbeb40…`, CI #1129 verde.
- Delta: `{ composer: +1, legacy: -1 }`.
- Matrix pós-W7: `32 / 20 / 38 / 52 / 16`.

## W8 — N3.01 / F13 — FECHADA

- F13 ganhou specialized builder e `VisualAdditionStage` próprios, mantendo `VisualAddition` como superfície compartilhada.
- Escada: objetos+numerais → numerais nos contêineres no L4 → símbolo puro no L5; evidência `adicao-sem-objetos`; RT silencioso de 5 s no L5.
- Screenshots descobriram duplicação visual no L5 e o gate pós-promoção descobriu duplicidade de superfície de resposta; ambas foram corrigidas na fonte.
- Recibo final: HEAD `46dd06d40bec980e25ec87a3581e9e95f2710d02`, CI #1163 / run `31590118288` — 6/6.
- Delta: `{ composer: +1, legacy: -1 }`.
- Matrix pós-W8: `33 / 19 / 38 / 52 / 16`.

## W9 — N3.02 / F15 — FECHADA

### Contrato pedagógico preservado

- F15 usa `EmojiRow#riscar`: a criança executa a retirada em vez de receber leitura pronta.
- O primeiro degrau alfabetiza explicitamente **X = saiu / foi removido** antes de cobrança de conteúdo.
- O objeto riscado permanece no mesmo slot; a marcação não pode deslocar o objeto.
- O acerto corrigido após `RESPONDE_O_REMOVIDO` continua sendo tentativa real e alimenta feedback/Radar, mas não compra independência/domínio.
- O palco autoral responde no próprio `EmojiRowRiscarStage`; `q.options` permanece catálogo diagnóstico, não é a grade visual do teclado.

### Recibo técnico

1. Implementação inativa: ficha N3.02, specialized builder, runtime kind `emojirow-riscar-f15`, Stage, contrato procedural, semântica, mastery correction, a11y e sonda Chrome.
2. CI #1168 identificou deslocamento real do slot fantasma (`dx=2`, `dw/dh=4`) causado por borda; a fonte foi corrigida para `outline` no commit `4218ac68…`.
3. CI #1169 / run `31597318974` comprovou a cadeia inativa verde, incluindo F15 em Chrome real (`15 cenários + 12 passos`).
4. Promoção declarativa de `N3.02` entrou no canário; o gate genérico passou a registrar a ficha no contrato e o teste regression-first foi convertido em pós-promoção.
5. A primeira execução pós-promoção fez a Matrix ficar vermelha em `34 Composer / 18 legado`: isto foi tratado como **observação**, não como erro a esconder.
6. O auditor da Coverage Matrix ainda achatava `emojirow-riscar-f15 + modo=riscar` para `EmojiRow`; a ponte de observabilidade foi corrigida para qualificar `EmojiRow#riscar`.
7. Ledger W9 registrado com delta `{ composer: +1, legacy: -1, divergences: -1 }`; snapshot P21.1 permaneceu imutável.
8. O canary contract revelou que F15 usa teclado autoral 0–10 enquanto `q.options` guarda alternativas diagnósticas. O gate foi especializado para validar **as duas superfícies**, sem relaxamento de cobertura.
9. A sonda F13 apresentou 404 anônimo num run pós-promoção; o portão foi fortalecido para registrar URL/status HTTP e localização de `console.error`. No HEAD final F13 e F15 passaram em sequência.
10. Recibo de produto: HEAD `4dec3ad576d8ae57490f535b58bd9103282758d9`, CI #1177 / run `31628659208` — **6/6 verde**.

### Matrix pós-W9

`34 Composer / 18 legado / 38 fallback / 52 servidas / 15 divergências / 12 swaps / 44 estreias`.

## Costura nova — Motor de Resolução

Os documentos `MOTOR_DE_RESOLUCAO.md`, `MOTOR_DE_RESOLUCAO_PARTE_2_DESIGN.md` e `MENSAGEM_PARA_O_CODEX.md` foram auditados no checkpoint correto da W9, como solicitado pelo próprio pacote.

A análise completa e as correções ao plano estão em:

`AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`

Decisão de ordem:

- **não** retroagir W7/W8/W9 agora;
- **não** começar pela conta armada;
- inserir **R0-A — Contrato de Resolução** imediatamente antes da W10;
- R0-A é infraestrutura técnica, **não** uma migração de Coverage Matrix e não ganha delta fictício no ledger curricular;
- a W10/N3.03/F14 será a primeira competência nova obrigada a nascer emitindo `resolucao()` tipada; W11 e W12 herdam o contrato;
- comportamento runtime do tutor (player manual, pausa de RT, faixa do tutor, item espelho) fica fora de R0-A e entra em fase posterior, depois que o contrato de dados estiver provado.

## R0-A — critérios antes de W10

R0-A deve seguir regression-first, mas sem promover competência:

1. consolidar `TutStep` em uma única definição de tipo e evitar um terceiro dialeto de tutorial;
2. criar `PassoDeResolucao<TShow>` e `Question.resolucao` sem React/DOM;
3. criar utilitários puros de entrada por equívoco e estado visual anterior ao passo;
4. preferir `show` como snapshot declarativo tipado por família/palco, não sequência imperativa dependente de timing;
5. `corrige` é índice semântico; `parcial` é invariante/estado, não substituto de diagnóstico;
6. teste universal: caminho declarado termina na resposta quando a família possuir resposta escalar/validável;
7. teste: misconceptions geráveis pela família que declara resolução têm ao menos um passo corretivo ou fallback explícito;
8. portões de dependência: procedimento não importa React; primitives/Stages não importam currículo para interpretar resolução;
9. **nenhuma alteração em GameLoop/UI na R0-A**;
10. Matrix permanece exatamente `34/18/38/52/15` após R0-A.

## Ordem causal restante do Bloco 1

- R0-A — contrato técnico de resolução; sem Coverage delta.
- W10 `N3.03/F14` — `LinkingCubes + NumberLine`; primeira adoção obrigatória de `resolucao()` tipada e owner de `LinkingCubes`.
- W11 `AL.03/F30` — `InteractiveNumberLine + Quadrado100`; nasce sob o mesmo contrato.
- W12 `N4.01/F97` — `Grupo ×N`; só fecha depois de N3.03 + AL.03 e também nasce sob o contrato.

## Critério de saída do Bloco 1

- 6 nós do bloco em Padrão Ouro;
- legados ≤ 15;
- divergências ≤ 10;
- `Quadrado100`, `VisualAddition` e `LinkingCubes` com builder e owner declarados;
- nenhuma promoção sem portão inativo + Chrome real + CI do mesmo SHA;
- snapshots históricos permanecem imutáveis; somente o ledger registra deltas observados;
- R0-A não falsifica Matrix nem conta como competência fechada.

## Decisões autônomas vigentes

- Nenhum patch direto na `main`; trabalho somente em `codex/fechamento-curricular`.
- PR #35 permanece draft; nenhum merge sem nova autorização humana explícita.
- Creature Engine continua fora do escopo desta linha.
- Thinking Engine runtime continua não autorizado.
- Gate vermelho é evidência: corrigir fonte/observabilidade/contrato, não diminuir a expectativa.
- Nenhuma faxina P2 oportunista; limpeza do legado vertical só no escopo em que a resolução vertical for atacada.

## Condições de parada

Escalar ao autor antes do fechamento do Bloco 1 somente se ocorrer:

1. rejeição humana de versão visual;
2. necessidade real de afrouxar um gate;
3. invalidação do plano/DAG;
4. decisão que altere arquitetura ou pré-requisitos fora da costura já registrada.

Fora disso: decidir localmente, registrar, provar no remoto e seguir R0-A → W10 → W11 → W12.
