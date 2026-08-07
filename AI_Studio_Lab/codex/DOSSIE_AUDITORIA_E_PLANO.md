# Dossiê consolidado — Auditoria, decisões e plano do SAGA

> **Nota de atualização (2/ago/2026):** este dossiê continua válido como histórico
> das decisões e implementações, mas os números 95/53 foram superados pelo cânone
> v3.2 recebido depois. O baseline **daquele dia** era 88 competências (hoje
> são **89**, ver P12), 13 trilhas e 92
> fichas autorais**; a ordem executiva está em
> `AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md`.

**Data de consolidação:** 31 de julho de 2026  
**Branch de trabalho:** `work`  
**Finalidade:** preservar, em um único arquivo Markdown, o conteúdo útil produzido
nas conversas com o Codex: evidências, diagnóstico, decisões, riscos, plano e
continuidade. Este documento não substitui a Bíblia, o Grafo, o Manual ou o Dojo.

> Este é um registro consolidado, não uma transcrição palavra por palavra nem uma
> exposição de raciocínio interno. Ele preserva os resultados, justificativas,
> comandos e decisões necessários para continuar o trabalho sem depender do chat.

> **Auditoria detalhada:** o registro problema por problema, com fatos, impactos,
> riscos e recomendações, está em
> [`AUDITORIA_PROFUNDA_COMPLETA.md`](./AUDITORIA_PROFUNDA_COMPLETA.md).

---

# 1. Visão do produto entendida

O SAGA é uma plataforma educacional adaptativa, inicialmente focada em matemática
e raciocínio lógico para crianças de 4 a 12 anos. A experiência pretendida combina:

- currículo em grafo de competências;
- progressão por microcompetência;
- método CRA/CPA: concreto → representacional/pictórico → abstrato;
- Jornada/Academia para aprender;
- Dojo para fluência;
- Oficina para recuperação;
- Sensei como porta de entrada para a missão diária;
- tutor vertical, áudio-first e microaulas coreografadas;
- feedback positivo, nunca punitivo;
- mascote vivo no estilo Tamagotchi/videogame;
- gamificação, álbum, moedas, XP e evolução futura;
- aplicativo React/TypeScript, offline-first, com persistência Firebase.

Princípio central observado na Bíblia: o SAGA não deve ser um catálogo de aulas,
mas uma máquina que lê competência, escolhe experiência, gera intervenção e
registra domínio.

---

# 2. Fontes da verdade encontradas

## 2.1 Conjunto canônico

1. `AGENTS.md` — regras operacionais, público, idioma, CRA, DAG e arquitetura.
2. `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md` — constituição pedagógica.
3. `AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md` — estrutura humana.
4. `AI_Studio_Lab/pedagogia/MANUAL_DIDATICO_SAGA.md` — como ensinar.
5. `AI_Studio_Lab/pedagogia/DOJO_SAGA.md` — fluência FD/PD e Jardim.
6. `curriculum/grafo_saga.yaml` — grafo agregado executável/autoral.
7. `AI_Studio_Lab/pedagogia/SPEC_CONSTRUCAO_EXERCICIOS.md` — catálogo textual.

## 2.2 Documentos auxiliares

- `PLANO_MESTRE_SAGA.md` — ordem executiva vigente.
- `ORGANIZACAO_GERAL.md` — diagnóstico histórico; pode conter itens já corrigidos.
- `DIARIO_DE_BORDO.md` — fatos e contexto recente.
- `Upload_docs/` — recebimentos externos para comparação; não é fonte canônica.
- `arquivo_morto/` — histórico preservado; não deve governar implementação nova.

## 2.3 Duplicações confirmadas

- `SPEC_CONSTRUCAO_EXERCICIOS.md` e `SPEC_CONSTRUCAO_SAGA.md` eram cópias exatas.
- O primeiro nome foi documentado como canônico para edição; o segundo permanece
  como alias de compatibilidade e deve continuar byte a byte idêntico.
- Os uploads de Bíblia, Dojo, Grafo, Manual e YAML recebidos coincidiam com as
  cópias já colocadas nos locais canônicos.
- `src/docsText.ts` continha uma Bíblia inteira embutida em uma string. Foi trocado
  por importação raw do Markdown canônico, eliminando uma cópia silenciosa.

---

# 3. Resumo executivo da auditoria

