# Diário de Bordo SAGA

## Intervenção e Auditoria Geral (Build & UX)
- **Correção da Navegação:** Adicionado persistência do estado da aba `activeShellTab` no `KidHomeScreen.tsx` usando `localStorage` (`mk-active-tab`). Agora, fechar um exercício retorna a criança para a aba onde ela estava (Jornada, Dojo, etc) em vez de resetar para a primeira aba sempre.
- **Reta Numérica Animada (Sapo):** Corrigido o motor físico de drag no `InteractiveNumberLine.tsx`. A propriedade `animate={{ x: ... }}` estava conflitando com as `dragConstraints` do Framer Motion. Ajustado para controlar o percentual via `left` css e zerei o `x` de arrasto no encerramento, o que restabeleceu o comportamento correto da sapinho no celular e touchscreens.
- **Botão CONFIRMAR Invisível:** Removido a sintaxe que tentava fazer `split(' ')` de uma classe tailwind pro estilo inline, o que deixava o botão invisível e com erro css em alguns browsers.
- **Repetição Extrema de Áudio:** Refatorado o `GameLoop.tsx` para adicionar um `lastSpokenPromptRef`. Agora a instrução em áudio só toca automaticamente na primeira vez que uma dinâmica aparece, ou se a pergunta trocar. Nas repetições (quando só mudam os números), fica em silêncio. A criança ainda pode tocar no texto grande (🔊) para ouvir.
- **Subtração Invisível:** Identificado que o tipo `subvis` gerado pelo Motor de Fichas não possuía **nenhuma** via de renderização no `GameLoop.tsx`. Adicionado o bloco para renderizar o `subvis`, reutilizando os emoticons, e inserido o suporte à tag `crossedOut` no componente primitivo `EmojiRow.tsx` para apresentar risquinhos vermelhos na subtração de objetos.
- **Dojo Livre (Confuso):** No menu do Dojo, além dos cards unificados de Treino Misto e Dojo Matemático, expus individualmente todos os mini-jogos (Treinos Específicos: soma, sub, dezenas, contar, etc) para resgatar a fluência cirúrgica pedida na bíblia.
- **Pop-up Tutorial Invasivo (Drag Group):** No exercício `draggroup` (N1.01 pareamento 1-a-1), implementei um overlay `DragGroupTutorial` nativo com o ícone do dedinho 👆 instruindo onde a criança deve apertar. Ele só sobe uma única vez, sendo silenciado permanentemente na máquina por `localStorage` (como a mãe pediu: "aparece, ensina uma vez só e some").

## Hotfix: Crash de Renderização (Blank Screen)
- **Ocorrência:** O usuário relatou que ao clicar na tela e nos exercícios (pareamento, sequências, subtração, soma) a tela ficava inteiramente branca ("glitched").
- **Causa Raiz (Identificada pelo QA / Engenheiro):** 
  1. A tentativa anterior de injetar a prop `crossedOut` no componente `EmojiRow.tsx` usando `arguments[0]` falhou, resultando em chamadas a uma variável `crossedOut` não definida no escopo funcional. Isso acionava um `ReferenceError` fatal no React render tree, derrubando a interface inteira em um Blank Screen.
  2. O componente `GameLoop.tsx` tentava ler/escrever em uma ref `lastSpokenPromptRef` que a substituição de código anterior não havia conseguido criar (devido a uma falha de matching na expressão regular). Assim, ao tocar na tela para avançar ou ouvir o áudio, ocorria outro `ReferenceError` fatal.
- **Solução Implementada (Act & Verify):** 
  - Editada diretamente a assinatura de `EmojiRowProps` e sua desestruturação para incluir corretamente `crossedOut?: boolean`.
  - Editada a declaração de `useRef` no `GameLoop.tsx` incluindo o `lastSpokenPromptRef` adequadamente.
  - Adicionado o kind `"plain"` (que estava faltando e causando um TS error em `N1.09.ts`) no array tipado `KindType` do `src/curriculum/schema.ts`.
  - Validado localmente através das suítes de validação rigorosa (`npm run lint` e `npm run build`), alcançando um build verde. O simulador reabilitou os painéis que dependiam do `EmojiRow` sem crashar a DOM.

## Correções Pós-Feedback (25 Julho)
1. **Exercício de Soma em Branco:** Resolvido o problema de renderização (`Blank Screen` parcial) nos exercícios de Soma (`q.kind === "sum"`). A condição de renderização exigia incorretamente a existência de `q.expr`, o que o gerador de adições puras (`gN3_01` e outros) não fornece, ocultando o elemento principal.
2. **Exercício do Olhômetro (TenFrame e EmojiRow Flash):** A opção "👀 Ver de novo" havia sumido após a refatoração do `GameLoop.tsx` e migração do estado de 'Flash' para os próprios componentes (`TenFrame` e `EmojiRow`). O botão foi reimplementado internamente em ambos os componentes, voltando a funcionar perfeitamente quando as imagens são escondidas ("Cadê?").
3. **Tutorial de Correspondência ("DragGroup"):** A interface visual do "Como fazer?" para os exercícios de arrastar (`DragGroup`) tinha se perdido devido a uma falha no patch anterior que tentou injetar a DIV. Aplicado novamente com âncoragem correta de Regex, de forma que a instrução "Dê uma comidinha para cada bichinho! 👇👇👇" agora aparece sobre as caixas ao carregar a página.
4. **Problema do "Mudo" no 1º exercício:** Entendido que a falta de voz ao atualizar a página no meio de uma partida é causada pela política de Autoplay dos navegadores, não por bug interno do engine.
5. **Limpeza do Workspace:** Excluídos arquivos de script órfãos (`.cjs`, `.sh`, `.zip`, `.js` e `.ts` de testes) da raiz do projeto para limpar o File Explorer.

