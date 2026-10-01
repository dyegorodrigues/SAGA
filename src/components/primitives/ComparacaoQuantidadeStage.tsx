import React from "react";
import { motion } from "motion/react";
import { ComparacaoQuantidadeSpec, GrupoQuantidadeSpec } from "../../curriculum/procedimentos/comparacaoQuantidadeContract";
import { Grupo } from "./Grupo";
import { AlternativasQueFalam } from "../gameloop/AlternativasQueFalam";
import { PalcoEscalado } from "./PalcoEscalado";
import { tokens } from "../../styles/tokens";

const ERRO_MS = 2400;
const ACERTO_MS = 1100;

type Fase = "idle" | "erro" | "acerto";

export interface ComparacaoQuantidadeMostrar {
  destacarAmbos?: boolean;
  /** Índice zero-based do último par demonstrado: 0 = só o primeiro par. */
  parear?: number;
  pulsarGrupos?: boolean;
}

interface Props {
  spec: ComparacaoQuantidadeSpec;
  onAnswer?: (valor: number) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: ComparacaoQuantidadeMostrar | null;
}

/**
 * As cores do par. Cada par recebe a MESMA cor nos dois grupos.
 *
 * Poucas e bem separadas: a criança precisa distinguir "este com aquele" de
 * relance, não estudar uma paleta. Depois da sexta, repete — a esta altura o
 * que importa já não é qual par é qual, e sim que ainda há objeto sem cor.
 */
const CORES_DO_PAR = [
  tokens.cor.acao.primaria,
  tokens.cor.feedback.acerto,
  tokens.cor.feedback.erro_suave,
  tokens.cor.acao.secundaria,
  tokens.cor.elementos.base_B,
  tokens.cor.elementos.base_A,
];

/**
 * ⚠️ A ligação acontece NO OBJETO.
 *
 * `pareados` diz quantos itens deste grupo já foram ligados ao outro lado.
 * Cada um recebe um anel na cor do seu par — a mesma cor do parceiro no
 * grupo oposto —, e quem sobra fica sem anel.
 *
 * Antes, "ligar um de cada lado" desenhava uma caixinha embaixo com `●—●`
 * repetido: símbolos abstratos, desligados dos objetos na tela. O pai viu e
 * disse: *"diz que vai ligar, mas não ligou nada, não sei para que que ia
 * ligar."* A correspondência um a um é a competência inteira desta ficha;
 * desenhá-la como dois pontinhos genéricos é desenhar outra coisa.
 */
function itensDoGrupo(grupo: GrupoQuantidadeSpec, pareados = 0) {
  return Array.from({ length: grupo.quantidade }, (_, i) => {
    const temPar = i < pareados;
    return (
      <motion.span
        key={`${grupo.emoji}-${i}`}
        data-grupo-quantidade-item
        data-par-do-item={temPar ? i : undefined}
        aria-hidden
        className={grupo.distribuicao === "espalhada"
          ? "relative m-2 inline-flex items-center justify-center text-[28px] leading-none"
          : grupo.distribuicao === "compacta"
            ? "relative -m-0.5 inline-flex items-center justify-center text-[28px] leading-none"
            : "relative inline-flex items-center justify-center text-[28px] leading-none"}
        style={{
          transform: `scale(${grupo.escalaItem})`,
          // O anel da cor do par. `outline` não empurra o vizinho, e estes
          // grupos têm distribuição "compacta" onde qualquer borda mudaria o
          // arranjo — e o arranjo é justamente a armadilha que a ficha testa.
          outline: temPar ? `3px solid ${CORES_DO_PAR[i % CORES_DO_PAR.length]}` : undefined,
          outlineOffset: temPar ? 2 : undefined,
          borderRadius: temPar ? 9999 : undefined,
        }}
        initial={{ opacity: 0, scale: 0.7 * grupo.escalaItem }}
        animate={{ opacity: 1, scale: grupo.escalaItem }}
        transition={{ delay: 0.04 * i, duration: 0.25 }}
      >
        {grupo.emoji}
      </motion.span>
    );
  });
}

