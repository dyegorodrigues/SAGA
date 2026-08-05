# Importar o Creature Engine no Google AI Studio

Este documento descreve o fluxo de preview do Tamagotchi/Creature Engine. Ele não autoriza merge nem publicação no `main`.

## Fonte correta

- Repositório: `dyegorodrigues/SAGA`
- Branch obrigatória: `agent/creature-engine-tamagotchi`
- Branch de referência do aplicativo atualizado: `claude/install-superpowers-repo-bst25i`
- Não importar `main` para esta tarefa.
- Não editar nem enviar commits diretamente para a branch do Cloud Code.

Antes de permitir que o Google AI Studio altere arquivos, confirme que o painel mostra estes caminhos:

```text
src/features/creature-engine/
server/services/creatureSpriteService.ts
docs/GOOGLE_AI_STUDIO_CREATURE_ENGINE.md
```

Se eles não aparecerem, a branch errada foi importada.

## Runtime

- Node.js: 22
- Instalação reproduzível: `npm ci`
- Desenvolvimento: `npm run dev`
- Build: `npm run build`
- Servidor: Express + Vite, ouvindo em `0.0.0.0`
- Porta padrão: `3000`, ou a variável `PORT` fornecida pelo ambiente

O Creature Engine não necessita de chave do Gemini, API paga ou segredo no navegador. Caso o Google AI Studio solicite uma chave para outra funcionalidade existente, isso é independente deste módulo. Nunca coloque segredo diretamente no código cliente.

## Rede externa necessária

Para mostrar as animações PMD reais, o ambiente de preview precisa alcançar por HTTPS:

- `spriteserver.pmdcollab.org`
- `raw.githubusercontent.com`

Quando a rede externa falha, a interface deve continuar funcionando com retrato ou emoji de fallback. A ausência de rede não pode travar o perfil.

## Verificação mínima após importar

1. Abra `/api/health` e confirme `creatureEngine: true` e `spriteCollab: true`.
2. Abra `/api/creatures/catalog` e confirme o catálogo de seis criaturas.
3. Entre no Perfil da criança e localize o cartão Creature Engine.
4. Teste Alimentar, Brincar, Dormir, Carinho e Treinar.
5. Troque o parceiro e renomeie o mascote.
6. Recarregue a página e confirme a persistência do nome, espécie e progresso.
7. Observe caminhada, idle, celebração e fallback quando a rede for bloqueada.
8. Confira o layout em viewport de tablet, especialmente 390 px e larguras maiores.

## Comandos de prova

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

A branch só deve ser considerada tecnicamente íntegra quando esses comandos passarem. A inspeção visual/touch continua obrigatória porque testes não avaliam enquadramento, escala percebida, conforto dos botões ou fluidez no tablet.

## Regra de sincronização

O fluxo é unidirecional:

```text
Cloud Code atualizado
        ↓ copiar/mesclar para
agent/creature-engine-tamagotchi
        ↓ importar no
Google AI Studio
```

Nunca fazer o caminho inverso automaticamente. Mudanças aprovadas no preview permanecem nesta branch até uma decisão futura e explícita do proprietário do projeto.

## Limites do protótipo

- Pokémon e sprites PMDCollab são usados para validação técnica, não como licença comercial do SAGA.
- A camada de sombra é renderizada; offsets corporais finos ainda não são interpretados integralmente.
- Os PNGs dependem de rede/cache HTTP; ainda não existe pacote offline próprio.
- O catálogo inicial tem seis criaturas para reduzir carga e simplificar a validação.

## Proibição de merge

Esta branch é um ambiente isolado de desenvolvimento e simulação. Não habilitar auto-merge, não marcar o PR como pronto para revisão e não fundir no `main` nem na branch do Cloud Code sem uma nova instrução explícita do proprietário.
