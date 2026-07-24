# 🧠 Algoritmo de Adaptação e Orquestração (O "Personal Trainer")

Este documento detalha **COMO** a Inteligência do Matemágica enxerga a criança e orquestra a sessão.

## 1. O Conceito da Ginástica (Aquecimento e Hipertrofia)
A criança nunca começa o dia levantando o "peso máximo". O algoritmo funciona como um treinador físico:

- **Aquecimento (Retrieval / Dojo Inicial)**: Exercícios de habilidades que a criança já está no Nível 5 (Fluência). Servem para dar confiança, ativar as conexões neurais e praticar o cálculo rápido (ex: 2+2, 5+1).
- **Treino de Força (Prática Guiada de Nova Habilidade)**: O foco da sessão. Traz uma habilidade em Nível 1 (Entendeu) ou Nível 2 (Com ajuda). É aqui que entra o esforço cognitivo, a microaula e o scaffold (apoio estruturado).
- **Desaquecimento (Revisão Espaçada)**: Habilidades de Nível 4 que estão quase caindo no esquecimento.

## 2. Visão Raio-X do Algoritmo
Como o algoritmo sabe onde a criança está? Através da estrutura de rastreamento:
- Ele não guarda que a criança "Sabe Adição: Nível 3".
- Ele guarda:
  - `C0101 (Somar Juntando)`: Nível 6 (Automação).
  - `C0102 (Contar do maior)`: Nível 4 (Sozinho).
  - `C0103 (Amigos do 10)`: Nível 1 (Descobriu).

Se a criança for fazer um teste na sessão, o algoritmo não mistura C0103 com "Subtração". Ele a mantém focada na competência alvo até consolidar.

## 3. Gestão de Crianças Pequenas (Alfabetização Numérica)
- O algoritmo possui uma trava de segurança. Se o perfil for "4 Anos / Iniciante", o motor consulta o Grafo de Competências e percebe que as competências `C000A` (Canto Numérico) e `C000B` (Símbolos) estão no Nível 0.
- Enquanto essas não passarem para o Nível 4 (Resolve Sozinho), o motor **bloqueia** qualquer exercício que exija somar duas quantidades ocultas ou símbolos matemáticos (`+`, `-`).

## 4. Onde Mora Esse Algoritmo?
Na arquitetura do projeto (MAB), ele mora no **CORE**.
- `progressEngine.ts`: Guarda o estado (Níveis de 0 a 7 para cada C000X).
- `sessionManager.ts`: É o "treinador". Ele olha para o `progressEngine`, escolhe 1 competência alvo, 2 para aquecimento, 1 para revisão, e envia esse pedido para a camada de Geração de Conteúdo.

## 5. Garantia de Funcionamento
Para sabermos que está evoluindo e se ajustando, o motor precisa emitir "Progress Events". A interface gráfica não precisa mostrar a complexidade para a criança, mas para o "Painel dos Pais" (ParentDashboard) ou "Modo Desenvolvedor", conseguimos ver uma árvore de habilidades acendendo (ficando verdes). Se a criança errar 3 vezes no "Amigos do 10", o algoritmo abaixa o peso e volta para "Somar Juntando" (C0101).
