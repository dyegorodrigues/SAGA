# O que o SAGA guarda de uma criança, onde, e por quanto tempo

Documento de auditoria do Andar 5. Foi escrito lendo o código, não a intenção:
cada linha abaixo aponta para o lugar exato onde o dado é gravado.

Isto existe porque o app é usado por crianças de 4 a 12 anos. Dado de criança
que não responde a nenhuma pergunta não é "dado extra" — é risco parado, e a
única forma honesta de saber se há algum é listar tudo.

---

## 1. Inventário: tudo o que sai do aparelho

### 1.1 Autenticação (Firebase Auth)

| Dado | Origem | Necessário? |
|---|---|---|
| E-mail da conta Google **do responsável** | login com Google | **Sim** — é o que permite recuperar o progresso num aparelho novo |
| `uid` anônimo | "Começar sem Conta" | **Sim** — sem ele não existe save na nuvem |

O login é do adulto. A criança nunca cria conta, nunca informa e-mail, nunca
digita senha.

### 1.2 Save do usuário — `userStates/{id}` (`src/lib/firebase.ts`)

O estado inteiro do app vai serializado neste documento.

| Dado | Necessário? | Por quê |
|---|---|---|
| Nome da criança | **Sim** | é como a criança se reconhece na tela de escolha de perfil. É o único dado identificável, e é um primeiro nome escolhido pelo responsável — pode ser apelido |
| Idade / ano escolar | **Sim** | calibra a Bússola, a duração da sessão e o tom narrativo (§11.5) |
| Tema, mascote, roupa, inventário, álbum | **Sim** | é o progresso do jogo |
| Progresso por competência, coroas, estrelas, moedinhas | **Sim** | é o produto |
| Hipóteses do Radar (`misconceptions`) | **Sim** | é o que faz a Oficina existir. Janela rolante de 15 por nó — não cresce sem limite |
| Log diário (`log`) | **Sim** | ofusca o painel dos pais se sair. Limitado a 366 dias por criança |

**Não há** endereço, telefone, foto, geolocalização, contatos, identificador de
publicidade, nem qualquer campo de texto livre preenchido pela criança.

### 1.3 Telemetria — `userStates/{id}/Kids/{kidId}/TelemetryLogs`

Um registro por questão respondida.

| Campo | Necessário? |
|---|---|
| `trackId`, `qIndex`, `qPrompt`, `expectedAnswer`, `givenAnswer` | **Sim** — sem a questão e a resposta dada não existe análise de erro |
| `reactionTimeMs`, `isCorrect`, `attemptCount`, `hintsUsed`, `tutState` | **Sim** — são as evidências de fluência e independência do §12.8 |
| `recoveredAfterError`, `misconceptionTags` | **Sim** — são o Radar |
| `kidId` | **Sim** — separa irmãos |
| ~~`parentUserId`~~ | **Não** — **removido**. Repetia dentro do documento o que já era o caminho dele |

O `kidId` é um identificador interno gerado pelo app; o **nome** da criança não
é copiado para cada registro de telemetria.

---

## 2. Retenção

| Dado | Política | Onde é aplicada |
|---|---|---|
| Save do usuário | vive enquanto a conta existir | apagar o perfil apaga o dado (`handleDeleteKid`); "reset de fábrica" apaga tudo |
| Log diário dentro do save | **366 dias**, corte automático | `lg.slice(-366)` em `commitProg` |
| Hipóteses do Radar | **15 por competência**, janela rolante | `trackMisconception` |
| Telemetria | **550 dias (~18 meses)** | campo `expiraEm`, ver abaixo |

**Por que 18 meses para a telemetria.** A única análise que justifica guardar
esse detalhe é comparar a criança com ela mesma ao longo de mais de um ano
letivo. Dezoito meses cobrem isso com folga e nada além.

### Como ligar a retenção automática (uma vez, no Console)

Cada registro já é gravado com um campo `expiraEm`. Ele fica **inerte** até que
a política de TTL seja criada — depois disso, o Firestore apaga os registros
vencidos sozinho, sem ninguém precisar lembrar de faxinar.

No Console do Firebase, pelo navegador do tablet:

1. **Criação → Firestore Database → TTL** (*Time-to-live*).
2. **Criar política**.
3. Grupo de coleções: `TelemetryLogs` · Campo de carimbo de data/hora: `expiraEm`.
4. Salvar.

Faz sentido fazer isso na mesma visita em que as regras forem publicadas
(`PUBLICAR_REGRAS_FIRESTORE.md`) — são dois cliques a mais, na mesma tela.

> Enquanto a política não existir, nada quebra e nada vaza: os registros
> simplesmente não se apagam sozinhos. E como as regras ainda não foram
> publicadas, hoje não há registro algum na nuvem.

---

## 3. Custo de gravação (o item "custo de writes" do Andar 5)

Medido, não estimado. Save modelado de 1 criança, 1 ano de uso, 88 competências
tocadas: **127 KB**.

| | Antes | Depois |
|---|---|---|
| Gravações na nuvem por missão de 10 questões | 10 do save + 10 de telemetria | **1** do save + 10 de telemetria |
| Upload do save por missão | ~1,2 MB | **~127 KB** |
| Upload do save por ano (3 missões/dia) | ~1,3 GB | **~136 MB** |

A cota gratuita do Firestore (20.000 gravações/dia) nunca esteve em risco — com
3 crianças e 3 missões diárias são ~180. **O custo real era a franquia de dados
e a bateria do tablet**, reescrevendo o save inteiro depois de cada questão para
mudar meia dúzia de números.

O amortecedor (`sincronizadorDeNuvem.ts`) coalesce as gravações da nuvem e
descarrega no fim da missão, ao trocar de app e ao fechar a aba. O aparelho
continua gravando a cada questão — isso não mudou e não deve mudar.

**Isto só é seguro por causa da reconciliação por carimbo**
(`reconciliacaoDeSaves.ts`): se o app fechar com gravação pendente, o save local
é o mais recente e vence na abertura seguinte. Na ordem inversa, o amortecedor
teria criado uma janela de perda de progresso.

---

## 4. O que continua em aberto

- **Painel dos pais não mostra os dados guardados nem oferece exportação.** Não é
  exigência de nenhum andar, mas é o passo natural quando o painel evoluir.
- **Nada lê a telemetria ainda.** Ela é gravada e não consumida. Quando a
  primeira análise existir, revisitar se todos os campos deste inventário
  continuam se justificando — a pergunta certa é sempre "que decisão este campo
  muda?".
