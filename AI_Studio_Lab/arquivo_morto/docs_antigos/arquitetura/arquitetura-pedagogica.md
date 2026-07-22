# 🏛️ Arquitetura Pedagógica — a anatomia de TODO exercício do Matemágica

*O documento que responde: "como é cada exercício, como começa, qual a dinâmica, quais
habilidades, por que essa interação, onde tem animação". Se não está aqui, não está
arquitetado. Complementa: método (Learning Trajectories), catálogo, blueprint GraphoGame.*

---

## 1. O CICLO DE VIDA universal (os 5 momentos de todo exercício)

Todo exercício do app, de toda matéria, vive este ciclo — é o que o GraphoGame faz e
o que faltava nomear:

| # | Momento | O que acontece | Estado |
|---|---|---|---|
| 0 | **Introdução da trilha** (1ª vez na vida) | A Luna/mascote APRESENTA o conceito com animação + narração ("Juntando o B e o A..."). 15-30s, pulável. | 🔴 A CONSTRUIR (= "motor de animações"; áudio já roteirizado no Luna Studio) |
| 1 | **Demonstração** (1ª questão da missão) | `howto` falado + tutorial visual 💡 (mãozinha do Contar é o padrão-ouro) | 🟡 howto ✅ · tutorial 💡 só no Contar/relógio/dezenas |
| 2 | **Prática** (o trial, 3-8s) | Som primeiro → opções → reouvir à vontade (balão/frase/🔊 por opção) → escolhe → feedback | ✅ implementado |
| 3 | **Feedback** | Acerto: curto (mais curto em streak). Erro: `explain` ensina a ESTRATÉGIA. Sempre pulável. | ✅ implementado |
| 4 | **Fixação** | Revisão espaçada 🧠 (erros voltam, 2 acertos = dominado) + Domínio Absoluto 👑 | ✅ implementado |

**Regra:** trilha nova só nasce completa quando tem os 5 momentos definidos (o 0 pode
estrear como narração simples antes de ganhar animação).

## 2. Os TIPOS DE ATIVIDADE (kinds) — quando usar cada interação

| Kind | Interação | Quando usar | Usos hoje |
|---|---|---|---|
| `count` | ver e contar (tutorial mãozinha 👉) | quantidade concreta | Contar |
| `groups` | comparar dois grupos | mais/menos | Mais ou Menos |
| `shapes` | reconhecer forma/cor | percepção visual | Formas |
| `pattern` | continuar sequência | padrões AB/AAB, lógica | Padrões, Detetive |
| `plain` | pergunta + opções | genérico (número, símbolo, texto) | vários |
| `math` | expressão aritmética | contas escritas | Soma, Sub |
| `sum`/`subvis` | cena com emojis somando/saindo | aritmética concreta | Soma pré, Sub N1 |
| `story` | OUVIR → tocar (frase tocável 🔊) | tudo que entra pelo ouvido | Rimas, Ditado, Inglês, Sons, Ciências |
| `money`/`picto`/`clock`/`tens` | cenas específicas | dinheiro, gráfico, relógio, Material Dourado | Ano 1 |
| `bond`/`tenframe` | cenas vivas de Singapura | number bonds, subitização | Mat de Elite |
| `blend` | fusão animada de letras | sílabas (som → forma) | Fábrica de Sílabas |
| **PLANEJADOS** | | | |
| `flash` | mostra 2s → esconde | subitização real (Olhômetro 👀) | — |
| `order` | ORDENAR etapas (tocar em sequência) | ciclos: sementinha→árvore, ovo→galinha, rotina do dia | — |
| `orbit` | animação orbital dia/noite | Senhor do Tempo ⏰ | — |
| `grid` | grade 4×4 | sudoku do Detetive | — |
| `drag` | arrastar (mais difícil p/ 4 anos — usar com parcimônia) | formar palavras, montar cenas | — |

**Regra (Constituição 2):** interação nova só com 2+ usos previstos. Escolha da
interação segue a HABILIDADE: entrada auditiva → `story`; quantidade → cena concreta;
sequência/tempo → `order`/`orbit`.

## 3. A MATRIZ POR IDADE (o continuum — e as LACUNAS nomeadas pelo Zeus)

### Jardim (4 anos — Benjamin): o mundo ANTES dos símbolos
- **Pré-numérico:** contar 👉, mais/menos, formas, padrões, Moldura de 10, *(FALTA:
  ligar numeral↔quantidade — "o 3 e três patinhos"; Olhômetro flash)*
