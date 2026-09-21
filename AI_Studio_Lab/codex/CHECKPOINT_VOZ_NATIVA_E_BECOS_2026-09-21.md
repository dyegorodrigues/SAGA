# Checkpoint — a voz nativa e dois becos sem saída

Sessão de 21/09/2026. Branch `claude/gate-b-class-007-witnesses-q5i062`.
`main` e o PR #35 não foram tocados.

O pedido que abriu a sessão foi do dono, e vale transcrito porque é o critério
de tudo o que está abaixo:

> "Vai, fazendo, vai vendo exercício por exercício, como se eu estivesse
> começando do zero. (...) O áudio eu não consegui testar ali através do link,
> né? não dá nem para saber. (...) Meus filhos não conseguiram usar, não tem
> nem sentido."

---

## 1. A auditoria estava cega — e por quê

`src/curriculum/todaCriancaConsegueJogar.test.tsx` varre as noventa
competências nos cinco níveis e cobra o mínimo para uma criança conseguir
jogar. Ela passava, e passava errado.

Para simular "o app concedeu nova tentativa", o teste rerenderizava com uma
`key` nova no **renderizador inteiro**. Chave nova no topo remonta a árvore
toda, inclusive o palco — e remontar o palco é justamente o que cura o beco.
O teste curava sozinho o defeito que devia medir, por um caminho que o app não
percorre: no app o renderizador continua montado e só `hiddenOpts` muda.

Prova de que estava cega: apagar a remontagem de dentro do renderizador
(`chaveDaTentativa` devolvendo constante) não quebrava nada.

**Correção.** O teste agora toca, COLHE a resposta que o palco emitiu (valor e
meta, pelo `handlePick` de verdade) e pergunta à política real do app — os
mesmos `isMotorSlip`, `ownsAuthorialRetry` e `isRetryableAnswer` que o
`GameLoop` chama — o que aconteceria a seguir. Sem allowlist: a decisão sai de
`answerPolicy`, não de uma lista escrita no teste. E deixou de exigir que o
palco reabra quando a criança ACERTOU, que era cobrar um defeito.

Com a vista de volta, dois becos apareceram.

### N3.03 — "toque na próxima casa da reta", e não havia casa

A criança escolhe começar pelo número maior, acerta, e o palco pede que toque
na próxima casa da reta. Depois disso **a reta é a única coisa na tela** — e as
casas eram `<div onClick>`: sem papel, sem nome, sem foco. Para qualquer
varredura, e para qualquer leitor de tela, aquela tela estava vazia. Três
níveis da N3.03 terminavam ali.

