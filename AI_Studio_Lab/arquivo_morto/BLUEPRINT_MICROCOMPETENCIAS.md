# 🧠 BLUEPRINT ESTRUTURAL: Das Microcompetências ao Código (Geração de Exercícios)

**Status:** Documento de Pesquisa Profunda e Ancoragem Arquitetural.
**Objetivo:** Eliminar qualquer lacuna entre a teoria pedagógica (Manual Mestre) e o que será efetivamente codificado nos exercícios, interações, animações e áudios do aplicativo. Nenhuma trilha será codificada sem seguir este Blueprint.

---

## 1. O FIM DO TTS ROBÓTICO (A Solução de Áudio)
**O Problema:** O TTS nativo do navegador é robótico, frio e destrói a imersão infantil (especialmente no método fônico do GraphoGame).
**A Solução Definitiva:** O aplicativo utilizará exclusivamente o pipeline do **Luna Studio** (áudios de alta qualidade, quentes, humanos). 
- Para letras e fonemas: Áudios pré-gerados e cacheados, ou integração via API de voz neural real. 
- Nunca usaremos o "hack" do navegador para ensinar sons. O componente `Mascot.tsx` apenas orquestrará a reprodução dos áudios premium.

---

## 2. ARQUITETURA DO EXERCÍCIO (O Ciclo de Vida Perfeito)
Cada exercício, independentemente do nível, seguirá um pipeline imutável para não "bugar":

1. **Entrada Visual (Render-Strategy):** O componente não carrega tudo de uma vez. Primeiro, a cena é montada (SVG).
2. **Micro-Tutorial (Se necessário):** 
   - *Se erro anterior ou primeiro acesso:* Animação de um cursor fantasma (I Do) + Áudio explicativo curto (< 5 segs).
3. **Interação da Criança (Touch Targets Gigantes):**
   - Haptic Feedback (vibração suave) + Efeito Sonoro imediato (Plop/Click).
   - Bloqueio de múltiplos cliques rápidos para evitar double-fire.
4. **Resolução e Feedback (Frustration Engine):**
   - *Acerto:* Confete direcional + Som harmônico + Multiplicador de ELO.
   - *Erro:* O objeto volta suavemente (Física de mola). O áudio entra: *"Tente de novo, conte devagar!"*. **Nunca um "X" vermelho gritante.**

---

## 3. MAPEAMENTO: DO "ZERO ABSOLUTO" AO "DOJO" (As Trilhas de Código)

Para que o gerador de exercícios (`src/utils/generators.ts`) não tenha "furos", ele deve gerar objetos de questão (`QuestionData`) perfeitamente alinhados a Kinds (tipos de renderização).

### Nível 0: Zero Absoluto (Alfabetização Numérica)
- **Habilidade (Grafo C000A/B):** Canto Numérico e Reconhecimento.
- **Kind UI (Componente):** `listen-touch` (Ouvir e Tocar).
- **Como funciona na tela:** O mascote canta "Um, Dois, Três" com voz real. Os números na tela brilham em sincronia (Karaokê). A criança deve estourar a bolha com o número ditado.
- **Prevenção de Bug:** O toque só é registrado se o áudio correspondente já terminou, para não atropelar a voz.

### Nível 1: Fundamentos (A Base CRA - Concreta)
- **Habilidade (Grafo C0001/2):** Subitização e Correspondência Um a Um.
- **Kind UI (Componente):** `count-drag` ou `subitize-flash`.
- **Como funciona na tela:** 3 maçãs. A criança toca uma por uma. Cada maçã emite um som ascendente (Dó, Ré, Mi) ao ser tocada, sumindo ou indo para um cesto.
- **A Pedagogia:** Se a criança errar, o cesto esvazia suavemente e o mascote diz: *"Vamos contar juntos? Um..."* (We Do).

### Nível 2: Adição Viva (Método de Singapura em SVG)
- **Habilidade (Grafo C0101/4):** Somar juntando, Modelagem de Barras.
- **Kind UI (Componente):** `singapore-bars` (Barras de Singapura interativas).
- **Como funciona na tela:** Em vez de ver "3 + 2", a criança vê um bloco tamanho 3 azul e um bloco tamanho 2 amarelo. Ela *arrasta* um bloco para perto do outro. Quando eles colidem, fazem "snap" magnético e se fundem num bloco de tamanho 5. SÓ ENTÃO a equação `3 + 2 = 5` aparece brilhando embaixo.
- **O Insight Recuperado:** Isso garante abstração profunda. A criança entende grandeza antes do símbolo.

### Nível 3: Lógica e Padrões (O Hacker Lógico)
- **Habilidade:** Rotação espacial, identificação de intrusos.
- **Kind UI (Componente):** `pattern-matrix`.
- **Como funciona na tela:** Sequência de formas (Triângulo, Quadrado, Triângulo, ?). A criança deve arrastar a forma correta. Erros geram dica visual (destaque na forma anterior).

### Nível 4: A Forja Mental (O Dojo de Velocidade estilo Kumon)
- **Habilidade (Grafo C0105/6):** Reflexo Matemático (Subitização avançada).
- **Kind UI (Componente):** `rapid-fire` (Tiro Rápido).
- **Como funciona na tela:** Sem tutoriais, sem vozes longas, sem mascote atrapalhando. Apenas uma tela focada, estilo arcade. Conta na tela (`5 + 4`), 3 botões gigantes. 
- **Mecânica de ELO Sensível ao Tempo:** O código mede a **latência** do clique. Acerto < 2s = +15XP (Genialidade). Acerto > 10s = +2XP (Ainda contando nos dedos).

---

## 4. MATRIZ DE REVISÃO E AVALIAÇÃO (Algoritmo CUE)
Nós não teremos "Testes e Provas" chatos. Teremos o **Algoritmo de Treino Intercalado**.

- **Diagnóstico (Teste de Nivelamento Oculto):** Quando a criança cria a conta, a primeira sessão mistura Nível 0, 1 e 2. O tempo de resposta dirá onde ela está.
- **Spaced Repetition (Repetição Espaçada):** Se ela dominou a soma hoje, o algoritmo (`progressEngine.ts`) guardará o timestamp. Daqui a 4 dias, ele injetará disfarçadamente 2 questões de soma no meio da trilha de lógica, para garantir que ela não esqueceu.

## 5. RESUMO DE GARANTIA (Checklist Anti-Gargalo)
- [x] O áudio será humano, nativo ou via API premium (Luna Studio), descartando o TTS falho do navegador.
- [x] Os exercícios seguirão estritamente a escada: Concreto (tocar objetos) -> Representacional (barras SVG) -> Abstrato (equações) -> Dojo (velocidade).
- [x] O tempo de resposta dita a dificuldade, não apenas os erros.
- [x] As animações SVG serão leves, baseadas em CSS/Framer Motion, para não estourar a memória.