**Saúde geral estimada:** 5,8/10.  
**Estágio:** MVP técnico avançado / beta interno.  
**Maior ativo:** visão pedagógica forte, explícita e testável.  
**Maior risco:** várias representações e motores concorrentes aparentando estar
mais integrados do que realmente estão.  
**Primeira decisão:** não começar por redesign ou migração em massa; restaurar
primeiro a capacidade de medir e provar o estado do currículo.

O projeto compila e possui uma base expressiva de testes, mas ainda não pode ser
considerado produto pedagógico completo porque a documentação descreve 95
competências enquanto grande parte não chega à criança como experiência real.

---

# 4. Arquitetura real observada

## 4.1 Fluxo de telas

`App.tsx` usa um roteador de estado próprio e concentra:

- login e autenticação;
- setup e seleção de criança;
- Home infantil;
- montagem de Jornada, Dojo, desafio misto e matrícula;
- persistência local/nuvem;
- economia;
- telas de pais, álbum, admin, galeria e teste do mascote.

A Home infantil possui cinco abas: Sensei, Jornada, Dojo, Oficina e Perfil. A aba
Sensei é persistida como entrada inicial.

## 4.2 Currículo efetivamente usado

O cartucho de Matemática é registrado por `src/subjects/index.ts`, que recebe os
tracks de `src/curriculum/motores/curriculum.ts`. Esse módulo ainda utiliza:

- `src/utils/generators.ts`;
- `src/utils/generatorsF1.ts`;
- `src/utils/generatorsF2.ts`;
- um `GENERATOR_MAP` explícito;
- `gFallback` para nós sem gerador.

Portanto, o caminho predominante de produção ainda é o caminho legado de
geradores. O sistema novo de fichas existe, mas sua integração é parcial.

## 4.3 Dois “Composers”

1. `src/curriculum/motores/composer.ts` — monta a sessão diária.
2. `src/curriculum/Composer.ts` — transforma uma ficha em uma questão.

Os nomes iguais escondem responsabilidades diferentes e devem ser esclarecidos no
futuro, por exemplo `DailySessionComposer` e `QuestionFactory`.

## 4.4 Sessão diária

O compositor diário seleciona:

1. aquecimento;
2. fronteira;
3. resgate;
4. fluência;
5. fecho.

Ele consulta desbloqueio e Radar, mas existem divergências entre ordem, dose e
quantidades documentadas. Exceções de geração também podem ser engolidas e virar
questões ausentes, ocultando erros de conteúdo.

## 4.5 Progressão

O `progressEngine` implementa:

- streak;
- bônus de velocidade;
- subida de nível;
- queda após dois erros fora do aquecimento;
- `maxLvl` que não regride;
- domínio no nível 5.

Entretanto, domínio ainda é simplificado. A Bíblia exige evidências de compreensão,
fluência, retenção e independência, não apenas uma sequência de acertos.

## 4.6 Radar

O `radarEngine` possui uma implementação real:

- janela rolante de erros;
- duas ocorrências da mesma tag;
- janela de cinco erros;
- intervalo de dez minutos;
- revisão Leitner de 1, 2, 4, 9 e 21 dias.

O maior problema não é a ausência do Radar, mas a escassez de distratores com tags
cognitivas e a integração incompleta entre resposta, progresso, UI e remediação.

## 4.7 Persistência

O estado é local-first e sincronizado com Firestore. Ele inclui crianças,
progresso, Dojo, moedas, álbum, logs e preferências. Riscos observados:

- documento agregado crescendo indefinidamente;
- conflitos entre dispositivos sem merge pedagógico;
- regras Firestore possivelmente bloqueando subcoleções de telemetria;
- estado e questões com funções que não sobrevivem à serialização;
- custo futuro de escritas granulares.

---

# 5. Baseline curricular comprovado

O auditor read-only `npm run auditar` comprovou:

| Medida | Resultado |
|---|---:|
| Grafo Markdown | 95 competências |
| YAML agregado | 95 nós |
| JSON derivado | 95 nós |
| TypeScript de runtime | 95 nós |
| YAMLs individuais por strand | 95 nós |
| Nós com gerador explícito | 42/95 |
| Nós no fallback “Em construção” | 53/95 |
| Fichas de Jornada no disco | 12/95 |
| Fichas de Jornada registradas | 12/95 |
| Fichas de Dojo no disco/registradas | 4/4 |
| Fichas fora de `AllFichas` | 0 |

As 11 competências que estavam ausentes dos YAMLs individuais foram incorporadas:

- `N2.06`, `N2.07`, `N2.08`;
- `N5.06`, `N5.07`, `N5.08`;
- `N7.03`, `N7.04`;
- `GM.10`, `GM.11`;
- `PE.05`.

