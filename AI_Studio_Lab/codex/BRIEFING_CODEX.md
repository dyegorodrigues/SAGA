# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`. Próximo bloqueante único: **Coverage Matrix**.

## Leia

1. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`
4. `CHECKPOINT_SIMULACAO_LONGITUDINAL_FECHADA_2026-08-09.md`
5. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
6. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`
7. cânone em `AI_Studio_Lab/pedagogia/`: `BIBLIA_DO_SAGA.md`, `GRAFO_DE_CONHECIMENTO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md`, `DOJO_SAGA.md`.

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 deve permanecer open + draft + unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head remoto antes de editar.

## Não reabra sem falha objetiva

Cânone P17–P22, Tutor↔Dojo, QA Chrome, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone, recomendador por estrelas, Misto elegível, Matrícula adaptativa, Cloud Reconciliation, Simulação Longitudinal e **Gamificação / Economia / Meta-jogo** estão fechados.

### Contratos do meta-jogo já fechados

- learner state decide aprendizagem/mastery;
- Nível SAGA 1–100 é do perfil da criança;
- XP vitalício não é moeda e não compra competência;
- moedas são gastáveis com transações atômicas;
- velocidade não multiplica XP nem mastery;
- Dojo/Jardim preservam XP sem misturar estados conceituais;
- Atlas/insígnias são projeção do Curriculum Graph e das evidências reais;
- fallback não recompensa;
- Misto dobra moeda, não XP/mastery;
- retry/double tap/reload/materialização não duplicam o mesmo evento técnico;
- replay legítimo pode pagar prática nova, sem repetir bônus único de primeira missão.

Recibo funcional: `791a21b002794e29818551adbb5cdb93138105e9`; CI #811/run `31325208953`; **155 arquivos / 2.367 testes**; build/TypeScript/auditores/grafo/PR/higiene/binários/Chrome verdes; artefato `9074276985`.

## Faça agora — Coverage Matrix

Não começar a fábrica. Primeiro produzir uma matriz única que, para **cada uma das 90 competências**, ligue:

`nó do Curriculum Graph → ficha(s) canônica(s) → implementação/runtime → screen/primitiva → caminho no Composer/Sensei → testes/auditores → status de serviço → dívida/bloqueio → ação necessária → dependências/ordem causal`.

Classificar objetivamente:

1. servido real/canônico;
2. legado aproveitável;
3. fallback;
4. divergência ficha↔screen;
5. linguagem visual que não serve a ficha;
6. ferramenta/primitiva sem onboarding;
7. primitiva inexistente ou incompleta;
8. cobertura de teste insuficiente;
9. bloqueio que impede competências dependentes.

A matriz deve ser auditável/reproduzível e preservar os números já inventariados como baseline, explicando qualquer diferença encontrada.

## Dívida de partida — não esconder

- Composer 26/90;
- 51/90 servidas sem placeholder;
- 25 prontas em legado;
- 39 fallback;
- 21 divergências ficha↔tela;
- 12 trocas visuais;
- 44 estreias;
- primitivas incompletas `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

Se a Coverage Matrix encontrar números diferentes, não ajustar expectativa para ficar verde: investigar a causa e registrar a reconciliação.

## Visão futura — preservada, fora da fila

Companheiro/NPC meta-inteligente, widget, necessidades suaves, emoções/retratos, animais lutadores humanoides/pixel art, fighting game, beat ’em up 2.5D e Thinking Lab estão documentados em `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`. São direção evolutiva e podem ser refinados; não são autorização para tocar no Creature Engine agora.

## Depois

`Coverage Matrix → fábrica curricular → mega auditoria integrada → hardening/performance → release`.

## Gates

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
npm run sonda:sensei-dojo
```

**Uma competência só está pronta quando código, telemetria, persistência, ficha canônica e experiência real da criança concordam.**
