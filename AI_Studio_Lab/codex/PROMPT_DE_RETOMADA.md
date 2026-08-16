# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** Leia este arquivo integralmente antes de editar. O GitHub remoto vence memória de conversa, prompt antigo, SHA histórico ou status presumido.

---

## 1. Âncora remota

- Repositório: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch viva: `codex/fechamento-curricular`
- Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`

Antes de qualquer edição:

1. confirme PR, branch e HEAD remoto;
2. confirme que `main` continua intocada;
3. consulte os workflows do **SHA exato** relevante;
4. se CI + Certificação transversal já estiverem `completed/success`, **não espere novamente: execute o próximo passo**;
5. se houver deriva, investigue antes de escrever — o remoto vence este documento.

**Regra de evidência:** nunca inventar SHA, run ID, contagem de testes ou delta de Matrix. Conclusão global de workflow e evidência de job/log são fatos distintos.

---

## 2. Documentos de continuidade

Ler conforme a área:

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`
- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md`
- `AI_Studio_Lab/codex/ROADMAP_PRODUTO_E_EXPANSAO.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W20_W24_FECHADA_2026-08-15.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W25_W29_FECHADA_2026-08-15.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W30_W34_FECHADA_2026-08-15.md`

Checkpoint é recibo humano. **Coverage Matrix, canário, DAG e runtime vivos são a autoridade executável.**

---

## 3. Invariantes arquiteturais

- `composerCanaryIds.ts`, `coverage_matrix_core.ts` e `ficha_runtime_map.cjs` são declarativos.
- Não criar mutação por efeito colateral de import para canário, ledger, Matrix ou mapa runtime.
- Registrar ficha no Composer **não ativa** competência.
- Promoção acontece somente no array declarativo do canário.
- Promoção + linha nominal do ledger + contrato Matrix entram no **mesmo SHA**.
- A Matrix observa o delta real; baseline não mascara deriva.
- `ficha_runtime_map.cjs` deve ser completado **ainda no estágio inativo**, antes do portão de promoção, quando a nova ficha introduzir kind/builder/renderer/palco composto.
- Em palco composto, a realização física é explicitada em todas as primitivas canônicas pertinentes; não inferir cadeia inexistente só para ficar verde.
- Não tocar/mergear `main`.
- Não tocar Creature Engine/Tamagotchi neste fluxo.

---

## 4. Estado curricular vivo pós-W34

Ondas **W1–W34 fechadas**.

Coverage Matrix observada no Gates final da W34:

- **59 Composer**
- **15 legado**
- **16 fallback**
- **74 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Canário ativo: **59 competências**.

Gates final W34 `95094560886`: catálogo, fichas, conformidade, grafo, TypeScript, **221 arquivos / 3.123 testes**, build, guarda textual e guarda de binários verdes. A Matrix observou `59/15/16/74/11` e GE.08 como `padrao-ouro ShapeCanvas#grade`.

### Último bloco fechado

| Onda | Competência / ficha | Matrix após fechamento | Recibo técnico final |
|---|---|---|---|
| W30 | `N2.06 / F38` | `55/15/20/70/11` | `05b7787e7239db4c687b5fa7cc47ee0b4f256447` — CI `31883452067` + transversal `31883452082`, success |
| W31 | `PE.03 / F83` | `56/15/19/71/11` | `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd` — CI `31908549456` + transversal `31908549471`, success |
| W32 | `GM.09 / F82` | `57/15/18/72/11` | `40ef8eb13cd93d1a0b2e60375964853e62118e24` — CI `31913688446` + transversal `31913688438`, success |
| W33 | `GE.07 / F79` | `58/15/17/73/11` | `5fa072c84e69687491a21d0e6f975d7b9da3fd44` — CI `31916781563` + transversal `31916781644`, success |
| W34 | `GE.08 / F80` | `59/15/16/74/11` | `da00831f80f38550835501a45e0374ee526d316f` — CI `31918571578` + transversal `31918570753`, success |

---

## 5. W34 — GE.08 / F80 — O Plano Cartesiano — fechamento

Pré-requisitos: `GE.05 + N1.12`.  
Primitiva canônica: `ShapeCanvas#grade`.  
Realização: `PlanoCartesianoStage` / `plano-cartesiano-f80`.

Contrato canônico:

1. ler ponto;
2. colocar ponto;
3. percorrer caminho entre pontos;
4. completar/desenhar figura por coordenadas;
5. reconhecer padrão em pontos alinhados.

