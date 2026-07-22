# 📖 A BÍBLIA DO SAGA
**Versão 1.0 · Julho 2026 · Fonte única de verdade do projeto**

> **Cláusula de supremacia.** Este documento + `GRAFO_DE_CONHECIMENTO_SAGA.md` + `MANUAL_DIDATICO_SAGA.md` + `DOJO_SAGA.md` + `grafo_saga.yaml` substituem TODOS os anteriores: `BIBLE_PEDAGOGICA_UNIFICADA.md`, `MAB_CONSTITUICAO_MESTRE.md`, `MANUAL_PEDAGOGICO_MESTRE.md`, `biblia-do-matemagica.md`, `curriculo-mestre.md`, `mapa-mestre.md`, `grafo_competencias.md`, `catalogo-atividades.md`, os 8 docs de didática soltos (`adicao.md`, `subtracao.md`, `multiplicacao.md`, `divisao.md`, `fracoes.md`, `geometria.md`, `medidas.md`, `logica-e-padroes.md` — absorvidos e costurados ao Grafo pelo Manual) e variantes espalhadas em `AI_Studio_Lab/`. Os antigos viram **arquivo histórico** (mover para `AI_Studio_Lab/arquivo_morto/`), nunca mais fonte. Nenhuma IA cria documento paralelo: se falta algo, **edita-se AQUI**.

---

## §1. IDENTIDADE E ESCOPO

**SAGA** (ex-Matemágica) é uma plataforma educacional adaptativa, áudio-first, para crianças de **4 a 12 anos**, construída por uma pessoa com IAs (Google AI Studio + modelos Anthropic). Matemática é o primeiro cartucho completo; Português, Inglês, Ciências e Mundo já existem como cartuchos e herdam esta arquitetura.

**A frase que define o projeto:** *o SAGA não é um catálogo de aulas; é uma máquina que lê competência, escolhe experiência, gera intervenção e registra domínio.*

**O que o SAGA NÃO é:** não é linear (não existe "trilha da adição" gigante); não é punitivo (errar é dado, não crime); não é um app de leitura disfarçado (criança de 4 anos usa 100% por som e imagem); não é dependente de IA em tempo de aula (geração é determinística e offline; IA entra na *autoria*, não na *execução* — doutrina já vigente no composer).

---

## §2. OS 10 PRINCÍPIOS (a Constituição pedagógica)

1. **Competência pequena, sessão que fecha.** Cada sessão trabalha UMA decisão cognitiva e termina com progresso visível. É a cura estrutural do "um século na adição".
2. **CRA sempre** (Concreto → Representacional → Abstrato), adaptado ao digital: concreto = manipulável interativo com som; representacional = imagem estruturada (moldura, barra, reta); abstrato = símbolos. Nunca pular etapas para "adiantar".
3. **O grafo manda.** Nada é ensinado sem pré-requisitos em pé; nada fica travado se houver outra strand aberta. Idade sugere, proficiência decide.
4. **Compreensão antes de fluência.** O Dojo só automatiza o que já foi entendido (Grafo, Apêndice A).
5. **Errar ensina — e o fluxo é sagrado.** O erro numa questão recebe toque leve e a criança segue (auto-correção → uma dica → mostra e avança, nunca trava); a remediação profunda (demonstração, fazer junto, microtutoria) é disparada por PADRÃO de erro, não por tropeço isolado, e entregue no momento certo — pausa, fim de sessão ou resgate (§8, §11.4). Sem punição, sem sons agressivos, mascote jamais castiga.
6. **Áudio-first.** Toda instrução, opção e feedback existe em voz. Texto acompanha (alfabetização incidental), nunca bloqueia (§10).
7. **Uma tela, uma pergunta, uma ação.** Carga cognitiva mínima: sem placar poluído, sem duas tarefas simultâneas (regra anti-slop, mantida).
8. **Contrato imutável do gerador:** `gen(nível 1-5) → { kind, prompt, ..., options[], answer }`, resposta presente exatamente uma vez, valores dentro das restrições do micro (Grafo). Herdada da Constituição antiga — permanece inviolável.
9. **Determinismo na aula, IA na autoria.** A lição roda offline e barata; a IA preenche contratos (§12), não inventa trilhas.
10. **Um prompt = uma mudança; teste nasce junto; ritual de fechamento** (build ✅ → test ✅ → commit → atualizar estado). Herdado do CLAUDE.md — permanece.

---

## §3. ARQUITETURA: OS 4 MOTORES + A CAMADA NARRATIVA

```
GRAFO DE COMPETÊNCIAS  →  MOTOR PEDAGÓGICO  →  MOTOR DE GERAÇÃO  →  MOTOR ADAPTATIVO
(o que existe e em      (como se ensina:      (fabrica questões,   (lê telemetria, escolhe
 que ordem — o YAML)     CRA, tutoria,         tutoriais e sessões   o próximo passo, agenda
                         feedback, dose)       dentro dos contratos) revisão, destrava nós)
```