O auditor também verifica IDs duplicados, pré-requisitos inexistentes, ciclos,
paridade de artefatos, aliases da SPEC, geradores órfãos, deriva de nomes e paridade
de IDs/pré-requisitos entre o agregado e os YAMLs por strand.

---

# 6. Problemas críticos

## C-01 — Fontes curriculares concorrentes

Markdown, YAML agregado, YAMLs por strand, JSON e TypeScript podem divergir. É
necessário definir formalmente fonte autoral e artefatos derivados.

## C-02 — DAG calculado, mas não aplicado integralmente à lista (corrigido)

O fluxo devolvia todos os tracks deduplicados sem usar o resultado para controlar a
seleção. A correção preserva os 95 nós matemáticos visíveis no mapa, bloqueia a
interação pelos pré-requisitos do DAG, usa o progresso global (inclusive de faixas
anteriores) e impede recomendações do Sensei para nós fechados. Cartuchos externos
não são confundidos com nós matemáticos.

## C-03 — Contrato inconsistente no Composer de fichas (corrigido no catálogo atual)

O `kind` era escolhido por `niveis[lvl].primitiva`, mas os dados eram construídos
pelo primeiro kind da micro. Agora a mesma primitiva efetiva seleciona o builder;
as 12 fichas registradas são exercitadas em seus cinco níveis por teste de contrato,
e kind desconhecido falha explicitamente. A tipagem discriminada completa continua
pendente porque `Question` e `FichaParams` ainda possuem campos amplos.

## C-04 — Falso domínio

O código concede `dom` de forma mais simples que a regra canônica. Isso pode
destravar conteúdo cedo e produzir um painel pedagogicamente enganoso.

## C-05 — Cobertura incompleta

53 competências ainda caem em “Em construção”. Especificação textual não equivale
a ficha, gerador, renderer, feedback e teste executáveis.

## C-06 — Telemetria Firestore

O cliente pretende escrever em uma subcoleção por criança, mas as regras observadas
autorizam o documento agregado do usuário e não explicitam essa subcoleção.

## C-07 — Ferramentas quebradas

O auditor antigo apontava para arquivo inexistente e o simulador declarado no
`package.json` continua sem seu arquivo de entrada.

## C-08 — Escopo etário incompleto nos tipos

O tipo `Kid.grade` representa somente pré, primeiro e segundo ano, enquanto o
produto e o grafo chegam aos 12 anos/F4.

---

# 7. Dívida técnica relevante

- `App.tsx`, `GameLoop.tsx`, painéis e motores visuais excedem o teto arquitetural.
- `Question`, `Option`, `uiProps`, `evaluate` e tracks customizados usam `any`.
- currículo importa cores de componente visual, invertendo dependências.
- geradores ainda embutem emojis, texto, cor e decisões visuais.
- há renderer/mascote legado e motor V2 coexistindo.
- o bundle principal é grande para tablets/celulares modestos.
- “lint” executa somente TypeScript; não existe lint semântico completo.
- faltam testes Firestore, E2E, acessibilidade, responsividade e coreografia.

---

# 8. Lacunas pedagógicas

1. Poucas competências têm uma ficha vertical completa.
2. Distratores frequentemente são numéricos genéricos, não misconceptions.
3. Microtutorial e Mão Fantasma não são universais.
4. Coreografia ainda contém lógica especial dentro do GameLoop.
5. Oficina não implementa toda a física de resgate documentada.
6. Dojo ainda precisa separar de forma completa Nível 1–5 e Faixa 1–10.
7. Domínio não incorpora retenção/independência plenamente.
8. A criança maior não possui representação escolar completa no contrato de dados.
9. Grande parte de frações, decimais, geometria, medidas e estatística está apenas
   especificada, não entregue como experiência executável.

---

# 9. Plano atômico de execução

## Fase 0 — Baseline e segurança

**Objetivo:** tornar todo estado reproduzível antes de mudar conteúdo.  
**Estado:** auditor restaurado; sincronização principal comprovada.  
**Estado:** YAMLs individuais agora cobrem os 95 nós; JSON e TypeScript possuem
gerador determinístico com modo `--check` integrado ao build.

Critérios:

- `npm run auditar` reproduz o relatório;
- DAG sem ciclos ou referências ausentes;
- fonte e derivados explicitamente identificados;
- nenhuma ferramenta escreve em produção.

## Fase 1 — Organização e fontes da verdade