function Pareamento({ spec, limitePares, mostrarSobra }: {
  spec: ComparacaoQuantidadeSpec;
  limitePares?: number;
  mostrarSobra: boolean;
}) {
  const paresTotais = Math.min(spec.grupos[0].quantidade, spec.grupos[1].quantidade);
  const paresVisiveis = limitePares == null
    ? paresTotais
    : Math.max(0, Math.min(paresTotais, limitePares));
  const sobraEsquerda = spec.grupos[0].quantidade - paresTotais;
  const sobraDireita = spec.grupos[1].quantidade - paresTotais;
  return (
    <motion.div
      data-comparacao-pareamento
      data-pares-visiveis={paresVisiveis}
      className="mt-2 flex flex-col items-center gap-1 rounded-xl border border-blue-200 bg-blue-50/90 px-3 py-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/*
        ⚠️ Os `●—●` saíram daqui.
        Eles eram a ÚNICA coisa que aparecia quando a voz dizia "vou ligar um
        de cada lado": pontinhos abstratos numa caixa, desligados dos objetos
        na tela. O pai: *"diz que vai ligar, mas não ligou nada, não sei para
        que que ia ligar."* Agora a ligação é o anel colorido no próprio
        objeto, nos dois grupos — ver `itensDoGrupo`. Esta caixa ficou só
        para o que ela sabe dizer e o anel não diz: quantos sobraram.

        O contador continua no DOM (`data-pares-visiveis`) porque os testes da
        ficha medem por ele, e medir pelo anel exigiria geometria.
      */}
      <span className="text-xs font-bold text-blue-900">Um de cada lado</span>
      {mostrarSobra && (sobraEsquerda > 0 || sobraDireita > 0) && (
        <span data-comparacao-sobra className="text-sm font-black text-blue-800">
          {sobraEsquerda > 0 ? `Sobrou ${sobraEsquerda} à esquerda` : `Sobrou ${sobraDireita} à direita`}
        </span>
      )}
    </motion.div>
  );
}

export function ComparacaoQuantidadeStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [fase, setFase] = React.useState<Fase>("idle");
  const [escolhido, setEscolhido] = React.useState<number | null>(null);
  const [mostrarPares, setMostrarPares] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    setFase("idle");
    setEscolhido(null);
    setMostrarPares(false);
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    };
  }, [spec]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = Boolean(disabled) || fase !== "idle" || emAula;
  const paresTutorial = typeof mostrar?.parear === "number" ? mostrar.parear + 1 : 0;
  const pareamentoDeErro = fase === "erro" && spec.autoParearNoErro;
  const exibirPareamento = pareamentoDeErro || mostrarPares || paresTutorial > 0;
  const limitePares = pareamentoDeErro || mostrarPares ? undefined : paresTutorial;
  /**
   * Quantos objetos já estão ligados, na CENA.
   *
   * A aula liga um de cada vez (`parear: 0` = o primeiro par); quando a
   * criança pede "Quer parear?", ou quando o erro mostra a conta, liga todos
   * os que têm par. Nunca mais do que o grupo menor: ligar um objeto a nada
   * seria mentir sobre a correspondência.
   */
  const paresPossiveis = Math.min(spec.grupos[0].quantidade, spec.grupos[1].quantidade);
  const paresVisiveisNaCena = limitePares == null
    ? paresPossiveis
    : Math.max(0, Math.min(paresPossiveis, limitePares));
  const mostrarSobra = pareamentoDeErro || mostrarPares;

  function tocar(i: number) {
    if (travado) return;
    setEscolhido(i);
    const certo = i === spec.resposta;
    onAnswer?.(i);
    if (!certo) {
      setFase("erro");
      falar?.(spec.explain);
      timer.current = window.setTimeout(() => {
        setFase("idle");
        setEscolhido(null);
        // A explicação pode mostrar a solução; o retry precisa voltar limpo.
        setMostrarPares(false);
      }, ERRO_MS);
      return;
    }
    setFase("acerto");
    falar?.("Isso. O grupo que sobrou no pareamento tem mais.");
    timer.current = window.setTimeout(() => setFase("idle"), ACERTO_MS);
  }

  return (
    <PalcoEscalado>
      <div
        data-comparacao-quantidade-stage
        data-comparacao-nivel={spec.nivel}
        data-armadilha-tamanho={spec.armadilhaTamanho || undefined}
        data-armadilha-espaco={spec.armadilhaEspaco || undefined}
        className="flex flex-col items-center gap-2 select-none"
      >
        {/*
          ⚠️ ESCOLHER pede confirmar.

          "Qual grupo tem MAIS?" é escolha entre dois, e o toque num grupo era
          a resposta. É uma das sete competências que a criança encontra ao
          abrir o app, e o pai cobrou a confirmação mais de uma vez.

          A voz diz a POSIÇÃO — "o grupo da esquerda" —, não a contagem: dizer
          "este grupo tem cinco" entregaria a resposta no toque. Posição é fala
          fixa, está no pacote de vozes, e é o que uma criança que não lê pode
          usar para saber o que o ✓ vai confirmar.
        */}
        <AlternativasQueFalam
          alternativas={spec.grupos.map((_, i) => ({
            valor: i,
            rotulo: i === 0 ? "o grupo da esquerda" : "o grupo da direita",
          }))}
          onEscolher={valor => tocar(Number(valor))}
          falar={falar}
          disabled={travado}
          className="flex items-stretch justify-center gap-3"
          renderAlternativa={(alternativa, regra) => {
            const i = Number(alternativa.valor);
            const grupo = spec.grupos[i];
            const selecionado = escolhido === i;
            const correto = fase === "acerto" && i === spec.resposta;
            const erro = fase === "erro" && selecionado;
            const destaqueAula = Boolean(mostrar?.destacarAmbos);
            const pulsarAula = Boolean(mostrar?.pulsarGrupos);
            return (
              <motion.div
                key={`${grupo.emoji}-${grupo.quantidade}-${i}`}
                data-comparacao-grupo={i}
                data-quantidade={grupo.quantidade}
                data-distribuicao={grupo.distribuicao}
                data-caixa={`${grupo.caixa.largura}x${grupo.caixa.altura}`}
                animate={erro
                  ? { x: [0, -4, 4, 0] }
                  : correto || pulsarAula
                    ? { scale: [1, 1.04, 1] }
                    : destaqueAula
                      ? { opacity: 1 }
                      : {}}
                transition={{ duration: pulsarAula ? 0.7 : 0.35 }}
                style={{
                  width: grupo.caixa.largura,
                  minHeight: grupo.caixa.altura,
                  opacity: emAula && !destaqueAula && !pulsarAula && paresTutorial === 0 ? 0.78 : 1,
                }}
              >
                <Grupo
                  items={itensDoGrupo(grupo, exibirPareamento ? paresVisiveisNaCena : 0)}
                  onClick={regra.onToque}
                  disabled={regra.disabled}
                  // Armada: a criança tem de VER qual grupo o ✓ vai confirmar.
                  selected={correto || regra.armada}
                  rotulo={`grupo ${i + 1}`}
                />
              </motion.div>
            );
          }}
        />

        {spec.pareamentoDisponivel && fase === "idle" && !emAula && (
          <button
            type="button"
            data-comparacao-parear
            disabled={Boolean(disabled)}
            onClick={() => setMostrarPares(v => !v)}
            className="rounded-full border border-blue-300 bg-white px-3 py-1 text-xs font-bold text-blue-800 shadow-sm"
          >
            {mostrarPares ? "Esconder pares" : "Quer parear?"}
          </button>
        )}

        {exibirPareamento && (
          <Pareamento spec={spec} limitePares={limitePares} mostrarSobra={mostrarSobra} />
        )}
      </div>
    </PalcoEscalado>
  );
}