`NumberLine` passa a desenhar cada casa como `<button>` com nome ("Número 7 na
reta") quando há `onValueClick`, e a manter `<div>` quando a reta é ilustração
— botão que não faz nada é pior que nenhum.

### AL.01 nível 5 — errar o critério apagava as três alternativas

"Por que estas estão juntas?" oferece três critérios. Ao primeiro toque as TRÊS
ficavam desabilitadas para sempre. Errando, o app fazia o de sempre: escondia a
errada, dizia "Olha de novo!" e devolvia a vez — para uma tela em que nada
respondia. Medido em todos os erros possíveis do nível, não num caso.

Quem decide que a questão acabou é o app, pelo `disabled`. Enquanto for falso a
pergunta continua aberta, e a alternativa volta a responder depois de 1,4 s —
pausa para a criança ver qual foi o seu toque. De quebra, o erro não pinta mais
de verde a alternativa CERTA: entregava a resposta um instante antes de pedir
que tentasse de novo.

### Correção de medição: a guarda do TenFrame

O comentário afirmava dez exercícios mortos na mão da criança. **Falso.** N3.07
e N3.08 têm construtor especializado, e `selectGenerator` serve o construtor —
pela porta do app nascem `fazer-dez-f33` e `voltar-pelo-dez-f34`. Varridas as
90 competências × 5 níveis × 12 sorteios, nenhuma serve `tenframe` com
`moldura` numérica. Quem alcançava o estouro era uma sonda chamando o
`Composer` direto, porta que o app não usa. A guarda ficou (o chamador é um
`spread` genérico), o texto passou a dizer a verdade.

---

## 2. A voz nativa

### O que estava errado

O app falava só pelo `speechSynthesis` do aparelho. Medido no Chromium do build
de produção: `speechSynthesis.getVoices()` devolve **zero** vozes. O app chamava
a fala, a fala não acontecia, e ninguém ficava sabendo — `speak()` não reclama.

Para a criança de quatro a sete anos, que não lê, isso não é "sem áudio": o
enunciado só existe em voz. Sem voz o exercício não fica difícil, fica
impossível, e o app registra como erro de matemática.

### O que existe agora

| peça | o quê |
|---|---|
| `scripts/gerar-vozes.ts` | Kokoro-82M (Apache-2.0) + espeak-ng pt-br + voz `pf_dora`, saída AAC mono 24 kbps |
| `public/vozes/` | 1606 falas, 16,4 MB, versionadas |
| `src/audio/corpus-da-voz.json` | o que gravar — **medido**, não escrito à mão |
| `src/audio/chaveDaFala.ts` | normalização e hash, um só módulo para gerador e navegador |
| `src/audio/vozNativa.ts` | índice, caminho, e "pacote ausente = pacote vazio" |
| `src/components/AudioPlayer.tsx` | toca o arquivo; cai para o aparelho quando não há |
| `scripts/conferir-vozes.ts` | ouve o pacote por reconhecimento de fala |
| `scripts/sonda-voz.mjs` | prova no navegador que a voz sai |

### Três coisas que só apareceram medindo

1. **Fonemização.** O espeak-ng 1.51 escreve o /i/ final átono como `y` e o /a/
   final átono como `æ`. O Kokoro lê com som de inglês: "sete" virava "satu".
   Duas correções (`y`→`i`, `æ`→`ɐ`) resolvem.

2. **Uma amostra não é medição.** Houve uma terceira correção, `lj`→`ʎ`, feita
   porque "olha" voltava "óleo". Medida depois em oito frases com "lh", perdeu
   em duas e não ganhou em nenhuma — o "óleo" era do `æ`, não do `lj`. Foi
   **retirada**, e o erro está registrado no código, não apagado.

3. **A narração vinha colada.** Primeira montagem: índice baixado, pacote
   carregado, **nenhum áudio tocado**. O `qSpeech` do GameLoop junta enunciado,
   som-alvo e "como faz" com " ... " no meio, e a junção é combinatória: nunca
   estaria no pacote. Agora o `AudioPlayer` fala pedaço por pedaço.

### Recibo no navegador

`node scripts/sonda-voz.mjs` contra o build de produção:

```
índice pedido: 200
clipes pedidos: 3 → 206, 206, 206
nenhum recusado
A VOZ SAI: o app buscou o índice e tocou áudio do pacote.
```

Os clipes tocados foram "Conte os dinossauros. Toque em cada um!" e "Toque um
de cada vez. Quando tocar, fale o número comigo." — num navegador com zero
vozes instaladas.

### Recibo por reconhecimento de fala, e o que ele NÃO diz

`npm run vozes:conferir` numa amostra de 200: **63% das frases transcrevem de
volta idênticas.** O número é um piso, não a qualidade: boa parte das
divergências é o ouvinte, não a voz —

- "Meça os dois objetos" volta "Messa os dois objetos" (é assim que se fala);
- "Arredonde" volta "A redom de" (o ASR reparte a palavra);
- "÷" volta "dividido por" (a voz leu certo, o ASR escreveu por extenso).

O que é limite real, e fica anotado como limite:

- **Palavra sozinha.** "oito", "seis", "um" isolados saem fracos. Dentro de
  frase ("É oito.") voltam certos — o modelo de 82 M sofre com a sequência
  curta. As falas de uma palavra ficam fora da conta e são relatadas à parte.
- **Monossílabo nasal.** "um" e "cem" erram mesmo com apoio de frase.
- **"Olha" em começo de frase** degrada; testados cinco tratamentos de ataque
  (vírgula, glotal, aspas, alongamento), **nenhum melhorou** e vários
  pioraram. Fica como está.

### A fronteira do pacote, escrita para não virar folclore

- **Toda fala sem número entra.** São as fixas — instrução, elogio, erro suave,
  aula. 861 delas.
- **Fala com número entra só se já estiver gravada.** Saturar a varredura
  levou de 745 para mais de cinco mil: seriam sessenta megabytes. As novas caem
  na voz do aparelho.
- **O arquivo único não leva o pacote.** Dezesseis megabytes em base64 viram
  vinte e o publicador recusa. Lá a voz do aparelho segue sendo o caminho.

---

## 3. Duas concordâncias que a criança OUVIA erradas

Achadas lendo o corpus colhido:

- **F61/GM.05**: "Quantas bolas iguais medem **o fita de treino**?", "a ponta
  **do fita de treino**... onde **ele** termina".
- **F59/GE.04**: "o que acontece com **o esfera** na rampa?"

Gênero é propriedade da palavra, então passou a morar no dado; os dois `Record`
fechados obrigam o compilador a cobrar o gênero de todo objeto ou sólido novo.
Portão em `concordanciaFalada.test.ts`, com prova de vida e mutação.

O enunciado do SAGA é falado para uma criança que está aprendendo a língua ao
mesmo tempo que a matemática. Ela ouve o erro e confia nele.

---

## 4. O que continua faltando

Sem mudança desde o checkpoint anterior, e repetido aqui porque continua
valendo:

1. **A conta Google nunca foi exercitada.** O progresso hoje é do APARELHO.
2. **As regras do Firestore não estão publicadas.**
3. **A arte dos mascotes nunca foi feita.**
4. **Nenhuma criança usou** (Gate J). Tudo o que se sabe vem de teste,
   simulação e sonda.

E o que esta sessão acrescenta à lista:

5. **A voz não foi ouvida por um humano.** Foi medida por reconhecimento de
   fala e provada no navegador, o que é muito mais do que havia — mas ninguém
   escutou os 1606 arquivos. A primeira pessoa a escutar vai achar coisa.
6. **Falas com número novas caem no aparelho.** É decisão de tamanho, não
   esquecimento; está no código.

## Lições

- **Um instrumento que cura o defeito que mede não mede nada.** A `key` no topo
  do renderizador fazia a varredura passar por um caminho que o app não tem.
  Mutação é o que descobre isso: se apagar a correção não quebra o teste, o
  teste não estava olhando.
- **Uma amostra não é medição.** O `lj`→`ʎ` passou por correção durante horas
  porque uma frase melhorou. Oito frases depois, era regressão.
- **"Tem arquivo no repositório" não é "o app toca".** Entre gerar 1606 clipes
  e ouvir um som havia um bug inteiro — a narração colada —, e só a sonda no
  navegador o encontrou.
