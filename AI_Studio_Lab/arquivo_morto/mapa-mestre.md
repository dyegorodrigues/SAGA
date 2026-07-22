# 🗺️ MAPA MESTRE — as perguntas do Zeus, respondidas e organizadas
**Este documento é o índice vivo da expansão: cada dúvida → resposta curta → onde está o detalhe → o que falta decidir. Atualizar sempre que uma fase concluir.**

---

## 1. Como as matérias novas entram SEM virar bagunça?

**Resposta curta:** o motor nunca sabe qual matéria está rodando. Matéria é cartucho, o motor é o console (bíblia, Parte IV). Uma matéria nova = **1 arquivo de geradores + 1 registro no `SUBJECTS` + testes** — e ela ganha DE GRAÇA: adaptação de nível, revisão espaçada 🧠, economia ⭐🪙, voz, Desafio Misto, analytics e Tamagotchi.

**As garantias anti-conflito (Constituição, já em vigor):**
1. Contrato imutável: `gen(nível) → { kind, prompt, options[], answer }` — português, inglês e ciências devolvem O MESMO formato que matemática.
2. Kind (renderizador) é compartilhado: "ouça e toque" serve pra fonema, palavra em inglês E número falado. Kind novo só com 2+ usos.
3. `if (subject === "port")` dentro do motor é PROIBIDO. Se precisar, o design está errado.
4. Estrutura de pastas na era do conteúdo (Sessão 12+): `src/subjects/mat/`, `src/subjects/port/`, `src/subjects/eng/`… cada gerador ≤15KB com seu `.test.ts` ao lado.

**Onde está o detalhe:** bíblia Parte IV (5 camadas + checklist de 6 passos) · relatório seção 9.

## 2. O multidisciplinar não vai se misturar com as matérias?

**Resposta curta:** não, porque multidisciplinar não é matéria — é **cenário**. As 10 "Missões do Mundo" (Mercadinho, Cozinha Mágica, A Turma Vota…) são um MODO que puxa geradores das matérias existentes com roupagem de vida real. Regra 8: tema transversal é FIO, não ilha.

**Onde está o detalhe:** adendo seção 1 (as 10 missões, mecânica por mecânica) · começar por Mercadinho 🛒 e A Turma Vota 🗳️.

## 3. Alfabetização/GraphoGame: como colocar no app? E a voz pt-BR natural?

**Resposta curta:** o método GraphoGame = instrução fônica sistemática + adaptatividade — **nosso motor já É isso**; falta só o conteúdo (Fases 0-6: consciência fonológica → vogais → consoantes → Fábrica de Sílabas → Fábrica de Palavras → primeira leitura → manhas do português).

**O problema real (TTS não fala fonema isolado) tem solução em 3 camadas:**
1. **Sílaba como unidade mínima de voz** ("MA", "PO") — resolve 90% do currículo, custo zero.
2. Palavras-âncora ("M de MACACO 🐵").
3. ~40 áudios gravados de fonemas (fase 2 — dá pra gravar com a voz da família).

**Fluência (o momento do Heitor):** módulo Leitor Veloz 🚀 — Cola-Sílabas (blending progressivo), Palavras-Relâmpago, eco, leitura repetida, prosódia, Livrinhos Mágicos decodáveis gerados sob medida.

**Onde está o detalhe:** relatório seção 4 · adendo seções 3 e 4.

## 4. A criança vai poder FALAR com o app?

**Resposta curta:** sim, em 3 camadas de custo (adendo seção 4): **Camada 0 (R$ 0, próxima)** = Web Speech API nativa: responder falando + avaliação de leitura em voz alta (precisão + palavras/minuto — a métrica de fluência do painel dos pais). Camada 1 = tutor por turnos com o endpoint Gemini que já existe (centavos). Camada 2 = conversa streaming (cara, luxo futuro). Regra sagrada: voz processada na hora, NUNCA gravada; nasce desligada, pais ativam.

## 5. Educação financeira e "investimentos" para essa idade?