**Camada narrativa (a "SAGA"):** por cima dos motores, o mundo do jogo. Mapeamento fixo: **Mundo = strand** (N1, N3, GE… cada um com bioma e cor próprios) · **Ilha = competência** · **Missão = sessão** · **Chefão = checkpoint de domínio (nível 5 + coroa 👑)**. O mapa mostra vários mundos abertos ao mesmo tempo — a criança VÊ que nunca está presa. Mascote, economia dupla (⭐ XP / 🪙 moedas), álbum e evolução permanecem como estão (funcionam e estão documentados no código).

---

## §4. HIERARQUIA E NOMENCLATURA

`Domínio → Strand → Competência → Microcompetência → Experiência → Sessão`

- **IDs novos:** `STRAND.NN` e `STRAND.NNx` para micros (`N3.07b`). Esquema completo, tabela de migração dos IDs velhos e as 84 competências: `GRAFO_DE_CONHECIMENTO_SAGA.md`. **IDs antigos (C0001, C_LOG2…) ficam proibidos em código novo** — só aparecem na tabela de migração.
- **Experiência** = um tipo de encontro com a competência: `tutor` (microtutoria), `guiada`, `autonoma`, `dojo`, `revisao`, `historia`, `chefao`. A mesma competência gera experiências diferentes conforme o nível.
- **Track (código)** passa a ser: *a materialização de UMA competência* — nunca mais um saco de 3 competências espremidas em 5 níveis (o defeito do "Contar" atual, corrigido na migração).

---

## §5. A ESCADA DE PROFICIÊNCIA (5 níveis por competência)

Unifica o CRA com o que o `progressEngine` já faz:

| Nível | Nome | Natureza | Quem faz |
|---|---|---|---|
| 1 | Tutoria | Concreto guiado — **Mão Fantasma** (I DO): o app resolve na frente da criança, narrando | O app |
| 2 | Concreto | Manipulável com apoio (WE DO): dicas ativas, dedo-guia disponível | Juntos |
| 3 | Pictórico | Representações estruturadas (moldura, barra, reta), apoio só ao errar | A criança |
| 4 | Abstrato | Símbolos; sem apoio visual por padrão (YOU DO) | A criança |
| 5 | Fluência | Dojo: velocidade sobre precisão já consolidada | A criança, veloz |

**Regras de movimento (mantidas do código, agora canônicas):**
- Sobe: 3 acertos seguidos (streak) — com bônus de velocidade (rt < 3s conta +1 no streak).
- Desce: 2 erros seguidos (nunca no aquecimento). Piso: nível 1.
- `maxLvl` (bolinhas) só sobe com **acerto no nível** — conquista nunca regride.
- **Domínio 👑 (`dom`)**: 3 acertos seguidos no nível 5 **e** `helpClicks = 0` no nível **e** rt dentro da meta da trilha de fluência. (A regra completa da Bíblia antiga, agora obrigatória no código — hoje só o streak é checado.)
- **Desbloqueio de nó do grafo:** todos os pré-reqs com `maxLvl ≥ 3` ou `dom` (igual ao `dominated()` do composer atual — uma regra só, em um lugar só: o futuro `unlock_engine`).

**O andaime desaparece conforme a criança sobe (regra do fading — evita a aula chata para quem já sabe).** A quantidade de ensino é função inversa da proficiência, e isso está embutido nos próprios níveis: no nível 1-2 há Mão Fantasma e apoio ativo (a criança está aprendendo); no nível 3 o apoio só aparece ao errar; no nível 4 é execução limpa sem apoio; no nível 5 é prática fluida e veloz, sem ensino nenhum — só revisão espaçada de vez em quando para não enferrujar. **Consequência operacional:** microtutoria e demonstração só disparam em conceito NOVO (nível 1) ou por PADRÃO de erro (§8, §11.4) — nunca como enfeite recorrente para quem já domina. Quem está fluente faz exercício atrás de exercício, com celebração curta, e o Tutor "some". Aula demais para expert atrapalha (efeito de reversão da expertise); o SAGA respeita isso.

---

## §6. ANATOMIA DA SESSÃO

A receita do composer atual ("▶️ Minha Aula") é canonizada como estrutura oficial, com dose por idade:

