# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21 concluída; P22 em execução. P22.1/GM.12 está provisoriamente promovida e aguarda rerun final após correção de higiene textual.**

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
- P21.2 — mapa de primitivas reconciliado com builder→kind→renderer real.

### Estado final P21

- grafo: 90/90;
- Markdown: 92 fichas cobrindo 88/90 competências;
- lacunas autorais: N1.09 e GM.02;
- Journey TS: 29/29 em `JOURNEY_FICHAS` e `AllFichas`;
- Composer registrado: 24;
- Composer ativo antes da P22.1: 22;
- fallback real antes da P22.1: 41;
- mapa de primitivas: 20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente.

P21.2 gate `31276118716`: success, 125 arquivos / 2.132 testes.

## 4. P22 — decisão audit-first

Documento vivo: `DECISAO_P22_DIVIDAS_CURRICULARES.md`.

Decisões:

1. **N1.09:** nó canônico real; legado parcial; precisa ficha Markdown + TS completa.
2. **GM.02:** Tempo cotidiano é canônico; legado atual é insuficiente; precisa ficha Markdown + TS completa e pré-leitora.
3. **N1.07/JD4:** primeiro completar compreensão da Jornada (sucessor + antecessor + ordenação e pré-requisitos corretos), depois registrar JD4 como automaticidade.
4. **N4.09:** promoção autorizada em lote próprio; bloqueio histórico do nível 4 foi resolvido pelo contrato atual; sonda atual verde.
5. **GM.12:** promoção autorizada em lote próprio; ficha/Stage/testes/sonda atuais verdes.

Audit P22 run `31276442048`: success.

## 5. Estado corrente — P22.1 GM.12

Mudança funcional aplicada na branch:

- `GM.12` adicionado a `DEFAULT_COMPOSER_CANARY_IDS`.

Primeiro gate P22.1 run `31276688133`:

- contrato GM.12: aprovado;
- contrato genérico de canário: aprovado;
- proveniência esperada: aprovada — Composer ativo 23/90, servido sem placeholder 50/90, fallback real 40/90;
- sonda GM.12 promovida: aprovada em 390/320/900 px;
- suíte completa: 125 arquivos / 2.145 testes, aprovada;
- build, TypeScript, grafo e guards: aprovados;
- **única falha:** `git diff --check` encontrou whitespace em documentos de checkpoint.

A falha é de higiene textual, não de runtime. A promoção ainda não é considerada fechada até o rerun completo ficar verde.

## 6. Próxima ação exata

1. limpar whitespace documental;
2. repetir o gate P22.1 completo;
3. se verde, registrar GM.12 como promovida e seguir para **P22.2 N4.09**;
4. não avançar para P22.2 enquanto P22.1 estiver vermelho.

## 7. Portões

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