**Resposta curta:** é o exemplo perfeito de matéria-FIO (bíblia Parte III): **4-6 anos** = moedas, troco, precisa×quer (Dinheirinho + Mercadinho — já existem) · **7-8** = Cofrinho com Meta 🐷 e o pulo do gato: "guarde 5 moedinhas hoje, amanhã viram 6" — juros e gratificação adiada GAMIFICADOS (a própria economia 🪙 do app vira o laboratório!) · **10+** = Investidor Mirim simulado, inflação como "monstro que morde o cofrinho". Nada de tela de corretora — é conceito na dose da idade.

## 6. Alfabetização tecnológica e em IA?

**Resposta curta:** matéria própria "Mundo Digital 💻🤖" (bíblia Parte III): **4+** tela e corpo, "o computador não é mágico" · **6+** internet como "cartas velocíssimas", senha é segredo, pensamento computacional (Comande o Mascote ⬆️➡️ — estilo Code.org pré-leitor) · **7+** alfabetização em IA: "a IA aprende com exemplos", "a IA pode errar — confira!", "nunca conte segredos a um app". Pouquíssimos no mundo fazem isso bem — é diferencial.

## 7. Animações estilo Synthesis (sem torrar IA)? ✨ *(pergunta nova — incorporada)*

**Resposta curta:** a filosofia certa é a que a Synthesis usa e que JÁ é nossa regra: **animação é CÓDIGO reutilizável e parametrizado, nunca gerada por IA na hora.** Nossos "kinds" são exatamente isso: um banco de cenas construídas uma vez que servem infinitas questões.

**O plano — Biblioteca de Cenas Vivas (cresce 1 por vez, com 2+ usos cada):**
- Já temos: moldura de contagem, material dourado, moedas/notas, relógio, cenas, gráficos picto.
- Próximas (era do conteúdo): **órbita Sol-Terra-Lua** (Senhor do Tempo + Ciências — a mesma!), **moldura de 10** animada, **círculo dos Amigos dos Números**, **reta numérica saltitante**, **balança de comparação**, **sílabas que se colam** (Cola-Sílabas).
- Regra de ouro: cada cena entra como kind no contrato, parametrizada pelo gerador (`{ kind: "orbit", dias: 3 }`), animada por CSS/SVG — custo zero por uso, funciona offline.

## 8. Analytics e metadados por aluno? *(pergunta nova — plano incorporado)*

**O que JÁ coletamos hoje, por criança:** nível/acertos/total/sequências POR TRILHA, banco de erros com contagem de domínio (metacognição real!), log diário com acertos, estrelas, TEMPO DE RESPOSTA e missões, streak.

**O plano em 3 degraus (sem inchar o banco — plano diretor H.6):**
1. **Agora (grátis):** o painel dos pais já pode derivar: precisão por trilha, velocidade média, curva semanal, "dominou X revisões". O relatório Gemini já consome isso.
2. **Era do conteúdo:** log por kind e por domínio (não só por trilha) → habilita o **mapa vertical** no painel: "na escada da adição, ele está no degrau 1º-ano-nível-4" — posição sem rótulo (adendo seção 2.5).
3. **Ao escalar:** migrar para subcoleções `userStates/{uid}/kids/{kidId}` quando multiplicar matérias (limite de 1MB/doc). Voz: palavras-por-minuto entra com a Camada 0.
**Regra ética permanente:** dados servem para ADAPTAR e ORIENTAR, nunca rotular. O app não diagnostica.

## 9. O aluno avançado/travado atravessando os anos (tipo IXL, mas melhor)?

**Resposta curta:** é o **Continuum Vertical** (adendo seção 2) — cada domínio é uma escada que atravessa os anos; o "ano" só define onde a criança entra. Travou (2 rebaixamentos) → desce a escada como "Missão Turbo de Aquecimento ⚡" (nunca "voltou pro pré"). Voando (≥90% + rápido, sustentado) → Modo Gênio 🚀 sobe pro ano seguinte + enriquecimento horizontal (problemas abertos, "ensine o mascote"). Custo: 1 campo `prereqs` por trilha + 2 gatilhos no motor. O IXL faz diagnóstico frio; o nosso faz a mesma coisa com carinho e sem rótulo.

