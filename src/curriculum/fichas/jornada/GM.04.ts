import { FichaCompetencia } from "../../schema";

/**
 * DECISAO-001 — RESOLVIDA. A GM.04 é a hora cheia e a meia hora; os minutos
 * são da GM.06.
 *
 * ## A divergência
 *
 * Quatro autoridades falavam sobre o escopo desta competência e não diziam a
 * mesma coisa:
 *
 * | autoridade | escopo | faixa | pré-req |
 * |---|---|---|---|
 * | DAG (`grafo_saga`) | "Horas (ponteiros e digital)" | F1 | `[N1.06]` |
 * | `curriculum/GM.yaml` | "horas exatas e meia hora"; nota explícita: *ler minutos exige contagem de 5 em 5 — por isso fica para GM.06* | F1 | `[N1.06]` |
 * | ficha canônica F55 | escada de 5 níveis: hora exata → meia hora → **quartos** → **5 em 5** → produzir | F1 | `[N1.06]` |
 * | esta ficha, antes | horas exatas + **avançar 15 minutos** | F2 | `[N2.01, AL.01]` |
 *
 * ## Por que a hora cheia venceu, e não foi moeda ao ar
 *
 * 1. **O DAG é a autoridade operante.** É dele que `unlockEngine` e
 *    `rescuePlanner` leem os pré-requisitos: é o DAG que tranca a porta. Ele
 *    põe a GM.04 em F1 com `[N1.06]` apenas.
 *
 * 2. **A F55 se contradiz, e a contradição aponta a saída.** O nível 4 dela
 *    diz, com todas as letras, "usa contagem por saltos (AL.03)" — um
 *    pré-requisito que o próprio bloco de identidade da F55 não lista. Uma
 *    GM.04 em F1 com `[N1.06]` que ensinasse 5 em 5 cobraria da criança um
 *    salto que o DAG só concede na GM.06.
 *
 * 3. **O app já se comporta assim.** O `gGM_04`, que serve esta competência em
 *    produção, tem cinco níveis e nenhum deles sai da hora cheia e da meia
 *    hora: L1 hora cheia, L2 meia hora, L3 mistura, L4 problema de horas
 *    inteiras, L5 em palavras ("três e meia"). O micro invasor não servia
 *    criança nenhuma — era prosa divergindo do que roda.
 *
 * 4. **A GM.06 já entrega o resto, e testada.** A F62, promovida na W35 e
 *    aprovada pelos onze portões, tem exatamente a escada que a F55 descreve
 *    do nível 3 em diante: quartos (15/30/45) → 5 em 5 → minuto a minuto →
 *    duração. Duplicar isso aqui criaria duas competências ensinando a mesma
 *    escada.
 *
 * A F55 não foi descartada: os níveis 3 a 5 dela são o que a GM.06 implementa
 * hoje. O que esta decisão resolve é **onde a escada mora**, não se ela existe.
 *
 * ## Como reverter
 *
 * Se o dono decidir que a GM.04 deve ensinar quartos e 5 em 5, a ordem é
 * obrigatória e começa longe daqui:
 *
 * 1. editar o **DAG** primeiro (`curriculum/grafo_saga.yaml` e
 *    `src/curriculum/grafo_saga.ts`): GM.04 vira F2 e ganha `AL.03` entre os
 *    pré-requisitos — sem isso a porta continua trancada na regra antiga e a
 *    criança recebe 5 em 5 sem ter aprendido a contar de 5 em 5;
 * 2. só então esta ficha, e a nota do `curriculum/GM.yaml` que manda os
 *    minutos para a GM.06;
 * 3. retirar da **GM.06** o que subiu, ou as duas passam a ensinar o mesmo —
 *    e a GM.06 é servida pelo Composer, com onze portões olhando.
 */
export const GM_04: FichaCompetencia = {
  id: "GM.04",
  nome: "Relógio: a Hora e a Meia Hora",
  strand: "GM",
  faixa: "F1",
  prereqs: ["N1.06"],
  bncc: "EF02MA18", 
  
  howto: "O ponteiro pequeno marca a hora. O grande marca os minutos.",
  explain: "Cuidado para não confundir: o ponteiro curto e grosso aponta a hora. O ponteiro longo aponta os minutos.",
  distratores: [
    { regra: "inverte_ponteiros", tag: "TROCA_PONTEIROS" }
  ],
  niveis: {
    1: { primitiva: "relogio", andaime: "mao_fantasma" },
    2: { primitiva: "relogio", andaime: "alto" },
    3: { primitiva: "relogio", andaime: "medio" }, // Reading instead of dragging
    4: { primitiva: "plain", andaime: "minimo" },
    5: { primitiva: "plain", rt_alvo: 5000 }
  },

  micros: [
    {
      id: "a",
      alvo: "ler horas exatas no relógio analógico",
      kinds: ["relogio"],
      params: { 
        apenas_horas_exatas: true,
        audio_prompt: "Que horas o relógio está marcando?" 
      },
      dominio: { acertos: 3, de: 4, sessoes: 1 }
    },
    {
      id: "b",
      alvo: "ler a meia hora, quando o ponteiro das horas fica entre dois números",
      kinds: ["relogio"],
      params: {
        interativo: true,
        minutos_step: 30,
        audio_prompt: "O ponteiro grande está no 6. Que horas são?"
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 }
    }
  ],
  erros_tipicos: [
    {
      id: "troca_ponteiros",
      descricao: "Confunde o ponteiro maior (minutos) com o ponteiro menor (horas)."
    }
  ]
};
