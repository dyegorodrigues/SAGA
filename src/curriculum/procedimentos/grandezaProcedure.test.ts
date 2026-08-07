import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ADJETIVO, AcaoDeGrandeza, FALAS, atributoDoNivel, diagnosticar,
  diferencaDoNivel, diferencaPequena, dominou, eixoDoAtributo,
  objetosDiferentesNoNivel, quantosNoNivel, reguaFantasmaNoNivel, seriaNoNivel,
} from "./grandezaProcedure";
import {
  cabeNaCaixa, construirGrandezaSpec, outroAtributoContrario,
  semEmpate, valorComparado,
} from "./grandezaContract";
import { GM_01 } from "../fichas/jornada/GM.01";

function semente(s: number): () => number {
  let x = s >>> 0;
  return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
}
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];
const CANONE = readFileSync(join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"), "utf8").split("**").join("");

describe("F49 §5 — escada", () => {
  it.each([
    [1, "altura", "vertical", false, false],
    [2, "comprimento", "horizontal", false, false],
    [3, "altura", "vertical", false, false],
    [4, "altura", "vertical", true, false],
    [5, "tamanho", "uniforme", false, true],
  ])("nível %i: %s/%s, objetos diferentes %s, seriação %s", (n, attr, eixo, dif, seria) => {
    expect(atributoDoNivel(n)).toBe(attr);
    expect(eixoDoAtributo(attr as never)).toBe(eixo);
    expect(objetosDiferentesNoNivel(n)).toBe(dif);
    expect(seriaNoNivel(n)).toBe(seria);
  });
  it("só L3 carrega diferença pequena", () => expect([1,2,3,4,5].map(diferencaPequena)).toEqual([false,false,true,false,false]));
  it("régua fantasma entra de L3 em diante", () => expect([1,2,3,4,5].map(reguaFantasmaNoNivel)).toEqual([false,false,true,true,true]));
  it("L5 tem três objetos", () => expect([1,2,3,4,5].map(quantosNoNivel)).toEqual([2,2,2,2,3]));
  it("L1 é muito mais separado que L3", () => expect(diferencaDoNivel(1)).toBeGreaterThan(diferencaDoNivel(3) * 2));
});

describe("contrato semântico da cena", () => {
  it("nunca há empate e tudo cabe", () => {
    for (const s of SEMENTES) for (let n=1;n<=5;n+=1) {
      const spec=construirGrandezaSpec(n,semente(s));
      expect(semEmpate(spec), `empate n${n} s${s}`).toBe(true);
      expect(cabeNaCaixa(spec), `caixa n${n} s${s}`).toBe(true);
    }
  });

  it("a resposta é extrema NA DIMENSÃO QUE A PERGUNTA NOMEIA", () => {
    for (const s of SEMENTES) for (let n=1;n<=4;n+=1) {
      const spec=construirGrandezaSpec(n,semente(s));
      const vals=spec.objetos.map(o=>valorComparado(o,spec.atributo));
      const alvo=spec.polo==="maior"?Math.max(...vals):Math.min(...vals);
      expect(valorComparado(spec.objetos[spec.resposta],spec.atributo), `n${n} s${s}`).toBe(alvo);
    }
  });

  it("L2 pergunta comprimento e o vencedor é realmente o mais comprido/curto — não o mais alto", () => {
    for (const s of SEMENTES) {
      const spec=construirGrandezaSpec(2,semente(s));
      expect(spec.atributo).toBe("comprimento");
      const comprimentos=spec.objetos.map(o=>o.comprimento);
      const alturas=spec.objetos.map(o=>o.altura);
      const alvoC=spec.polo==="maior"?Math.max(...comprimentos):Math.min(...comprimentos);
      expect(spec.objetos[spec.resposta].comprimento).toBe(alvoC);
      const extremoAltura=spec.polo==="maior"?alturas.indexOf(Math.max(...alturas)):alturas.indexOf(Math.min(...alturas));
      expect(extremoAltura).not.toBe(spec.resposta);
    }
  });

  it("atributo distrator nunca aponta para a resposta certa em L1–L4", () => {
    for (const s of SEMENTES) for (let n=1;n<=4;n+=1) {
      expect(outroAtributoContrario(construirGrandezaSpec(n,semente(s))), `n${n} s${s}`).toBe(true);
    }
  });

  it("L1–L3 usam a mesma identidade; L4 troca; L5 volta à mesma identidade para isolar seriação", () => {
    for (const s of SEMENTES) {
      for (const n of [1,2,3,5]) expect(new Set(construirGrandezaSpec(n,semente(s)).objetos.map(o=>o.emoji)).size, `n${n}`).toBe(1);
      expect(new Set(construirGrandezaSpec(4,semente(s)).objetos.map(o=>o.emoji)).size).toBe(2);
    }
  });

  it("L5 escala as duas dimensões na mesma ordem e ordena os três", () => {
    for (const s of SEMENTES) {
      const spec=construirGrandezaSpec(5,semente(s));
      expect(new Set(spec.ordemCerta).size).toBe(3);
      const hs=spec.ordemCerta.map(i=>spec.objetos[i].altura);
      const cs=spec.ordemCerta.map(i=>spec.objetos[i].comprimento);
      const sh=spec.polo==="maior"?[...hs].sort((a,b)=>b-a):[...hs].sort((a,b)=>a-b);
      const sc=spec.polo==="maior"?[...cs].sort((a,b)=>b-a):[...cs].sort((a,b)=>a-b);
      expect(hs).toEqual(sh); expect(cs).toEqual(sc);
    }
  });

  it("posição na tela não denuncia a resposta", () => {
    expect(new Set(SEMENTES.map(s=>construirGrandezaSpec(1,semente(s)).resposta)).size).toBeGreaterThan(1);
  });

  it("500 amostras sem exceção", () => {
    for(let i=0;i<500;i+=1) expect(()=>construirGrandezaSpec((i%5)+1,semente(i+1))).not.toThrow();
  });
});

describe("§6 diagnóstico", () => {
  const base: AcaoDeGrandeza={ escolhido:0,certo:0,vencedorDoOutroAtributo:1,diferencaPequena:false,antesDaReferencia:false,atributo:"altura" };
  it("acerto não diagnostica",()=>expect(diagnosticar(base)).toBeUndefined());
  it("decidir antes da referência é BASE_DESALINHADA",()=>expect(diagnosticar({...base,escolhido:1,antesDaReferencia:true})).toBe(MisconceptionTag.BASE_DESALINHADA));
  it("escolher a dimensão distratora é CONFUNDE_ATRIBUTOS",()=>expect(diagnosticar({...base,escolhido:1})).toBe(MisconceptionTag.CONFUNDE_ATRIBUTOS));
  it("errar diferença pequena é SO_DIFERENCA_GRANDE",()=>expect(diagnosticar({...base,escolhido:2,vencedorDoOutroAtributo:1,diferencaPequena:true})).toBe(MisconceptionTag.SO_DIFERENCA_GRANDE));
});

describe("§9 domínio",()=>{
  const a=(pequena:boolean):AcaoDeGrandeza=>({escolhido:0,certo:0,vencedorDoOutroAtributo:1,diferencaPequena:pequena,antesDaReferencia:false,atributo:"altura"});
  it("três fáceis não bastam",()=>expect(dominou([a(false),a(false),a(false)])).toBe(false));
  it("um pequeno entre três basta para a condição local",()=>expect(dominou([a(false),a(false),a(true)])).toBe(true));
});

describe("§7 e ficha",()=>{
  it("falas-base continuam no cânone",()=>{expect(CANONE).toContain(FALAS.howto);expect(CANONE).toContain(FALAS.explain);});
  it("adjetivos por eixo",()=>{expect(ADJETIVO.altura.maior).toBe("mais alto");expect(ADJETIVO.comprimento.menor).toBe("mais curto");});
  it("cinco níveis continuam grandeza",()=>{for(let n=1;n<=5;n+=1)expect(GM_01.niveis![n].primitiva).toBe("grandeza");});
  it("três tags declaradas",()=>expect(GM_01.erros_tipicos!.map(e=>e.id).sort()).toEqual([MisconceptionTag.BASE_DESALINHADA,MisconceptionTag.CONFUNDE_ATRIBUTOS,MisconceptionTag.SO_DIFERENCA_GRANDE].sort()));
});