## 10. Integração de tudo com economia, mascote e modos?

**Resposta curta:** automática por arquitetura. Qualquer trilha de qualquer matéria paga ⭐ XP e 🪙 na mesma regra, alimenta a mesma revisão 🧠, entra no mesmo Desafio Misto 👑 (que já sorteia "de todas as trilhas da criança" — quando português existir, entra sozinho), evolui o mesmo dragão. O Tamagotchi "come de qualquer matéria". Nenhum trabalho extra por matéria — essa é a razão de ser das 5 camadas.

---

## 11. As 5 bolinhas como níveis de domínio (e o "SmartScore" do IXL)? ✅ IMPLEMENTADO

**Sua ideia era certeira e já está no app.** As 5 bolinhas embaixo de cada trilha agora SÃO os 5 níveis de dificuldade conquistados:
- Bolinha acesa = nível dominado; a do nível atual **pulsa** (você vê exatamente onde está).
- Níveis conquistados **nunca regridem** (`Progress.maxLvl`): mesmo que a criança caia de nível num dia ruim, a bolinha ganha continua acesa — conquista não se perde.
- **Domínio Absoluto 👑** = 3 acertos seguidos no nível 5. Pinta as 5 bolinhas de dourado + coroa. É o "preencheu tudo" que você descreveu: o domínio perfeito da trilha.

**Como se compara ao SmartScore do IXL:** o SmartScore é um número 0-100 que sobe rápido e DESABA com erro (pune). O nosso é melhor em 3 pontos: (a) **aquecimento** — as 2 primeiras questões vêm fáceis pra encorajar, e errar nelas não conta; (b) **sem punição** — a bolinha conquistada não apaga; (c) **revisão espaçada embutida** — o erro vira card 🧠 que volta até dominar 2×, coisa que o SmartScore não faz. Mesma função (medir domínio), com pedagogia mais humana.

## 12. Modo Gênio — desbloquear o próximo ano para os avançados 🚀 *(próximo passo de código)*

**O gatilho já existe:** o `dom` (Domínio Absoluto) marca quem esgotou a trilha. Falta o passo que você pediu: quando a criança tem Domínio Absoluto numa trilha, o app **OFERECE** (nunca impõe) a versão do ano seguinte da mesma escada. Design:
- Cada trilha tem `prereqs` (já no contrato) → isso forma o **grafo vertical**: contar-pré → seq-ano1 → (futuro) seq-ano2.
- Dominou contar-pré → aparece um card dourado "🚀 Modo Gênio: Antes e Depois (1º ano)!" que pluga o gerador do ano seguinte.
- Enriquecimento horizontal: "monte 10 de 3 jeitos", "ensine o mascote" (efeito protégé — a criança explica em voz alta).
- **Custo:** baixo — o registro já separa por ano; é apontar o gerador do ano seguinte quando `dom === true`. Entra na Fase C.

## 13. Ciências, Filosofia, Finanças — estrutura para não conflitar? *(roadmap pronto)*

Todas seguem o MESMO cartucho (skill `/nova-materia`). O que muda é só o conteúdo e a idade:
- **Ciências 🔬:** trilhas de classificação (mecânica que o motor já roda): Corpo Humano, Animais e Casas, De Onde Vem?, Vivo/Não-Vivo, Água (estados), Sistema Solar (reusa a MESMA animação orbital do Senhor do Tempo). Fase E.
- **Educação Financeira 💰 (FIO, não ilha):** 4-6 troco+precisa×quer (Mercadinho, já mapeado) · 7-8 Cofrinho com Meta + juros gamificados usando a PRÓPRIA economia 🪙 do app como laboratório · 10+ Investidor Mirim simulado. Atravessa Dinheirinho→Mercadinho→Cofrinho.
- **Filosofia 🦉 (P4C):** modo ESPECIAL, não quiz — a voz conta um micro-dilema, a criança escolhe e o mascote pergunta "por quê?". **Regra única: dilemas NÃO têm resposta certa marcada** — o valor é o raciocínio. Precisa de um kind novo ("dilema" sem `answer`), por isso é matéria de fase mais tardia.
- **Mundo Digital & IA 💻🤖:** 4+ tela e corpo · 6+ senha é segredo + Comande o Mascote (setas, lógica) · 7+ "a IA erra — confira!". Matéria própria, curta.
**Anti-conflito:** cada uma é 1 arquivo em `src/subjects/<materia>.ts` + 1 entrada no `SUBJECTS`. Não tocam uma na outra nem no motor. Já provado 2× (português, matemática de elite).

