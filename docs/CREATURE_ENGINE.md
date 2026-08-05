# SAGA Creature Engine — Tamagotchi do Perfil

## Objetivo

O Creature Engine transforma o mascote do perfil em um companheiro animado, persistente e integrado ao progresso pedagógico do SAGA. Pokémon do PMDCollab são usados **somente como protótipos técnicos** para validar o motor, as animações e a experiência. A arquitetura mantém espécie, estado e renderer desacoplados para permitir a substituição posterior por mascotes originais do SAGA.

## Princípios invariantes

- O mascote nunca morre, adoece, regride ou pune a criança.
- Ausência e necessidades baixas mudam somente humor, animações e frases.
- Errar não retira XP, vínculo, evolução ou conquistas.
- Praticar já produz vínculo positivo; acertos e sequências geram celebrações adicionais.
- A aula continua determinística e funcional sem IA.
- O Creature Engine não depende de chave de API.
- Assets ausentes são mostrados como indisponíveis; o sistema não inventa frames.
- Animações respeitam `prefers-reduced-motion` e pausam quando a aba fica oculta.

## Arquitetura

```text
src/features/creature-engine/
├── catalog.ts                 catálogo inicial e metadados visuais
├── domain.ts                  estado, necessidades, progresso e comportamento
├── pmdAnimData.ts             parser estrito de AnimData.xml
├── spriteCollabClient.ts      cliente das rotas internas do SAGA
├── PmdCreatureSprite.tsx      renderer PMD com 1 ou 8 direções
├── CreatureProfileCard.tsx    integração touch-first com o perfil
└── tests/

server/services/
└── creatureSpriteService.ts   GraphQL oficial, cache e proxy allowlisted
```

### Domínio

`CreatureSaveV1` é persistido dentro do objeto da criança (`kid.creature`). O estado inclui:

- espécie e apelido;
- XP e estágio evolutivo;
- energia, saciedade, alegria e vínculo;
- humor e última reação;
- timestamps do relógio e da interação;
- snapshot pedagógico já processado;
- espécies desbloqueadas.

A migração principal do SAGA preserva propriedades desconhecidas ao espalhar o objeto da criança, portanto saves antigos continuam válidos e passam a receber o estado do Creature Engine ao abrir o perfil.

### Integração pedagógica

O cartão resume o progresso de `state.progress` e `state.log`:

- estrelas vitalícias;
- acertos e questões praticadas;
- sequência de dias;
- último dia ativo.

A aplicação compara o snapshot atual com o último processado. Somente deltas novos geram XP, alegria, vínculo e celebração, evitando duplicar recompensas ao reabrir a tela.

### Relógio gentil

O tempo é calculado pelo intervalo entre `lastTickAt` e o momento atual. O cálculo é limitado a 72 horas por atualização e possui pisos seguros:

- energia ≥ 20;
- saciedade ≥ 20;
- alegria ≥ 25;
- vínculo ≥ 35.

Nada bloqueia a criança ou reduz o estágio evolutivo.

### Comportamento

A intenção semântica (`idle`, `walk`, `eat`, `sleep`, `happy`, `attack`, `celebrate` etc.) é separada do nome do asset. `resolvePmdAction` seleciona a melhor ação realmente disponível para cada criatura e cai honestamente para `Idle` ou para a primeira ação disponível.

O comportamento autônomo é decorativo. Necessidades têm prioridade; quando estão adequadas, pequenas ações ociosas são escolhidas em intervalos espaçados. A geração de exercícios e a progressão pedagógica não usam essa aleatoriedade.

## PMDCollab

O servidor consulta a API GraphQL oficial do PMDCollab para um catálogo inicial enxuto:

- Bulbasaur;
- Charmander;
- Squirtle;
- Pikachu;
- Eevee;
- Riolu.

Para cada criatura, o serviço seleciona preferencialmente a forma canônica, não shiny e sem variação feminina. Ele entrega:

- `AnimData.xml`;
- lista de ações e `CopyOf`;
- URLs de `Anim`, `Offsets` e `Shadow`;
- retrato;
- fase de conclusão;
- créditos;
- commit da fonte.

O navegador nunca acessa URLs arbitrárias diretamente pelo backend. `/api/creatures/asset` aceita apenas HTTPS nos hosts:

- `spriteserver.pmdcollab.org`;
- `raw.githubusercontent.com`.

## Renderer PMD

O parser rejeita:

- XML malformado;
- animação sem nome, dimensão ou duração;
- `CopyOf` inexistente ou cíclico;
- sheet não divisível pela célula;
- qualquer número de direções diferente de 1 ou 8;
- divergência entre colunas e durações.

O renderer usa os ticks PMD em 1/60 s, não presume seis frames e não repete linhas ou colunas. O índice direcional adotado segue a convenção PMD: `0` frontal/baixo, `2` direita e `6` esquerda.

## Rotas

| Rota | Função |
|---|---|
| `GET /api/health` | saúde e capacidades do servidor |
| `GET /api/creatures/catalog` | catálogo inicial do PMDCollab |
| `GET /api/creatures/:numericId` | metadados, XML, ações e créditos |
| `GET /api/creatures/asset?url=...` | proxy seguro de imagem/XML |

## Verificação

```bash
npm run lint
npm run test:creature
npm test
npm run auditar
npm run fichas:auditar
npm run grafo:check
npm run build
npm run test:creature:smoke
```

A CI executa esses gates em pull requests que alterem o módulo.

## Licença e substituição futura

O PMDCollab e os personagens Pokémon possuem direitos e condições de uso próprios. Os sprites servem para prototipagem técnica e validação interna; não são a base jurídica de uma distribuição comercial do SAGA.

A substituição por mascotes originais exige apenas que o novo provedor entregue o mesmo contrato semântico: espécie, catálogo, ações disponíveis, metadata de animação, sheets e créditos. O estado pedagógico, o comportamento e a interface permanecem reutilizáveis.

## Limitações conhecidas

- A validação visual e touch precisa ser feita em preview real de tablet antes do merge.
- O protótipo renderiza a camada `Shadow`, mas ainda não interpreta marcadores de `Offsets` para deslocamentos corporais finos.
- Não há cache offline de PNGs; o navegador usa cache HTTP e o cartão mantém fallback de retrato/emoji.
- A seleção de mascote começa com seis espécies para preservar desempenho e reduzir carga de rede.
