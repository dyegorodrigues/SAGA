# Caderno de percepções

**O que é.** Um lugar para observações que não cabem nos outros documentos: o
Diário registra decisões com evidência, o Roteiro registra o plano, o Handoff
registra onde paramos. Aqui ficam as **percepções sobre o trabalho em si** — o
que se aprendeu sobre o projeto, sobre a colaboração e sobre como o erro aparece.

**Por que separado.** Misturar percepção com evidência estraga os dois: o Diário
precisa ser confiável como registro factual, e a percepção precisa ser livre para
ser provisória. Quando uma percepção vira regra, ela migra para o `AGENTS.md` ou
para o `FLUXO_GIT_SEM_BUG.md` e sai daqui.

**Como usar.** Entradas curtas, datadas, sem cerimônia. Quem retomar o projeto —
pessoa ou IA — lê isto para herdar o que já foi aprendido na prática, e não
apenas o que foi decidido.

---

## 3 de agosto de 2026

**O gargalo do trabalho com IA neste projeto não é memória, é consulta.**
Três falhas ocorreram numa mesma sessão: um lote declarado completo sem reler a
lista, um canário promovido com padrão mais fraco que o do seguinte e o grafo de
código quatro commits atrás. Em todas, **a informação estava no repositório**. O
roteiro tinha a lista; o teste do outro canário existia; o comando do grafo
estava no `CLAUDE.md`. Nenhuma teria sido evitada por mais armazenamento — só por
um gatilho de releitura. Guardar mais não resolve não olhar.

**Teste verde não é prova de código correto.**
Catorze testes passaram com uma chamada cujo terceiro argumento era do tipo
errado; só o `tsc` viu. Vitest não faz checagem de tipos. Por isso `lint` e
`test` precisam permanecer gates separados — um cobre o que o outro não vê.

**Quatro defeitos sérios do Lote D foram achados por teste exaustivo, não por
revisão.** A tag de diagnóstico errada, a narrativa entregando a resposta, a
coincidência numérica que anulava o `REPETE_DADO` e a ausência de rótulo no
segmento da diferença. Nenhum apareceria lendo o código: todos exigiam varrer
combinações. Onde o espaço de entrada é pequeno e enumerável — quatro estruturas,
três posições, poucos valores —, varrer tudo é mais barato que pensar bonito.

**Três defeitos vieram de olhar a tela, e nenhum teste os pegaria.**
Concordância de gênero e número, a escada do nível 4 que não retirava a
ilustração e a rolagem além da viewport. Automação não substitui inspeção visual
em produto infantil; ela cobre o que é verificável, não o que é percebido.

**Moldura vazia é lida como defeito, mesmo por quem sabe que é intencional.**
O proprietário, que acompanhava a construção, leu a caixa vazia do nível 4 como
"esqueceu de botar o elemento" antes de qualquer explicação. Se quem conhece o
projeto lê assim, a criança lê igual. Ausência precisa ser **desenhada como
ausência**, não deixada como buraco.

**Não reescrever o que já existe.** `StoryPanel` e `SingaporeBars` já estavam no
repositório — o primeiro sem uso, o segundo com três consumidores vivos. A
tentação era refazer; o certo foi ligar o primeiro por um palco e deixar o
segundo intocado, acrescentando um componente novo ao lado. Inventário **antes**
de escrever, sempre.

**O acervo histórico custava mais do que parecia.** `arquivo_morto` não
contaminava o runtime, mas inflava a suíte em 36% — 337 dos 936 testes vinham de
código morto — e respondia por 30% do grafo de código. Um relatório de saúde
inflado é pior que um relatório ausente, porque dá confiança falsa.

**Correção estrutural vale mais que correção pontual.** Ao descobrir que o
rollback do canário era inerte, consertar apenas N3.09 teria bastado para o
sintoma. Remover a lista de ids do `curriculum.ts` foi o que impediu a falha
silenciosa no nó seguinte — e a prova disso é que promover N3.10 depois não
exigiu tocar em nada.