## 14. Emojis → visuais melhores (SVG)? ✅ COMEÇOU — Biblioteca de Cenas Vivas

Sua intuição está certa: emoji estático é o piso, não o teto. A resposta é a **Biblioteca de Cenas Vivas** — renderizadores SVG por código (não IA, não imagem): construídos uma vez, servem infinitas questões, custo zero, animam e funcionam offline. **Já entregues:** Material Dourado, moldura de contagem, relógio, moedas, e agora **Número-Amigo 🤝 e Moldura de 10 🔟**. Próximas: reta numérica saltitante, balança de comparação, órbita Sol-Terra-Lua, sílabas que se colam. Emoji continua onde faz sentido (é universal e leve), mas as mecânicas-chave ganham cena viva.

## 15. Os mascotes "vivos" (pixel art animado, estilo Pokémon/Marvel)? 

**Dois caminhos que convivem:**
1. **Enquanto você faz a pixel art:** o dragão SVG atual JÁ pisca, flutua e solta partículas por código (camada de vida por cima da forma). Quando seus PNGs chegarem, é só soltar em `src/assets/mascotes/` que o app troca sozinho — e a MESMA camada de animação (flutuar, brilho, aura do nível 5) roda por cima do PNG.
2. **Para "vivo de verdade" tipo Pokémon:** a técnica é **sprite sheet** — várias poses num PNG (idle, feliz, comemorando) que o código alterna. É o padrão dos jogos que você citou. Já deixei a arquitetura pronta pra isso: `mascotAssets.ts` resolve por `{tema}-{estagio}`, e dá pra estender pra `{tema}-{estagio}-{pose}`. Recomendação de arte: pixel art HD com iluminação suave (o "voxel fofo"), 4 poses por estágio numa folha. **Regra de ouro:** personagem = imagem; movimento = código. Nunca desenhar personagem realista em SVG à mão (a lição dos 103KB).

## 16. Coerência e sequência entre anos e matérias — o "caminho da criança"? 

Este é o **grafo de aprendizado** (o "segredo" do nosso motor, que você intuiu). Três eixos:
- **Vertical (dentro da matéria):** cada domínio é uma escada que atravessa os anos, ligada por `prereqs`. A criança sobe quando domina, desce (com carinho, "Missão Turbo ⚡") quando trava. O ano é porta de entrada, não muro.
- **Horizontal (dentro do ano):** a home mostra as trilhas da série; o motor RECOMENDA a próxima (a "Jornada Mágica" já faz isso: prioriza revisão pendente → pior precisão → trilha nova).
- **Transversal (entre matérias):** o Desafio Misto 👑 cruza tudo, e os fios (financeira, tempo) conectam matérias. Números em inglês reusam a matemática já dominada (terreno conhecido + língua nova = confiança).
**O que falta pra fechar:** tornar o grafo `prereqs` ATIVO (hoje é declarado mas o motor ainda não bloqueia/sugere por ele) — é a peça central da Fase C, junto com o Modo Gênio (§12) e o mapa vertical no painel dos pais (§8).

## 17. O algoritmo é perfeito? Os exercícios existentes estão bons? *(minha auditoria)*

