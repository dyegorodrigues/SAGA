# 🗺️ Sala de Situação e Mapa Mestre do Projeto
*O painel vivo e o mapa de integração do Matemágica AI.*
*Atualizado a cada rodada pela Inteligência Artificial. Se você se sentir perdido, comece por aqui.*

---

## 📍 1. STATUS GERAL E FRENTES DE TRABALHO
**Regra Estratégica Atual:** Não criar novas matérias agora. Foco total em **TERMINAR A MATEMÁTICA INTEIRA** (auditar + completar cada trilha) antes de expandir para o resto do currículo.

### As Frentes Atuais:
1. **Conteúdo & Pedagogia (Matemática)**: Foco em completar e fechar todos os nós do grafo matemático.
2. **Áudio / Voz**: Integração via API do TTS (Luna Studio). Precisa destravar faturamento para gerar em lotes.
3. **Arte e Cenas**: Pipeline de assets operando (PNG Die-cut para mascotes; SVG para mapas).
4. **Código Limpo**: Foco no refatoramento de MascotBases para usar GameEngine, enxugar dependências e preparar a interface unificada (Sessão 12).
5. **Design Visual**: UX da Home (Mapa de Ilhas estilo Duolingo) e sistema do Tamagotchi (fase futura programada).
6. **Integração Multi-IA**: Claude vs AI Studio operando em harmonia sob a Constituição (`MAB_CONSTITUICAO_MESTRE.md`).

---

## 🧩 2. INTEGRAÇÃO DE MATÉRIAS E MULTIDISCIPLINARES (O Mapa)
Como o sistema escala e absorve novos conteúdos sem virar bagunça.

- **A Máquina Genérica**: O motor nunca sabe qual matéria está rodando. O núcleo provê Adaptação, Economia, Revisão, Voz e Logs. Cada matéria é apenas um `cartucho` conectando a ele. (Consulte a Constituição).
- **Multidisciplinar não é matéria, é MODO**: As "Missões do Mundo" (Mercadinho, A Turma Vota) são cenários que puxam mecânicas da matemática, ciências e cidadania juntos.
- **Transição de Idade**: O ano letivo (pré, 1º ano) é uma sugestão de *entrada*, não um confinamento. A criança viaja pelo Grafo de Conhecimento, avançando apenas se dominar o requisito.
- **O Alfabetizador (GraphoGame)**: Implementado no mesmo motor usando o método fônico + instrução sistemática.

---

## 🛠️ 3. CHECKLIST E PRÓXIMOS PASSOS (O que falta destravar)
- [ ] **Zeus**: Ativar faturamento/billing na chave API Gemini para liberar TTS.
- [ ] **Zeus**: Gerar novos SVG de cena ou Folhas de Sprite de novos mascotes.
- [ ] **IAs**: Auditoria rigorosa de cada trilha matemática de `catalogo-atividades.md` contra o código gerado em `src/subjects/mat/`.
- [ ] **IAs**: Validar a transição limpa para a interface "Mapa de Ilhas" / "Caminho de Aprendizagem" contínuo, aposentando menus genéricos.

---
## 🌟 4. PÉROLAS RECUPERADAS DO BACKUP (Evolução Cognitiva Futura)
*Insights extraídos da Auditoria do Backup do GitHub (`MEGA_ANALISE_BACKUP_GITHUB.md`) a serem desenvolvidos.*

- **O Motor de "Tiro Rápido" (Dojo Kumon)**: Implementar efetivamente o UI de restrição de tempo no `GameLoop.tsx` para forçar a fluência e a subitização cerebral (cálculos rápidos como reflexo).
- **ELO Invisível Sensível ao Tempo (Latência)**: O `progressEngine.ts` precisa evoluir para não medir apenas Acerto/Erro, mas também o **Tempo de Resposta (Speed)**. Demorar 20s para responder uma conta simples significa contagem nos dedos e deve engatilhar um Downgrade Silencioso para trilhas visuais/concretas.
- **Cenas Vivas de Barras de Singapura (SVG)**: Acelerar a adoção do `mapa-de-cenas-svg.md` focado em arrastar bloquinhos (Modelagem por Barras) para ensino de frações e álgebra precoce.
- **Dashboard dos Pais com Batch AI**: Usar a IA para rodar em lote "de madrugada" analisando os logs do Firebase e gerando relatórios de desempenho e lacunas (sem impacto no tempo real do jogo).
