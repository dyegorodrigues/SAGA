# Pendências estacionadas — Fase do Player do Motor de Resolução

**Status:** PENDENTE — FASE DO PLAYER  
**Origem:** auditoria pós-W9 + aprovação humana de 12/08/2026  
**Regra:** este arquivo existe para impedir que decisões de política sejam congeladas prematuramente na R0-A ou desapareçam do workflow.

## O que a R0-A decide

A R0-A decide somente o contrato de dados:

- `tutorial` = onboarding/coreografia da ficha;
- `resolucao` = solução calculada do item atual;
- passos de resolução usam `show` como **snapshot declarativo e idempotente**, não delta/replay temporal;
- `corrige` é índice semântico de misconception;
- `parcial` é estado/invariante e não substitui diagnóstico;
- ponto de entrada por misconception e cobertura/fallback são funções puras;
- nenhuma política do player altera Coverage Matrix.

## PENDENTE — FASE DO PLAYER: escalada por erro

**Pergunta ainda aberta:** a política deve ser exatamente “2º erro = dica / 3º erro = resolução completa”?

Não congelar esse número no contrato. A fase do player deve decidir com evidência de uso e preservar, no mínimo:

- primeira tentativa independente não é mascarada por ajuda;
- hint não pode revelar involuntariamente a resposta;
- resolução completa é assistência explícita e não compra independência/domínio;
- misconceptions diferentes podem justificar pontos de entrada e intensidade diferentes.

## PENDENTE — FASE DO PLAYER: teto por sessão

**Pergunta ainda aberta:** limitar resoluções completas a aproximadamente 2–3 por sessão?

Não congelar o teto agora. A fase do player deve decidir com telemetria e objetivos pedagógicos, distinguindo:

- ajuda curta / dica;
- resolução completa;
- repetição da mesma família;
- fadiga e dependência de ajuda.

## Outras políticas já estacionadas para a mesma fase

1. modos explícitos do tocador: `onboarding-auto` versus `resolution-manual`;
2. fim da fala não avança automaticamente no modo manual;
3. token/geração de sessão invalida callback de TTS atrasado;
4. avanço manual cancela a fala atual de forma segura;
5. RT usa pausa **acumulada** por ajuda, inclusive múltiplas entradas/saídas;
6. exercício fica realmente inerte durante resolução (`disabled`/`inert`/gestão de foco), não apenas `opacity + pointer-events:none`;
7. faixa do tutor é o alvo primário de continuação; toque no palco inteiro só quando o palco for comprovadamente sem controles/gestos ativos;
8. foco inicial e restauração de foco são parte do contrato de acessibilidade;
9. telemetria de ajuda/resolução vive em canal próprio e não cria tentativa fictícia de resposta;
10. reduced motion deve funcionar a partir dos mesmos snapshots, sem depender de replay acelerado.

## Fora desta decisão

- migração do vertical/conta armada;
- remoção de `VerticalAlgorithm.tsx` órfão;
- integração de `PromocaoDeOrdem` com carry/borrow;
- implementação visual da `FaixaDoTutor`.

Esses itens pertencem a fases posteriores e não podem entrar por oportunismo em R0-A/W10–W12.