**O algoritmo (o coração):** sólido e com base científica (ZDP/Vygotsky + repetição espaçada). Sobe com 3 acertos, desce com 2 erros, revisa erro até dominar 2×, aquece no início. É genuinamente mais completo que o SmartScore. **Melhoria pendente:** ativar o grafo `prereqs` (§16) e o Modo Gênio (§12).
**Os exercícios de matemática:** revisados — os 20 geradores (10 pré + 10 ano1) estão coerentes e cobrem bem a BNCC. A suíte de 149 testes garante que nenhum gera questão inválida. Já pegou e corrigiu bugs reais (Reloginho, XP em dobro). **Lacunas que preenchi hoje:** faltavam as ferramentas de fluência mental (Amigos dos Números, Moldura de 10) — agora existem. **Próximos refinamentos:** Senhor do Tempo (com órbita), Detetive Lógico (raciocínio puro — berço da superdotação), subitização/Olhômetro.

## 18. E se acabarem os créditos / a versão sumir? 

**Nada se perde.** Tudo que importa vive no GitHub, versionado: os 5 documentos em `docs/` (a fonte da verdade), o `CLAUDE.md` (estado vivo — o que está feito e o que vem), as skills `.claude/skills/` (os rituais de como construir), e cada commit conta o que foi feito e por quê. Qualquer sessão nova — minha, sua com outra IA, ou o próprio AI Studio — clona o repo, lê o CLAUDE.md e continua exatamente daqui. O projeto é **independente de qualquer sessão individual** por design. É a mesma disciplina que salvou o projeto das interrupções de cota do AI Studio.

---

## O PROCESSO EM ETAPAS (o filme que o Zeus pediu pra enxergar)

**FASE A — Alicerce (✅ CONCLUÍDA, sessões 0-9+11):** segurança, testes, arte SVG + encaixe PNG, economia dupla, Tamagotchi ético, aquecimento, Desafio Misto, faxina.

**FASE B — Acabamento do núcleo (sessões 10 e 12):**
- 10: correções UX com a lista do teste real do Zeus (roteiro da Parte F).
- 12: dividir os gigantes (nada >15KB, extrair `useGameEngine`, `src/subjects/`) — **pré-requisito técnico da era do conteúdo**: arquivo pequeno = IA erra menos = expansão segura.
- Critério de pronto: 4 vitais verdes no aparelho real + merge na main.

**FASE C — Matemática de elite + as duas pontas (13-15):** Senhor do Tempo (com a cena orbital) → Amigos dos Números + Moldura de 10 → Modo Gênio + Modo Alicerce + Perfis de Apresentação (Foco/Leitura) + continuum (prereqs).

**FASE D — Português, a maior aposta (16-18):** Fase 0 consciência fonológica (Benjamin: Caça-Rimas, Palminhas) → Leitor Veloz fase 1 (Heitor: Cola-Sílabas, Palavras-Relâmpago) → Camada 0 de voz (falar respostas + medir leitura).

**FASE E — Horizonte (19+):** Inglês oral (trilhas 1-4) → Ciências → Missões do Mundo (Mercadinho, A Turma Vota) → Detetive Lógico → Traçar com o Dedo → Manhas do Português → modos Aventura/Cooperativo → Mundo Digital & IA → tutor por turnos.

**Regra do processo:** 1 sessão = 1 entrega com teste; ritual sempre; este mapa e o CLAUDE.md atualizados a cada fase.

---

## Onde mora cada coisa (o índice dos índices)
| Assunto | Documento |
|---|---|
| Visão, ética, arquitetura 5 camadas, Constituição, currículo por idade | `biblia-do-matemagica.md` |
| **O MÉTODO** (Learning Trajectories, 7 princípios, receita de 6 passos) | `metodo-matemagica.md` |
| **O CATÁLOGO** (toda trilha × matéria × idade × nível, com tela+porquê+fonte) | `catalogo-atividades.md` |
| Correções técnicas, arte, economia, algoritmo, UX, auditoria | `plano-diretor-v2.md` |
| Passo a passo executável por sessão | `roteiro-de-execucao.md` |
| Matérias novas, Singapura, superdotados/dificuldade, neurodiversidade | `relatorio-expansao-pedagogica.md` |
| Multidisciplinar, continuum, fluência/Leitor Veloz, voz | `adendo-relatorio-expansao.md` |
| Perguntas ↔ respostas ↔ fases (este arquivo) | `mapa-mestre.md` |
| Estado vivo do projeto (o que está feito, o que vem) | `CLAUDE.md` |
