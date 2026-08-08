# Handoff de continuidade — SAGA

> **VIGENTE — 8/ago/2026. Checkpoint: P21.A concluída; próximo passo P21.1.**

## Regra de ouro

- Repo: `dyegorodrigues/SAGA`.
- Branch: **`codex/integrar-bloco-f0`**.
- `main` protegida/imóvel: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- PR #29: open + draft, somente comparação/CI; **não mesclar / não auto-merge**.
- Não tocar:
  - `agent/creature-engine-tamagotchi`
  - `codex/criar-branch-para-creature-engine-tamagotchi`
- Não criar branch auxiliar desta linha.
- Workflow/script temporário deve desaparecer no lote que publica.

## Fontes de verdade — leia nesta ordem

1. [`RETOMADA.md`](./RETOMADA.md)
2. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
3. [`AUDITORIA_P21_FONTES_DE_VERDADE.md`](./AUDITORIA_P21_FONTES_DE_VERDADE.md)
4. [`MAPA_MESTRE_POS_P20.md`](./MAPA_MESTRE_POS_P20.md)
5. decisão P específica se for tocar naquele bloco.

`ROTEIRO_ATE_O_FIM.md` e `PLANO_DO_BLOCO_F0.md` são análise histórica. Não executar números/fila deles sem recalcular o runtime.

## Blocos fechados — não redescobrir

- **P17:** N1.10/N1.11; `SEM_MOLDURA`; ponte perceptual→NumberBond; tempo não coroa Jornada.
- **P8:** Jardim JD1/JD2/JD3/JD5; estado em `dojoTracks`; automático ≠ compreensão; UI/sonda validadas; JD4 continua separada.
- **P18:** kind autoral só quando existe builder.
- **P19:** migrador único; npm audit completo/produção = 0 após remediação conservadora.
- **P20:** save local por Firebase UID + bootstrap único + sync com UID de origem + link anônimo→Google.

P20 commit funcional:

`f45509ca73739d93fe32986c9cf7bcc5aaf6337a`

Gate transacional P20 run `31273869346`: **success** em testes focais, auditores, suíte inteira e build. O run `action_required` do commit auto-publicado tinha zero jobs e não representa falha de código.

## P21.A — inventário concluído

Run `31274280464`: **success**; workflow/script temporários auto-removidos.

Estado derivado:

- 90 nós YAML / 90 JSON;
- 92 fichas Markdown cobrindo 88/90 competências;
- sem ficha Markdown: **N1.09, GM.02**;
- 29 fichas TS de Jornada;
- 24 registradas no Composer;
- 22 canários ativos;
- registradas/inativas: **N4.09, GM.12**;
- TS existentes fora do registro Composer: **AL.05, GM.04, N2.01, N3.11, N4.02** — classificar intenção antes de qualquer promoção;
- `JOURNEY_FICHAS` administrativo registra 19/29 e deixa 10 fichas fora;
- `ficha_catalog_auditor.cjs` ainda usa `EXPECTED_COMPETENCIES = 88` e não falha se o grafo ganhar nó sem ficha;
- `catalog_auditor.cjs` mistura proveniência antiga com Composer e pode chamar canário ativo de fallback;
- mapa de primitivas tem 26 entradas e precisa reconciliar falsos negativos/positivos com o runtime real.

## Próximo passo exato — P21.1

Não escrever nova ficha ainda.

1. completar `AllFichas/JOURNEY_FICHAS` com as 29 fichas existentes;
2. teste permanente disco↔registry;
3. tornar auditor de cobertura derivado dos 90 nós;
4. manter N1.09/GM.02 em exceção **explícita e justificada** enquanto não houver decisão pedagógica;
5. separar no auditor agregado:
   - legacy explícito;
   - Composer registrado;
   - Composer ativo;
   - fallback real;
6. limpar comentários obsoletos de N1.10/N1.11 em `composerCanary.ts`;
7. P21.2: provar builder→kind→renderer de cada primitiva e corrigir o mapa.

## Depois de P21

### P22 — decisões curriculares deliberadas

- N1.09;
- GM.02;
- JD4 e relação com N1.07;
- N4.09;
- GM.12.

Não preencher buracos por tabela: cada item entra com cânone, pedagogia, runtime e QA.

### Auditoria dos motores adaptativos

Longitudinal: Progress Engine, Composer/Minha Aula, Radar, Oficina, Jardim, FD/PD, matrícula, mixed challenge, Leitner/retenção, domínio/evidências, unlock e telemetria.

### Mega auditoria pedagógica

Quatro lentes:

1. currículo/grafo;
2. ficha/atividade;
3. primitivas/design pedagógico;
4. trajetória completa da criança do zero ao avançado.

### Fechamento

Auditoria integrada do Dojo → release hardening técnico/pedagógico/visual → somente então o autor decide integração.

## Portões

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

**Existir não é estar certo. Ausência explícita é dívida gerenciável; ausência silenciosa é falha de governança.**
