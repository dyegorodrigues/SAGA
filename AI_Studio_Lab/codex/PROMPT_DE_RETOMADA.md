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

## 4. Estado curricular vivo pós-W35

Ondas **W1–W35 fechadas**.

Coverage Matrix observada após a promoção final da W35:

- **60 Composer**
- **15 legado**
- **15 fallback**
- **75 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Canário ativo: **60 competências**.

### Últimos recibos técnicos

| Onda | Competência / ficha | Matrix após fechamento | Recibo técnico final |
|---|---|---|---|
| W31 | `PE.03 / F83` | `56/15/19/71/11` | `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd` — CI `31908549456` + transversal `31908549471`, success |
| W32 | `GM.09 / F82` | `57/15/18/72/11` | `40ef8eb13cd93d1a0b2e60375964853e62118e24` — CI `31913688446` + transversal `31913688438`, success |
| W33 | `GE.07 / F79` | `58/15/17/73/11` | `5fa072c84e69687491a21d0e6f975d7b9da3fd44` — CI `31916781563` + transversal `31916781644`, success |
| W34 | `GE.08 / F80` | `59/15/16/74/11` | `da00831f80f38550835501a45e0374ee526d316f` — CI `31918571578` + transversal `31918570753`, success |
| W35 | `GM.06 / F62` | `60/15/15/75/11` | `c7d21d50eb85939e190f29c3a3dbabc17bed4cd8` — CI `31934324465` + transversal `31934324470`, success |

---

## 5. W35 — GM.06 / F62 — Horas e Minutos — fechamento

Pré-requisitos: `GM.04 + AL.03`.  
Primitivas canônicas: `Relogio + NumberLine`.  
Realização: `HorasMinutosStage` / `horas-minutos-f62`.

Contrato canônico materializado:

1. meia hora e quartos;
2. minutos de 5 em 5 com numeração fantasma;
3. minutos de 5 em 5 sem apoio;
4. minuto a minuto;
5. duração entre horários, contando primeiro horas inteiras e depois minutos.

Diagnósticos: `MINUTO_COMO_NUMERO`, `IGNORA_HORA_NA_DURACAO`, `SUBTRAI_DECIMAL`.  
Domínio: **3/3 em 2 sessões**.

### 5.1 Regression-first

SHA `93b5e28cf7a65fad03ade3dfc6db22c9a1d24a7b`: teste nominal nasceu antes do registro de GM.06 e falhou por desenho.

### 5.2 Materialização inativa inicial

SHA `779f40349328728b92a9a4969537ed4982625e8e`:

- GM.06 registrada/renderizável/mapeada, fora do canário;
- runtime map com as duas primitivas físicas;
- CI `31932785122`: `completed/success`;
- transversal `31932785057`: `completed/success`.

### 5.3 Falha real de promoção — onboarding

A primeira promoção `7d7689aceb459cdf4b62c816c69723990b7e89f8` alterou somente os três governantes, mas o `visualOnboardingGate` encontrou dívida real: `GM.06.ts` declarava `params.tutorial` como objeto, enquanto o contrato canônico reconhece array de passos.

A Matrix/baseline **não foram relaxados**. Foi feito forward rollback em `917e68f209a69dd08b6b9b57796d9335dec51435`, restaurando os três governantes ao estado inativo sem reescrever histórico.

### 5.4 Reparo inativo e promoção final

SHA inativo reparado `c30f6d291ac70d8cb0054d2da96dde7b44d003b1` trocou somente a ficha GM.06 para `tutorial: [...]` com passos `fala/show`, mantendo o canário desligado.

- CI `31933937338`: `completed/success`;
- transversal `31933937332`: `completed/success`;
- o gate que detectara a dívida passou sem allowlist ou mascaramento.

Promoção final: `c7d21d50eb85939e190f29c3a3dbabc17bed4cd8`, novamente só com os três governantes.

- CI `31934324465`: `completed/success`;
- transversal `31934324470`: `completed/success`;
- Matrix: `60/15/15/75/11`.

**W35 fechada.**

---

## 6. Seleção fallback-first pós-W35