| Bloco | O quê | F0 (4-5) | F1-F2 | F3-F4 |
|---|---|---|---|---|
| 🔥 Aquecimento | trilha forte, um nível abaixo; erro não pune | 1 | 2 | 2 |
| 🧠 Resgate | banco de erros + trilha "fria" (mais dias sem prática) | 1 | 2 | 2 |
| ⚔️ Fronteira | A competência-alvo (pré-reqs ok, menor precisão) — **aqui se aprende** | 3 | 4 | 4-5 |
| ⚡ Fluência | Dojo diário (fatos da FD ativa) | 1 | 1 | 1-2 |
| 🎉 Fecho | lógica/padrões — sair sorrindo | 1 | 1 | 1 |
| **Total** | | **7 (~5-8 min)** | **10 (~10-12 min)** | **11-12 (~15 min)** |

- Ordem fixa com arco emocional (fácil → forja → fecho). Nunca embaralhar.
- **Se a Fronteira é uma competência em nível 1:** a sessão ABRE com a microtutoria (§7) antes do aquecimento — nunca jogar a criança num conceito virgem sem o I DO.
- Sessão de F0 nunca mistura mais de 2 competências além do fecho.

**A aula é feita de PRÁTICA, não de palestra.** Dos blocos acima, só a Fronteira é "aprender"; o resto é a criança FAZENDO. E mesmo na Fronteira, a explicação aparece na dose certa: microtutoria completa só quando a competência é virgem (nível 1); nos níveis seguintes, a criança resolve e a ajuda entra pontual (Camada 1, §8) — o Tutor vai sumindo conforme ela sobe (fading, §5). O padrão é fluxo de exercícios; o ensino é a exceção oportuna.

**Entender a matéria ≠ entender o exercício** — e o Tutor cobre os dois com ajudas diferentes. O conceito (o que é dividir) é ensinado na Primeira Explicação e nas microtutorias. Mas dá para entender o conceito e travar no EXERCÍCIO (como ler aquele enunciado, qual estratégia usar, o "bizu" daquele tipo). Para isso existem as micro-interações de estratégia: o campo `howto` (COMO pensar, falado na 1ª questão do tipo) e a dica da 2ª tentativa (§8), que ensinam a ATACAR a questão sem re-explicar a teoria. Confusão de conceito → remediação conceitual (§11.4); confusão de "como faço isto" → dica de estratégia. São gatilhos distintos.

---

## §7. MICROTUTORIAIS (o momento de ensino)

Três camadas, todas offline:

1. **Mão Fantasma (I DO)** — obrigatória no nível 1 de toda competência: uma mão translúcida faz o exercício inteiro, narrado, com a tela travada. *(Status: conceito aprovado, componente `<GhostHand/>` ainda não construído — prioridade da migração, §13.)*
2. **TutSteps (aula narrada)** — o sistema de `tutorials.ts` (passos `say` + `show`), generalizado: **todo kind declara seus passos**. Padrão de roteiro (30–90s): *gancho* (1 frase que liga ao mundo da criança) → *demonstração* (worked example completo, narrado, com a cena mudando junto da voz — o padrão Meu Dia/Ciclo da Planta) → *"sua vez"* (1 item guiado).
3. **Exemplos com lacuna (faded examples)** — no nível 2-3, o app resolve 80% e a criança fecha o último passo; a lacuna cresce até o nível 4. É a ponte científica entre ver e fazer.

**Regra da dose:** microtutoria completa só na estreia da competência e na remediação (§8). Reprises: versão de 15s. Criança que já sabe odeia ser reensinada.

---

## §8. FEEDBACK E ERRO (duas camadas — o fluxo é sagrado)

**Princípio-mãe:** errar é parte de aprender; a criança tem de continuar SE MOVENDO. A resposta ao erro NUNCA para a sessão para dar aula a cada tropeço. Duas camadas separadas, que não se misturam: uma leve dentro da questão, outra profunda disparada por PADRÃO. Campos `howto` (COMO, falado na 1ª questão) e `explain` (PORQUÊ) permanecem obrigatórios em todo gerador.

### 8.1 Camada 1 — resposta imediata (leve, preserva o fluxo)
No máximo dois toques antes de seguir; a criança fica no comando o tempo todo:
1. **1ª tentativa errada** → auto-correção: feedback gentil que convida a tentar de novo ("olha de novo!") + esconder 1 opção absurda. Sem aula — a maioria dos erros é deslize e a criança conserta sozinha.
2. **2ª tentativa errada** → UMA dica estratégica falada (`explain` aponta o caminho, nunca a resposta).
3. **Ainda errou** → mostra a resposta com uma frase de porquê, marca o item/fato como frágil e **AVANÇA na hora**. Nada de demonstração longa no meio do fluxo. Nunca trava.

*Deslize vs. dificuldade (o motor decide o peso do toque):* erro rápido (`rt` baixo) num distrator qualquer = provável deslize → toque mínimo. Erro lento OU num distrator com tag de misconception = dificuldade real → a dica do passo 2 já é a específica daquela confusão.

