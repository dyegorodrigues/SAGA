# Roadmap de produto — o que existe, o que falta, em que ordem

> **Para que serve.** Registrar as frentes que estão fora da fábrica curricular
> para que não se percam entre sessões, e fixar as decisões de arquitetura já
> tomadas — inclusive as decisões de **não** construir certas coisas.
> Levantado lendo os motores no HEAD `1806c731`.

---

## 1. A descoberta que organiza tudo

As frentes que pareciam quatro projetos — escola, painel do professor, IA de
análise, missões adaptativas — dependem de **uma única peça ausente**: um lugar
onde o estado da criança exista fora do aparelho dela.

O cérebro pedagógico **já está construído**:

| Motor | Já faz hoje |
|---|---|
| `senseiOrchestrator` | escolhe a entrada e o próximo passo |
| `unlockEngine` | trava o que o DAG não liberou |
| `radarEngine` | erros por tipo + **repetição espaçada** + revisões vencidas |
| `rescuePlanner` | prescreve resgate por erro conceitual |
| `dojoEngine` / `jardimEngine` | fluência e sessões |

E o aprendizado já é documento estruturado: `Progress`, `MasteryEvidence`,
`FactStrength`, `ProcStrength`, `DojoTrackState`, `JardimTrackState`.

O que não existe: `server.ts` tem 32 linhas e só responde health-check. Não há
conta, servidor nem sincronização. Persistência é `localStorage`.

---

## 2. Decisões de arquitetura tomadas

### 2.1 Escola — construir a Rota B, entregando a Rota A como primeira etapa

- **Rota A — espelho.** O aparelho continua dono do estado e publica cópias; o
  adulto lê. Incompleto como destino (o professor não age), correto como etapa.
- **Rota B — espelho + fila de prescrições.** Professor e IA **enfileiram
  sugestões**; o `senseiOrchestrator` as considera junto com as próprias,
  sujeitas às mesmas travas do `unlockEngine`. **Escolhida.**
- **Rota C — turma como currículo, servidor decidindo. NÃO CONSTRUIR.**
  Cria um segundo cérebro que diverge do cliente, força lockstep e mata a
  adaptação por criança. Toda regra pedagógica passaria a existir em dois
  lugares.

A necessidade legítima da Rota C — “a turma está em frações esta semana” —
entra na Rota B como **peso, não como ordem**: foco da turma vira sugestão
ponderada, nunca override do grafo.

**Invariante:** professor e IA **propõem**; o motor determinístico **decide**.
Prescrição que fere pré-requisito é recusada e o painel explica o porquê — isso
é recurso, não erro.

### 2.2 IA — em lote, propondo; nunca no laço de decisão

| Uso | Veredito |
|---|---|
| IA escolhendo exercício ao vivo | **não** — destrói rastreabilidade, custa por questão, mata o offline |
| IA como tutor falante em tempo real | **não agora** — caro, imprevisível, sensível com criança |
| IA lendo telemetria e gerando relatório + sugestões, semanal | **sim** — centavos por aluno, nada trava, e é o que o adulto compra |

A sugestão da IA entra na **mesma fila** do professor e passa pelo mesmo filtro.
Assim ela personaliza dentro dos trilhos: se errar, o erro para no grafo, não na
criança.

### 2.3 Missões — projeção, não segundo estado

1. **Uma porta, não um menu.** A tela inicial mostra a ação que o
   `senseiOrchestrator` já escolhe; o resto fica em segundo plano.
2. **Missão é meta com motivo**, não checklist.
3. **Missão começada não muda no meio.** Adaptação acontece **entre** missões.
   É o que separa “adaptativo” de “confuso”.
4. **Missão é derivada do progresso**, com apenas um ponteiro de “missão
   atual” persistido. Se a missão guardar progresso próprio, ele divergirá do
   verdadeiro e produzirá bug irreproduzível.

---

## 3. Ordem de execução

| Quando | O quê |
|---|---|
| **Agora** | Nada disto. A fábrica curricular está em 21 fallbacks e roda bem; interromper cria duas obras pela metade. |
| **Agora — única exceção** | **Estado versionado e exportável.** Já é estruturado; falta número de versão e um par salvar/carregar do documento inteiro. Barato hoje, caro depois: sem isso, sincronizar vira reescrever. |
| Depois | Design: migrar cores para os papéis, ligar o tema, hospedar a fonte. |
| Depois | Missões + porta única. Não precisa de servidor. |
| Só então | Contas + servidor + Rota A. |
| Depois | Rota B + IA em lote. |

Cada degrau é vendável sozinho e nenhum exige desmontar o anterior.

---

## 4. Lista aberta

- **Design visual completo** — paleta, tipografia local, botões, espaçamento,
  cantos, sombra, movimento. Ver `DESIGN_ESTADO_E_DECISOES.md`.
- **Cor por trilha** — 4 colisões (`N7=N1`, `PE=N2`, `GE=N5`, `AL=N6`) e hex
  solto em `GM`. Decisão do dono.
- **Cor por operação** — **fechada, não reabrir.**
- **Tipografia externa** — Google Fonts por rede; dívida conhecida.
- **Estado versionado e exportável** — peça-chave de tudo.
- **Missões + porta única.**
- **Contas, servidor, sincronização** — envolve dado de menor de idade.
- **Painel dos pais** — `ParentDashboard.tsx` existe e está vazio.
- **Painel do professor + fila de prescrições** — Rota B.
- **IA em lote** — relatório semanal e sugestão que nunca decide.
- **Modelo de negócio** — grátis para a criança; assinatura para o adulto que
  quer entender; licença por turma para escola.

---

## 5. O que este documento proíbe

- construir a Rota C;
- colocar IA dentro do laço de decisão pedagógica;
- dar a professor ou IA poder de escrever direto no estado do aprendiz;
- criar estado de missão paralelo ao progresso;
- interromper a fábrica curricular para começar qualquer um destes itens.
