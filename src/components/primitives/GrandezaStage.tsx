import React from "react";
import { motion } from "motion/react";
import { Grupo } from "./Grupo";
import { PalcoEscalado } from "./PalcoEscalado";
import {
  ALTURA_DA_CAIXA,
  GrandezaSpec,
  LARGURA_DA_CAIXA,
  LINHA_DE_INICIO,
  LINHA_DO_CHAO,
  ObjetoDeGrandeza,
  valorComparado,
} from "../../curriculum/procedimentos/grandezaContract";
import { AcaoDeGrandeza, FALAS } from "../../curriculum/procedimentos/grandezaProcedure";

const ABERTURA_MS = 1200;
const ERRO_MS = 2200;
const ACERTO_MS = 1800;
const BASE_OBJETO = 84;

type Fase = "idle" | "erro" | "acerto" | "fecho";

interface Props {
  spec: GrandezaSpec;
  onAnswer?: (valor: number, acao: AcaoDeGrandeza) => void;
  disabled?: boolean;
  falar?: (texto: string) => void;
  mostrar?: {
    destacarLinhaBase?: boolean;
    subirLinhaTracejada?: boolean;
    destacarMaior?: boolean;
  } | null;
}

function ObjetoVisual({ o, eixo, destaque, erro, delay }: {
  o: ObjetoDeGrandeza;
  eixo: GrandezaSpec["eixo"];
  destaque: boolean;
  erro: boolean;
  delay: number;
}) {
  const sx = o.comprimento / BASE_OBJETO;
  const sy = o.altura / BASE_OBJETO;
  return (
    <motion.span
      data-grandeza-object
      data-grandeza-altura={o.altura}
      data-grandeza-comprimento={o.comprimento}
      className="relative z-10 flex h-[84px] w-[84px] items-center justify-center"
      initial={{ opacity: 0, x: eixo === "horizontal" ? -24 : 0, y: eixo === "horizontal" ? 0 : -28, scale: 0.94 }}
      animate={{
        opacity: 1,
        x: erro ? [0, -5, 5, 0] : 0,
        y: 0,
        scale: destaque ? 1.08 : 1,
      }}
      transition={erro ? { duration: 0.4 } : { duration: 0.7, delay }}
    >
      <span
        aria-hidden
        className="block text-[68px] leading-none"
        style={{
          transform: `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`,
          transformOrigin: eixo === "horizontal" ? "left center" : "center bottom",
        }}
      >
        {o.emoji}
      </span>
    </motion.span>
  );
}

function Guia({ spec, objeto, de, para }: {
  spec: GrandezaSpec;
  objeto: ObjetoDeGrandeza;
  de?: number;
  para?: number;
}) {
  const vertical = spec.eixo !== "horizontal";
  const alvo = vertical ? objeto.altura : objeto.comprimento;
  const inicio = de ?? alvo;
  const fim = para ?? alvo;
  if (vertical) {
    return (
      <motion.span
        data-grandeza-guide
        aria-hidden
        className="pointer-events-none absolute inset-x-2 z-30 border-t-[3px] border-dashed border-blue-600"
        initial={{ top: LINHA_DO_CHAO - inicio, opacity: 0 }}
        animate={{ top: LINHA_DO_CHAO - fim, opacity: 1 }}
        transition={{ duration: de == null ? 0.55 : 0.8, ease: "easeInOut" }}
      />
    );
  }
  return (
    <motion.span
      data-grandeza-guide
      aria-hidden
      className="pointer-events-none absolute inset-y-3 z-30 border-l-[3px] border-dashed border-blue-600"
      initial={{ left: LINHA_DE_INICIO + inicio, opacity: 0 }}
      animate={{ left: LINHA_DE_INICIO + fim, opacity: 1 }}
      transition={{ duration: de == null ? 0.55 : 0.8, ease: "easeInOut" }}
    />
  );
}

function SetaMedida({ spec, objeto }: { spec: GrandezaSpec; objeto: ObjetoDeGrandeza }) {
  if (spec.eixo === "horizontal") {
    return (
      <span
        data-grandeza-measure-arrow
        aria-hidden
        className="pointer-events-none absolute z-40 flex items-center text-blue-700"
        style={{ left: LINHA_DE_INICIO, top: 10, width: objeto.comprimento }}
      >
        <span className="text-lg leading-none">◀</span>
        <span className="h-[3px] flex-1 bg-blue-600" />
        <span className="text-lg leading-none">▶</span>
      </span>
    );
  }
  return (
    <span
      data-grandeza-measure-arrow
      aria-hidden
      className="pointer-events-none absolute z-40 flex flex-col items-center text-blue-700"
      style={{ left: 7, top: LINHA_DO_CHAO - objeto.altura, height: objeto.altura }}
    >
      <span className="text-lg leading-none">▲</span>
      <span className="w-[3px] flex-1 bg-blue-600" />
      <span className="text-lg leading-none">▼</span>
    </span>
  );
}

