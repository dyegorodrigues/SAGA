# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21 concluída; P22 em execução. P22.1/GM.12 e P22.2/N4.09 concluídas; próxima tarefa exata: P22.3A/N1.07.**

## 1. Leia antes de editar

1. [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md)
2. [`DECISAO_P22_DIVIDAS_CURRICULARES.md`](./DECISAO_P22_DIVIDAS_CURRICULARES.md)
3. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
4. [`AUDITORIA_P21_FONTES_DE_VERDADE.md`](./AUDITORIA_P21_FONTES_DE_VERDADE.md) — baseline histórico pré-P21.1/P21.2
5. [`MAPA_MESTRE_POS_P20.md`](./MAPA_MESTRE_POS_P20.md)

Roadmaps de 5/ago são históricos. Não usar fila ou contagens antigas sem recalcular o runtime.

## 2. Git — regra de ouro

- repo: `dyegorodrigues/SAGA`;
- branch: `codex/integrar-bloco-f0`;
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: open + draft/no-merge;
- head confirmado após auto-limpeza P22.2: `e259ccd19d10ec00ed6e4a35e2ce24967796d4f1`;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- workflow/script temporário deve se apagar no próprio lote.

## 3. Fechado — não reabrir sem falha objetiva

- P17 — N1.10/N1.11 e ponte perceptual→simbólica;
- P8 — Jardim e automaticidade separada da Jornada;
- P18 — `KindType` sem promessa autoral falsa;
- P19 — migrador único e dependências saneadas;
- P20 — save/sync por Firebase UID;
- P21.1 — registries, cobertura e proveniência;
- P21.2 — mapa de primitivas reconciliado com builder→kind→renderer real;
- **P22.1 — GM.12 promovida como estreia Composer**;
- **P22.2 — N4.09 promovida como estreia Composer e telemetria de área corrigida**.

## 4. Estado atual após P22.2

- grafo: 90/90;
- Markdown: 92 fichas cobrindo 88/90 competências;
- lacunas autorais restantes: N1.09 e GM.02;
- Journey TS: 29/29 em `JOURNEY_FICHAS` e `AllFichas`;
- Composer registrado: **24/90**;
- Composer ativo: **24/90**;
- Composer registrado/inativo: **0/90**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- mapa de primitivas: 20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente.

## 5. P22.1 — GM.12 CONCLUÍDA

Gate final `31276881058`: **success**.
Bancada auto-removida no commit `35493c012b96aaf64e919babba47cc5f5a4171cf`.

Comprovado:

- contrato específico e contrato genérico de canário;
- estreia→rollback para placeholder→reativação;
- sonda promovida em 390/320/900 px;
- suíte completa: 125 arquivos / 2.145 testes;
- auditores, TypeScript, grafo, build, `pr:check` e `git diff --check` verdes.

## 6. P22.2 — N4.09 CONCLUÍDA

Primeiro gate `31277083778` encontrou um defeito semântico real: a alternativa correta de N4.09 carregava a tag diagnóstica sentinela `"correta"`, fazendo um acerto virar misconception no Radar.

Correção causal:

- `areaProcedure.ts`: gabarito sem tag; somente distratores recebem `MisconceptionTag`;
- `areaContract.ts`: propaga tag somente quando existe;
- `areaContract.test.ts`: trava gabarito sem diagnóstico e distratores com hipótese diagnóstica;
- `canaryContract.test.ts`: N4.09 entrou no contrato genérico;
- `composerCanaryIds.ts`: N4.09 promovida.

Gate final `31277213310`: **success**.
Bancada auto-removida; head limpo `e259ccd19d10ec00ed6e4a35e2ce24967796d4f1`.

Comprovado:

- focal N4.09: **3 arquivos / 339 testes**;
- sonda N4.09 promovida: verde;
- proveniência: 24 registrados / 24 ativos / 0 inativos / 51 sem placeholder / 39 fallbacks;
- `fichas:conferir`: 9/9;
- suíte completa: **125 arquivos / 2.160 testes**;
- TypeScript, grafo, build, `pr:check` e `git diff --check`: verdes;
- PR #29 continua open + draft + unmerged; `main` permanece no SHA protegido.

## 7. PRÓXIMA TAREFA EXATA — P22.3A N1.07

**Completar a compreensão da Jornada antes de criar JD4.**

Estado auditado:

- cânone N1.07: ordem, sucessor e antecessor até 10;
- grafo: prereqs `N1.02 + N1.06`;
- ficha TS ativa atual: cobre majoritariamente sucessor/+1 e declara `N1.04 + N1.06`;
- JD4 é automaticidade da competência-mãe, não substituto do ensino conceitual.

Sequência obrigatória:

1. reler a ficha autoral/cânone N1.07 e o legado;
2. reconciliar pré-requisitos com o grafo;
3. implementar micros que provem sucessor + antecessor + ordenação;
4. manter rollback legado e o contrato genérico;
5. validar pedagogia, telemetria, tela e gates;
6. somente depois abrir **P22.3B/JD4**.

Não registrar JD4 enquanto a Jornada N1.07 não estiver completa e verde.

## 8. Depois de P22.3

- P22.4 — N1.09;
- P22.5 — GM.02;
- depois: auditoria longitudinal dos motores adaptativos, mega auditoria pedagógica, auditoria integrada JD/FD/PD e release hardening.

## 9. Portões

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

Tela afetada exige sonda real.

> **Automaticidade treina o que já foi compreendido; nunca deve esconder uma lacuna conceitual da Jornada.**
