# Reconciliação segura entre `main` e Codex

**Data:** 2 de agosto de 2026
**Branch:** `reconcile/main-codex`

## Evidência inspecionada

- Repositório GitHub: `dyegorodrigues/SAGA`.
- Branches remotas: `main` (`f72ab35`) e
  `codex/realizar-auditoria-completa-do-repositorio-saga-fovec6` (`f15a804`).
- Pull requests: #1 (integrado), #2 (aberto) e #3 (fechado sem integração).
- Os commits `f72ab35` e `f15a804` adicionaram independentemente os mesmos 16
  arquivos novos, com blobs Git idênticos.

## Manifesto dos 16 arquivos recebidos

| Arquivo | Blob Git verificado nos dois lados |
|---|---|
| `ARQUITETURA_COGNITIVA_SAGA.md` | `6aab0356d6bdebaa327ba7fe99b37f965fdb9347` |
| `BIBLIA_SAGA.md` | `0108d00d9d17ca854396bdf92cac4f70b899070b` |
| `DIARIO_DE_ALTERACOES_CANONE.md` | `3cae9c7250c871ed6a83ff373b7c8548362b94d7` |
| `DOJO_SAGA.md` | `6762525ca8c7a69332a94180bcee594092c33a73` |
| `DOJO_TRILHAS_COMPLETAS.md` | `986a602800d13434a586cc33558907cba4fbd4b7` |
| `FICHAS_F0_COMPLETAS.md` | `4b148757650ea85fa4bd06686a901c772ddabd30` |
| `FICHAS_F1_COMPLETAS.md` | `90c787ed92c9a1c001ae875b14d07ecf70ab04d6` |
| `FICHAS_F2_COMPLETAS.md` | `4557f97f9be10e560b37423faab7f02170687356` |
| `FICHAS_F3_COMPLETAS.md` | `62b51e86a8dee4d2257f95c219f21b9a1dbb5729` |
| `FICHAS_F4_COMPLETAS.md` | `953350b6b328c7d36e4e92b2772e5acb83afc1c7` |
| `GRAFO_DE_CONHECIMENTO_SAGA.md` | `27dfd5c00045dd2fafbf5ecb53e9b59adbb7cb90` |
| `MANUAL_DIDATICO_SAGA.md` | `99841a5698013962f404cca6ecb12fea791b5f61` |
| `METODO_SAGA.md` | `dec09fc9a1cee5580d529eafe1e0a08cbd935045` |
| `PACOTE_DE_RECONCILIACAO_SAGA.md` | `69fbae5fce25b2c70e776bda6ee92e6223ee404d` |
| `PRIMITIVAS_SAGA.md` | `a06f6761022733cb69c1d484aaf6eaedf870b779` |
| `grafo_saga.txt` | `bd86af52fdff313dd96379fd96a226a981ed9f35` |

## Decisão de fusão

Foi realizado um merge real de `main` na linha Codex, preservando os dois pais no
histórico. Os quatro conflitos eram versões antigas, vindas de `main`, de arquivos
que a branch Codex continuou evoluindo: Diário, README de continuidade, Plano
Mestre e auditor. Neles foi mantida a versão Codex mais recente; a versão de
`main` continua integralmente recuperável pelo segundo pai do merge.

`Upload_docs/README.md`, presente apenas no lado `main`, foi restaurado. Nenhum
arquivo de `main` foi removido no resultado. Os 16 uploads permanecem na raiz com
os blobs listados acima, enquanto toda a implementação posterior da branch Codex
também permanece.

## Critérios de preservação

1. os 16 caminhos existem na árvore reconciliada;
2. cada blob final coincide com os blobs das duas branches de origem;
3. o diff da árvore reconciliada contra `main` não contém deleções;
4. o merge contém `main` e Codex como ancestrais;
5. auditor, grafo, TypeScript, testes e build devem passar antes da publicação.
