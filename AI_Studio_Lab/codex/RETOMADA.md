# Retomada — comece por aqui

> **VIGENTE a partir de 8/ago/2026, pós-P20.**  
> A conversa pode desaparecer; o repositório não.

## 1. Não comece pelo histórico

A primeira leitura de qualquer sessão nova é:

1. [`MAPA_MESTRE_POS_P20.md`](./MAPA_MESTRE_POS_P20.md)
2. [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md)
3. [`BRIEFING_CODEX.md`](./BRIEFING_CODEX.md)

`ROTEIRO_ATE_O_FIM.md` e `PLANO_DO_BLOCO_F0.md` preservam análise histórica importante, mas vários números, canários e “próximos passos” foram superados por P17/P8/P19/P20. **Não executar a fila antiga sem recalcular o runtime.**

## 2. Git

- repo: `dyegorodrigues/SAGA`;
- branch única desta linha: `codex/integrar-bloco-f0`;
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: draft/no-merge;
- Creature Engine: fora deste fluxo;
- nenhuma branch auxiliar;
- workflow/script temporário precisa se apagar.

## 3. Estado fechado

- **P17:** N1.10/N1.11 e ponte perceptual→simbólica;
- **P8:** Jardim real, automático e separado da Jornada;
- **P18:** KindType autoral sem promessa falsa;
- **P19:** migrador único + npm audit zerado;
- **P20:** save local/sync isolados por Firebase UID.

Detalhes estão nas decisões `DECISAO_P*.md`.

## 4. Próxima tarefa

> **P21 — reconciliar as fontes de verdade e recalcular o backlog atual.**

Não construir outro bloco curricular antes disso.

P21 deve recalcular, do código:

- número real de competências;
- ficha autoral por nó;
- active / registered / legacy / fallback;
- catálogo de primitivas executáveis;
- divergências ficha×runtime;
- dívida confirmada versus histórica já fechada.

Depois atualizar o `MAPA_MESTRE_POS_P20.md` com os números atuais e marcar os roadmaps históricos como superados onde necessário.

## 5. Depois da P21

Ordem deliberada:

1. revalidar N4.09, GM.12, JD4 e antiga dívida de coreografia;
2. auditoria dos **motores adaptativos/meta-algoritmos**;
3. correções dos motores;
4. **mega auditoria de engenharia pedagógica** — grafo, fichas, primitivas e trajetória completa da criança;
5. auditoria integrada do Dojo (JD/FD/PD);
6. release hardening técnico/pedagógico/visual.

O roteiro detalhado está no mapa mestre.

## 6. Portões

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

Tela alterada também exige sonda e prints reais.

## 7. Regra que vale acima de todas

> **Existir não é estar certo.**

Teste verde não prova pedagogia. Ficha boa não prova que o motor a serve na hora certa. Tela bonita não prova que a criança já conhece a linguagem visual. Documento antigo não vence runtime atual.