### 8.2 Camada 2 — remediação profunda (por PADRÃO, no momento certo)
A demonstração narrada, a Mão Fantasma (fazer junto) e o microtutorial vivem AQUI — e **não disparam na questão isolada**. Disparam quando o Radar de Lacunas (§11.4) detecta padrão, e são entregues no momento que respeita o fluxo: **numa pausa natural, no fim da sessão, ou como Missão de Resgate na sessão seguinte** — jamais engasgando a criança no meio de uma questão. É o "depois de alguns exercícios, verificar os erros e aí trabalhar pontualmente".
- Conteúdos (o QUÊ; o QUANDO é sempre §11.4): **dica** aponta a estratégia · **demonstração** = o app resolve um gêmeo narrando (mini Mão Fantasma), a criança assiste · **fazer junto** = a criança executa com o tutor sustentando.

### 8.3 Distratores são o sensor
Cada opção errada deve ser um erro típico do Grafo, etiquetado com sua tag de misconception (ex.: 42−38 oferece 16, tag `inverte-coluna`; 1/4+2/4 oferece 3/8, tag `soma-em-cima-e-embaixo`). Distrator aleatório é desperdício de diagnóstico — o distrator escolhido REVELA o que a criança pensou e é o que alimenta o Radar (§11.4) que dispara a Camada 2.

**Exceção — modo ensino:** na 1ª vez de um conceito e dentro de um microtutorial, o andaime Eu-faço → Fazemos-juntos → Você-faço é o esperado (a criança está aprendendo, não sendo avaliada). Andaime em aula ≠ punição por erro.

**Regras de tom (mantidas):** acerto = elogio curto ("Isso!"), mais curto em streak; elogia esforço/estratégia, não "gênio"; transição rápida (250ms); erro nunca tem som agressivo; energia/mascote jamais punem.

---

## §9. CATÁLOGO DE KINDS (renderizadores de exercício)

Kind = o "molde de interação". Regra viva: **kind novo só com 2+ usos previstos** (Constituição). Todo kind declara: mecânica, competências que serve, comportamento de áudio, tutorial (TutSteps) e acessibilidade de não-leitor.

### 9.1 Existentes no código (validados — manter e especificar)
| Kind | Mecânica | Serve principalmente |
|---|---|---|
| `plain` | pergunta + 3-4 opções tocáveis (texto/emoji/numeral) | universal (o coringa) |
| `math` | expressão simbólica + opções | N2-N7 abstrato |
| `count` | tocar objetos 1 a 1 com trava e dedo-guia 👉 | N1.01, N1.04 (padrão-ouro) |
| `sum` / `subvis` | juntar grupos / esconder objetos, animado | N3.01-04 concreto |
| `groups` | grupos iguais em cena | N4.01, N1.05 |
| `tenframe` | moldura de 10 interativa | N1.08, N1.11, N3.07-08 |
| `bond` | círculo parte-todo (number bond) | N1.10-11, N3.05 |
| `flash` | quantidade pisca ~2s e some | N1.03 |
| `pattern` | sequência para continuar/corrigir | AL.02, AL.04, AL.07c |
| `shapes` | formas para reconhecer/classificar | GE.02-03, GE.07 |
| `order` | ordenar cartas/sequências | N1.07, N2.02, AL.03-04 |
| `conserv` | espalhamento animado (conservação) | N1.05c |
| `tens` | material dourado (barras/cubinhos) | N2.01, N2.04, N3.11-12a |
| `money` / `clock` | moedas-cédulas / relógio | GM.03-04, GM.06, N6.02b |
| `picto` | pictogramas/tabelas/barras | PE.01-02 |
| `story` | probleminha 100% narrado com cena | N3.10, N4.05, F3-F4 contexto |
| `scene`/`journey`/`daypart`… | cenas vivas narradas | GM.02, GE.01, tutoriais |
| `rapid-fire` | dojo cronometrado | todas as FD |
| `singapore-bars` | barras de Singapura | N3.10, N5, N6.04 |

### 9.2 Novos necessários (o backlog oficial, por prioridade)
**P1 — destravam F1-F2 (construir primeiro):**
- `numberline` — reta interativa com saltos animados. Serve 10+ competências (N1.12, N3.03-08, N6.01, N7.01-02…). **É o buraco mais grave do motor atual.**
- `vertical` — conta armada interativa, dígito a dígito, com reagrupamento animado e vírgula (N3.11-12, N4.08-10, N4.12, N6.02).

**P2 — destravam o mundo multiplicativo e frações:**
- `array` (arranjo retangular giratório; N4.02-08, GM.08) · `drag-group` (arrastar para repartir/classificar; N4.05, AL.01d) · `frac-shade` (partir/pintar frações; N5.*, N6.01, N6.03) · `balance` (balança da igualdade; AL.05, AL.08, GM.01c) · `part-whole`/`fact-family` (variações do bond) · `build-number` (compor números com placas/barras/vírgula) · `trace` (traçado do numeral com guia) · `drag-match` (parear).