- corrigir resíduos documentais;
- resolver definitivamente aliases;
- documentar geração YAML → JSON/TS;
- atualizar README operacional;
- manter `arquivo_morto` fora das ferramentas ativas;
- não apagar evidência histórica.

## Fase 2 — Contratos e grafo

- criar união discriminada de `Question` por kind;
- normalizar `TutorialStep` (`say`, `show`, `sync`, `ms`);
- tipar distratores e misconceptions;
- separar idade, série e faixa pedagógica;
- corrigir aplicação do DAG na interface;
- preservar saves com migrador versionado.

## Fase 3 — Motor de exercícios

- escolher uma competência padrão-ouro;
- ligar grafo → ficha → cinco níveis → renderer → áudio → erro → teste;
- corrigir a primitiva efetiva no Composer;
- garantir resposta exatamente uma vez;
- usar distratores da ficha;
- não migrar 95 competências em lote;
- não retirar legado antes de paridade.

## Fase 4 — Dojo e adaptatividade

- separar Nível Jornada 1–5 de Faixa Dojo 1–10;
- fortalecer FD e PD;
- integrar resposta selecionada ao Radar;
- implementar frustração, revisão e resgate proporcional;
- criar domínio multidimensional;
- definir migração de coroas/progresso existente.

## Fase 5 — UI/UX e mascote

- exercício sem rolagem em celular/tablet;
- tokens responsivos;
- acessibilidade e reduced motion;
- lazy loading de Admin/Pais;
- compressão de assets;
- componentização sem reescrever pedagogia;
- manter mascote separado do motor adaptativo.

## Fase 6 — Confiabilidade

- suíte nominal de contratos;
- simulador de criança contra motores reais;
- Firestore Emulator;
- E2E da missão diária;
- testes de coreografia;
- acessibilidade;
- detecção de imports circulares;
- orçamento de bundle.

---

# 10. Primeiros PRs recomendados

## PR 1 — Baseline curricular

Restaurar auditoria, comparar fontes, listar geradores/fallbacks/fichas.  
**Estado:** realizado.

## PR 2 — Fonte curricular inequívoca

Resolver YAMLs por strand, definir artefatos gerados e impedir deriva.

## PR 3 — DAG real na interface

Aplicar `status.opened` à experiência visível, com teste de integração e medição de
paridade para não reduzir acidentalmente conteúdo alcançável.
**Estado:** realizado; validação visual infantil e refinamento da navegação ficam
como melhoria de UI, sem reabrir a regra curricular.

## PR 4 — Competência padrão-ouro

Implementar uma competência F0 completa, provavelmente `N1.01` ou `N1.04`, nos
cinco níveis, com áudio, tutorial, misconception e testes.

## PR 5 — Contratos do Composer

Corrigir incompatibilidade de kind/props e começar migração tipada kind por kind.
**Estado:** incompatibilidade corrigida e catálogo atual protegido; migração da
união discriminada continua em PRs pequenos, kind por kind.

---

# 11. Mascote — direção preservada

O mascote será um motor/widget independente. O motor pedagógico publica eventos;
o mascote reage, mas não decide nível, desbloqueio ou recompensa pedagógica.

Vocabulário inicial informado pelo proprietário:

- ocioso;
- comendo;
- comemorando;
- dormindo;
- cansado;
- desmaiado;
- meditando;
- estudando;
- pensando;
- encorajando;
- chute;
- soco.

Cada entrada futura do atlas deve declarar:

- nome semântico;
- frames;
- FPS;
- loop;
- prioridade;
- se pode ser interrompida;
- retorno ao estado ocioso;
- ponto de ancoragem;
- fallback estático.

T-Rex 1 e T-Rex 2 permanecem protótipos. A profissionalização ocorre depois de
Jornada, Dojo, Oficina, progressão e persistência estarem confiáveis. Fome, energia,
cansaço ou “desmaio” são estados ficcionais e jamais punição por erro ou ausência.

---

# 12. Git, GitHub e backups

## Modelo pretendido

- `SAGA` — original conectado ao Google AI Studio; usado como fonte de consulta.
- `SAGA-Codex` — repositório destinado ao trabalho Codex.
- branch local `work` — linha de trabalho isolada.

Estado local atual:

- não há remotos configurados nesta cópia;
- nenhum push ocorre automaticamente;
- o SAGA original não é um destino alcançável de push a partir desta cópia.

## Bloqueio atual

O ambiente recusou leitura e escrita HTTPS com:

```text
CONNECT tunnel failed, response 403
```

