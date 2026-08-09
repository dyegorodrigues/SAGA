# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md`. Próximo bloqueante único: **simulação longitudinal**.

## Leia

1. `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `CHECKPOINT_MATRICULA_FECHADA_2026-08-09.md`
4. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 open + draft + unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head remoto antes de editar.

## Não reabra

Cânone, Tutor↔Dojo, QA Chrome, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone, recomendador por estrelas, Misto elegível, Matrícula adaptativa e **Cloud Reconciliation** estão fechados.

Cloud funcional: `f76017e3a8ed2a15fb5561f2fc886f6445964168`, CI #766 / run `31319778442`, **150 arquivos / 2.325 testes**, build/TypeScript/auditores/higiene/binários/Chrome verdes; artefato `9039831130`.

Contratos de cloud fechados:

- UID local escopado e legado com owner/família;
- `State.updatedAt` é autoridade lógica;
- write Firestore transacional rejeita stale arrival;
- horário externo Firestore é só transporte;
- empate preserva cloud já aceito;
- Aula/Dojo materializados antes de React/save sem re-carimbo;
- anonymous→Google preserva UID/namespace via link;
- retry offline automático mantém um único pending state;
- estado novo suplanta retry velho;
- troca de UID cancela também retry de write antigo em voo;
- duas abas/dois dispositivos cobertos;
- campos atuais de learner state sobrevivem round-trip;
- nenhum merge campo-a-campo inventado;
- nenhum `DEPLOYMENT-ONLY` novo.

## Faça agora — simulação longitudinal

Construa uma simulação sintética determinística que execute o Learner Model/Sensei ao longo de múltiplas sessões e reloads.

Perfis mínimos:

1. iniciante absoluto;
2. ritmo típico;
3. alta facilidade/avanço rápido;
4. dificuldade persistente + remediação causal;
5. esquecimento/retenção + revisão;
6. retorno após intervalo.

Trace recomendado:

`estado inicial → Matrícula/estado já existente → planAula/Sensei → respostas → progress/source/mastery/Radar/Leitner → Dojo/Jardim/Oficina quando causalmente elegíveis → persist/reload → próxima sessão → invariantes`.

Provar, entre outros:

- uma meta dominante por Aula;
- idade/série nunca viram teto curricular;
- RT/fluência não compram nem retiram domínio conceitual;
- Dojo manual não move ponteiro adaptativo do Tutor;
- prescrição de Dojo só move estado próprio;
- Jardim/Oficina só entram por causa demonstrável e têm saída;
- Misto só usa repertório elegível;
- retenção/esquecimento geram revisão sem apagar domínio por velocidade;
- reload não muda a decisão apenas por efeito de persistência;
- nenhum estado fica preso em loop sem saída.

Primeiro escreva regressões/invariantes. Corrija produção apenas quando a simulação provar bug real.

## Dívida curricular continua inventariada

26/90 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias; primitivas incompletas no inventário. Não iniciar fábrica antes da Coverage Matrix.

## Depois

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