**P3 — F3-F4 e medidas:**
- `grid` (malha/plano cartesiano) · `measure` (régua arrastável) · `clock-set` (arrastar ponteiros) · `hundred-chart` · `bar-build` · `angle` (transferidor) · `area-model` · `ratio-table` · `chip-model` (fichas ±) · `geo-transform` · `blocks-3d` · `symmetry` · `input` (**teclado numérico para resposta aberta** — a partir de F2 nem tudo pode ser múltipla escolha; distratores viram análise do valor digitado).

---

## §10. ÁUDIO-FIRST E UX DO NÃO-LEITOR (regras duras)

1. **Todo enunciado se auto-narra** ao carregar; o balão 🔊 sempre reproduz (com o `lang` correto — bug já corrigido, regra registrada).
2. **Toda opção é audível quando o conteúdo é simbólico/verbal** (`audibleOptions` + `Option.say`): a criança escolhe pelo SOM antes de ler. Emojis/imagens autoevidentes dispensam.
3. **`sayTarget`:** o alvo sonoro é falado e NUNCA escrito quando escrever entregaria a resposta (herdado do Português — vale para "toque no cinco").
4. **Botões de navegação falam.** Home, mapa, álbum: primeiro toque em ícone desconhecido = fala o nome; toque no rótulo = repete. Nenhuma tela do fluxo da criança exige leitura para navegar — **auditar a home atual com esse critério (pendência, §13)**.
5. **Toque corta a voz** e avança (fluidez — regra conquistada na 7ª rodada, inviolável).
6. **Misclick-lock** durante transições e primeiros 300ms de áudio (mantida).
7. **Touch targets ≥ 80px**, uma ação por tela, contraste alto (mantidas).
8. **Instruções ≤ 12 palavras** por frase falada em F0-F1; frases curtas, ritmo de conversa, zero jargão ("vamos JUNTAR" antes de "somar" — o símbolo chega com a voz apresentando).
9. **Voz:** TTS pt-BR como fallback permanente; banco neural (pipeline Luna: MP3 pré-gerados em `public/audio/` + fallback TTS) é a rota oficial. O hack de fonemas TTS segue **proibido** (causa raiz de bug já diagnosticada).
10. **Texto sempre presente, nunca exigido:** o rótulo escrito acompanha a fala (alfabetização incidental) — exceto quando viola a regra 3.

---

## §11. O MOTOR ADAPTATIVO

### 11.1 O que ele lê (telemetria — campos já existentes)
`lvl, maxLvl, dom, streak, bad, ok/tot, rt` (média móvel 70/30), `helpClicks`, `skips`, `lastDay`, banco de erros (`bank`). Novo campo por implementar: `errKind` (qual distrator-tipo a criança escolhe — alimenta §8.3).

### 11.2 O que ele decide
1. **Desbloqueio** (unlock_engine): regra única do §5. O mapa pinta ilhas: 🔒 travada · 🌱 aberta · 🔥 fronteira ativa · 👑 dominada.
2. **Seleção da fronteira** (composer, mantido): entre abertas e não dominadas, a de pior precisão; se tudo dominado, a próxima virgem do grafo.
3. **Revisão espaçada** (review_planner): intervalos **2 → 4 → 7 → 12 → 21 → 45 dias** por competência dominada (já especificados no código — agora executados de verdade). Falhou na revisão? Recolocar na fila de resgate e, se falhar 2×, reabrir como fronteira (decair `dom` visualmente é proibido — a coroa fica, o treino volta).
4. **Dojo:** pilar autônomo (a criança entra direto e treina à vontade) que também cede 1 bloco diário à aula; treina DUAS famílias de fluência — fatos (FD) e procedimentos armados multi-dígito (PD) — mais o Jardim do Dojo pré-simbólico. Spec completa em `DOJO_SAGA.md`.
5. **Anti-travamento (a resposta ao teu medo):**
   - Sempre ≥ 3 strands com ilha aberta. Se o grafo afunilar, abrir a próxima raiz de outra strand.
   - Frustração detectada (2 sessões seguidas com precisão < 50% na mesma fronteira, ou `skips` ≥ 2) → trocar a fronteira de strand na próxima sessão + injetar microtutoria do pré-req mais frágil (menor `maxLvl` entre os pré-reqs).
   - **Nunca** exigir nível 5 para destravar o próximo nó (3 basta) — fluência amadurece em paralelo no Dojo, não segura a fila.
6. **Modo Gênio (existente como ideia):** o seletor de nível 🎯 permite pular com honestidade (bolinha só pinta com acerto — regra mantida). Para o pai destravar faixas acima da idade: liberar por strand, nunca global.

