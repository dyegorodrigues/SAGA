# Decisão P17 — parte-todo como uma competência com múltiplas representações

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Estado:** **RESOLVIDA E REVALIDADA**

## 1. Problema que precisava ser resolvido

`N1.10` é o nó canônico **Parte-todo (number bonds)**. O repositório tinha duas linguagens para a mesma estrutura matemática:

- **JD5 — Ver e imaginar:** grupo concreto/perceptual, uma parte é escondida, a criança mantém o todo e infere a parte oculta;
- **`bond`/parte-parte-todo:** formalização explícita da mesma relação.

Ativar somente a JD5 apagaria a formalização simbólica. Manter somente o `bond` faria o oposto: apresentaria uma representação abstrata antes de a relação parte-todo estar construída mentalmente.

`N1.11` tinha a tensão paralela:

- **JD3 — Moldura Relâmpago:** percebe o vazio/complemento sem contar;
- **F28 — Amigos do 10:** formaliza essa relação em `number bond` e, depois, em sentença numérica.

## 2. Alternativas consideradas

### A. Criar nós separados para cada representação — rejeitada

Duplicaria a mesma competência matemática e obrigaria a reescrever arestas do DAG. `N1.10` já destrava `N1.11`, `N3.01`, `N3.05` e `N3.07`; dividir o conceito em nós artificiais criaria currículo paralelo e migração desnecessária de saves.

### B. Criar subníveis persistentes dentro de cada nó — rejeitada agora

É conceitualmente possível, mas exigiria migrar `Progress`, saves, seletor de níveis, unlock engine, Radar, resgates e relatórios para resolver duas competências. O custo sistêmico é desproporcional e criaria risco onde o modelo atual de cinco níveis já suporta a transição.

### C. Um nó, progressão representacional na Jornada + automaticidade completa no Jardim — **escolhida**

É o mesmo padrão arquitetural já legitimado por `N1.08` (`JD2 + F02`):

- a **Jornada** instala a sequência conceitual necessária;
- o **Jardim do Dojo** preserva a trilha perceptual completa para automaticidade;
- as trilhas `JD*` **não entram no grafo** e não viram competências concorrentes.

## 3. Arquitetura final de N1.10

A Jornada agora segue:

1. **L1 — JD5:** esconde 1 com total ancorado por contagem;
2. **L2 — JD5:** esconde 1–2;
3. **L3 — JD5:** sem contagem em voz alta;
4. **L4 — retirada de andaime:** alterna o degrau JD5 com moldura e o degrau com objetos realmente soltos;
5. **L5 — NumberBond:** formaliza a mesma relação todo = parte + parte.

### Gate que fechou a micro-lacuna do primeiro desenho

A primeira composição ainda permitiria chegar ao `bond` depois de provar escala >5, mas **sem necessariamente provar retirada da geometria da moldura**.

P17 v2 criou:

- `Evidencia.SEM_MOLDURA`;
- `dominio.gateAntesDeAvancar` como contrato genérico;
- `Question.gateEvidenceBeforeAdvance`;
- suporte no `progressEngine` para impedir `level-up` enquanto a evidência-gate não foi observada;
- `source_level/source_level_alt` no contrato da moldura para fazer fade explícito de andaime;
- renderização real dos objetos soltos no `TenFrame`/palco, em vez de apenas esconder a borda.

Assim, **L5 só abre depois de um acerto real sem moldura**. A evidência `TOTAL_ALEM_DE_CINCO` continua independente e necessária para a maestria da ficha.

## 4. Arquitetura final de N1.11

A Jornada agora segue:

1. **L1–L2 — JD3:** percepção do vazio/complemento na moldura;
2. **L3 — F28 / NumberBond:** `10` vira explicitamente o todo;
3. **L4–L5 — F28 / símbolo:** transferência para `n + □ = 10`.

A JD3 completa permanece no Jardim do Dojo para automaticidade perceptual, inclusive o degrau de vazio disperso.

## 5. Domínio deixou de ser apenas texto da ficha

A auditoria descobriu uma lacuna sistêmica maior: fichas declaravam regras como `4/4 em 3 sessões`, mas o motor tinha um critério fixo antigo.

P17 tornou `dominio.acertos/de/sessoes` executável:

- `MasteryRule` viaja na `Question`;
- a janela de compreensão é por sessão;
- uma sessão posterior precisa amadurecer como a primeira;
- sessões de retenção precisam estar espaçadas;
- defaults antigos continuam compatíveis para fichas sem regra explícita;
- `rt_alvo` continua telemetria/automaticidade e **não reprova compreensão na Jornada**.

N1.10 usa `3/3 em 2 sessões`; F28 em N1.11 usa `4/4 em 3 sessões`.

## 6. O grafo não foi alterado

O DAG canônico permanece:

- `N1.10` prereqs: `N1.04`, `N1.08`;
- `N1.11` prereqs: `N1.08`, `N1.10`;
- dependentes existentes continuam apontando para os mesmos IDs.

`JD3` e `JD5` são trilhas de treino, **não nós do grafo**.

Isso evita:

- currículo paralelo;
- desbloqueios duplicados;
- migração de saves;
- duas coroas para a mesma estrutura matemática.

## 7. QA e visual

Foram executados:

- auditoria do catálogo;
- auditoria das fichas;
- `grafo:check`;
- TypeScript;
- testes focais P17;
- suíte completa;
- build;
- Chromium real;
- sonda de `N1.10`, `N1.11`, `JD3` e `JD5`;
- screenshots em 320/390/900.

### Regra de leitura dos screenshots

O ZIP de QA **não é mockup final do produto**. Ele contém deliberadamente:

- cenas `rollback` do legado;
- fases intermediárias (`mostrando`, `vazio`, `tampando`, `perguntando`);
- novas representações autorais.

Logo, uma cena com aparência antiga dentro do ZIP pode ser **prova de rollback**, não regressão do canário.

A pedagogia/layout dos manipulativos foi validada; a direção visual premium final do SAGA continua sendo uma camada separada de produto/UI.

## 8. Ativação e revalidação

A primeira promoção foi interrompida deliberadamente quando o P17 v2 encontrou a micro-lacuna da retirada de andaime. Os dois IDs saíram novamente da lista ativa até o gate ficar implementado.

Depois do gate real:

- **N1.10 revalidada:** `37595c73795b45c9e16075749bae51690c5d77ac` — CI normal completa verde;
- **N1.11 revalidada sobre N1.10 ativa:** `ab5b3b613a3226076b1d967a48cc99ba6c8b50c9` — CI normal completa verde.

Os dois voltaram a `composerCanaryIds.ts` em commits separados.

## 9. Invariantes permanentes que saem da P17

1. **Representação nova não pode apagar representação anterior necessária.**
2. **Troca de linguagem exige ponte observável**, não apenas mudança de componente no nível seguinte.
3. **Retirada de andaime pode ser um gate de progressão**, quando o próximo nível depende dela.
4. **Domínio declarado pela ficha precisa ser domínio executado pelo motor.**
5. **Trilha de automaticidade não vira nó curricular só porque tem cinco níveis.**
6. **Sonda de QA não é aprovação de direção visual final.**

**Promoção tecnicamente possível não basta; a cadeia representacional inteira precisa estar demonstrada.**