- **Consciência fonológica:** rimas, palminhas, sons mágicos (vogais/1ª letra) ✅
- **Espaço** *(FALTA — trilha "Onde Está? 🧭"):* dentro/fora, em cima/embaixo,
  perto/longe, cheio/vazio, na frente/atrás (kind story/plain com cenas)
- **Tempo vivido** *(FALTA — trilha "Meu Dia ☀️🌙"):* dia/noite, ontem/hoje/amanhã,
  antes/depois na rotina (acordar→escola→jantar→dormir — kind `order`)

### 1ª série (6 anos — Heitor): os símbolos ganham sistema
- **Fônica sistemática:** sons → sílabas → ditado ✅; *(FALTA: alfabeto COMPLETO letra
  a letra estilo GraphoGame — hoje só regulares; Manhas do Português: C/G, R, X,
  dígrafos — blueprint Fase 5)*
- **Aritmética:** sequência, soma, sub, comparação, dezenas, bonds ✅ *(pré-requisito
  reconhecer numerais VEM ANTES — ver grafo)*
- **Tempo estruturado** *(FALTA — expandir "Senhor do Tempo ⏰"):* dias da semana EM
  ORDEM (segunda→domingo, quantos dias tem), meses/estações, segundos→minutos→horas→
  dias→meses→anos (a escada do tempo), horas no relógio ✅ (já existe)
- **Medidas** *(FALTA):* maior/menor, pesado/leve, cheio/vazio com litros — fase 2

**REGRA DO GRAFO (a queixa "quer somar sem saber os números"):** os `prereqs` já
existem no contrato — a Fase C os ATIVARÁ na interface: trilha só destrava quando as
alicerces têm nível ≥2 (com Modo Gênio 🚀 pra pular provando domínio 👑).

## 4. REGRA ANTI-EXAUSTÃO (a crítica do "vivo, morto, vivo, morto")

**Cada nível de uma trilha muda pelo menos UM de:** (a) a habilidade, (b) a
interação, (c) o contexto. **Proibido:** 5 níveis da mesma pergunta com mais opções.

Exemplo — Vivo ou Não 🌱 re-arquitetado (aplicar):
N1 classificar óbvios → N2 pega-ratão (sol/rio/nuvem se movem mas não vivem) →
N3 "o que todo ser vivo precisa?" (comida/água/ar) → N4 ciclo de vida em CENA VIVA
(sementinha→broto→árvore→fruto, kind `order`) → N5 detetive do vivo (casos difíceis:
semente seca? fogo? robô?). Auditar TODAS as trilhas por esta régua.

## 5. CENAS VIVAS > emojis (a crítica da "sementinha feia" + "o teste do floquinho")

**O TESTE DO FLOQUINHO (regra do Zeus, vale para TODA atividade):** um emoji só serve
quando é RÓTULO inequívoco de um objeto (🍎=maçã). Para um CONCEITO, emoji não basta e
até atrapalha — a criança não "lê" frio num floco ❄️, nem "boa tarde" numa luz 💡. Todo
conceito precisa de uma CENA construída que a criança compreenda de olho:
- **Temperatura:** não ❄️ vs 🔥 soltos — uma cena: pessoa tremendo de casaco na neve ×
  pessoa suando ao sol; a criança VÊ o frio e o calor.
- **Partes do dia:** não 🌅/☀️/🌙 crus — o mesmo cenário (casa + céu) mudando: sol
  nascendo / sol a pino / lua e estrelas.
- **Ciclo/crescimento:** a sementinha que brota, cria raiz, vira árvore com fruto;
  o filhote que vira adulto — em CENA, não emoji.
- **Emoções:** um rostinho/personagem expressivo, não só 😊/😢.

Emoji é aceitável como PISTA (significado de palavra num banco); é pobre como CENA de
conceito. A Biblioteca de Cenas Vivas (NumberBond, TenFrame, SyllableScene) é o caminho:
cada conceito-chave ganha cena SVG por código (ou PNG quando for personagem), animável e
nítida. **Isto é frente própria (design de cena) e pré-requisito de qualidade das trilhas
novas de Ciências/Mundo/Meu Mundo — não construir essas com emoji cru.**
**Biblioteca de cenas (`src/components/scenes/`):** ✅ SyllableScene (fusão de sílaba) ·
✅ WeatherScene (clima frio/calor/chuva/sol — personagem reage) · ✅ GrowthScene (ciclo da
planta semente→broto→arvorezinha→árvore, com raiz). **Fila:** partes do dia · reta
numérica viva · balança de comparação · escada do tempo · órbita dia/noite · emoções.
**Método de trabalho (provado):** construir a cena → renderizar (SSR galeria + app real
via `scripts/e2e-screenshots.mjs`) → OLHAR o screenshot → refinar até ler de olho.

