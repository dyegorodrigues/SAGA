# Decisão P22 — dívidas curriculares deliberadas

**Data:** 8/ago/2026
**Branch:** `codex/integrar-bloco-f0`
**Pré-requisito:** P21 fechada e governança de fontes de verdade estabilizada.

## Estado

P22 audit-first foi aberta no run `31276442048` = success.

Ordem executada:

1. P22.1 — GM.12;
2. P22.2 — N4.09;
3. P22.3A — N1.07 Jornada;
4. P22.3B — JD4 Jardim;
5. P22.4 — N1.09;
6. P22.5 — GM.02.

**P22 está CONCLUÍDA.**

## 1. N1.09 — decisão executada em P22.4

`N1.09` permanece **Contagem até 20 e a partir de qualquer número**, prereqs `N1.04 + N1.02`.

O legado cobre somente continuação parcial de sequência e permanece rollback. A ficha autoral mede conjuntos 10–20, início em N, regressiva e recuperação mista.

## 2. GM.02 — decisão executada em P22.5

`GM.02` permanece **Tempo cotidiano**, prereqs `[]`: partes do dia, ontem/hoje/amanhã, dias da semana e ordenação de eventos.

O legado “Manhã ou Noite?” permanece rollback parcial. A atividade autoral é pré-leitora: `audioPrompt`, opções audíveis e iconografia carregam a linguagem essencial. Massa/capacidade permanece em GM.12.

## 3. N1.07 ↔ JD4 — decisão executada

- Jornada N1.07 = compreensão conceitual;
- JD4 = treino posterior de automaticidade de sucessor/antecessor;
- `dojoTracks` separado do progresso da Jornada;
- `rt_alvo` nunca concede domínio conceitual.

## 4. P22.1 — GM.12 CONCLUÍDA

Gate `31276881058`: **success**.

## 5. P22.2 — N4.09 CONCLUÍDA

Gate `31277213310`: **success**.

Gabarito de área sem misconception; somente distratores carregam hipótese diagnóstica.

## 6. P22.3A — N1.07 CONCLUÍDA

Commit `d233591dcb7aa4b5a7883430fa769c5e9dae3823`.
Gate `31281685349`: **success**.
Clean follow-up `31281842046`: **success**.

N1.07 cobre sucessor, antecessor e ordenação conforme o grafo, prereqs `N1.02 + N1.06`.

## 7. P22.3B — JD4 CONCLUÍDA

Gate `31282358997`: **success**.

JD4 entrou no Jardim com estado em `dojoTracks`, sem entrar no grafo/Journey registry e sem conceder domínio conceitual à mãe.

## 8. P22.4 — N1.09 CONCLUÍDA

Entregue:

- 93ª ficha Markdown com nove seções;
- Journey TS + teste permanente;
- builder procedimental pela porta autoral de produção;
- L1 10–15, L2 10–20, L3 partir de N, L4 regressiva, L5 misto;
- `rt_alvo=20s` como metadado de fluência;
- telemetria causal `NAO_CONTA_A_PARTIR_DE` e `DIRECAO_ERRADA`;
- legado preservado como rollback;
- exceção autoral N1.09 removida.

A sonda encontrou colisões reais em `ScatteredItems`; o palco passou a usar células invisíveis embaralhadas + jitter determinístico, com teste geométrico permanente.

Evidência:

- `31286476155` = success;
- sonda real `31286955931` = success;
- clean CI `31287106974` = success.

## 9. P22.5 — GM.02 CONCLUÍDA

Entregue:

- 94ª ficha Markdown com nove seções;
- Journey TS + teste permanente;
- builder procedimental pré-leitor;
- L1 manhã/tarde/noite;
- L2 ontem/hoje/amanhã;
- L3 dia anterior/seguinte;
- L4 ordenação de três acontecimentos;
- L5 mistura as quatro famílias;
- `rt_alvo=12s` como metadado de fluência;
- resposta correta sem misconception;
- diagnósticos `DIRECAO_ERRADA`, `OFF_BY_ONE`, `ORDEM_ERRADA` somente quando causais;
- legado parcial preservado como rollback;
- GM.02 registrada e ativa no Composer;
- última exceção autoral removida;
- auditor específico passou a derivar a contagem em vez de congelar 93/94;
- testes globais de Journey passaram a usar a mesma porta autoral de produção;
- builders especializados passaram a propagar `rt_alvo → rt_max_s`.

A primeira sonda (`31287813598`) encontrou dois defeitos compartilhados: contraste 4,22:1 no aviso de áudio e selo 🔊 cobrindo conteúdo. O CSS compartilhado foi corrigido — sem exceção de ficha — e a mesma prova passou em `31288014568`.

Clean CI sem bancada: `31288136803` = **success**.

## 10. Estado final de P22

- grafo: **90/90**;
- fichas Markdown: **94**;
- cobertura autoral: **90/90**;
- exceções autorais: **0**;
- Journey: **31/31**;
- Composer registrado: **26**;
- Composer ativo: **26**;
- Composer inativo: **0**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- mapa P21.2: **20 executáveis / 4 renderer-sem-builder / 1 componente-isolado / 1 ausente**.

Dívidas de primitiva mantidas explícitas: LinkingCubes, Moedas, SingaporeBars, VisualAddition, Quadrado100 e Regua.

## 11. Próxima fase

Seguir `PLANO_POS_P22_FABRICA_CURRICULAR.md`.

Primeiro: auditoria longitudinal da máquina adaptativa:

`GameLoop answer → misconception/evidence → mastery/progression → persistence → Radar/review → recommendation → unlock`.

Somente após provar discrepâncias começar correções algorítmicas.

## 12. Regra que sobrevive a P22

Cobertura 90/90 não significa produto curricular terminado. Significa que nenhum nó canônico está sem especificação autoral. A fábrica curricular, os motores adaptativos, a cobertura executável e o hardening continuam separados e auditáveis.

> **Promoção, mastery e automaticidade são consequências de evidência; nunca atalhos para deixar uma tabela verde.**