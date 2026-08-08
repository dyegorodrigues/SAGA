# Decisão P22 — dívidas curriculares deliberadas

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Pré-requisito:** P21 fechada e governança de fontes de verdade estabilizada.

## Estado da auditoria

A P22 foi aberta com inventário **read-only** dos cinco itens delimitados em `RETOMADA.md`.

Gate de inventário: run `31276442048` = **success**.  
Bancada temporária auto-removida em `f14089d9239f6fbe536fce4dd8bac354febdc04c`.

O inventário executou:

- matriz de proveniência atual;
- busca dos testes que citam os itens;
- sonda real de N4.09 e GM.12 em Chromium;
- `auditar`, `fichas:auditar`, `fichas:conferir`, `grafo:check` e TypeScript.

Nenhuma decisão abaixo altera a `main`, o Creature Engine ou a semântica do grafo por contagem.

---

## 1. N1.09 — manter o nó e construir a competência que falta

### Cânone

`N1.09` é **Contagem até 20 e a partir de qualquer número**.

Pré-requisitos canônicos:

- `N1.04` — contar/cardinalidade;
- `N1.02` — sequência oral.

Micros canônicos incluem:

1. contar objetos entre 10 e 15;
2. contar objetos entre 10 e 20;
3. continuar a sequência a partir de um ponto interno;
4. contagem regressiva 10→0.

A decisão histórica P12 já provou que esse significado não pode ser sequestrado por “produzir quantidade”: `N1.12`, `N2.01`, `N3.03` e `AL.03` dependem de N1.09 representar contagem além do dez. Por isso F04 virou `N1.13`.

### Runtime atual

- há gerador legado;
- não há ficha Markdown própria;
- não há ficha TS;
- não há registro Composer;
- não há canário.

O legado atual (`gVis_Sequence`) cobre apenas continuação de sequência. Ele **não** prova contagem de conjuntos 10–20 nem contagem regressiva.

### Decisão

**N1.09 permanece no grafo e deve ganhar ficha autoral própria + implementação TS completa.**

Não reutilizar F04/N1.13. Não declarar domínio de N1.09 a partir de uma tarefa que só pede “qual vem depois”.

A implementação deve reaproveitar gramáticas já ensinadas (`TouchCount`/sequência) sempre que fizer sentido e evitar criar primitiva nova sem necessidade.

---

## 2. GM.02 — manter Tempo cotidiano e substituir o legado insuficiente

### Cânone

`GM.02` é **Tempo cotidiano**:

- partes do dia;
- ontem/hoje/amanhã;
- dias da semana;
- ordenação de eventos.

Ele é semanticamente necessário porque `GM.04` — horas — parte dessa linguagem temporal.

A P15 já decidiu que F50 não podia ocupar GM.02: massa/capacidade ganhou nó próprio (`GM.12`).

### Runtime atual

- há gerador legado;
- não há ficha Markdown própria;
- não há ficha TS;
- não há registro Composer;
- não há canário.

O legado atual reduz o nó a “Manhã ou Noite?” e usa resposta fixa `morning`. Não representa a competência canônica.

### Decisão

**GM.02 permanece Tempo cotidiano e deve ganhar ficha autoral própria + implementação TS completa.**

A ficha precisa ser pensada para criança pré-leitora: tempo cotidiano não pode virar prova de leitura de palavras como “terça-feira”. Áudio, cenas/ordenação e iconografia devem carregar a linguagem; texto é apoio, não pré-requisito escondido.

---

## 3. N1.07 ↔ JD4 — primeiro compreensão completa, depois automaticidade

### Cânone de N1.07

`N1.07` é **Ordem, sucessor e antecessor até 10**.

O grafo exige:

- sucessor;
- antecessor;
- ordenação de numerais.

### Runtime atual

N1.07 já está:

- registrado no Composer;
- ativo;
- com rollback legado real.

Porém a ficha TS corrente cobre essencialmente **+1 / “qual vem depois?”**. Não há micro equivalente completo para antecessor e ordenação. O diagnóstico `fichas:conferir` também mostra que o cânone JD4 declara `AudioChoice + NumberLine`, enquanto a amostra servida entrega só `NumberLine`.

Há ainda deriva estrutural a reconciliar: o grafo canônico usa `N1.02 + N1.06` como pré-requisitos, enquanto a ficha TS corrente declara `N1.04 + N1.06`.

### Cânone de JD4

JD4 é **Próximo Passo**, uma trilha de automaticidade ligada a N1.07 — não um novo nó do grafo.

Sua progressão autoral é:

- L1 sucessor 1–5 com reta;
- L2 sucessor 1–10;
- L3 sucessor 1–20, reta só após erro;
- L4 antecessor 2–10;
- L5 alternância sucessor/antecessor 1–20, áudio, meta ~3 s.

### Decisão

