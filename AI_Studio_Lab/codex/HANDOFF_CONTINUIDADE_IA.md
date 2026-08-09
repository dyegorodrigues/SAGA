# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Fonte principal: `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md`. Próximo bloqueante único: **simulação longitudinal**.

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main `68fad4c575e28959b2ca4776e9a541d6828b63f3` protegida;
- PR #29 open + draft + não mesclar/ready/auto-merge;
- não tocar Creature Engine;
- não criar branch auxiliar;
- reancorar PR/head antes de qualquer edição;
- GitHub remoto é a fonte da verdade.

## Primeira leitura

1. `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `BRIEFING_CODEX.md`
4. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

## Fechado

P17–P22, cânone, Radar/source/persist, Sensei full DAG, Oficina causal, Tutor↔Dojo, QA real, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone/dia civil, recomendador por estrelas, Misto elegível, Matrícula adaptativa e **Cloud Reconciliation**.

Cloud funcional:

- head `f76017e3a8ed2a15fb5561f2fc886f6445964168`;
- CI #766 / run `31319778442`;
- 150 arquivos / 2.325 testes;
- build/TypeScript/auditores/higiene/binários/Chrome verdes;
- artefato `9039831130`.

Cloud agora garante, sob o contrato atual:

- storage local por UID e legado protegido;
- escolha bootstrap por `State.updatedAt`;
- stale writer rejeitado atomicamente por transação;
- empate preserva cloud já aceito;
- timestamp externo Firestore não tem autoridade curricular;
- Aula/Dojo materializados antes de React/save sem re-carimbo;
- anonymous→Google preserva UID/namespace;
- erro offline mantém pending write e tenta novamente;
- write novo suplanta retry velho;
- troca de UID mata também retry de write em voo;
- duas abas e dois dispositivos cobertos;
- `dojoTracks`, `masteryEvidence`, `bank`, `reviewForce`, `lastDay`, FactStrength/ProcStrength e schema sobrevivem round-trip;
- sem merge campo-a-campo;
- sem `DEPLOYMENT-ONLY` novo.

Riscos residuais não bloqueantes: clock skew entre aparelhos, conflitos simultâneos whole-state sem merge especificado e retry fixo de 8 s. Não resolver inventando semântica nova dentro da simulação.

## Próxima tarefa — simulação longitudinal

Objetivo: provar que a máquina pedagógica se comporta corretamente ao longo do tempo, não apenas em testes pontuais.

Perfis mínimos:

- iniciante absoluto;
- ritmo típico;
- alta facilidade;
- dificuldade persistente;
- esquecimento/retenção;
- retorno após intervalo.

Trace:

`estado inicial → Sensei/placement → plano → questões/source → respostas → mastery/Radar/Leitner/Dojo → persist → reload → próxima sessão → decisão seguinte`.

Invariantes a manter:

- Sensei é a autoridade prescritiva;
- uma meta dominante por aula;
- Jornada é mapa;
- idade/série não podam grafo;
- RT/fluência não concedem/retiram domínio conceitual;
- Dojo livre não move ponteiro adaptativo do Tutor;
- Dojo prescrito move apenas estado adaptativo do Dojo;
- Jardim e Oficina são causais e têm saída;
- Misto é opcional e só usa repertório elegível;
- placement não concede `dom=true`;
- fallback não é evidência real;
- gamificação não compra progresso.

Primeiro regressões/simulações determinísticas. Patch somente para bug provado. Não abrir gamificação/fábrica durante esta frente.

## Dívida curricular não perdida

26 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias; primitivas incompletas no inventário. A fábrica entra depois da Coverage Matrix.

## Fila posterior

simulação longitudinal → gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening/performance/release.

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

**Uma competência só está pronta quando código, telemetria, persistência e experiência real da criança concordam.**
