# Auditoria P19 — dependências npm

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Ação:** diagnóstico somente; **nenhum pacote foi atualizado por esta auditoria**.

## Resumo

- Audit completo (dev + runtime): **total=4; critical=0; high=3; moderate=0; low=1**.
- Audit `--omit=dev` (árvore de produção): **total=3; critical=0; high=2; moderate=0; low=1**.

> Regra: não executar `npm audit fix` cegamente. Cada correção precisa ser classificada por cadeia, superfície de runtime, versão corrigida e risco de breaking change.

## Vulnerabilidades reportadas

### `js-yaml` — HIGH

- versão instalada no lock (quando presente): `5.2.1`;
- dependência direta: **sim**;
- aparece na árvore de produção: **não**;
- range vulnerável agregado: `5.0.0 - 5.2.1`;
- nós afetados: `node_modules/js-yaml`;
- fix automático sugerido: sim, atualização compatível indicada pelo npm.
- advisories/cadeia:
  - **high**: js-yaml: Exponential parsing time in flow collections leads to denial of service (>=5.0.0 <=5.2.1) — https://github.com/advisories/GHSA-pm4m-ph32-ghv5

### `nanoid` — HIGH

- versão instalada no lock (quando presente): `3.3.15`;
- dependência direta: **não**;
- aparece na árvore de produção: **sim**;
- range vulnerável agregado: `<=3.3.16`;
- nós afetados: `node_modules/nanoid`;
- fix automático sugerido: sim, atualização compatível indicada pelo npm.
- advisories/cadeia:
  - **high**: nanoid: non-secure generators can loop indefinitely with negative size (<3.3.16) — https://github.com/advisories/GHSA-28wg-ghj8-5hjv
  - **high**: nanoid: custom generators can loop indefinitely when size is zero (<3.3.17) — https://github.com/advisories/GHSA-2v37-7h3g-55p8

### `postcss` — HIGH

- versão instalada no lock (quando presente): `8.5.16`;
- dependência direta: **não**;
- aparece na árvore de produção: **sim**;
- range vulnerável agregado: `<=8.5.22`;
- nós afetados: `node_modules/postcss`;
- fix automático sugerido: sim, atualização compatível indicada pelo npm.
- advisories/cadeia:
  - **high**: PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure (<=8.5.17) — https://github.com/advisories/GHSA-r28c-9q8g-f849
  - **moderate**: PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset (<=8.5.22) — https://github.com/advisories/GHSA-fxqj-rqcc-2cmp

### `body-parser` — LOW

- versão instalada no lock (quando presente): `1.20.5`;
- dependência direta: **não**;
- aparece na árvore de produção: **sim**;
- range vulnerável agregado: `<1.20.6`;
- nós afetados: `node_modules/body-parser`;
- fix automático sugerido: sim, atualização compatível indicada pelo npm.
- advisories/cadeia:
  - **low**: body-parser vulnerable to denial of service when invalid limit value silently disables size enforcement (<1.20.6) — https://github.com/advisories/GHSA-v422-hmwv-36x6

## Próxima decisão

Para cada HIGH/CRITICAL: confirmar advisory atual e versão segura em fonte oficial; verificar se é dev-only ou runtime; simular a menor atualização possível; executar TypeScript, suíte completa e build; se tocar browser/runtime visual, executar sonda.


## Cadeia instalada (`npm explain`)

### `js-yaml`

```text
===== js-yaml =====
js-yaml@5.2.1 dev
node_modules/js-yaml
  dev js-yaml@"^5.2.1" from the root project
```

### `nanoid`

```text
===== nanoid =====
nanoid@3.3.15
node_modules/nanoid
  nanoid@"^3.3.12" from postcss@8.5.16
  node_modules/postcss
    peer postcss@"^8.1.0" from autoprefixer@10.5.2
    node_modules/autoprefixer
      dev autoprefixer@"^10.4.21" from the root project
    postcss@"^8.5.3" from vite@6.4.3
    node_modules/vite
      dev vite@"^6.2.3" from the root project
      peer vite@"^5.2.0 || ^6 || ^7 || ^8" from @tailwindcss/vite@4.3.2
      node_modules/@tailwindcss/vite
        @tailwindcss/vite@"^4.1.14" from the root project
      peer vite@"^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0" from @vitejs/plugin-react@5.2.0
      node_modules/@vitejs/plugin-react
        @vitejs/plugin-react@"^5.0.4" from the root project
      peerOptional vite@"^6.0.0 || ^7.0.0 || ^8.0.0" from @vitest/mocker@4.1.10
      node_modules/@vitest/mocker
        @vitest/mocker@"4.1.10" from vitest@4.1.10
        node_modules/vitest
          dev vitest@"^4.1.10" from the root project
      vite@"^6.0.0 || ^7.0.0 || ^8.0.0" from vitest@4.1.10
      node_modules/vitest
        dev vitest@"^4.1.10" from the root project
```

### `postcss`

```text
===== postcss =====
postcss@8.5.16
node_modules/postcss
  peer postcss@"^8.1.0" from autoprefixer@10.5.2
  node_modules/autoprefixer
    dev autoprefixer@"^10.4.21" from the root project
  postcss@"^8.5.3" from vite@6.4.3
  node_modules/vite
    dev vite@"^6.2.3" from the root project
    peer vite@"^5.2.0 || ^6 || ^7 || ^8" from @tailwindcss/vite@4.3.2
    node_modules/@tailwindcss/vite
      @tailwindcss/vite@"^4.1.14" from the root project
    peer vite@"^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0" from @vitejs/plugin-react@5.2.0
    node_modules/@vitejs/plugin-react
      @vitejs/plugin-react@"^5.0.4" from the root project
    peerOptional vite@"^6.0.0 || ^7.0.0 || ^8.0.0" from @vitest/mocker@4.1.10
    node_modules/@vitest/mocker
      @vitest/mocker@"4.1.10" from vitest@4.1.10
      node_modules/vitest
        dev vitest@"^4.1.10" from the root project
    vite@"^6.0.0 || ^7.0.0 || ^8.0.0" from vitest@4.1.10
    node_modules/vitest
      dev vitest@"^4.1.10" from the root project
```

### `body-parser`

```text
===== body-parser =====
body-parser@1.20.5
node_modules/body-parser
  body-parser@"~1.20.5" from express@4.22.2
  node_modules/express
    express@"^4.21.2" from the root project
```

