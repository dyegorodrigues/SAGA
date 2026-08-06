import React from "react";
import { motion } from "motion/react";
import { Grupo } from "./Grupo";
import { PalcoEscalado } from "./PalcoEscalado";
import {
  ALTURA_DA_CAIXA,
  GrandezaSpec,
  LARGURA_DA_CAIXA,
  LINHA_DO_CHAO,
} from "../../curriculum/procedimentos/grandezaContract";
import { AcaoDeGrandeza, FALAS } from "../../curriculum/procedimentos/grandezaProcedure";

/**
 * `GrandezaStage` — a tela de GM.01, ficha F49.
 *
 * Composta a partir do `Grupo` em **modo comparação**, que é a primitiva que a
 * §1 nomeia — com a base alinhada que a §2 exige e que o modo padrão do `Grupo`
 * não dava.
 *
 * ---
 *
 * ### A linha de chão é o conteúdo, não a moldura
 *
 * §4, abertura: *"uma **linha de chão** se desenha atravessando os dois
 * contêineres. Os objetos 'pousam' nela."*
 *
 * Ela é o instrumento da comparação. Por isso duas coisas dependem dela:
 * o palco só aceita resposta **depois** que ela termina de se desenhar sem
 * penalizar quem tocou antes (a §4 dá 1,2s), e responder antes é a única
 * assinatura observável de `BASE_DESALINHADA` (ver o procedimento).
 *
 * ### A régua fantasma
 *
 * §4, do nível 3 em diante: *"uma linha horizontal tracejada sobe do chão até o
 * topo do menor — mostra visualmente a diferença"*. Com diferença de 14%, olhar
 * não basta; a régua é o que transforma "parece" em "é".
 */

/** §4: a linha de chão leva 1,2s para se desenhar. */
const DESENHO_DO_CHAO = 1200;

interface Props {
  spec: GrandezaSpec;
  onAnswer?: (valor: number, acao: AcaoDeGrandeza) => void;
  disabled?: boolean;
  /** A voz do app. §4: ela enfatiza o atributo e nomeia o que a linha mostra. */
  falar?: (texto: string) => void;
  /** O passo da micro-aula (§8). */
  mostrar?: {
    /** §8: "Os dois estão no chão." */
    destacarLinhaBase?: boolean;
    /** §8: "Veja qual sobe mais." */
    subirLinhaTracejada?: boolean;
    /** §8: "Este é mais alto!" */
    destacarMaior?: boolean;
  } | null;
}

export function GrandezaStage({ spec, onAnswer, disabled, falar, mostrar }: Props) {
  const [escolhido, setEscolhido] = React.useState<number | null>(null);
  const [ordem, setOrdem] = React.useState<number[]>([]);
  const [chaoPronto, setChaoPronto] = React.useState(false);

  const emAula = mostrar != null && Object.keys(mostrar).length > 0;

  React.useEffect(() => {
    setChaoPronto(false);
    const t = window.setTimeout(() => setChaoPronto(true), DESENHO_DO_CHAO);
    return () => window.clearTimeout(t);
  }, [spec]);

  const respondeu = escolhido !== null;
  const travado = disabled || respondeu || emAula;

  function tocar(i: number) {
    if (travado) return;

    // §5, nível 5: seriação. Ela toca em ordem, e a cena só julga no fim.
    if (spec.seria) {
      if (ordem.includes(i)) return;
      const nova = [...ordem, i];
      setOrdem(nova);
      if (nova.length < spec.objetos.length) return;
      const certo = nova.every((v, k) => v === spec.ordemCerta[k]);
      setEscolhido(certo ? spec.resposta : nova[0]);
      falar?.(certo
        ? FALAS.acerto(spec.atributo, spec.polo)
        : FALAS.erroSuave(spec.atributo, spec.polo));
      onAnswer?.(certo ? spec.resposta : nova[0], leitura(certo ? spec.resposta : nova[0]));
      return;
    }

    setEscolhido(i);
    falar?.(i === spec.resposta
      ? FALAS.acerto(spec.atributo, spec.polo)
      : FALAS.erroSuave(spec.atributo, spec.polo));
    onAnswer?.(i, leitura(i));
  }

  function leitura(i: number): AcaoDeGrandeza {
    return {
      escolhido: i,
      certo: spec.resposta,
      vencedorDoOutroAtributo: spec.vencedorDoOutroAtributo,
      diferencaPequena: spec.pequena,
      // A §4 dá 1,2s para o chão se desenhar. Tocar antes é decidir sem a
      // referência — a única assinatura possível de `BASE_DESALINHADA`.
      antesDoChao: !chaoPronto,
    };
  }

  /** O topo do MENOR, medido do chão — onde a régua fantasma para (§4). */
  const topoDoMenor = Math.min(...spec.objetos.map(o => o.altura));

  return (
    <PalcoEscalado>
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="flex items-end justify-center" style={{ gap: 14 }}>
        {spec.objetos.map((o, i) => {
          const certo = respondeu && i === spec.resposta;
          const errado = respondeu && i === escolhido && i !== spec.resposta;
          const naOrdem = spec.seria ? ordem.indexOf(i) : -1;
          return (
            <div key={`${o.nome}-${i}`} className="relative">
              <Grupo
                disabled={travado}
                onClick={() => tocar(i)}
                selected={certo || naOrdem >= 0}
                rotulo={`${o.nome} ${i + 1}`}
                chao={{
                  linha: LINHA_DO_CHAO,
                  largura: LARGURA_DA_CAIXA,
                  altura: ALTURA_DA_CAIXA,
                  destacada: emAula ? mostrar?.destacarLinhaBase === true : false,
                }}
                items={[
                  <motion.span
                    key="obj"
                    aria-hidden
                    style={{
                      // A altura desenhada É a grandeza comparada. Ela vem do
                      // contrato, e a largura anda ao contrário — é o que faz
                      // "escolher o maiorzão" ser uma resposta diferente de
                      // "escolher o mais alto".
                      fontSize: o.altura,
                      lineHeight: 1,
                      display: "block",
                      transform: `scaleX(${(o.largura / 58).toFixed(3)})`,
                      transformOrigin: "bottom center",
                    }}
                    // §4, acerto: "o objeto maior cresce ligeiramente".
                    animate={{
                      scale: certo || (emAula && mostrar?.destacarMaior && i === spec.resposta) ? 1.08 : 1,
                      x: errado ? [0, -5, 5, 0] : 0,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {o.emoji}
                  </motion.span>,
                ]}
              />

              {/* §4, a régua fantasma: sobe do chão até o topo do MENOR, e é
                  contra ela que a criança vê quem passa. Só do nível 3, onde a
                  diferença deixa de ser óbvia. */}
              {(spec.reguaFantasma && (respondeu || (emAula && mostrar?.subirLinhaTracejada))) && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-2"
                  style={{ top: LINHA_DO_CHAO - topoDoMenor, borderTop: "3px dashed #2563EB" }}
                  initial={{ opacity: 0, scaleX: 0.2 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.6 }}
                />
              )}

              {/* Na seriação, a ordem em que ela tocou fica visível: sem isso
                  ela não tem como saber onde parou numa lista de três. */}
              {naOrdem >= 0 && (
                <span
                  aria-hidden
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-black"
                  style={{ backgroundColor: "#2563EB", color: "#FFF" }}
                >
                  {naOrdem + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </PalcoEscalado>
  );
}
