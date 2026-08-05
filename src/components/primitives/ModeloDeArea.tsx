import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { RegiaoSpec } from "../../curriculum/procedimentos/areaContract";

/**
 * O retângulo partido — ficha F68.
 *
 * ---
 *
 * ### A versão descartada, e por que ela estava errada
 *
 * A primeira desenhava cada região como uma **grade de quadradinhos**, composta
 * de `Arranjo`. Parecia a escolha certa: a ficha nomeia `ArrayGrid` em modo
 * área, e a criança já conhece o arranjo de N4.03.
 *
 * Estava errada por três motivos, e um adulto os viu antes de qualquer teste:
 *
 * 1. **Ninguém conta 195 quadradinhos.** Em `15 × 13` a grade vira textura. O
 *    arranjo serve para *contar* fatos pequenos; o modelo de área serve para
 *    *partir* números grandes. Reusar a forma sem reusar o propósito é a
 *    armadilha §6.22, e eu caí nela.
 * 2. **Tudo da mesma cor.** Duas regiões azuis coladas lêem como um bloco só, e
 *    a partição — que é o assunto inteiro — ficava invisível. Isso é o §6.17,
 *    escrito por mim mesmo depois de errar igual nos saltos da reta numérica.
 * 3. **Os números apareciam sem origem.** Sob as grades saíam "20" e "10", e um
 *    adulto perguntou o que aquilo tinha a ver com `15 × 2`. Tinha tudo — eram
 *    `10 × 2` e `5 × 2` — mas a tela não dizia.
 *
 * ### A forma atual: o desenho da própria ficha
 *
 * A F68 §3 traz o diagrama, e ele responde os três problemas de uma vez:
 *
 * ```
 * +----------+---+
 * |  10 x 4  |3x4|
 * |   = 40   |=12|
 * +----------+---+
 * ```
 *
 * Retângulos **proporcionais** — a região das dezenas é visivelmente maior —,
 * com **a conta escrita dentro** e as **medidas nas bordas**. Nada para contar:
 * tudo para ler. Cada coluna tem a sua cor, porque é a coluna que o corte
 * separa.
 *
 * **O total nunca aparece.** A linha de baixo mostra `40 + 12 = ?`; somar é o
 * trabalho da criança.
 */

interface Props {
  regioes: RegiaoSpec[];
  /** A divisa do corte, marcada — só o nível 1 a recebe. */
  corteMarcado: boolean;
  /** As regiões ficam afastadas. No nível 2 o retângulo fica inteiro. */
  regioesSeparadas?: boolean;
  /** Qual região a micro-aula está acendendo. `null` acende todas. */
  destacada?: number | null;
  /**
   * Qual MEDIDA a aula está apontando: a de cima ou a da lateral.
   *
   * A convenção dos eixos — o primeiro fator deitado em cima, o segundo em pé
   * na lateral — é combinação, não descoberta. A criança precisa que alguém
   * aponte. Sem isto, ela vê números em duas bordas e deduz sozinha ou não
   * deduz. Ver §6.36.
   */
  destacarMedida?: "cima" | "lado" | null;
  /** O passo final da aula: as regiões deslizam juntando-se. */
  juntando?: boolean;
}

/** O que sobra da tela de 390px depois das margens do palco. */
const LARGURA = 296;
/** Altura do retângulo de uma fileira. Com duas, cresce pela metade. */
const ALTURA = 108;
/** Menor largura em que a conta ainda cabe escrita dentro da região. */
const LARGURA_MINIMA = 74;
/** Menor altura legível de uma fileira. */
const ALTURA_MINIMA = 46;

/**
 * A cor de cada COLUNA do retângulo.
 *
 * Por coluna, não por região: é a coluna que o corte separa. Com multiplicador
 * de dois dígitos, as regiões de cima e as de baixo compartilham o mesmo par de
 * colunas, e pintar por coluna deixa a partição vertical visível nas duas
 * fileiras ao mesmo tempo.
 */
const COR_DA_COLUNA = [
  { fundo: "#EEF2FF", borda: "#6366F1", tinta: "#3730A3" },
  { fundo: "#FEF3C7", borda: "#D97706", tinta: "#92400E" },
];

/**
 * Divide um total entre partes proporcionais, sem deixar nenhuma ilegível.
 *
 * A proporção é o que ensina — a região do 10 tem de parecer o dobro da do 5 —,
 * mas uma região de 3 colunas em 29 sairia com 30px e a conta não caberia
 * dentro. Quem está acima do mínimo cede o excedente.
 */
export function repartir(partes: number[], total: number, minimo: number): number[] {
  const soma = partes.reduce((s, p) => s + p, 0) || 1;
  const bruto = partes.map(p => (p / soma) * total);
  const faltando = bruto.map(v => Math.max(0, minimo - v)).reduce((s, v) => s + v, 0);
  if (faltando === 0) return bruto;
  const folga = bruto.map(v => Math.max(0, v - minimo));
  const folgaTotal = folga.reduce((s, v) => s + v, 0) || 1;
  return bruto.map((v, i) => Math.max(minimo, v - (folga[i] / folgaTotal) * faltando));
}

/**
 * Em que coluna do retângulo mora a região `i`.
 *
 * A soma de baixo precisa saber disso para pintar cada parcela na cor do
 * quadrado que a produziu. Com quatro regiões, a 3ª volta para a coluna 0 —
 * ela é a de baixo, na mesma coluna da 1ª.
 */
function indiceDaColuna(regioes: RegiaoSpec[], i: number): number {
  const daFileira = regioes.filter(r => r.linhas === regioes[i].linhas);
  return daFileira.indexOf(regioes[i]);
}