Restam **15 fallbacks**:

`AL.07, AL.08, GE.09, GE.10, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

Critério vinculante:

1. candidato só é elegível quando todos os prereqs estão servidos;
2. maximizar ganho imediato de desbloqueio;
3. empate → ordem causal executável da Matrix/DAG (`causalWave` crescente, depois maior impacto downstream, depois ID);
4. empate residual → menor delta estrutural / continuidade local.

Próximas três seleções calculadas no estado pós-W35:

1. **W36 = `GM.10 / F93 — Conversão de Unidades`** — prereqs `GM.05 + N2.04`, primitivas `NumberLine + Balanca`;
2. **W37 = `N7.02 / F85 — Operar com Negativos`** — prereqs `N7.01 + N3.13`, primitiva `InteractiveNumberLine`;
3. **W38 = `AL.07 / F89 — A Linguagem das Letras`** — prereqs `AL.06 + AL.04`, primitivas `SingaporeBars + plain`; servir N7.02 também deixa `AL.08` mais próximo do desbloqueio total.

W39 previsto pela ordem causal após o recálculo: **`N2.07 / F66 — A Fábrica de Retângulos`**, prereqs `N4.02 + N2.06`, primitiva `ArrayGrid`.

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
- `codex/blob-stage-w35`

O conector atual não expõe remoção de branch/ref. Apagar essas branches quando houver mecanismo de remoção. Até lá, ignorá-las como fonte de verdade.

Não classificar `claude/w24-canary-contract-negative-j4kt89` como descartável por inferência: ela contém commits de origem já usados como referência e só deve ser removida por decisão explícita.

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

Registrar separadamente conclusão global de cada workflow, evidência de Gates/job/log e falha regression-first vs falha real de implementação.

### 9.4 Materialização inativa

Criar ficha runtime, contrato/builder, palco, catálogo, renderer e wiring necessários **sem ativar canário**.

### 9.5 Runtime map antes da promoção

Se houver novo kind, specialized builder, renderer, modo ou palco composto, registrar a cadeia física em `ficha_runtime_map.cjs` ainda inativa. Nunca adiar essa lacuna para depois da ativação.

### 9.6 Auditoria pedagógica

Comparar implementação com a ficha canônica integral, níveis 1–5, tags, domínio, onboarding, exposição motora e resolução. CI estrutural verde não prova fidelidade pedagógica.

### 9.7 Gates determinísticos

Auditorias, TypeScript, suíte, build, guarda textual/binária e Matrix devem permanecer estritos. Não relaxar expectativa para ficar verde.

### 9.8 Portão inativo exato

**A promoção só é autorizada quando CI + Certificação transversal do MESMO SHA inativo estão ambos `completed/success`.** Consultar a API do SHA exato e, se ambos já estiverem verdes, executar imediatamente sem pedir confirmação.

### 9.9 Promoção atômica

Canário + ledger nominal + contrato Matrix no mesmo SHA. Depois:

1. deixar a Matrix observar o delta real;
2. investigar qualquer diferença antes de ajustar expectativa;
3. certificar CI + transversal do SHA final;
4. só então fechar checkpoint/porta/corpo do PR.

### 9.10 Cadência W35+

- Não reportar a cada onda; reportar somente a cada **5 ondas**, salvo parada real comprovada.
- Fechamento documental da onda N e regression-first da onda N+1 entram no **mesmo push**.
- O SHA regression-first é vermelho por desenho e não substitui o recibo técnico final da onda N.
- Em cada recálculo, calcular as **três próximas seleções** de uma vez pelo critério determinístico.
- A serialização obrigatória que permanece é: materialização inativa → dois workflows verdes → promoção atômica → Matrix honesta → dois workflows finais verdes.

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
2. confirmar que W35 continua fechada em `60/15/15/75/11` e 60 canários;
3. confirmar o estado do regression-first W36 no HEAD atual;
4. reancorar F93/GM.10 integralmente;
5. seguir §§9.1–9.10 sem pular runtime map, portão inativo ou promoção atômica;
6. continuar o bloco até W39 e só então emitir relatório de bloco, salvo parada real comprovada.