export function GrandezaStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [fase, setFase] = React.useState<Fase>("idle");
  const [escolhido, setEscolhido] = React.useState<number | null>(null);
  const [ordem, setOrdem] = React.useState<number[]>([]);
  const [referenciaPronta, setReferenciaPronta] = React.useState(false);
  const [entradaSeq, setEntradaSeq] = React.useState(0);
  const timers = React.useRef<number[]>([]);

  const limparTimers = React.useCallback(() => {
    timers.current.forEach(t => window.clearTimeout(t));
    timers.current = [];
  }, []);
  const agendar = React.useCallback((fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  React.useEffect(() => {
    limparTimers();
    setFase("idle");
    setEscolhido(null);
    setOrdem([]);
    setReferenciaPronta(false);
    setEntradaSeq(n => n + 1);
    const t = window.setTimeout(() => setReferenciaPronta(true), ABERTURA_MS);
    timers.current.push(t);
    return limparTimers;
  }, [spec, limparTimers]);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;
  const travado = Boolean(disabled) || fase !== "idle" || emAula;

  function leitura(valor: number, ordemProduzida?: number[]): AcaoDeGrandeza {
    return {
      escolhido: valor,
      certo: spec.resposta,
      vencedorDoOutroAtributo: spec.vencedorDoOutroAtributo,
      diferencaPequena: spec.pequena,
      antesDaReferencia: !referenciaPronta,
      atributo: spec.atributo,
      ...(ordemProduzida ? { ordemProduzida } : {}),
    };
  }

  function resolver(valor: number, certo: boolean, ordemProduzida?: number[]) {
    setEscolhido(valor >= 0 ? valor : ordemProduzida?.[ordemProduzida.length - 1] ?? null);
    if (!certo) {
      setFase("erro");
      falar?.(FALAS.erroSuave(spec.atributo, spec.polo));
      onAnswer?.(valor, leitura(valor, ordemProduzida));
      agendar(() => {
        setFase("idle");
        setEscolhido(null);
        setOrdem([]);
      }, ERRO_MS);
      return;
    }
    setFase("acerto");
    falar?.(FALAS.acerto(spec.atributo, spec.polo));
    onAnswer?.(valor, leitura(valor, ordemProduzida));
    agendar(() => setFase("fecho"), ACERTO_MS);
  }

  function tocar(i: number) {
    if (travado) return;
    if (!spec.seria) {
      resolver(i, i === spec.resposta);
      return;
    }
    if (ordem.includes(i)) return;
    const nova = [...ordem, i];
    setOrdem(nova);
    if (nova.length < spec.objetos.length) return;
    const certo = nova.every((v, k) => v === spec.ordemCerta[k]);
    // Nunca reutilize o primeiro item como valor de erro: uma ordem errada pode começar certo.
    resolver(certo ? spec.resposta : -1, certo, nova);
  }

  const medidas = spec.objetos.map(o => valorComparado(o, spec.atributo));
  const menorIdx = medidas.indexOf(Math.min(...medidas));
  const objetoMenor = spec.objetos[menorIdx];
  const mostrarGuiaNormal = referenciaPronta && fase !== "erro" && (
    spec.reguaFantasma || fase === "fecho" || Boolean(emAula && mostrar?.subirLinhaTracejada)
  );
  const escolhidoObj = escolhido != null && escolhido >= 0 ? spec.objetos[escolhido] : null;
  const corretoObj = spec.objetos[spec.resposta];

  return (
    <PalcoEscalado>
      <div className="flex flex-col items-center gap-2 select-none" data-grandeza-stage data-grandeza-eixo={spec.eixo}>
        <div className="flex items-end justify-center" style={{ gap: 14 }}>
          {spec.objetos.map((o, i) => {
            const naOrdem = spec.seria ? ordem.indexOf(i) : -1;
            const certoVisual = fase === "acerto" && i === spec.resposta;
            const erroVisual = fase === "erro" && escolhido === i;
            const destaqueAula = Boolean(emAula && mostrar?.destacarMaior && i === spec.resposta);
            const ref = {
              largura: LARGURA_DA_CAIXA,
              altura: ALTURA_DA_CAIXA,
              destacada: Boolean(emAula && mostrar?.destacarLinhaBase),
            };
            const grupo = spec.eixo === "horizontal"
              ? { inicio: { ...ref, linha: LINHA_DE_INICIO } }
              : { chao: { ...ref, linha: LINHA_DO_CHAO } };
            return (
              <div key={`${entradaSeq}-${i}-${o.nome}`} className="relative" style={{ width: LARGURA_DA_CAIXA, height: ALTURA_DA_CAIXA }}>
                <Grupo
                  {...grupo}
                  disabled={travado}
                  onClick={() => tocar(i)}
                  selected={certoVisual || naOrdem >= 0}
                  rotulo={`${o.nome} ${i + 1}`}
                  items={[
                    <ObjetoVisual
                      key="obj"
                      o={o}
                      eixo={spec.eixo}
                      destaque={certoVisual || destaqueAula}
                      erro={erroVisual}
                      delay={0.25 + i * 0.18}
                    />,
                  ]}
                />

                {mostrarGuiaNormal && <Guia spec={spec} objeto={objetoMenor} />}
                {fase === "erro" && escolhidoObj && (
                  <Guia
                    key={`erro-${escolhido}`}
                    spec={spec}
                    objeto={corretoObj}
                    de={spec.eixo === "horizontal" ? escolhidoObj.comprimento : escolhidoObj.altura}
                    para={spec.eixo === "horizontal" ? corretoObj.comprimento : corretoObj.altura}
                  />
                )}
                {certoVisual && <SetaMedida spec={spec} objeto={o} />}

                {naOrdem >= 0 && (
                  <span
                    data-grandeza-order={naOrdem + 1}
                    aria-hidden
                    className="absolute right-2 top-2 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white shadow"
                  >{naOrdem + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PalcoEscalado>
  );
}
