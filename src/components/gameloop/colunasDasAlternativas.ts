/**
 * Quantas colunas a barra de alternativas usa.
 *
 * ## Por que isto não pode ser um número fixo
 *
 * A barra era `grid-cols-2`, sempre. Com TRÊS alternativas — e são **162 das
 * 450 combinações**, incluindo os cinco níveis da N1.01, o primeiro exercício
 * que a criança encontra — a terceira ficava sozinha na segunda linha.
 *
 * Uma alternativa sozinha numa linha não é só feio: é **pista de posição**.
 * Ela ganha espaço, silhueta e centro só para si, e a criança de quatro anos
 * escolhe pelo que salta aos olhos. Numa tarefa de som→símbolo isso contamina
 * a medida: o app registra "acertou" quando o que houve foi "achou a
 * diferente".
 *
 * O `AudioChoice` já tinha corrigido exatamente isso no palco dele, e o
 * comentário de lá vale aqui: *"a quarta alternativa ficava sozinha no centro
 * e ganhava saliência visual, exatamente o tipo de atalho que pode contaminar
 * uma tarefa de reconhecimento"*. A barra genérica nunca recebeu a correção.
 *
 * ## A regra
 *
 * Nenhuma linha pode terminar com UMA alternativa sozinha, e entre as opções
 * que cumprem isso vale a mais legível — quanto menos colunas, maior o botão
 * no dedo de uma criança.
 */
export function colunasDasAlternativas(quantas: number): number {
  if (quantas <= 1) return 1;
  // Duas em duas colunas, três em três: nenhuma sobra.
  if (quantas <= 3) return quantas;
  // Quatro em 2×2 é mais legível que 4×1 num aparelho de 390px.
  if (quantas === 4) return 2;
  // Daqui para cima, a primeira largura que não deixa ninguém sozinho.
  for (const colunas of [3, 4, 2]) if (quantas % colunas !== 1) return colunas;
  return 2;
}

/** A linha final fica com uma alternativa sozinha? */
export function deixaAlguemSozinho(quantas: number, colunas: number): boolean {
  return quantas > colunas && quantas % colunas === 1;
}