### 11.3 A Bússola de Posicionamento (onde a criança COMEÇA)
O problema real: um filho de 6-7 anos entra no app — por qual competência começar? Perguntar a idade e chutar a faixa erra pros dois lados (quem tem lacunas afoga; quem está adiantado boceja). A resposta: **a idade dá o palpite inicial; a evidência decide.**

- **Formato:** a primeira sessão é a "Expedição do Mapa" — 10-15 min disfarçados de jogo de exploração, sem cara de prova. 2-3 itens por strand principal (N1/N3 primeiro, depois AL, GE, GM), começando no ponto que a idade sugere.
- **Movimento tipo busca binária:** acertou com folga → pula 2-3 competências à frente na strand; errou → recua até achar chão firme. Cada strand fecha quando encontra a **fronteira** (acerta aqui, hesita ali).
- **Regras duras:** nenhum feedback de erro na expedição (toda resposta ganha "hmm, interessante!" do explorador); sinais de frustração (Manual §Criança Real) encerram a strand na hora e assumem a fronteira conservadora; pode pausar e continuar amanhã; o resultado NUNCA é mostrado como nota — vira o mapa inicial (ilhas já 👑 pelo que demonstrou, 🔥 na fronteira).
- **Competências puladas na expedição ficam `presumido_dom`** (coroa cinza): valem como pré-requisito, MAS a primeira vez que aparecerem em revisão/resgate são testadas de verdade — se falharem, viram fronteira sem drama. Confiança com verificação.
- **Reposicionamento contínuo:** a Bússola nunca "termina". Cada entrada em strand nova dispara uma mini-expedição (3-4 itens). Errar é dado, nunca dano.

### 11.4 O Radar de Lacunas (como detecta ONDE está falhando — e resgata)
O motor não pergunta "quantos erros?"; pergunta **"qual é o PADRÃO do erro?"**. **Este radar é o gatilho da Camada 2 do §8** — a remediação profunda (demonstração, Mão Fantasma, microtutorial) só acontece quando um destes sensores acende, e é entregue numa pausa/fim de sessão/resgate, nunca no meio de uma questão. Erro solto na questão é tratado pela Camada 1 leve; é o PADRÃO que este radar captura que merece trabalho focado. Quatro sensores, em ordem de precisão:

1. **Tag de misconception no distrator (o sensor de ouro).** Todo distrator gerado carrega a tag do erro que representa (o Grafo define os "Erros" de cada competência; o gerador etiqueta: `off-by-one`, `soma-em-cima-e-embaixo`, `inverte-coluna`, `pensamento-aditivo`…). **2× a mesma tag em 5 questões = misconception ATIVA** → dispara o microtutorial específico daquela confusão (não o genérico da competência). É a diferença entre "errou divisão" e "está somando denominadores".
2. **Erro na competência ≠ lacuna na competência.** 2 erros no mesmo micro → o motor testa a HIPÓTESE pré-requisito: injeta 1-2 questões-sonda do pré-req mais frágil (menor maxLvl) **dentro da própria aula** (os slots de resgate do composer, §6 — já existem, agora com este gatilho). Sonda falhou → a lacuna é lá atrás: nasce uma **Missão de Resgate**.
3. **rt e ajuda como sismógrafo:** acerto com rt 3× acima do padrão da criança = domínio frágil (conta como meio-erro para revisão); helpClicks repetidos no mesmo tipo = pedir o microtutorial antes que o erro aconteça.
4. **Ferrugem programada:** a revisão espaçada (11.2.3) é o radar do esquecimento — falha na revisão reabre treino, nunca rebaixa coroa.

**A Missão de Resgate (como o "voltar" funciona):** a competência frágil vira uma missão especial na ilha antiga — *"o Guardião da Ponte precisa de você de novo!"* — com 4-6 questões + microtutorial. **Enquanto isso a fronteira atual NÃO fecha:** a criança segue avançando em outra strand em paralelo (anti-travamento, 11.2.5). Resgate concluído → a competência de cima destrava de novo o degrau que tinha ficado difícil. Na prática: o app volta SEM a criança sentir que voltou.

### 11.5 IDADE NUNCA TRAVA (a regra de ouro da progressão)
As faixas F0-F4 do Grafo são **calibragem, não catraca**: elas ajustam o palpite da Bússola, a duração da sessão, o tom narrativo e o tamanho dos alvos — e NADA mais. O que abre e fecha competência é uma única coisa: **pré-requisito dominado (regra do §5)**. Consequências explícitas:
- O filho de 7 com lacunas de F0 treina competências de F0 — apresentadas com narrativa da idade dele (o resgate é missão de herói, não "voltinha pro jardim"; os temas visuais são por idade, o conteúdo é por evidência).
- A criança de 6 que voa entra em F2-F3 sem nenhuma trava etária. O sistema **nunca segura** por "não é da sua série": se os pré-reqs estão 👑, abre. (O Modo Gênio de 11.2.6 vira só um atalho de exploração para o pai — a progressão normal já não conhece teto de idade.)
- Estar "adiantado" ou "atrasado" não existe no vocabulário do app — nem nas telas, nem no painel dos pais. Existe fronteira: onde a criança está aprendendo AGORA. O painel dos pais mostra o mapa por strand (pode estar em F3 de números e F1 de geometria — e isso é NORMAL e dito assim).

