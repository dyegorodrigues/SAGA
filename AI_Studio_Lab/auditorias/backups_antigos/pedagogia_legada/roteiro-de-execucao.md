# 🎬 ROTEIRO DE EXECUÇÃO — Matemágica no AI Studio

> ⚠️ **DOCUMENTO HISTÓRICO (cumprido).** As sessões deste roteiro foram executadas. Preservado como registro. A fila atual de trabalho vive em `sala-de-situacao.md`.
**Cada sessão = UM comando pra colar + o que verificar + o ritual de fechamento. Nesta ordem, sem pular.**

---

## O RITUAL (repete ao fim de TODA sessão — decora)
1. ✅ Rodar `npm run build` sem erro (a partir da Sessão 3: também `npm run test`)
2. ✅ Testar as 4 vitais no app: voz fala · selo 🧠 de revisão aparece · fechar e reabrir mantém progresso · álbum abre
3. ✅ **Commit no GitHub** com mensagem do passo ("sessao-1-seguranca")
4. Só então a próxima sessão.

---

## SESSÃO 0 — Verificação de integridade 🔍
**Cole:**
> Consulte docs/planejamento/plano-diretor-v2.md. Execute APENAS a Sessão 0 (verificação de integridade), com um adendo: além de procurar imports órfãos e validar o build, liste também (SEM remover ainda): (a) onde está implementada a "remoção de fundo branco em tempo real" adicionada recentemente no MascotRenderer; (b) onde está o "alternador de estilo Vetor/3D Toy" e se ele está de fato conectado à interface ou é código morto. Me devolva o relatório do que encontrou e corrija SOMENTE o que estiver quebrando o build. Nenhuma outra alteração.

**Esperado:** relatório + build verde. *(Correção importante: Sessão 0 NÃO é a de segurança — ele confundiu isso no resumo. Segurança é a próxima.)*

---

## SESSÃO 1 — Segurança: fechar o banco 🔐
**ANTES, você no console do Firebase:** Authentication → Sign-in method → ativar **Anonymous**.
**Cole:**
> Consulte docs/planejamento/plano-diretor-v2.md, Parte B. Execute apenas ela: remova o fluxo de login por e-mail sem senha (usr_email_). O app fica com dois caminhos: "Entrar com Google" (existente) e "Começar sem conta" via signInAnonymously, ambos gravando em userStates/usr_cloud_{auth.uid}. Implemente a migração de dados de perfis usr_email_ existentes para o uid autenticado no primeiro login. Nada além disso.

**DEPOIS, você:** abrir o app uma vez em cada dispositivo (roda a migração) → só então, no console do Firestore, colar e **publicar as novas rules** (o arquivo firestore.rules que te entreguei) → testar em aba anônima que perfil alheio NÃO carrega.

---

## SESSÃO 2 — Segurança: proteger os endpoints do Gemini 💸
**Cole:**
> Consulte docs/planejamento/plano-diretor-v2.md, Parte H, item 1. Execute apenas ele: no server.ts, exija token do Firebase Auth (verifyIdToken) nas rotas /api/tutor e /api/analyze-progress, e adicione limite por usuário: 20 chamadas de tutor e 5 relatórios por dia. Ajuste o front pra enviar o token no header. Nada além disso.

---

## SESSÃO 3 — A cinta de segurança: testes 🧪
**Anexe** o arquivo `generators.test.ts` e **cole:**
> Salve o anexo em src/utils/generators.test.ts. Instale vitest como dependência de desenvolvimento e adicione o script "test": "vitest run" no package.json. Rode os testes e me mostre o resultado completo. Se algum gerador falhar, corrija O GERADOR (nunca o teste). Nada além disso.

**A partir daqui, o ritual includes `npm run test` sempre.**

---

## 🏠 DEVER DE CASA (fora do AI Studio, sem gastar cota)
Gerar as 5 imagens definitivas do Dragão de Fogo seguindo docs — guia de arte: PNG transparente REAL, 512×512, centralizado, margem 10-15%, prompt-mestre congelado + refinamento por referência. Nomes exatos: `dragao-1-ovo.png`, `dragao-2-filhote.png`, `dragao-3-jovem.png`, `dragao-4-guerreiro.png`, `dragao-5-supremo.png`.

## SESSÃO 4 — Arte de verdade: matar as gambiarras 🎨
**Anexe os 5 PNGs e cole:**
> Recebi os PNGs finais com transparência nativa. Salve em src/assets/mascotes/ com os nomes dos arquivos. No MascotRenderer: REMOVA completamente (1) a remoção de fundo branco em tempo real (recorte pixel a pixel/feathering), (2) qualquer resquício de mixBlendMode, (3) o alternador "Vetor/3D Toy". Renderize os PNGs com <img> simples, mantendo por cima as animações, auras e partículas existentes. Delete as imagens antigas do dragão. Nada além disso.

