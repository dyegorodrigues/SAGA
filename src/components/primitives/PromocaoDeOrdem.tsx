import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A micro-aula do deslocamento — ficha F67, coreografia `promoverOrdens`.
 *
 * ---
 *
 * **O problema que ela resolve.** Mostrar o material parado e dizer "cada peça
 * sobe uma casa" pede que a criança IMAGINE a promoção. Quem está aprendendo
 * multiplicação agora não tem essa imagem — ela olha os cubinhos, conta, e a
 * frase passa por cima. O material vira decoração.
 *
 * **Por que ESTA forma, e não uma sequência de transformações.**
 *
 * A primeira versão mostrava dois passos lado a lado: cubinho→barra e
 * barra→placa. Ficou ambígua. A barra aparecia duas vezes — uma como resultado
 * do primeiro passo, outra como origem do segundo — e o olho lia "duas barras"
 * sem entender por quê. *(Apontado por um adulto olhando a tela: "por que duas
 * barras dentro do 14 × 10?")*
 *
 * A forma correta é a **escada das casas**, porque é isso que "subir uma casa"
 * literalmente significa. As três ordens ficam nomeadas — UNIDADE, DEZENA,
 * CENTENA — cada uma com a sua peça, e a seta mostra de qual casa a peça sai e
 * em qual chega. A criança vê PARA ONDE sobe, não apenas que sobe. Cada peça
 * aparece uma vez só, no lugar dela.
 *
 * **E a escada distingue ×10 de ×100**, que a versão anterior não fazia: dez
 * sobe um degrau, cem sobe dois. O desenho muda de verdade entre os níveis 1 e
 * 2, em vez de repetir a mesma figura com outro texto por baixo.
 *
 * **Nenhum número aparece.** A demonstração ensina a REGRA; aplicá-la às peças
 * da questão é o trabalho da criança. Mostrar o material já promovido entregaria
 * a resposta com aparência de aula.
 */

interface Props {
  /** Quantas ordens sobem: uma para ×10, duas para ×100. */
  ordens: number;
}

const CASAS = [
  { nome: "UNIDADE", peca: "cubinho" },
  { nome: "DEZENA", peca: "barra" },
  { nome: "CENTENA", peca: "placa" },
] as const;

const ACESA = "#B45309";
const APAGADA = "#D6B27C";

function Peca({ tipo }: { tipo: (typeof CASAS)[number]["peca"] }) {
  if (tipo === "cubinho") {
    return <div className="h-5 w-5 rounded-sm border border-amber-600 bg-amber-400 shadow-sm" />;
  }
  if (tipo === "barra") {
    return (
      <div className="flex flex-col gap-[1px] rounded-sm bg-amber-600 p-[1px] shadow-md">
        {Array.from({ length: 10 }, (_, i) => <div key={i} className="h-[4px] w-5 bg-amber-400" />)}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-10 gap-[1px] rounded-sm bg-amber-600 p-[2px] shadow-md">
      {Array.from({ length: 100 }, (_, i) => <div key={i} className="h-[4px] w-[4px] bg-amber-400" />)}
    </div>
  );
}

export function PromocaoDeOrdem({ ordens }: Props) {
  const reduzido = Boolean(useReducedMotion());
  /** Um degrau para ×10, dois para ×100. */
  const degraus = Math.min(Math.max(ordens, 1), 2);

  const pulso = reduzido
    ? { duration: 0 }
    : { duration: 0.6, ease: "easeOut" as const, repeat: Infinity, repeatDelay: 1 };

  /**
   * **As setas são o CAMINHO; as casas são as PARADAS.**
   *
   * Essa separação é o que faz o desenho ser honesto. No ×100 a peça sai da
   * unidade e chega na centena passando por cima da dezena: o caminho percorre
   * as duas setas — apagar a primeira sugeriria que ele nem começa na unidade —
   * mas a dezena fica apagada, porque a peça não PARA nela.
   *
   * No ×10 tudo acende: a peça sobe de casa em casa, parando em cada uma.
   */
  const setaAtiva = () => true;
  const casaAtiva = (i: number) => i === 0 || i === degraus;

  return (
    <div
      role="img"
      // O rótulo nomeia a PEÇA e a CASA. Só as casas seria abstrato demais para
      // quem ouve em vez de ler; só as peças perderia o "para onde", que é o
      // conceito. A criança não-leitora ouve exatamente este texto.
      aria-label={degraus === 2
        ? "Demonstração: o cubinho da unidade sobe duas casas de uma vez e vira placa na centena, pulando a dezena"
        : "Demonstração: o cubinho da unidade sobe uma casa e vira barra na dezena; a barra sobe e vira placa na centena"}
      className="w-full rounded-xl bg-amber-50 px-3 py-3"
    >
      <div className="flex items-end justify-center gap-1">
        {CASAS.map((casa, i) => (
          <React.Fragment key={casa.nome}>
            {i > 0 && setaAtiva() && (
              <motion.span
                aria-hidden="true"
                className="pb-7 text-xl font-black"
                style={{ color: ACESA, minWidth: 20 }}
                initial={reduzido ? false : { opacity: 0.25, y: 5 }}
                animate={{ opacity: 1, y: -3 }}
                transition={{ ...pulso, delay: reduzido ? 0 : (i - 1) * 0.3 }}
              >
                ↗
              </motion.span>
            )}
            <div className="flex flex-col items-center gap-1" style={{ minWidth: 58 }}>
              <div className="flex items-end" style={{ minHeight: 48 }}>
                <motion.div
                  initial={reduzido ? false : { opacity: casaAtiva(i) ? 1 : 0.3, scale: i === 0 ? 1 : 0.85 }}
                  animate={{ opacity: casaAtiva(i) ? 1 : 0.3, scale: 1 }}
                  transition={{ ...pulso, delay: reduzido ? 0 : i * 0.3 }}
                >
                  <Peca tipo={casa.peca} />
                </motion.div>
              </div>
              <span
                aria-hidden="true"
                className="text-[9px] font-black tracking-wide"
                style={{ color: casaAtiva(i) ? ACESA : APAGADA }}
              >
                {casa.nome}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
