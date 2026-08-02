# Plano Mestre SAGA — execução após o cânone v3.2

**Atualizado em:** 2 de agosto de 2026
**Fonte de decisão:** Bíblia v3.2, Grafo v1.2, Manual v2.3, Dojo v1.4 e pacote de reconciliação de 1º de agosto de 2026.

## Estado de partida comprovado

- Grafo canônico: **88 competências** e **13 trilhas de fluência**.
- Autoria recebida: **92 fichas cinematográficas**, distribuídas em cinco blocos F0–F4.
- Runtime anterior à reconciliação: 42 geradores explícitos, 12 fichas TypeScript e 53 fallbacks sobre a contagem antiga de 95.
- Infraestrutura já existente: DAG aplicado, Composer tipado incrementalmente, domínio multidimensional, Radar, Oficina, painel dos pais, auditor e geração determinística do grafo.
- Regra de segurança: o Markdown autoral não entra automaticamente no runtime. Cada ficha passa por comparação, contrato, renderer e teste antes de substituir um caminho legado.

## Fase 0 — Cânone e proteção contra deriva

### Objetivo

Fechar uma única cadeia `documento humano → YAML agregado → JSON/TypeScript → runtime` e impedir a volta do incidente 84/95.

### Entregas

1. Retirar os sete IDs rejeitados por duplicação: `N2.08`, `N5.06`, `N5.07`, `N5.08`, `N7.03`, `N7.04`, `PE.05`.
2. Regenerar JSON e TypeScript a partir do YAML de 88.
3. Sincronizar os YAMLs por strand.
4. Promover Bíblia, Grafo, Manual e Dojo recebidos aos caminhos canônicos de `AI_Studio_Lab/pedagogia/`.
5. Manter Método, Arquitetura Cognitiva, Primitivas, Trilhas do Dojo e fichas como documentos irmãos, sem cópias ativas concorrentes.
6. Fazer o auditor bloquear contagem errada, IDs rejeitados, duplicação semântica óbvia, pré-requisito com nome equivalente e ficha apontando para nó inexistente.

### Pronto quando

`npm run auditar`, `npm run grafo:check`, `npm run lint`, `npm test` e `npm run build` passam com 88/13/92.

## Fase 1 — Catálogo executável das 92 fichas

### Objetivo

Transformar os cinco blocos Markdown em inventário estruturado sem inventar conteúdo.

### Entregas

1. Parser read-only para identidade, competência, primitiva, faixa, níveis, diagnóstico, falas, coreografia e domínio.
2. Relatório `ficha → competência → primitiva → componente existente → builder → renderer → teste`.
3. Detecção de ficha órfã, competência sem ficha, ID rejeitado, primitiva desconhecida e ausência das nove seções.
4. Classificação de origem: autoral recebida, runtime atual ou legado.

### Proibido

Gerar 92 arquivos TypeScript automaticamente sem revisão; transformar prosa em regra por heurística silenciosa; substituir ficha runtime já funcional sem teste de paridade.

## Fase 2 — Kinds e primitivas P1

### Ordem

1. Ligar componentes existentes: `InteractiveVertical`, `ArrayGrid`, `Quadrado100`, `SingaporeBars`.
2. Fechar contratos de `vertical`, `array`, `area-model`, `frac-shade` e `singapore-bars`.
3. Cada kind recebe união discriminada, builder, renderer, acessibilidade, áudio e teste de resposta única.
4. Só então construir primitivas realmente ausentes, começando por `money`, `measure`, `picto` e `pattern`.

## Fase 3 — Vertical padrão-ouro e cobertura F0

1. Migrar uma competência completa por vez, preservando o legado até paridade.
2. Tampar `GM.01`, único fallback anterior de F0.
3. Validar CRA, primeira exposição, divulgação progressiva, erro motor e coreografia curta.
4. Fazer teste infantil programático: uma ação dominante, sem leitura obrigatória e sem rolagem na viewport-alvo.

## Fase 4 — F2 antes de F3/F4

1. Priorizar reagrupamento, grupos iguais, arranjo, divisão, tabuadas e medidas.
2. Usar as fichas recebidas como contrato de autoria, não como código executável automático.
3. Reduzir fallbacks por lote pequeno e mensurável.
4. Não iniciar expansão ampla de F3/F4 enquanto os pré-requisitos F2 continuarem sem experiência real.

## Fase 5 — Radar, Oficina e Tutor Vertical v3.2

1. Filtro motor antes de misconception.
2. Radar probabilístico com peso, limiar, decaimento e linguagem de hipótese.
3. Mão Fantasma como exemplo esmaecido de até 10 segundos, nunca filme bloqueante.
4. Divulgação progressiva independente do nível.
5. Coreografia como dado universal, sem tratamentos especiais crescendo no `GameLoop`.

## Fase 6 — Dojo completo

