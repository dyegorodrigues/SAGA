# Handoff de continuidade — SAGA / branch cumulativa

> **VIGENTE — 8/ago/2026, após P20.**  
> Ponto de entrada de qualquer sessão nova. O repositório é a fonte de verdade.

## 1. Leia nesta ordem

1. `AI_Studio_Lab/codex/MAPA_MESTRE_POS_P20.md`
2. este arquivo;
3. `AI_Studio_Lab/codex/BRIEFING_CODEX.md`
4. decisões P17/P8/P19/P20 conforme a frente tocada;
5. PR #29 apenas como janela de comparação/CI.

Roadmaps de 5/ago (`ROTEIRO_ATE_O_FIM.md`, seções antigas de `RETOMADA.md`, `PLANO_DO_BLOCO_F0.md`) são registro histórico. **Não usar números/fila antigos sem recalcular o runtime.**

## 2. Git — regra de ouro

- Repo: `dyegorodrigues/SAGA`.
- Trabalho: **`codex/integrar-bloco-f0`**.
- `main` protegida/imóvel: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- PR #29: open + draft, base `main`, comparação/CI; **não mesclar / não auto-merge**.
- Creature Engine fora deste fluxo:
  - `agent/creature-engine-tamagotchi`
  - `codex/criar-branch-para-creature-engine-tamagotchi`
- Não criar branch auxiliar para esta linha.
- Workflow/script temporário se apaga no lote que publica.

## 3. Blocos fechados

### P17 — N1.10/N1.11

- N1.10: `JD5 perceptual → retirada real de moldura → NumberBond`;
- `SEM_MOLDURA` é gate antes da formalização;
- N1.11: `JD3 perceptual → F28 NumberBond → n + □ = 10`;
- tempo é fluência/telemetria, não domínio conceitual da Jornada.

Documento: `DECISAO_P17_N110.md`.

### P8 — Jardim do Dojo

- JD1→N1.03;
- JD2→N1.08;
- JD3→N1.11;
- JD5→N1.10;
- JD fora do DAG;
- estado em `dojoTracks`;
- GameLoop Garden não usa `applyJourneyAnswer`;
- automaticidade separada de compreensão;
- DojoTab real + testes + sonda 320/390/900.

**JD4 continua dívida confirmada.**

Documento: `DECISAO_P8_JARDIM.md`.

### P18 — KindType

Todo kind autoral declarado possui builder no Composer. Legado continua em `Question.kind` string.

### P19 — migrador/dependências

- migrador único em `src/utils/migrator.ts`;
- App não pode recriar migrador paralelo;
- npm audit completo e produção = 0 após lockfile conservador;
- sem major e sem `npm audit fix` cego.

Documento: `DECISAO_P19_ESTADO_E_DEPENDENCIAS.md`.

### P20 — identidade do save

Commit funcional:

`f45509ca73739d93fe32986c9cf7bcc5aaf6337a`

Arquitetura:

- produção salva localmente por Firebase UID (`mk-state-v1:<uid>`);
- chave global antiga só é ponte de migração com dono controlado;
- bootstrap único lê/valida/migra candidatos antes de escolher;
- local/cloud não são misturados campo-a-campo silenciosamente;
- debounce leva o UID que originou o estado;
- trabalho stale é descartado/cancelado na troca de identidade;
- anônimo→Google usa link para preservar UID;
- login não instala `defaultState()` antes do bootstrap;
- logout descarrega antes do sign-out.

Gate transacional run `31273869346`: patch + focais + auditores + suíte completa + build + publicação = **success**.

O run de CI criado no commit auto-publicado terminou `action_required` **sem nenhum job**; não é uma suíte vermelha. A prova executável que autorizou a publicação foi o gate transacional verde.

Documento: `DECISAO_P20_IDENTIDADE_SAVE.md`.

## 4. Canários — fonte única

Fonte:

`src/curriculum/motores/composerCanaryIds.ts`

Ativos conhecidos após P20:

- N3.09, N3.10;
- N4.03, N4.04, N4.06, N4.07, N4.08;
- N1.07;
- N1.01, N1.02, N1.03, N1.04, N1.06, N1.08, N1.10, N1.11, N1.13;
- AL.01, AL.02;
- GE.01, GE.02;
- GM.01.

Registradas, não ativas:

- N4.09;
- GM.12.

Promoção futura = **um id por commit**, com rollback e QA próprios.

## 5. Próxima frente: P21 — reconciliar as fontes de verdade

Não construir conteúdo novo primeiro.

Recalcular no runtime:

- número real de nós;
- fichas autorais;
- canários ativos/registrados;
- legado/fallback;
- primitivas executáveis;
- divergências ficha×runtime;
- dívida real versus dívida histórica já fechada.

Depois marcar como superados os números/filas antigos em:

- `ROTEIRO_ATE_O_FIM.md`;
- `PLANO_DO_BLOCO_F0.md`;
- qualquer trecho histórico ainda usado como orientação operacional.

O roteiro atual completo está em `MAPA_MESTRE_POS_P20.md`.

## 6. Backlog depois da P21

### Confirmado

- N4.09: registrada, não ativa; reauditar antes de promoção.
- GM.12/F50: implementada/registrada/QA visual; continua em observação.
- JD4: ausente do `JARDIM` por decisão explícita; auditar relação com N1.07 antes de implementar.
- primitivas `Moedas` e `Regua`: construir somente quando gargalo real exigir.

### Revalidar, não assumir

- dívida antiga de coreografia: N3.10, N4.03, N4.04, N4.06, N4.07, N4.08 L3–L5;
- P4 / teste intermitente antigo;
- qualquer contagem antiga de legado/vazio/divergência.

## 7. Fases grandes planejadas

### A. Auditoria dos motores adaptativos/meta-algoritmos

Auditar longitudinalmente:

- Progress Engine;
- Composer/Minha Aula;
- Radar;
- Oficina/resgate;
- Jardim;
- FD/Sensei e PD;
- matrícula;
- desafio misto;
- Leitner/retenção;
- domínio/evidências;
- unlock do grafo;
- telemetria usada na decisão.

Simular perfis: lento mas correto, rápido chutando, misconception persistente, esquecimento, dependência de andaime, visual→simbólico fraco, retorno após semanas etc.

### B. Mega auditoria de engenharia pedagógica

Quatro lentes:

1. currículo/grafo;
2. ficha/atividade;
3. design pedagógico das primitivas;
4. história completa da criança do zero ao avançado.

Confrontar com pesquisa externa atualizada e produzir matriz por competência: `OK / micro-lacuna / estrutural / precisa observação`.

### C. Auditoria do Dojo completo

Separar e integrar:

- Jardim/JD = pré-simbólico;
- FD = fatos;
- PD = procedimentos.

### D. Release hardening

Só depois das correções pedagógicas/motores: full QA, auth/offline/saves antigos, browsers/tablet, acessibilidade, performance, dados infantis/telemetria, docs/branches e decisão do autor sobre integração.

## 8. Portões de qualquer lote

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
git diff --check
```

Tela afetada também exige sonda/prints reais.

## 9. Não fazer

- não tocar `main`;
- não tocar Creature Engine;
- não reabrir P17/P8/P19/P20 sem falha objetiva;
- não criar currículo paralelo;
- não criar `progress[JD*]`;
- não misturar lentidão com misconception;
- não promover N4.09/GM.12 por momentum;
- não implementar JD4 antes da auditoria mãe/trilha;
- não usar roadmap antigo como fila atual;
- não tratar teste verde como prova pedagógica completa;
- não deixar bancada temporária órfã.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