**Verificar:** dragão nítido, sem película, integrando com qualquer cenário.

---

## SESSÃO 5 — Escola SVG (o motor secundário no papel certo) ✏️
**Cole:**
> Consulte docs/planejamento/plano-diretor-v2.md, Parte C. Registre as 6 lições como regra permanente de todo desenho SVG futuro. A partir de agora o motor vetorial fica restrito a: acessórios, cenários, ícones e efeitos — nunca personagens completos. Nenhuma alteração de código nesta sessão além de comentário de cabeçalho documentando isso no arquivo do renderizador.

---

## SESSÃO 6 — Economia dupla ⭐🪙
**Cole:**
> Consulte docs/planejamento/plano-diretor-v2.md, Parte D. Execute apenas a refatoração da economia: campo coins separado; estrelas viram XP vitalício que nunca é gasto (marcos de evolução 15/75/250/700); todo gasto (álbum, comida, acessórios) debita coins (ganho: 1/acerto + 3/missão + 5 na primeira do dia); migração: coins iniciais = saldo atual de estrelas. NÃO mexa em alimentação/humor nesta sessão.

## SESSÃO 7 — Tamagotchi: humor e alimentação 🐉
**Cole:**
> Consulte docs/planejamento/plano-diretor-v2.md, Parte D (alimentação/humor). Execute apenas: comida custa 2 coins (1 grátis/dia ao completar a Missão do Dia); alimentar enche barra de energia que decai 1/dia; energia e humor (calculado do streak: feliz/sonolento/com saudade) mudam SOMENTE animações e frases — jamais bloqueiam evolução ou regridem estágio. O mascote nunca adoece nem morre.

---

## SESSÃO 8 — Aquecimento de sessão 🔥
**Cole:**
> Consulte docs/planejamento/plano-diretor-v2.md, Parte E, item 1. Execute apenas o aquecimento: as 2 primeiras questões de cada missão usam nível max(1, nível−1); erros nelas não contam para rebaixamento; acertando as duas, a questão 3 volta ao nível salvo.

## SESSÃO 9 — Desafio Misto 👑
**Cole:**
> Consulte docs/planejamento/plano-diretor-v2.md, Parte E, item 3. Execute apenas o Desafio Misto: card especial 1×/dia; 10 questões = 40% dos bancos de revisão de todas as trilhas + 30% da trilha de pior precisão (mín. 8 respondidas) + 30% aleatórias no nível de cada trilha; recompensa em coins ×2.

---

## SESSÃO 10 — Varredura UX 🧹
**ANTES, você:** rode o roteiro de 10 minutos da Parte F do plano num celular real e anote o que falhar.
**Cole (exemplo — adapte ao que achou):**
> Consulte docs/planejamento/plano-diretor-v2.md, Parte F. Corrija APENAS estes problemas que encontrei no teste: [tua lista]. Use as soluções padrão da Parte F (AppHeader único, escala de z-index, sem position absolute em botões de layout).

## SESSÃO 11 — Faxina do repositório 🗑️
**Cole:**
> Limpeza sem mudança de comportamento: (1) delete os scripts de codemod da raiz (replace*.js, add_*.js, modify_*.js, rewrite_*.js, update_*.js); (2) esconda o AdminGodPanel atrás de import.meta.env.DEV; (3) renomeie o projeto no package.json para "matemagica"; (4) rode build e testes e me confirme tudo verde.

## SESSÃO 12 — Divisão dos gigantes 🪓
**Cole:**
> Consulte docs/planejamento/plano-diretor-v2.md, Parte H, item 2. Execute apenas a refatoração estrutural SEM mudar comportamento: extraia de GameLoop o hook useGameEngine + componentes de pergunta/opções; divida ParentDashboard em painéis; nenhum arquivo acima de 15KB. Rode os testes ao final e me mostre que continuam verdes.

---

## DEPOIS DISSO (a era do conteúdo — um por sessão, sempre citando os docs)
13. **Leitor Veloz fase 1** — Cola-Sílabas + Palavras-Relâmpago (docs/adendo, seção 3) — *o presente do Heitor*
14. **Consciência fonológica** — Caça-Rimas + Palminhas de Sílaba (relatório, Fase 0) — *o presente do Benjamin*
15. **Camada 0 de voz** — responder falando + avaliação de leitura em voz alta (adendo, seção 4)
16. **Senhor do Tempo** com a animação orbital (relatório, 1.1)
17. **Amigos dos Números + Moldura de 10** (relatório, 1.2-1.3)
18. Continuum vertical → Modo Gênio/Alicerce → Missões do Mundo… (ordem do relatório/adendo)

**Regra eterna:** um comando por sessão · ritual ao final · quando algo der errado, ME TRAGA o estado (zip/link) antes do próximo passo — eu audito e te devolvo a correção pronta.