export function ModeloDeArea({
  regioes, corteMarcado, regioesSeparadas = false, destacada = null,
  destacarMedida = null, juntando = false,
}: Props) {
  /** Durante a aula, a medida apontada acende e a outra recua. */
  const medida = (qual: "cima" | "lado") =>
    destacarMedida === null || destacarMedida === qual
      ? { opacity: 1, transform: "scale(1)" }
      : { opacity: 0.3, transform: "scale(1)" };
  const reduzido = Boolean(useReducedMotion());

  const fileiras = [...new Set(regioes.map(r => r.linhas))];
  const colunas = [...new Set(regioes.filter(r => r.linhas === fileiras[0]).map(r => r.colunas))];

  const larguras = repartir(colunas, LARGURA, LARGURA_MINIMA);
  const alturas = repartir(fileiras, ALTURA * (fileiras.length > 1 ? 1.6 : 1), ALTURA_MINIMA);
  const vao = regioesSeparadas ? 8 : 0;

  const rotulo = juntando
    ? `As partes se juntam: ${regioes.map(r => r.valor).join(" mais ")}.`
    : `Retângulo partido em ${regioes.length} ${regioes.length === 1 ? "parte" : "partes"}: `
      + regioes.map(r => `${r.colunas} vezes ${r.linhas} é ${r.valor}`).join("; ");

  return (
    <div role="group" aria-label={rotulo} className="w-full overflow-hidden">
      <div className="mx-auto w-fit">
        <div className="flex" style={{ gap: 6 }}>
          {/* Espaçador da coluna das medidas da esquerda. */}
          <div aria-hidden="true" style={{ width: 18 }} />
          {/* As medidas de cima, com o NOME da ordem embaixo de cada uma.
              A cor sozinha não diz nada: um adulto precisou raciocinar para
              descobrir que o azul era a dezena, e a criança não vai raciocinar.
              O nome escrito transforma a cor em legenda. Ver §6.35. */}
          <div className="flex" style={{ gap: vao }} aria-hidden="true">
            {colunas.map((c, i) => (
              <div
                key={c}
                className="pb-1 text-center transition-all"
                style={{ width: larguras[i], ...medida("cima") }}
              >
                <div className="text-sm font-black" style={{ color: COR_DA_COLUNA[i % 2].tinta }}>
                  {c}
                </div>
                <div
                  className="text-[9px] font-bold uppercase tracking-wide"
                  style={{ color: COR_DA_COLUNA[i % 2].tinta }}
                >
                  {i === 0 ? "dezenas" : "unidades"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex" style={{ gap: 6 }}>
          {/* As medidas da esquerda: o outro fator. */}
          <div
            className="flex flex-col transition-all"
            style={{ gap: vao, width: 18, ...medida("lado") }}
            aria-hidden="true"
          >
            {fileiras.map((f, j) => (
              <div
                key={f}
                className="flex items-center justify-end text-sm font-black text-slate-600"
                style={{ height: alturas[j] }}
              >
                {f}
              </div>
            ))}
          </div>

          <div className="flex flex-col" style={{ gap: vao }}>
            {fileiras.map((linhas, j) => (
              <div key={linhas} className="flex" style={{ gap: vao }}>
                {regioes
                  .map((r, i) => ({ r, i }))
                  .filter(({ r }) => r.linhas === linhas)
                  .map(({ r, i }, iCol) => {
                    const cor = COR_DA_COLUNA[iCol % 2];
                    const aceso = destacada === null || destacada === i;
                    // Numa fileira baixa (o "3" de 13) a conta e o resultado no
                    // tamanho cheio encostam na borda. Encolher mantém os dois
                    // legíveis; esconder um deles tiraria justamente a origem do
                    // número, que é o defeito que esta versão veio corrigir.
                    const apertado = alturas[j] < 62;
                    return (
                      <motion.div
                        key={i}
                        className="flex flex-col items-center justify-center rounded-lg"
                        animate={juntando && !reduzido ? { x: iCol > 0 ? -5 : 5 } : { x: 0 }}
                        transition={{ duration: reduzido ? 0 : 0.5, ease: "easeOut" }}
                        style={{
                          width: larguras[iCol],
                          height: alturas[j],
                          background: cor.fundo,
                          border: `2px ${corteMarcado && iCol > 0 ? "dashed" : "solid"} ${cor.borda}`,
                          opacity: aceso ? 1 : 0.3,
                        }}
                      >
                        {/* A conta que gera o número mora DENTRO da região.
                            Sem ela o "20" solto embaixo do desenho não tem
                            origem — e foi exatamente o que ninguém entendeu. */}
                        <span
                          aria-hidden="true"
                          className="font-bold leading-none"
                          style={{ color: cor.tinta, fontSize: apertado ? 11 : 14 }}
                        >
                          {r.colunas} × {r.linhas}
                        </span>
                        <span
                          aria-hidden="true"
                          className="font-black leading-none"
                          style={{ color: cor.tinta, fontSize: apertado ? 18 : 26, marginTop: 3 }}
                        >
                          {r.valor}
                        </span>
                      </motion.div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        {/* A soma em aberto — cada parcela na COR da região que a produziu.
            Cinza uniforme deixava a linha de baixo solta do desenho de cima:
            os números estavam certos e não se ligavam a nada. A cor é o fio que
            leva o olho do quadrado até a parcela. Ver §6.35. */}
        <p aria-hidden="true" className="mt-2 text-center text-lg font-black text-slate-700">
          {regioes.map((r, i) => {
            const cor = COR_DA_COLUNA[indiceDaColuna(regioes, i) % 2];
            return (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-slate-600"> + </span>}
                <span style={{ color: cor.tinta }}>{r.valor}</span>
              </React.Fragment>
            );
          })}
          <span className="text-slate-600"> = </span>?
        </p>
      </div>
    </div>
  );
}
