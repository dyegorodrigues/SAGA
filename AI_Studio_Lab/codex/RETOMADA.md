# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21 concluída; P22 em execução. P22.1/GM.12 concluída; próxima tarefa exata: P22.2/N4.09.**

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
- **P22.1 — GM.12 promovida como estreia Composer.**

### Estado final P21

- grafo: 90/90;
- Markdown: 92 fichas cobrindo 88/90 competências;
- lacunas autorais: N1.09 e GM.02;
- Journey TS: 29/29 em `JOURNEY_FICHAS` e `AllFichas`;
- Composer registrado: 24;
- Composer ativo: 22 antes da P22;
- fallback real: 41 antes da P22;
- mapa de primitivas: 20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente.

P21.2 gate `31276118716`: success, 125 arquivos / 2.132 testes.

## 4. P22 — decisão audit-first

Documento vivo: `DECISAO_P22_DIVIDAS_CURRICULARES.md`.

Decisões:

1. **N1.09:** nó canônico real; legado parcial; precisa ficha Markdown + TS completa.
2. **GM.02:** Tempo cotidiano é canônico; legado atual é insuficiente; precisa ficha Markdown + TS completa e pré-leitora.
3. **N1.07/JD4:** primeiro completar compreensão da Jornada, depois registrar JD4 como automaticidade.
4. **N4.09:** promoção autorizada em lote próprio; contrato/sonda atuais já removeram o bloqueio histórico.
5. **GM.12:** promoção autorizada e concluída em P22.1.

Audit P22 run `31276442048`: success.

## 5. P22.1 — GM.12 CONCLUÍDA

Mudança funcional:

- `GM.12` adicionado a `DEFAULT_COMPOSER_CANARY_IDS`.

Gate final: run `31276881058` = **success**.
Bancada auto-removida no commit `35493c012b96aaf64e919babba47cc5f5a4171cf`.

Comprovado:

- `GM.12.test.ts`: aprovado;
- contrato genérico de canário: aprovado, inclusive estreia→rollback para placeholder→reativação;
- proveniência: Composer ativo **23/90**;
- servido sem placeholder: **50/90**;
- fallback real: **40/90**;
- único registrado/inativo restante: **N4.09**;
- sonda GM.12 promovida: verde em 390/320/900 px;
- `fichas:conferir`: 9/9;
- suíte completa: **125 arquivos / 2.145 testes**;
- TypeScript, grafo, build, `pr:check` e `git diff --check`: aprovados.

O primeiro run `31276688133` havia falhado somente por whitespace documental; após limpeza, o mesmo escopo funcional passou integralmente.

## 6. PRÓXIMA TAREFA EXATA — P22.2 N4.09

Promover **N4.09** como estreia Composer, sem alterar sua pedagogia.

Lote mínimo:

1. importar `N4_09` em `canaryContract.test.ts`;
2. registrar `"N4.09": N4_09` em `REGISTRO`;
3. adicionar `"N4.09"` a `DEFAULT_COMPOSER_CANARY_IDS`;
4. rodar contrato genérico, `areaContract.test.ts`/testes da área, sonda N4.09 e gates completos;
5. provar rollback para placeholder;
6. se verde, registrar P22.2 e seguir para N1.07/JD4.

Não reabrir o antigo bloqueio “quatro regiões + algoritmo” sem evidência: o contrato atual usa `algoritmoSoNaAula` e a sonda P22 já passou em 390/320/900 px.

## 7. Depois de P22.2

- P22.3 — N1.07/JD4;
- P22.4 — N1.09;
- P22.5 — GM.02;
- depois: auditoria longitudinal dos motores adaptativos, mega auditoria pedagógica, auditoria integrada JD/FD/PD e release hardening.

## 8. Portões

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

> **Existir não é estar certo. Promoção só fecha com cadeia de evidência completa e reversível.**