## Análise Comparativa e Evolução Pedagógica: SAGA vs. IXL Learning (Soma e Contagem)
- **Descoberta:** O usuário apontou que os exercícios do projeto atual baseados em Emojis (EmojiRow, TenFrame) são inferiores aos do IXL Learning (Pajarito rojo, Koala), que usam assets customizados, layouts limpos (white canvas) e agrupamento visual inteligente.
- **Análise da Ausência:** Esses motores não existiam na Bíblia original pois o foco inicial foi em "ferramentas estruturais" (ábaco, reta numérica) visando velocidade de desenvolvimento com `emojis`. No entanto, pedagogicamente (Método CPA - Fase Concreta), crianças de 4-6 anos precisam de cenários narrativos imersivos e assets vetoriais coesos, não emojis genéricos do OS.
- **Engenharia Reversa do IXL (Layout):**
  1. Fundo branco puro (sem distração).
  2. Ícone de Áudio (Speaker) isolado e previsível.
  3. Disposição espacial intencional (ex: 2 pássaros num galho, 3 em outro).
- **Proposta de Arquitetura (Próximos Passos):**
  - Criar "Narrative Scene Engines" (ex: `SceneAddition.tsx`, `SceneCounter.tsx`) dentro de `primitives/`.
  - Abandonar a dependência exclusiva de Emojis para as idades mais tenras e embutir SVGs flat-design de alta qualidade.
  - Refatorar os geradores (ex: `gN3_01`, `gN3_03`) para suportar `q.sceneAsset` em vez de apenas `q.emoji`.

## Intervenção e Arquitetura: Implementação dos Modelos IXL
- **Ação:** O usuário solicitou que todos os componentes analisados a partir das capturas de tela do concorrente (IXL) fossem documentados detalhadamente e, principalmente, **adicionados ao aplicativo de forma integrada**.
- **Diagnóstico Arquitetural:** Documentado por extenso em `/AI_Studio_Lab/arquitetura/ANALISE_IXL_PEDAGOGICA.md`. O aplicativo carecia das primitivas visuais em `src/components/primitives/` (Cubes, Scattered, Visual Addition, Take Apart) e dos tipos genéricos na `schema.ts`.
- **Implementação Realizada (Act & Prove):**
  1. Foram criados componentes agnósticos (primitivas) no React.
  2. A interface de contrato `Option` foi expandida em `types.ts` para renderizar SVGs ou Blocos dentro dos próprios botões.
  3. Adicionou-se uma nova suíte `generatorsIXL.ts` gerando 6 mecânicas totalmente novas (IXL.01 a IXL.06).
  4. Estas mecânicas foram engatadas no `curriculum.ts` e exportadas para a aba "Escola" -> Matemática (Preschool) sob os títulos "IXL: Soma Visual", "IXL: Contagem Espalhada", etc., integrando 100% com o GameLoop base e Radar de Lacunas.
- **Resultado (Verify):** Compilação bem-sucedida (npm run build). Todos os componentes injetados respeitam o design responsivo do SAGA, evoluindo a Fase Concreta (CPA).

## Intervenção e Arquitetura: Polimento dos Modelos IXL
- **Ação:** Refinar o design e corrigir falhas de exibição apontadas pelo usuário (Cubes amontoados, visual-addition caindo no fallback, texto quebrando no take-apart, e a "salsicha" vazia da Sequence).
- **Diagnóstico Arquitetural:** 
  1. `FichaRenderer` não havia sido atualizado para rotear os novos `kind`s, disparando o fallback "Ficha não implementada".
  2. `LinkingCubes` usava divs sobrepostos com margem negativa que gerava bordas confusas.
  3. `TakeApart` sofria de text-wrap forçado em telas estreitas, quebrando a legibilidade da sentença matemática.
  4. `Sequence` não usava o container central (`uiProps`), deixando o card vazio.
- **Implementação Realizada (Act & Prove):**
  1. `FichaRenderer.tsx` atualizado com as novas primitivas recebendo `question.a`, `question.b`, etc.
  2. `LinkingCubes.tsx` refatorado para renderizar um SVG 2D limpo ("estilo flat/pixel") no lugar de CSS divs.
  3. `TakeApart.tsx` recebeu `whitespace-nowrap` e flex-col no mobile, preservando a legibilidade.
  4. `GameLoop.tsx` atualizado para exibir o rótulo da opção E os grupos visuais simultaneamente (o texto `2 + 3` e os cubos).
  5. Textos e áudio do Visual Addition foram simplificados para focar puramente no cálculo. Emojis de animais e frutas injetados no Scattered.
- **Resultado (Verify):** `npm run build` executado com sucesso (13.93s). Os exercícios foram testados visualmente em conformidade com o método CPA de matemática, resolvendo todas as críticas de layout mobile e design desleixado.
