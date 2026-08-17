# Estado do Fechamento Curricular — SAGA

**Última atualização operacional:** 17/08/2026 — W43 fechada; W44/F74 materializada e inativa, com portão técnico verde  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — deve permanecer **draft + open + unmerged**  
**Base protegida:** `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`  
**Fonte de verdade:** GitHub remoto + gates executáveis do mesmo SHA.

> Este arquivo é um **índice vivo**, não um ledger histórico. O histórico detalhado permanece nos checkpoints por onda e no Git. Para executar trabalho, leia primeiro `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`.

## Estado atual

- Ondas **W1–W43 fechadas**.
- W44 = `N5.04 / F74 — Somar Frações`.
- F74 está **materializada, registrada no Composer e INATIVA**.
- Última Matrix de produção fechada: **68 Composer / 15 legado / 7 fallback / 83 servidas / 11 divergências**.
- Composer registrado no estágio inativo W44: **69**, dos quais **68 ativos + N5.04 inativa**.
- 90 competências / 94 fichas autorais.
- `modeSwaps=12`.
- `toolIntroductions=44`.
- primitiva autoral ainda ausente: `Moedas`.

Fallbacks ainda não fechados:

`AL.08, GM.11, N5.04, N5.05, N6.02, N6.04, PE.04`.

## Último fechamento completo

### W43 — `N4.12 / F71 — Dividir por Dois Dígitos`

Recibo final: `83c18fd6902bb3d23a77fca04c051cd417b103b7`.

- CI `32048810747`: `completed/success`;
- Certificação transversal `32048810884`: `completed/success`;
- Matrix final: `68/15/7/83/11`.

Não reabrir W43 sem causa nova observável.

## W44 — estado técnico

### Regression-first

SHA `34b6b3a5ed3fde597564685e7b2a820c2beca0f7`:

- CI `32050560773`: `completed/failure`, vermelho nominal exclusivamente pela ausência de `N5.04/F74`;
- transversal `32050560782`: `completed/success`;
- 3.279/3.280 testes verdes.

### Materialização inativa certificada

Recibo técnico inativo vinculante: `a41e6e9e6317efcec230b879722a8ae3fcafd8ae`.

- CI `32052726802`: **completed/success**;
- Certificação transversal `32052726430`: **completed/success**;
- Gates: catálogo, fichas, conformidade, grafo, TypeScript, 235 arquivos / 3.287 testes, build e guarda textual verdes;
- higiene e binários verdes;
- `N5.04` continua fora do canário ativo;
- ledger e Matrix continuam pós-W43.

F74 realiza `SingaporeBars` com denominador fixo, soma/subtração, fração imprópria e simplificação como mesma quantidade/outro nome. Diagnósticos: `soma-denominador`, `nao-simplifica`, `impropria-invalida`. A restrição especial de domínio usa `masteryDisqualifier`, sem segunda autoridade de mastery.

## Próxima ação obrigatória

**Não repetir regression-first nem materialização F74.**

A próxima conversa deve:

1. reancorar PR/HEAD/main/reviews/threads;
2. ler integralmente `PROMPT_DE_RETOMADA.md` e `CHECKPOINT_FABRICA_CURRICULAR_W44_N5_04_F74_INATIVA_CERTIFICADA_2026-08-17.md`;
3. confirmar o portão inativo `a41e6e9e…`, CI `32052726802` + transversal `32052726430`;
4. promover W44 **atomicamente no mesmo SHA**: canário `N5.04` + ledger `W44-N5.04` + contrato Matrix;
5. observar o delta real da Matrix; se só a ativação mudar, expectativa `69/15/6/84/11`, mas a saída executável vence a expectativa;
6. exigir CI + transversal verdes do SHA final da promoção;
7. fechar W44 documentalmente;
8. recalcular DAG/Matrix antes de escolher W45.

`N5.05` depende de `N5.04 + N6.04`; a fila pós-W44 deve ser recalculada, não copiada de memória.

## Documentos vivos de retomada

- `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md` — porta operacional principal;
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W44_N5_04_F74_INATIVA_CERTIFICADA_2026-08-17.md` — recibo humano do ponto atual;
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W43_N4_12_F71_FECHADA_2026-08-17.md` — último fechamento completo;
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`;
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`;
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`.

## Governança

- `main` intocada;
- PR #35 permanece draft/unmerged;
- sem auto-merge/ready;
- sem Creature Engine/Tamagotchi;
- cânone compartilhado é aditivo;
- não apagar rationale/aliases/notas históricas;
- não relaxar testes, sondas ou Matrix;
- não misturar recibos de SHAs diferentes;
- issues #47 e #48 permanecem pós-90/90 e não interrompem W44–W50.
