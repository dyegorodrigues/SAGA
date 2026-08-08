# Decisão P17 — N1.10 não pode perder a forma simbólica ao ganhar a JD5

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Estado:** promoção BLOQUEADA até fechar a segunda representação

## 1. O conflito real

`N1.10` é o nó canônico **Parte-todo (number bonds)**, faixa F1.

Hoje ele possui duas coisas diferentes no repositório:

1. **JD5 — Ver e imaginar**, ficha TypeScript atual de `N1.10`:
   - pré-simbólica;
   - total conhecido por contagem/estrutura;
   - uma parte é escondida;
   - a criança mantém o total na cabeça e infere a parte oculta;
   - níveis usam `moldura`, sem escrever conta.
2. **rollback legado `gN1_10` / `legadoN1_10`**:
   - numérico/simbólico;
   - pergunta do tipo `Separei 2. Quantos ficaram do outro lado?`;
   - `Question.kind = takeapart`;
   - hoje é a única forma explícita/simbólica da relação parte-todo servida pelo nó.

Promover a JD5 agora faria o mecanismo de canário funcionar tecnicamente — rollback está definido —, mas a produção deixaria de servir a forma simbólica F1. Isso é regressão curricular, não simples troca de UI.

## 2. A ficha F1 separada não existe

`FICHAS_F1_COMPLETAS.md` lista N1.10 entre as competências já escritas no bloco F0; não contém outra ficha N1.10.

O plano F0 já registrava a dívida P17: o `bond` simbólico continua só no legado e ativar JD5 deixaria N1.10 sem essa representação até existir ficha F1.

## 3. O grafo mostra que não é seguro improvisar outro nó

N1.10 depende de N1.04 e N1.08 e destrava N1.11, N3.01, N3.05 e N3.07.

A relação escondido/visível/total da JD5 e o diagrama `bond` representam a **mesma estrutura matemática** em graus diferentes de formalização. Separar em dois nós sem necessidade criaria duas competências concorrentes para o mesmo conceito e exigiria reescrever várias arestas.

## 4. Evidência pedagógica usada na decisão

Referências consultadas:

- NCETM — *Composition*: jogos de esconder objetos são atividade central para number bonds e compreensão part–whole.
- NCETM — *Representation and Structure*: o diagrama part–part–whole é abstrato demais para ser a primeira representação; deve nascer de contexto concreto e depois formalizar a estrutura.
- Maths — No Problem! — *Making Sense of Number Bonds*: progressão CPA de objetos concretos → agrupamentos/representações → number-bond diagram.

Leitura para o SAGA:

> JD5 não concorre com o `bond`; JD5 instala a estrutura mental que o `bond` formaliza depois.

## 5. Decisão arquitetural

**Manter um único nó N1.10 com duas fontes/fichas, no padrão já usado por N1.08.**

N1.08 já prova que uma competência pode combinar duas fichas com linguagens diferentes (`JD2` + `F02`) e fazer a transição de representação dentro da própria escada.

Para N1.10, a solução desejada é:

1. preservar JD5 como fase pré-simbólica;
2. escrever uma ficha F1 explícita para a representação `bond`/parte-parte-todo;
3. ligar as duas fontes a N1.10 com progressão declarada, sem esconder a troca;
4. somente então promover N1.10.

## 6. O `bond` atual é infraestrutura, não contrato pronto

Já existem:

- builder `case "bond"` no Composer;
- componente `NumberBond`;
- renderer.

Mas faltam para uma ficha F1 de verdade:

- escada pedagógica canônica;
- tutorial que transforme objetos escondidos no diagrama;
- diagnóstico específico da estrutura parte-todo;
- critérios de domínio/evidência;
- QA visual nos cinco níveis;
- decisão explícita de quando aparecem números/`?` e quando aparecem sentenças numéricas.

Não usar o legado como se ele fosse automaticamente essa ficha.

## 7. Próximo passo

Antes de implementar a ficha simbólica N1.10 isoladamente, auditar N1.11.

N1.11 já possui outra tensão conhecida: **JD3 perceptual × F28 simbólica**. Se a estrutura for paralela, resolver N1.10 e N1.11 com um único padrão de “duas fichas/representações por competência”, reduzindo exceções no currículo e no Composer.

## 8. Regra de segurança

Até essa dívida ser paga:

- N1.10 permanece registrada em `COMPOSER_FICHAS`;
- N1.10 permanece **fora** de `composerCanaryIds.ts`;
- rollback `gN1_10` continua servindo a forma simbólica existente;
- não criar um novo nó apenas para contornar a ausência da ficha F1.

**Promoção tecnicamente possível não significa promoção curricularmente correta.**
