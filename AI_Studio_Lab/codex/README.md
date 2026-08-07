# Estado do trabalho Codex

> Esta pasta é um ponto de continuidade e auditoria. Ela **não contém uma segunda
> cópia do repositório**, porque duplicar o SAGA dentro dele criaria arquivos
> concorrentes e risco de editar a cópia errada.

> **Trabalhando aqui sem a conversa que produziu o estado?** Comece por
> [`RETOMADA.md`](./RETOMADA.md) e, se você é um agente recebendo uma tarefa,
> pelo [`BRIEFING_CODEX.md`](./BRIEFING_CODEX.md).

## Estado preservado

> **Marco de continuidade (2/ago/2026):** o Lote C liga F98/N4.02 ao ArrayGrid
> autoral sem trocar `gN4_02` em produção. O handoff operacional e a arquitetura
> aprovada, ainda não implementada, do Lote D estão em
> [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md).

- Branch canônica remota: `main` em <https://github.com/dyegorodrigues/SAGA>.
- Publicação validada: PR #9, incorporada em `main` pelo commit `2e0f9a2`.
- Árvore canônica publicada: `4f07bcb4a56a77fe761ffc3691831a12f8e51662`.
- Marco atual: cânone v3.2 reconciliado, catálogo autoral auditável e suíte com 865
  testes aprovada.
- O PR #8 é somente registro histórico da tentativa com base antiga; não deve ser
  mesclado, pois sua árvore já foi publicada integralmente pelo PR #9.

## Estado de publicação

O bloqueio de rede observado em 31/jul/2026 não está ativo neste ambiente: leitura
e `fetch` do remoto `origin` funcionam. A publicação continua seguindo o protocolo
de PR; nunca se escreve diretamente em `main` durante uma tarefa.

Cada novo bloco nasce de `origin/main`, recebe um commit atômico em branch nova e
um PR explícito para `main`. Antes do merge, devem ser comprovados pai/base, árvore
esperada, ausência de marcadores de conflito e checks verdes.

## Persistência

O trabalho canônico está preservado na `main` remota. Não há ZIP, patch, bundle ou
cópia concorrente do repositório dentro dele. Commit local e PR preparado continuam
sem equivaler a publicação: a evidência final é o commit presente em `origin/main`.

## Baseline técnico vigente

- grafo canônico: 89 competências e 13 trilhas de fluência *(88 até ago/2026; a `N1.13` nasceu quando a P12 separou "produzir quantidade" de "contar até 20" — Bíblia §15.8);*
- geradores explícitos: 42/88;
- fallbacks “Em construção”: 46/88;
- fichas autorais recebidas: 92, cobrindo 89/89 competências;
- fichas TypeScript de Jornada no disco/registradas: 15/15;
- fichas Dojo no disco/registradas: 4/4;
- fichas fora de `AllFichas`: nenhuma;
- YAMLs individuais por strand: 89 nós, sincronizados por ID e pré-requisitos com
  o grafo agregado; JSON/TypeScript são artefatos gerados e verificáveis.
- mapa autoral→runtime: 25 primitivas mapeadas; 13 executáveis, cinco com renderer
  sem builder, seis componentes isolados e uma lacuna real (`Regua`/`measure`).

Os comandos reproduzíveis são `npm run auditar` e `npm run fichas:auditar`. O plano de execução permanece em
`AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md` e os fatos de cada sessão em
`AI_Studio_Lab/DIARIO_DE_BORDO.md`.

## Dependência de conteúdo em elaboração

As fichas cinematográficas detalhadas estão sendo produzidas separadamente pelo
proprietário. O Codex pode criar ou completar fichas provisórias quando isso for
necessário para fazer o produto funcionar, sempre fundamentado em Bíblia, Grafo,
Manual e SPEC e com a origem registrada no commit/Diário.

Quando o arquivo do proprietário chegar, ele entra primeiro como material de
comparação, nunca como substituição cega. A fusão avalia lado a lado objetivo,
escada CRA, parâmetros, misconceptions, roteiro/coreografia, acessibilidade e
testes; aproveita o melhor de cada versão e publica apenas uma ficha runtime
canônica. O original recebido fica preservado em staging para rastreabilidade.

## Dossiê consolidado das conversas

O relatório, os diagnósticos, as decisões e o plano produzidos nas conversas com
o Codex estão preservados em:

- `AI_Studio_Lab/codex/DOSSIE_AUDITORIA_E_PLANO.md`

O dossiê é a melhor porta de entrada para retomar o trabalho sem depender do
histórico do chat. Ele não substitui as fontes pedagógicas canônicas.

## Auditoria completa, problema por problema

Para consultar a auditoria detalhada — fatos observados, impactos, riscos,
recomendações, lacunas pedagógicas/técnicas e matriz de prioridade — abra:

- **[`AUDITORIA_PROFUNDA_COMPLETA.md`](./AUDITORIA_PROFUNDA_COMPLETA.md)**

Use este arquivo quando precisar do detalhe que não cabe no resumo do dossiê.