### 11.6 Como tudo isso APARECE NA TELA
- **O mapa é o estado mental do motor, traduzido:** 🔒 travada · 🌱 aberta · 🔥 fronteira ativa · 👑 dominada · 👑cinza presumida · ✨ missão de resgate (ilha antiga brilhando com um "!").
- **Voltar nunca parece voltar:** resgate = missão especial com recompensa própria; recuo de nível dentro da competência = invisível (a próxima sessão simplesmente flui melhor).
- **Proibições visuais:** nada de vermelho de reprovação, nada de "nível caiu", nada de barra de "atraso", nenhuma comparação com idade/série em NENHUMA tela da criança.
- **O tutor fala o diagnóstico como convite:** *"percebi que os amigos do 10 estão escorregadios — bora afiar eles rapidinho?"* (nomeia a lacuna com carinho e já oferece o caminho).

### 11.7 O que ele NUNCA faz
Não pune, não rebaixa `maxLvl`, não tranca tudo atrás de uma competência, não decide com IA em tempo real (determinismo, §2.9).

---

## §12. CONTRATOS DE GERAÇÃO (a IA preenche, não inventa)

### 12.1 Arquivo de competência (`curriculum/NX.NN.yaml`)
```yaml
id: N3.07
nome: Fazer 10 (adição atravessando a dezena)
strand: N3
faixa: F1
prereqs: [N1.11, N1.10, N2.01]
bncc: "1º-2º ano — Números"
micros:
  - id: a
    alvo: "com moldura dupla animada"
    kinds: [tenframe]
    params: { a: [6,9], soma: [11,18] }     # o gerador SÓ sorteia aqui dentro
    dominio: { acertos: 8, de: 10, sessoes: 2 }
  - id: b
    alvo: "com number bond (decompor o b)"
    kinds: [bond]
    params: { a: [6,9], soma: [11,18] }
erros_tipicos:
  - id: para_no_10
    descricao: "soma até 10 e esquece o resto"
    distrator: "10"
    dica: "Você fez o 10! Agora junte o que sobrou."
audio:
  enunciado: "Encha a moldura para fazer 10, depois some o resto!"
tutorial: [ ...TutSteps... ]
```

### 12.2 Contrato do gerador (imutável — §2.8)
`gen(lvl 1-5) → Question` com: `kind` do catálogo §9; params dentro do micro ativo; resposta exatamente 1× nas options; distratores = `erros_tipicos` (aleatório só completa); `howto` + `explain` sempre; `prompt` ≤ 12 palavras faladas (F0-F1); nunca valores negativos antes de N7; função pura ~30 linhas com helpers (`ri`, `pick`, `numOpts`).

### 12.3 Prompt-contrato para a IA de autoria
Ao pedir conteúdo novo a qualquer IA (Gemini/Claude), o prompt é sempre: *"Preencha o contrato YAML da competência X seguindo a Bíblia §12 e o Grafo. NÃO crie competências, IDs, kinds ou faixas de parâmetros novos. Se algo parecer faltar no grafo, PARE e reporte a lacuna."* — a IA como operária do contrato, jamais arquiteta improvisada. (As skills `.claude/skills/nova-trilha` e `nova-materia` devem ser atualizadas para apontar para este documento.)

---

## §13. DIAGNÓSTICO DO ESTADO ATUAL E PLANO DE MIGRAÇÃO