> ⚠️ **Português precisa de uma passada de design antes de expandir** (aviso do Zeus):
> os exercícios de leitura hoje dependem muito de emoji/opção crua e podem ter bugs de
> fala/tipo de pergunta ainda não testados no aparelho. Antes de crescer o português,
> auditar exercício por exercício (fala natural, cena compreensível, sem vazar resposta).

## 6. TECNOLOGIA DE ANIMAÇÃO (resposta à pergunta "é tudo SVG mesmo?")

Três camadas, cada uma com a ferramenta certa — **o SVG nunca foi o problema**:

1. **Personagens/mascotes = sprites PNG** (pipeline `chroma-sprites.py` pronto).
   Vida do tamagotchi = trocas de frame por código: idle (respira), dormir 💤,
   comemorar 🎉, dar oi 👋 — 2-4 poses por estágio na folha. NÃO precisa de app/motor
   separado: é um componente pequeno no próprio Matemágica (o que pode ficar externo
   é a GERAÇÃO das folhas — gx-pixel-heroes).
2. **Cenas pedagógicas = SVG por código** (leve, nítido em qualquer tela, controlável
   passo a passo — essencial pra tutorial). Fracassos passados foram (a) desenhar
   personagem completo à mão em SVG (PROIBIDO desde então) e (b) hack de fonema — não
   a tecnologia.
3. **UI/transições = motion** (já instalada) + CSS.

Vídeo/Lottie/3D: NÃO por ora (peso, complexidade, sem ganho pedagógico).

## 7. ÁUDIO EM 2 CAMADAS (o banco do Luna Studio)

- **Camada A — Narrações de ensino** (JÁ roteirizadas no db.json do Luna: 39 itens):
  introduções de trilha (momento 0), explicações de regra ("C com E e I..."). Tocam
  nas introduções e nos erros.
- **Camada B — Sons crus curtos** (FALTA roteirizar): "pa", "bola", números, feedbacks
  de 1 palavra. Tocam DENTRO do trial. Lista e plano de lotes:
  `docs/luna-roteiro-audios.md`.
- **Encaixe no app:** `public/audio/<id>.mp3` + fallback TTS do navegador (o app nunca
  quebra sem o banco). Conversão WAV→MP3 + corte de silêncio no meu lado.

## 8. ERROS RECORRENTES ESTUDADOS (por que aconteceu → regra que impede)

| Erro vivido | Causa raiz | Regra permanente |
|---|---|---|
| "N acento agudo no I", v-v-u | fonema isolado colado (coarticulação) | TTS só fala sílaba/palavra inteira; vogal pode isolada |
| Mascotes horrorosos em SVG | desenhar personagem à mão é artesanato fora do nosso alcance | personagem = PNG gerado fora; SVG só cenas/efeitos |
| Trabalho sobrescrito | 2 IAs na mesma branch | branch oficial só minha; gemini-lab só dele; eu integro |
| Arquivos-monstro (115KB) | crescimento sem disciplina | ≤15KB, dividir por despacho |
| Exercício que não ensina | trial sem anatomia | ciclo de vida §1 obrigatório |
| Trilha exaustiva/repetitiva | níveis = mesma pergunta+opções | régua anti-exaustão §4 |
| Emoji como cena | atalho visual | conceito-chave = cena viva §5 |
| Luna "quebrou pra sempre" | cota grátis da API (429 diário) | billing na chave + lotes pequenos |

## 9. DESIGN VISUAL DO APP (fase própria — não misturar)

A crítica é real (home carregada, tamagotchi pequeno, hierarquia amadora), mas design
de interface é uma FASE dedicada (pós-conteúdo), com auditoria tela a tela: hierarquia
(o que a criança vê primeiro), tamanhos de toque, respiro, paleta consistente,
tipografia. Entra na sala de situação como frente própria — não se resolve por
remendo enquanto o conteúdo muda embaixo.
