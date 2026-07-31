import { grafoSaga, fluencySaga, GrafoNode } from "../curriculum/grafo_saga";

export type SagaNode = GrafoNode;

export const GrafoSaga = {
  strands: {
    N1: "Senso Numérico e Contagem",
    N2: "Sistema Decimal e Valor Posicional",
    N3: "Adição e Subtração",
    N4: "Multiplicação e Divisão",
    N5: "Frações",
    N6: "Decimais, Porcentagem e Proporção",
    N7: "Números Inteiros (negativos)",
    AL: "Álgebra e Padrões",
    GE: "Geometria e Espaço",
    GM: "Grandezas e Medidas",
    PE: "Probabilidade e Estatística"
  },
  nodes: grafoSaga,
  fluency: fluencySaga
};