### 13.1 O que a auditoria encontrou (julho/2026)
1. **Cinco+ "fontes únicas de verdade" concorrentes**, com currículos que se contradizem, e três cópias da árvore de docs (`AI_Studio_Lab/`, `backup_legado/`, `backup_repo/docs/`). O sintoma clássico de autoria multi-IA sem contrato.
2. **IDs incoerentes e colidentes:** `C0001` = Subitização no doc legado, mas = Contar 1-a-1 no código; `C0003` = Cardinalidade no doc, = Caixa Mágica no código. Cinco esquemas de ID convivendo. *(Resolvido: esquema novo + tabela de migração no Grafo §3.)*
3. **Grafo sem arestas:** `Track.prereqs` existe mas está vazio em quase tudo (3 trilhas de ~35 declaram pré-req); o `GraphValidator`/inter-ilhas admitidamente não existe. A "adaptatividade" real hoje é só o ZDP por trilha. *(Resolvido no papel: 84 nós com arestas; falta o unlock_engine.)*
4. **Trilhas-sanfona:** uma trilha comprime várias competências nos seus 5 níveis (Contar = 1-a-1 + cardinalidade + subitização + até 20), quebrando a semântica dos níveis CRA. *(Resolvido: 1 track = 1 competência; migração abaixo.)*
5. **Cobertura para até ~7 anos:** `grade: "pre" | "ano1"` no tipo `Kid`; nada de reagrupamento, multiplicação, divisão, frações, decimais (C0106/C0206 declarados e nunca implementados). *(Resolvido no papel: F2-F4 no Grafo.)*
6. **Tudo é múltipla escolha** e falta o kind mais importante da aritmética (reta numérica) e o da conta armada. *(Backlog §9.2, P1.)*
7. **Regra de domínio incompleta no código** (só streak; a Bíblia antiga exigia helpClicks=0 + latência — nunca implementado).
8. **Riqueza real a preservar:** composer com receita de aula excelente, ZDP com bônus de latência, telemetria já nos tipos, howto/explain, TutSteps, cenas vivas, economia dupla, mascote, skills de autoria, ritual de fechamento, lições de segurança do Firestore. **A fundação é boa — o problema era organização da autoria, não pedagogia.**

### 13.2 Migração em 6 fases (cada uma cabe em 1-3 sessões de trabalho)
- **M1 — Congelar e limpar.** Mover docs antigos para `arquivo_morto/`; commitar Bíblia+Grafo+YAML como únicos; atualizar CLAUDE.md e as skills para apontarem para cá. *Critério: grep por "fonte da verdade" retorna 1 lugar.*
- **M2 — Grafo executável.** Criar `curriculum/*.yaml` a partir do `grafo_saga.yaml` (F0-F1 primeiro); escrever `unlock_engine.ts` (regra §5) + testes; `graphId` novo em todas as tracks via tabela de migração (saves antigos migram por de-para).
- **M3 — Desfazer as trilhas-sanfona de F0.** Contar → N1.01/N1.04; canto → N1.02; etc. Progresso existente herda pelo de-para (nível atual vira nível da competência mais avançada da antiga trilha).
- **M4 — Kinds P1.** `numberline` e `vertical` + TutSteps + Mão Fantasma (`<GhostHand/>`) genérica. Com eles, F1 fecha inteira e F2 abre.
- **M5 — F2 no ar.** Competências N2.04–PE.02 geradas por contrato (§12.3), uma por sessão de autoria, teste junto.
- **M6 — Revisão espaçada e Dojo formais.** `review_planner` com os intervalos 2-4-7-12-21-45; trilhas FD; regra completa de domínio 👑; painel dos pais lendo o grafo (mapa de calor por strand).
- **F3-F4** entram depois de M6, cartucho a cartucho, pelo mesmo ritual — o grafo já está pronto esperando.

---

## §14. GOVERNANÇA
- **Mudança pedagógica** → edita Bíblia/Grafo primeiro, código depois (nunca o inverso).
- **Toda sessão de IA** começa lendo: CLAUDE.md (estado) → Bíblia (regras) → Grafo (conteúdo do dia). Termina com o ritual (§2.10).
- **Conflito entre documentos** = bug de documentação: resolver na hora, na fonte única.
- Versões: bump no topo deste arquivo a cada mudança material, com uma linha de changelog abaixo.

*Changelog: v1.0 (jul/2026) — unificação total pós-auditoria; renomeação Matemágica → SAGA; escopo 4-12; grafo de 84 competências (inclui N4.12, divisor de 2 dígitos, e divisão de decimais em N6.02 — fecha o algoritmo de divisão por completo).*
*v1.1 (jul/2026) — §11 expandido: Bússola de Posicionamento (11.3), Radar de Lacunas com tags de misconception e Missões de Resgate (11.4), regra Idade Nunca Trava (11.5), representação na tela (11.6); Dojo promovido a documento próprio (`DOJO_SAGA.md`); Manual Didático v2 completo integrado ao cânone.*
*v1.2 (jul/2026) — modelo de erro reformulado para DUAS CAMADAS (§8): resposta imediata leve na questão (preserva o fluxo, nunca trava) + remediação profunda disparada por PADRÃO via Radar (§11.4), entregue em pausa/fim de sessão/resgate. Princípio 5 refinado ("o fluxo é sagrado"). Correção da rigidez do escalonamento E1→E2→E3 por questão.*
*v1.3 (jul/2026) — regra do FADING (§5): o andaime some conforme a proficiência sobe (aula é exceção, não enfeite). §6: aula é feita de prática, não palestra; distinção entender-a-matéria vs entender-o-exercício com gatilhos separados. §11.2.4: Dojo como pilar autônomo com DUAS famílias de fluência (FD fatos + PD procedimentos armados).*
