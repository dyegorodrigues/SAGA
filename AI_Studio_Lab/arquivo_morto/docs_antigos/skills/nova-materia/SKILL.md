---
name: nova-materia
description: Criar uma matéria nova (português, inglês, ciências, mundo digital...) no Matemágica pelos 6 passos da bíblia — matriz de habilidades, kinds existentes, geradores com prereqs, registro em SUBJECTS, testes, arte. Usar quando o pedido for "nova matéria" ou "módulo de <matéria>".
---

# Nova matéria — o cartucho novo no console

**Princípio:** o motor NUNCA sabe qual matéria roda (`if (subject === ...)` no núcleo é PROIBIDO). A matéria ganha de graça: adaptação, revisão 🧠, economia ⭐🪙, voz, Desafio Misto, Tamagotchi e analytics.

## Os 6 passos (bíblia, Parte IV)
1. **Matriz de habilidades por idade** — BNCC + melhor referência internacional (GraphoGame p/ português, TPR p/ inglês, Singapura p/ matemática). Consultar `docs/relatorio-expansao-pedagogica.md` e `docs/adendo-relatorio-expansao.md` — as matérias já mapeadas estão lá.
2. **Mapear cada habilidade a um kind existente** (count, options, pattern, scene, story, listen-touch…). Kind novo é exceção com 2+ usos.
3. **Escrever geradores** — 1 trilha = 1 função (usar a skill `nova-trilha` para cada uma), com `prereqs` declarados.
4. **Registrar em `SUBJECTS`** — arquivo próprio `src/subjects/<materia>/` (≤15KB por arquivo).
5. **Testes + assets** pelo pipeline de arte (PNG transparente p/ personagens; SVG só acessórios/cenários/ícones/efeitos).
6. **Verificar integração automática**: a matéria deve aparecer no Desafio Misto e nas métricas dos pais SEM código extra. Se precisou de código extra, a arquitetura foi violada.

## Regras especiais
- Tema transversal (financeira, civismo) = FIO em matérias existentes, não ilha (Constituição regra 8).
- Voz: pt-BR usa sílaba como unidade mínima; inglês = `lang: "en-US"` na mesma `speak()`.
- Neutralidade absoluta em temas sociais; o app jamais diagnostica criança.

## Ritual de fechamento
Igual ao de `nova-trilha`, + atualizar `docs/mapa-mestre.md` (fase concluída) e `CLAUDE.md`.