1. Preservar Jornada nível 1–5 × Dojo faixa 1–10.
2. Gerar as quatro trilhas atuais conforme as tabelas e criar a quinta trilha de Frações/Decimais.
3. Separar `rt_direto` e `rt_invertido` em `FactStrength`.
4. Implementar `DojoErrorEvent`, inventário reproduzível de fatos e janelinha de faixas.
5. Construir Prancheta sobre `TraceCanvas` somente depois do contrato de interação.

## Fase 7 — Persistência, telemetria e confiabilidade

1. Migrador versionado de saves para 88 nós, ignorando com segurança os sete IDs rejeitados.
2. Regras Firestore testadas em emulador para telemetria infantil.
3. Política de retenção, custo, offline e conflitos entre dispositivos.
4. Simulador real restaurado; E2E, acessibilidade, responsividade, circularidade e orçamento de bundle.

## Fase 8 — UI, performance e mascote

1. Dividir monólitos sem misturar mudança pedagógica com redesign.
2. Garantir exercício sem rolagem em celular/tablet e `reduced-motion`.
3. Lazy-load de Admin/Pais e otimização de assets.
4. Mascote como motor orientado a eventos e renderer substituível; atlas profissional somente após estabilização educacional.

## Protocolo Git obrigatório

1. Uma branch por bloco atômico, sempre criada da `main` atualizada.
2. Nunca criar PR a partir de branch de PR já mesclada.
3. Antes de publicar: `git fetch`, provar a base, rodar checks e verificar ausência de conflitos.
4. PR sempre aponta explicitamente para `main`; merge somente após checks verdes.
5. Branch antiga só é removida depois de confirmar que é ancestral de `main`.
6. Nunca usar o editor web para resolver conflito pedagógico ou de código; resolver no ambiente com testes.

## Próximo bloco

**F35/N3.09 e F39/N3.11 estão estruturadas e validadas no Sandbox e na Jornada de
teste**, mantendo os dois geradores legados na produção. O próximo bloco é o
**Lote B — migração controlada do vertical**: fechar persistência diagnóstica por
tentativa, executar canário e decidir um único nó por PR. `array` e
`singapore-bars` continuam bloqueados até essa decisão.

## Orquestração dos próximos lotes após F39

Cada lote abaixo só começa quando o anterior estiver mesclado em `main` e a nova
branch provar que nasceu da `origin/main` atual. Nenhum lote mistura mudança
pedagógica, troca de gerador em produção e expansão de outra primitiva.

### Lote A — fechar F39 como padrão-ouro

**Estado: concluído em 2/ago/2026.** Os cinco níveis ficaram sem rolagem em
390×844; a Jornada legada foi exercitada sem crash e com uma única ação dominante;
erro gentil, áudio, troca simples/dupla e paridade foram cobertos por logs e testes.

1. Validar os cinco níveis de N3.11 no Sandbox e em 390×844.
2. Verificar a troca como ação observável: unidades → barra → dezena registrada.
3. Confirmar erro gentil por coluna, áudio, alvos de 80 px e ausência de rolagem.
4. Medir paridade entre `gN3_11` e a ficha; **não** trocar produção ainda.
5. Só depois decidir, em PR próprio, se a ficha substitui o legado.

### Lote B — migração controlada do vertical

**Estado: concluído em 2/ago/2026.** N3.09 tornou-se o único canário do Composer,
com proveniência observável e rollback pela retirada do conjunto de canários.
N3.11 continua no gerador legado `gN3_11`. O diagnóstico é agregado em memória e
publicado apenas no evento terminal da questão, deduplicado para o Radar.

1. Criar teste de paridade de alcance e contrato para N3.09/N3.11.
2. Preservar saves e telemetria; validar Radar e misconceptions por coluna.
3. Fazer canário no Sandbox/Jornada de teste antes de alterar `GENERATOR_MAP`.
4. Trocar um único nó por PR e manter rollback explícito.

### Lote C — array, somente depois de F39 verde

1. Ligar `ArrayGrid` ao builder `array` com união discriminada.
2. Implementar N4.02 nos cinco níveis seguindo grupos → arranjo → símbolo.
3. Validar rotação/comutatividade, toque alternativo e diagnóstico.
4. Preservar qualquer caminho legado até a paridade.

### Lote D — barras de Singapura

1. Ligar `SingaporeBars` ao builder tipado.
2. Começar por N3.10; não expandir de uma vez para frações/razão.
3. Testar áudio da história, uma pergunta por tela e quatro estruturas aditivas.

### Lote E — confiabilidade antes de massificação

1. E2E da missão diária e das fichas migradas.
2. Radar por coluna, filtro motor e Oficina com evidência real.
3. Firestore Emulator, saves versionados, acessibilidade e orçamento de bundle.
4. Só então repetir o pipeline em pequenos lotes de F2.

**Regra de revisão adaptativa:** descoberta nova pode reordenar itens dentro do
lote atual, mas não autoriza pular a trava entre lotes. Toda mudança de rota entra
no Diário com evidência, impacto, decisão e comando de verificação.