Regra visual: **primeiro anda no x, depois sobe no y**.  
Diagnósticos: `INVERTE_XY`, `IGNORA_ORIGEM`, `CONTA_MARCAS`.  
Domínio: **3/3 em 2 sessões**.  
Exposição motora alta: snap generoso + alternativa por toque; erro motor não vira misconception conceitual.

### 5.1 Regression-first

SHA `2da66a0a2d7552610a9129f01d585082f1a7c060`:

- CI `31917269091`: **completed/failure**;
- transversal `31917269087`: **completed/success**;
- Gates `95091180378`: failure exatamente nos 2 testes desenhados — GE.08 ainda não registrada e ativação rejeitada antes de `COMPOSER_FICHAS`.

### 5.2 Materialização inativa

SHA `0fb800ac64ca3598d39e6513ae3f213e7938c03d`:

- GE.08 registrada/renderizável/mapeada, ainda fora do canário;
- runtime map já contém `ShapeCanvas#grade → PlanoCartesianoStage`;
- CI `31917798514`: **completed/success**, attempt 1;
- transversal `31917798507`: **completed/success**, attempt 1, 9/9 jobs success;
- Gates `95092529668`: success.

Esse é o portão inativo válido da W34.

### 5.3 Promoção atômica e falha real do observador

SHA `75211643cba6388d67aa5bb09e022f09710ae118`, filho direto do inativo, alterou **somente** os três arquivos governantes:

- GE.08 no canário;
- `W34-GE.08` no ledger;
- contrato Matrix esperado `59/15/16/74/11`.

O catálogo já observou 59 Composer ativos e 16 fallbacks, mas Gates `95094103205` falhou porque o observador da Matrix traduziu `plano-cartesiano-f80` apenas como `ShapeCanvas`, deixando de qualificar o modo `#grade`. Resultado observado naquele job: `59/15/16/74/12` e divergência falsa `GE.08: pede ShapeCanvas#grade → entrega ShapeCanvas`.

**Conclusões globais desse SHA:** CI `31918416662` terminou `cancelled`; transversal `31918416664` terminou `success`. Não chamar o workflow CI de `failure`: a falha é evidência do Gates, enquanto a conclusão global é `cancelled`.

### 5.4 Correção final e certificação

SHA final `da00831f80f38550835501a45e0374ee526d316f` adicionou **uma linha em um arquivo**, `coverage_matrix_core.ts`, qualificando `plano-cartesiano-f80 → ShapeCanvas#grade`, em paralelo aos precedentes F60/F78/F59.

Não mudou canário, ledger, baseline nem runtime físico.

Gates `95094560886`: **success**; Matrix real `59/15/16/74/11`; GE.08 `padrao-ouro`; suíte **221 arquivos / 3.123 testes**; build e guards verdes.

**Conclusões globais do SHA final:** CI `31918571578` + transversal `31918570753`, ambos `completed/success`.

**W34 fechada. Bloco W30–W34 fechado.**

---

## 6. Seleção fallback-first pós-W34

Restam **16 fallbacks**:

`AL.07, AL.08, GE.09, GE.10, GM.06, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

Bloqueados imediatamente:

- `AL.08` depende de `AL.07 + N7.02`;
- `N5.05` depende de `N5.04 + N6.04`.

Critério vinculante:

1. candidato só é elegível quando todos os prereqs estão servidos;
2. maximizar ganho imediato de desbloqueio;
3. empate → ordem causal executável da Matrix/DAG (`causalWave` crescente, depois maior impacto downstream, depois ID);
4. empate residual → menor delta estrutural / continuidade local.

No estado pós-W34, o primeiro elegível pela ordem causal é:

**W35 = `GM.06 / F62 — Horas e Minutos`**

- prereqs do grafo: `GM.04 + AL.03`;
- primitivas canônicas: `Relogio + NumberLine`;
- `causalWave=7`;
- F62 é “a continuação do relógio”; a ponte explícita é contar minutos por saltos de 5.

**Não pule diretamente para materialização.** Reancore F62 integralmente e abra W35 por regression-first nominal.

---

## 7. Branches de rascunho / dívida de limpeza

As branches abaixo são **descartáveis, não são linha viva e nunca devem ser mergeadas**:

- `codex/w24-dominio-inteiros`
- `codex/w31-promotion-staging`
- `codex/w33-promotion-staging`
- `codex/w33-docs-staging`
- `codex/w33-promotion-canonical-staging`
- `codex/w34-inactive-staging`
- `codex/w34-promotion-staging`

O conector atual não expõe remoção de branch/ref. **Apagar essas sete branches quando houver mecanismo de remoção.** Até lá, ignorá-las como fonte de verdade.

Não classificar a branch `claude/w24-canary-contract-negative-j4kt89` como descartável por inferência: ela contém commits de origem já usados como referência e só deve ser removida por decisão explícita.

---

## 8. Design, cores e tipografia

A catraca de cores é vinculante:

- UI/ficha/palco novo usa papéis de `src/styles/tokens.ts`;
- não introduzir cor literal nova;
- não regenerar baseline para silenciar a catraca;
- se faltar papel semântico, ampliar tokens deliberadamente.

Fredoka e Nunito permanecem as famílias escolhidas.

**Tipografia local está resolvida e não deve ser reaberta.** A integração de `d1101e5db6147c50f3131996b1595005c9bf874b` trouxe quatro WOFF2 variáveis em `public/fonts/`, validação `wOF2`, exceção binária restrita a `public/fonts/*.woff2`, `src/index.css` sem Google Fonts e build servindo `dist/fonts/`.

Não trocar famílias e não reintroduzir dependência externa de Google Fonts.

---

## 9. Protocolo vinculante de cada nova onda

### 9.1 Reancoragem

Antes de editar: PR/HEAD, Matrix, DAG, ficha canônica, runtime, mapa físico e precedentes.

### 9.2 Regression-first

Criar teste nominal do nó ainda não materializado. A falha precisa ser a ausência esperada de registro/ativação/contrato — não um teste frouxo inventado para falhar.

### 9.3 Classificação de CI

Registrar separadamente:

- conclusão global de cada workflow;
- evidência de Gates/job/log;
- falha regression-first vs falha real de implementação.

### 9.4 Materialização inativa

Criar ficha runtime, contrato/builder, palco, catálogo, renderer e wiring necessários **sem ativar canário**.

### 9.5 Runtime map antes da promoção

Se houver novo kind, specialized builder, renderer, modo ou palco composto, registrar a cadeia física em `ficha_runtime_map.cjs` ainda inativa. Nunca adiar essa lacuna para depois da ativação.

### 9.6 Auditoria pedagógica

Comparar implementação com a ficha canônica integral, níveis 1–5, tags, domínio, onboarding, exposição motora e resolução. CI estrutural verde não prova fidelidade pedagógica.

### 9.7 Gates determinísticos

Auditorias, TypeScript, suíte, build, guarda textual/binária e Matrix devem permanecer estritos. Não relaxar expectativa para ficar verde.

### 9.8 Portão inativo exato

**A promoção só é autorizada quando CI + Certificação transversal do MESMO SHA inativo estão ambos `completed/success`.** Consultar a API do SHA exato antes de dizer “aguardando”.

### 9.9 Promoção atômica

Canário + ledger nominal + contrato Matrix no mesmo SHA. Depois:

1. deixar a Matrix observar o delta real;
2. investigar qualquer diferença antes de ajustar expectativa;
3. certificar CI + transversal do SHA final;
4. só então fechar checkpoint, porta de retomada e corpo do PR.

---

## 10. Autonomia e restrições

Pode agir autonomamente dentro deste protocolo: investigar, testar, corrigir e avançar ondas sem pedir confirmação a cada passo.

Não pode:

- tocar/mergear `main`;
- marcar PR #35 ready;
- habilitar auto-merge;
- tocar Creature Engine/Tamagotchi;
- mergear branches de staging/rascunho;
- relaxar testes, Matrix, auditorias ou sondas;
- inventar recibos;
- introduzir cores literais sem decisão semântica;
- ampliar a exceção de binários além de `public/fonts/*.woff2`;
- reabrir tipografia já resolvida.

---

## 11. Próximo passo em uma nova retomada

1. reancorar o PR #35 no remoto;
2. confirmar que o estado documental pós-W34 continua coerente com Matrix/canário vivos;
3. confirmar W35 por Matrix/DAG no estado atual;
4. ler F62 integralmente;
5. abrir **W35 GM.06/F62 por regression-first**;
6. seguir §§9.1–9.9 sem pular o runtime map inativo nem os dois workflows exatos.
