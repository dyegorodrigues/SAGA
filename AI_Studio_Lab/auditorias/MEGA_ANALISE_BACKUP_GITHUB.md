# 📚 MEGA ANÁLISE DO BACKUP (Matemágica-backup-ideias)
**Data da Análise:** Julho 2026
**Objetivo:** Comparar os arquivos do repositório de backup do GitHub com o estado atual, resgatar ideias, insights, bases pedagógicas, métodos e planejar a integração das micro-aulas.

## 1. O Que Foi Descoberto no Backup
O repositório `Matemágica-backup-ideias` não é apenas um backup de código, mas um **tesouro intelectual e metodológico**. Ele contém dezenas de documentos organizados nas pastas `/docs/didatica/`, `/docs/metodologia/` e `/docs/planejamento/`.

### 1.1 Metodologia e Bíblia do Matemágica
- **`biblia-do-matemagica.md` & `metodo-matemagica.md`**: Definem a visão central do projeto, a "Máquina de Criar Trilhas" e os 6 passos para gerar qualquer progressão do conhecimento. O método é incisivo em estruturar o aprendizado através de sequências perfeitas (ZDP).
- **Trilhas e Currículos (`catalogo-atividades.md` e `curriculo-mestre.md`)**: Contém a organização completa de módulos, trilhas e habilidades. Isso é exatamente a planta-baixa (Blueprint) que precisamos implementar para a progressão correta da criança.

### 1.2 Guias Pedagógicos Científicos
Existem arquivos detalhados (`adicao.md`, `subtracao.md`, `multiplicacao.md`, `divisao.md`, `fracoes.md`, `geometria.md`, `logica-e-padroes.md`, `medidas.md`) que descrevem como a criança absorve a matemática:
- **Do Concreto ao Abstrato**: O uso de manipulativos, o conceito de "counting on" (adicionar a partir do maior), superação do trauma de armar contas (divisão e empréstimo). Tudo validado pedagogicamente.

### 1.3 Design, Cenas e UI (`docs/design_e_ui/`)
- **`mapa-de-cenas-svg.md` e `roteiro-cinematografico.md`**: Define a experiência cena a cena (Roteiro) e como os assets SVG devem ser plugados (Brief de Arte).

### 1.4 Áudio, Fonética e Luna Studio (`docs/audio_e_fonetica/`)
- Documentação e propostas de integração de áudio (substituindo o TTS cru por áudio renderizado) para a criação das explicações e micro-aulas (Luna Studio).

## 2. O Que Falta no Nosso Repositório Atual (O Gap)
O código no nosso `src/` contém a base do GameLoop e alguns exercícios, mas **falta a implementação fiel da profundidade pedagógica descrita nestes documentos.**

1. **A Implementação do Currículo-Mestre**: Atualmente, temos geradores simples (`generators.ts`), mas a taxonomia completa (Matéria -> Módulo -> Trilha -> Habilidade) e os pré-requisitos lógicos ainda não estão estruturados de acordo com o `curriculo-mestre.md`.
2. **A "Escada do Conhecimento" Completa**: Embora tenhamos criado a base hoje (Singapore Bars, Rapid-Fire), ainda precisamos alinhar cada `lvl` de cada gerador com a metodologia exata descrita nos documentos `didatica/`.
3. **Mecânicas de Micro-Aula (I Do, We Do, You Do)**: A documentação prescreve um tutorial robusto guiado por áudio/animação onde o Mascote demonstra a mecânica antes da criança interagir. O `AudioPlayer.tsx` precisa comandar o `GameLoop` para travar interações enquanto ensina.
4. **Variedade de Kinds (Tipos de Exercício)**: As didáticas de frações, divisão e geometria precisarão de novos componentes SVG interativos (Kinds), não apenas caixas de seleção.
5. **Integração de Skills (Agentes Evolutivos)**: O backup menciona diretórios `/docs/skills/nova-materia/SKILL.md`. No AI Studio, precisamos converter isso para os nossos prompts internos e diretrizes de agentes (`AGENTS.md`).

## 3. Plano de Ação Estrutural
Para não perdermos a riqueza desta pesquisa, as seguintes ações foram/serão tomadas:

- **[FEITO]** Construída a fundação de Kinds modernos modulares (`ExerciseRenderer.tsx`, `RapidFire.tsx`, `SingaporeBars.tsx`).
- **[FEITO]** Evoluído o `progressEngine.ts` para contabilizar ELO/ZDP baseado em latência (velocidade de resposta = subitização vs contar nos dedos), como instruído na pedagogia.
- **[A FAZER]** Converter os documentos de Didática em lógicas concretas dentro do `generators.ts`. Cada trilha será auditada pelo "Neuro-Pedagogo" (nosso Agente) para seguir a Bíblia.
- **[A FAZER]** Finalizar o pipeline do Luna Studio no `AudioPlayer.tsx` e conectá-lo aos tutoriais guiados.
- **[A FAZER]** Organizar o mapa de telas de acordo com o Roteiro Cinematográfico.

## Conclusão
O backup do GitHub salva milhares de horas de pesquisa didática. Ao invés de tentarmos adivinhar como ensinar frações para uma criança de 6 anos, nós vamos seguir os guias científicos ali descritos. A arquitetura de software agora (React + Vite + Modulares) está perfeitamente limpa e pronta para receber toda essa injeção de conhecimento sem virar um código macarrônico.
