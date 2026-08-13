# Definição de pronto — fábrica curricular

A fábrica curricular do SAGA termina quando o currículo executável deixa de expor lacunas de conteúdo para a criança. O critério é técnico e verificável no **mesmo HEAD** que encerra o trabalho; verde herdado de outro SHA não vale.

## Critério verificável de término

1. O grafo curricular canônico permanece íntegro e sincronizado, com todas as competências esperadas pelo catálogo presentes.
2. A Coverage Matrix observa **todas as competências do grafo como servidas** e **fallback = 0**. Nenhuma competência pode chegar à criança como `Em construção`.
3. Toda competência construída ou migrada conserva sua ficha canônica, pré-requisitos, progressão de dificuldade, regras de domínio, misconceptions/evidências e cadeia física `ficha → builder → renderer/primitiva` quando aplicável.
4. Competências ainda atendidas por gerador legado podem continuar contabilizadas como **servidas**; migração `legado → Composer` que não seja necessária para desbloquear fallback é dívida técnica separada e não impede o fechamento da fábrica. A Matrix deve continuar mostrando essa proveniência sem mascará-la.
5. O HEAD final precisa passar integralmente, sem relaxamento de expectativa, por: `npm run auditar`, `npm run fichas:auditar`, `npm run fichas:conferir`, `npm run grafo:check`, `npx tsc --noEmit`, `npm test -- --run`, `npm run build` e `npm run pr:check`.
6. As sondas reais de Chrome exigidas pelas famílias autorais já promovidas precisam passar no mesmo HEAD, incluindo os portões transversais de 390 px × 8 sementes, 320/900 px e as sondas específicas registradas no CI.
7. O workflow do PR precisa encerrar **integralmente verde no HEAD exato**: Gates do SAGA, Sonda transversal 390 px × 8, Sonda transversal 320/900, Sonda real Sensei, Higiene do diff e Guarda de binários.
8. O ledger/checkpoint final deve registrar os números observados da Matrix e demonstrar explicitamente **servidas = total do grafo** e **fallback = 0**.

## O que não faz parte da fábrica curricular

Não pertencem a esta definição de pronto e não devem ser usados para ampliar o escopo ou atrasar o fechamento curricular: **player da resolução** e suas políticas de playback/TTS; **Oficina**; **conta armada / algoritmo vertical** além do que já for necessário como conteúdo curricular servido; **mascote / Creature Engine**; e mudanças de runtime do **Thinking Engine**. Esses itens têm trilhas próprias e só podem ser retomados por autorização específica.

Em resumo: **fábrica curricular pronta = grafo integralmente servido, zero fallback, nenhum `Em construção`, cadeia autoral auditável e CI completo verde no mesmo SHA**.