**Não adicionar JD4 ao Jardim antes de fechar a Jornada N1.07.**

Sequência correta:

1. reconciliar pré-requisitos de N1.07 com o grafo;
2. completar a ficha da Jornada para ensinar sucessor + antecessor + ordenação;
3. validar a Jornada como compreensão;
4. só então criar/registrar JD4 como automaticidade da competência-mãe N1.07.

O Jardim não pode compensar uma lacuna conceitual da Jornada. Automaticidade treina o que já foi compreendido.

---

## 4. N4.09 — promoção autorizada em lote próprio

### Cânone

F68 / N4.09 ensina multiplicação de dois dígitos pelo modelo de área:

- decomposição;
- regiões parciais;
- ligação ao algoritmo;
- quatro regiões em 2 dígitos × 2 dígitos;
- retirada do modelo no nível final.

### Runtime atual

- ficha TS completa;
- registrada em `COMPOSER_FICHAS`;
- ainda inativa;
- sem legado explícito: desligada, cai em placeholder;
- contrato de área possui guards contra revelar a resposta;
- nível 4 mantém algoritmo apenas na microaula (`algoritmoSoNaAula`), resolvendo o antigo risco de sobrecarga “quatro regiões + algoritmo” durante a resposta.

### Evidência atual

Sonda P22:

- 390 px: 40/40 tomadas;
- 320 px: 5/5;
- 900 px: 5/5;
- níveis 1, 3, 4, 5 + microaula;
- zero vazamento, colisão ou texto invisível/coberto.

`areaContract.test.ts` também protege:

- nenhuma região/linha entrega o total;
- parcelas espelham o retângulo;
- segunda linha representa `×10`, não `×1`;
- retirada gradual do apoio.

### Decisão

**Promover N4.09 em lote mínimo e reversível.**

A promoção deve:

- adicionar somente o ID à lista declarativa de canários;
- registrar N4.09 no contrato genérico de canário, pois ele ainda não está em `REGISTRO`;
- rodar contrato de canário, testes de área, sonda N4.09 e gates completos;
- provar rollback para placeholder, pois é uma estreia, não substituição.

---

## 5. GM.12 — promoção autorizada em lote próprio

### Cânone

F50 / GM.12 ensina comparação e conservação de massa/capacidade **antes de unidades**:

- peso evidente;
- capacidade com recipientes iguais;
- conservação com formatos diferentes;
- caso contraintuitivo;
- seriação.

Pré-requisito: `GM.01`.

### Runtime atual

- ficha TS completa;
- registrada em `COMPOSER_FICHAS`;
- já registrada no contrato genérico de canário;
- ainda inativa;
- sem legado explícito: desligada, cai em placeholder;
- `MedidasStage` implementa balança, recipientes, verificação, seriação, diagnósticos e evidências.

`GM.12.test.ts` prova, entre outros pontos:

- L1 ensina a linguagem da balança antes de cobrá-la;
- L2 ensina capacidade e aciona verificação com recipientes iguais;
- L3 não herda fala de balança na cena de recipientes.

### Evidência atual

Sonda P22:

- 390 px: 40/40 tomadas;
- 320 px: 5/5;
- 900 px: 5/5;
- cinco níveis;
- zero vazamento, colisão ou texto invisível/coberto.

### Decisão

**Promover GM.12 em lote mínimo e reversível.**

Como já está no contrato de canário, a mudança funcional esperada é apenas adicionar `"GM.12"` a `DEFAULT_COMPOSER_CANARY_IDS`, seguida dos gates completos e sonda focal.

---

## 6. Ordem de execução P22

Para minimizar risco e separar naturezas de mudança:

1. **P22.1 — GM.12:** promoção mínima de estreia já pronta;
2. **P22.2 — N4.09:** promoção mínima + inclusão no contrato genérico;
3. **P22.3 — N1.07/JD4:** corrigir compreensão da Jornada antes da automaticidade;
4. **P22.4 — N1.09:** nova ficha/TS completa, sem sequestrar N1.13;
5. **P22.5 — GM.02:** nova ficha/TS de Tempo cotidiano, pré-leitora.

Cada lote deve ter commit funcional próprio, gate transacional e checkpoint. Não juntar as cinco decisões em uma ativação única.

## 7. Regra de fechamento

P22 só termina quando:

- N1.09 e GM.02 deixarem de ser lacunas autorais sem reduzir o cânone;
- N1.07 ensinar o conceito inteiro e JD4 estiver corretamente separado como automaticidade;
- N4.09 e GM.12 estiverem explicitamente promovidas ou, se algum gate revelar regressão, explicitamente mantidas inativas com causa nova documentada;
- todos os auditores, testes, sondas afetadas, TypeScript, build e guards estiverem verdes.

> **Promoção não é prêmio por existir código. É a consequência de uma cadeia de evidência completa e reversível.**
