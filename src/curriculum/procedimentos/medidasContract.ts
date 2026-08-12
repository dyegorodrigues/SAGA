import { ModoMedida } from "./medidasProcedure";

export interface ItemDeMedida {
  id: string;
  emoji: string;
  nome: string;
  /** Marca não verbal que acompanha o recipiente antes/depois do despejo. */
  marcador?: string;
  /** Grandeza verdadeira; sem unidade visível em F0. */
  valor: number;
  /** Tamanho aparente do objeto/recipiente — pode deliberadamente enganar. */
  tamanhoVisual: number;
  /** Capacidade: largura relativa do recipiente. */
  largura?: number;
  /** Capacidade: altura relativa do recipiente. */
  altura?: number;
  /** Capacidade: altura aparente do líquido antes da verificação. */
  preenchimento?: number;
}

export interface MedidasSpec {
  nivel: number;
  modo: ModoMedida;
  seriacao: boolean;
  contraintuitivo: boolean;
  formatosDiferentes: boolean;
  itens: ItemDeMedida[];
  resposta: number;
  ordemCerta: number[];
  ordemVisual: number[];
  maiorVisual: number;
  enunciado: string;
  falado: string;
}

function embaralhar<T>(lista: T[], sorteio: () => number): T[] {
  const fora = [...lista];
  for (let i = fora.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
    [fora[i], fora[j]] = [fora[j], fora[i]];
  }
  return fora;
}

function ordenar(itens: ItemDeMedida[], valor: (x: ItemDeMedida) => number): number[] {
  return [...itens.keys()].sort((a, b) => valor(itens[b]) - valor(itens[a]));
}

function pesoDoNivel(nivel: number): ItemDeMedida[] {
  if (nivel === 1) {
    return [
      { id: "pena", emoji: "🪶", nome: "pena", valor: 1, tamanhoVisual: 0.72 },
      { id: "pedra", emoji: "🪨", nome: "pedra", valor: 6, tamanhoVisual: 1.05 },
    ];
  }
  if (nivel === 4) {
    // O pequeno é MAIS pesado: a aparência aponta para a resposta errada.
    return [
      { id: "peso", emoji: "⚙️", nome: "pecinha de metal", valor: 8, tamanhoVisual: 0.68 },
      { id: "almofada", emoji: "🧸", nome: "ursão de pelúcia", valor: 3, tamanhoVisual: 1.34 },
    ];
  }
  // L5: três valores distintos e uma ordem visual deliberadamente diferente.
  return [
    { id: "metal", emoji: "🔩", nome: "metal", valor: 8, tamanhoVisual: 0.72 },
    { id: "caixa", emoji: "📦", nome: "caixa", valor: 5, tamanhoVisual: 1.30 },
    { id: "bola", emoji: "🏐", nome: "bola", valor: 2, tamanhoVisual: 1.02 },
  ];
}

function capacidadeDoNivel(nivel: number): ItemDeMedida[] {
  if (nivel === 2) {
    // Mesma forma, tamanhos diferentes, ambos CHEIOS: agora a pergunta mede
    // capacidade (quanto cabe), não a quantidade de líquido já servida.
    return [
      { id: "copo-a", emoji: "🥛", nome: "copo menor", marcador: "●", valor: 0.38, tamanhoVisual: 0.78, largura: 0.78, altura: 0.78, preenchimento: 1 },
      { id: "copo-b", emoji: "🥛", nome: "copo maior", marcador: "▲", valor: 0.72, tamanhoVisual: 1.12, largura: 1.12, altura: 1.12, preenchimento: 1 },
    ];
  }
  if (nivel === 3) {
    // Ambos estão cheios. O alto/fino chama a atenção pela ALTURA, mas sua
    // capacidade é menor; despejar no mesmo recipiente neutraliza o formato.
    return [
      { id: "alto-fino", emoji: "🧪", nome: "recipiente alto e fino", marcador: "●", valor: 0.46, tamanhoVisual: 1.12, largura: 0.62, altura: 1.22, preenchimento: 1 },
      { id: "baixo-largo", emoji: "🥣", nome: "recipiente baixo e largo", marcador: "▲", valor: 0.72, tamanhoVisual: 1.28, largura: 1.30, altura: 0.82, preenchimento: 1 },
    ];
  }
  // L5: três recipientes CHEIOS. A ordem pela altura externa é diferente
  // da ordem pela capacidade — a criança precisa recorrer à referência comum.
  return [
    { id: "fino", emoji: "🧪", nome: "recipiente fino", marcador: "●", valor: 0.38, tamanhoVisual: 0.78, largura: 0.50, altura: 1.22, preenchimento: 1 },
    { id: "largo", emoji: "🥣", nome: "recipiente largo", marcador: "▲", valor: 0.58, tamanhoVisual: 1.32, largura: 1.30, altura: 0.82, preenchimento: 1 },
    { id: "medio", emoji: "🥛", nome: "recipiente médio", marcador: "■", valor: 0.78, tamanhoVisual: 1.02, largura: 1.24, altura: 1.00, preenchimento: 1 },
  ];
}

export function construirMedidasSpec(nivelBruto: number, sorteio: () => number): MedidasSpec {
  const nivel = Math.min(5, Math.max(1, Math.round(nivelBruto)));
  const seriacao = nivel === 5;
  const modo: ModoMedida = nivel === 1 || nivel === 4
    ? "peso"
    : nivel === 2 || nivel === 3
      ? "capacidade"
      : (sorteio() < 0.5 ? "peso" : "capacidade");

  const base = modo === "peso" ? pesoDoNivel(nivel) : capacidadeDoNivel(nivel);
  const itens = embaralhar(base, sorteio);
  const ordemCerta = ordenar(itens, i => i.valor);
  const valorVisual = (i: ItemDeMedida) => modo === "capacidade"
    // Em capacidade todos começam cheios: a armadilha visual é ALTURA/TAMANHO
    // do recipiente, nunca "quanto líquido alguém já colocou".
    ? (i.altura ?? i.tamanhoVisual)
    : i.tamanhoVisual;
  const ordemVisual = ordenar(itens, valorVisual);
  const maiorVisual = ordemVisual[0];
  const resposta = ordemCerta[0];
  const formatosDiferentes = modo === "capacidade" && nivel >= 3;
  const contraintuitivo = nivel === 3 || nivel === 4;
  const enunciado = seriacao
    ? (modo === "peso"
      ? "Toque do mais pesado para o mais leve."
      : "Toque do que cabe mais para o que cabe menos.")
    : (modo === "peso" ? "Qual é mais pesado?" : "Em qual cabe mais líquido?");

  return {
    nivel, modo, seriacao, contraintuitivo, formatosDiferentes,
    itens, resposta, ordemCerta, ordemVisual, maiorVisual,
    enunciado, falado: enunciado,
  };
}

export function semEmpate(spec: MedidasSpec): boolean {
  return new Set(spec.itens.map(i => i.valor)).size === spec.itens.length;
}

export function armadilhaReal(spec: MedidasSpec): boolean {
  return !spec.contraintuitivo || spec.ordemVisual[0] !== spec.ordemCerta[0];
}