Assim, tornar o repositório público não resolveu: o bloqueio ocorre antes da
autenticação. Quando houver rede e autorização, os comandos pendentes são:

```bash
git remote add origin https://github.com/dyegorodrigues/SAGA-Codex.git
git push -u origin work
```

## Persistência local atual

O histórico está commitado na branch local `work`. ZIPs, patches, bundles e cópias
redundantes foram removidos para manter uma única árvore de trabalho. A cópia no
GitHub só estará comprovada após um push confirmado.

Não se deve duplicar todo o repositório dentro de uma pasta do próprio repositório,
pois isso cria duas fontes editáveis e crescimento recursivo. Esta pasta `codex/`
guarda somente continuidade, diagnóstico e plano.

---

# 13. Verificações já executadas

- `npm run lint` — TypeScript aprovado.
- `npm test` — 28 arquivos e 853 testes aprovados após o domínio multidimensional.
- `npm run build` — aprovado; warning de bundle acima de 500 KB.
- `npm run auditar` — invariantes aprovados e lacunas listadas.
- comparação byte a byte dos uploads contra documentos canônicos.
- comparação byte a byte dos dois nomes da SPEC.
- `git diff --check` — aprovado.
- `git bundle verify` — histórico completo confirmado.
- `git fsck --no-dangling` — integridade local confirmada.

## Ferramentas ainda quebradas ou ausentes

- `npm run simular` aponta para `simulated-learner-real.ts`, que não existe.
- não há GitHub CLI/autenticação disponível neste container.
- push/fetch GitHub estão bloqueados pelo proxy HTTP 403.

---

# 14. O que falta, em lista direta

1. ✅ Registrar `AL.01` ou justificar sua exclusão — concluído.
2. ✅ Corrigir o DAG visível na UI — concluído.
3. Unificar gradualmente fichas e geradores legados.
4. Tipar contratos por kind — fronteira das fichas iniciada; contrato global legado
   ainda pendente.
5. ✅ Corrigir a divergência de primitiva do Composer — concluído; tipagem ampla
   continua no item 4.
6. Implementar coreografia universal.
7. Completar misconceptions e distratores diagnósticos.
8. ✅ Tornar domínio multidimensional e exibir as quatro dimensões — concluído para
   fichas atuais; novas fichas devem fornecer `rt_alvo` nível 5.
9. ✅ Completar a infraestrutura do Radar e da Oficina — resgates tipados, Leitner,
   seleção do pré-requisito mais frágil, dose de 4/8 questões, escada acelerada de
   2 acertos, término no nível necessário e escalada anti-loop após 3 missões estão
   implementados. A cobertura semântica de cada misconception continua vinculada
   às fichas pedagógicas reais: o motor retorna ausência em vez de inventar missão.
10. Consolidar Dojo FD/PD/Jardim.
11. Corrigir regras e arquitetura de telemetria Firestore.
12. Versionar/migrar estado de crianças até F4.
13. Dividir componentes monolíticos.
14. Corrigir responsividade infantil.
15. Reduzir bundle e otimizar assets.
16. Restaurar simulador e ampliar testes.
17. Cobrir as 53 competências atualmente em fallback.
18. Profissionalizar o mascote somente depois da base educacional.
19. Publicar a branch `work` no `SAGA-Codex` quando a rede permitir.
20. Continuar fichas provisórias quando necessário e, quando o proprietário entregar
    as versões cinematográficas, comparar e fundir sem substituição cega, mantendo
    uma única ficha runtime canônica e a origem recebida preservada em staging.

---

# 15. Etapas posteriores ao cumprimento do plano

1. Beta fechado com poucas famílias.
2. Observação real de crianças de idades diferentes.
3. Medição de retenção, frustração, abandono e tempo.
4. Painel dos pais baseado em evidências reais.
5. Segurança, privacidade infantil e controle de custos.
6. Pipeline de autoria para novas competências e matérias.
7. Otimização e publicação do produto.
8. Expansão de personagens, atlas, evolução e coleção.

---

# 16. Regra de continuidade

Ao retomar o projeto:

1. ler `AGENTS.md`;
2. ler este dossiê e o final do `DIARIO_DE_BORDO.md`;
3. executar `git status --short --branch`;
4. executar `npm run auditar`;
5. executar `npm run lint` e `npm test` antes de mudar motores;
6. trabalhar em uma fase e um PR atômico por vez;
7. não alterar o SAGA original sem autorização explícita;
8. atualizar este dossiê quando uma decisão estrutural mudar.
