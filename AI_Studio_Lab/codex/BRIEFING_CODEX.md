# Briefing operacional — continue daqui

> **Checkpoint: P21.A concluída. Próxima execução: P21.1.**

## Antes de tocar código

Leia:

1. `RETOMADA.md`
2. `DECISAO_P21_FONTES_DE_VERDADE.md`
3. `AUDITORIA_P21_FONTES_DE_VERDADE.md`
4. `MAPA_MESTRE_POS_P20.md`

Repo `dyegorodrigues/SAGA`; branch `codex/integrar-bloco-f0`.  
`main` = `68fad4c575e28959b2ca4776e9a541d6828b63f3`, **não tocar**.  
PR #29 = draft/no-merge. Creature Engine = fora deste fluxo.

## Fechado

- P17: N1.10/N1.11 e ponte perceptual→simbólica.
- P8: Jardim JD1/JD2/JD3/JD5, `dojoTracks`, automaticidade separada.
- P18: KindType autoral sem builder falso.
- P19: migrador único + audit npm zerado.
- P20: save/sync por Firebase UID, bootstrap único e link anonymous→Google.

Não reabrir sem falha objetiva.

## P21.A mediu o presente

- grafo: 90 nós;
- Markdown: 92 fichas, 88/90 competências;
- sem ficha: N1.09, GM.02;
- TS Jornada: 29;
- Composer registrado: 24;
- canários ativos: 22;
- registradas/inativas: N4.09, GM.12;
- `JOURNEY_FICHAS`: 19/29;
- auditor de ficha ainda espera 88 e não falha por cobertura faltante;
- auditor agregado mistura legacy/Composer/fallback;
- mapa de primitivas precisa revalidação contra runtime.

## Faça agora — P21.1

1. completar `AllFichas/JOURNEY_FICHAS` com as fichas TS existentes;
2. criar teste disco↔registry;
3. auditor de cobertura derivado do grafo;
4. N1.09/GM.02 ficam como exceções temporárias explícitas, não silêncio;
5. separar legacy / Composer registrado / Composer ativo / fallback real;
6. limpar comentários antigos N1.10/N1.11 em `composerCanary.ts`;
7. depois P21.2: reconciliar `FICHA_RUNTIME_MAP` pelo caminho builder→kind→renderer.

**Não promover nada nessa fase.**

## Depois

P22 decide N1.09, GM.02, JD4, N4.09 e GM.12. Depois: auditoria dos motores adaptativos → mega auditoria pedagógica → Dojo completo → release hardening.

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
git diff --check
```

**Comece pela P21.1.**
