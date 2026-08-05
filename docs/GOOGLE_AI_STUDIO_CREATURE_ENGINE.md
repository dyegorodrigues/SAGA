# Importar o Creature Engine no Google AI Studio

Este documento descreve o fluxo de preview do Tamagotchi/Creature Engine. Ele não autoriza merge nem publicação no `main`.

## Fonte correta

- Repositório: `dyegorodrigues/SAGA`
- Branch obrigatória: `agent/creature-engine-tamagotchi`
- Branch de referência do aplicativo atualizado: `claude/install-superpowers-repo-bst25i`
- Não importar `main` para esta tarefa.
- Não editar nem enviar commits diretamente para a branch do Cloud Code.

Antes de permitir qualquer alteração, confirme que o painel de arquivos contém:

```text
creature-lab.html
src/creature-lab-main.tsx
src/features/creature-engine/CreatureLab.tsx
src/features/creature-engine/PmdLabSprite.tsx
server/services/creatureSpriteService.ts
```

Se esses arquivos não aparecerem, a branch errada foi importada ou o AI Studio criou um aplicativo novo em vez de abrir o repositório.

## Não pedir para o Gemini recriar o sistema

Depois da importação, não envie comandos como “crie um Tamagotchi”, “faça um sistema Pokémon” ou “reconstrua esta aplicação”. Isso faz o Build Mode gerar um protótipo paralelo com dados e componentes inventados, em vez de executar o código do repositório.

A primeira ação deve ser apenas instalar e iniciar o projeto existente:

```bash
npm ci
npm run dev
```

Depois, no campo de endereço da Preview, abra exatamente:

```text
/creature-lab.html
```

A página correta apresenta o cabeçalho **SAGA Creature Lab** e três áreas principais: catálogo, palco de animação e inspetor com abas Ações, Frames, Motor e Assets. Qualquer tela com aluno fictício, “PikaPika”, “PMD Engine v2.0” ou rotas diferentes das documentadas abaixo não veio desta branch.

## Runtime

- Node.js: 22
- Instalação reproduzível: `npm ci`
- Desenvolvimento: `npm run dev`
- Build: `npm run build`
- Servidor: Express + Vite, ouvindo em `0.0.0.0`
- Porta padrão: `3000`, ou a variável `PORT` fornecida pelo ambiente
- Entrada infantil: `/`
- Laboratório independente: `/creature-lab.html`

O Creature Engine não necessita de chave do Gemini, API paga ou segredo no navegador. Caso o Google AI Studio solicite uma chave para outra funcionalidade existente, isso é independente deste módulo. Nunca coloque segredo diretamente no código cliente.

## O que existe no Creature Lab

- catálogo inicial com seis Pokémon;
- carregamento de qualquer ID numérico disponível no PMDCollab;
- lista integral das ações do personagem;
- identificação de sprites próprias e `CopyOf`;
- play, pause, reinício e navegação manual de frames;
- controle de velocidade e escala;
- oito direções PMD e comparação simultânea;
- timeline e miniaturas de todos os frames da ação;
- teste automático e execução de todas as ações;
- fila de comportamento editável, reordenável e duplicável;
- links para Anim, Offsets e Shadow originais;
- download do `AnimData.xml`;
- override local de spritesheet, sombra e XML para testes;
- importação e exportação da configuração da bancada;
- créditos, commit-fonte, fase e licença do asset.

## Rede externa necessária

Para mostrar as animações PMD reais, o ambiente de preview precisa alcançar por HTTPS:

- `spriteserver.pmdcollab.org`
- `raw.githubusercontent.com`

Quando a rede externa falha, a interface deve apresentar o erro de forma explícita. O perfil infantil continua com retrato ou emoji de fallback e não pode travar.

## Verificação mínima após importar

1. Abra `/api/health` e confirme `creatureEngine: true` e `spriteCollab: true`.
2. Abra `/api/creatures/catalog` e confirme o catálogo de seis criaturas.
3. Abra `/creature-lab.html`.
4. Selecione Pikachu e confira a lista completa de ações.
5. Teste Idle, Walk, Attack e outras ações existentes.
6. Pause, avance frames e percorra as oito direções.
7. Ative “Rodar todas as ações”.
8. Edite e execute a fila do Motor.
9. Digite outro ID nacional no catálogo e toque em “Puxar”.
10. Teste os overrides locais de XML e PNG sem enviar nada ao repositório.
11. Depois, abra `/` e valide o cartão infantil no Perfil.
12. Confira o layout no tablet em paisagem e retrato.

## Comandos de prova

```bash
npm run lint
npm run test:creature
npm test
npm run auditar
npm run fichas:auditar
npm run grafo:check
npm run build
test -f dist/creature-lab.html
npm run test:creature:smoke
```

A inspeção visual/touch continua obrigatória porque testes não avaliam enquadramento, escala percebida, conforto dos botões ou fluidez no tablet.

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

## Limites atuais

- Pokémon e sprites PMDCollab são usados para validação técnica, não como licença comercial do SAGA.
- O laboratório permite substituir e inspecionar assets, mas ainda não possui editor pixel a pixel embutido; esse papel continua pertencendo ao PokeSagaLab.
- A camada de sombra é renderizada; offsets corporais finos ainda não são interpretados integralmente no palco.
- Os PNGs dependem de rede/cache HTTP; ainda não existe pacote offline próprio.

## Proibição de merge

Esta branch é um ambiente isolado de desenvolvimento e simulação. Não habilitar auto-merge, não marcar o PR como pronto para revisão e não fundir no `main` nem na branch do Cloud Code sem uma nova instrução explícita do proprietário.
