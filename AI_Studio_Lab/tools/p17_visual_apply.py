from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {count}x")
    p.write_text(text.replace(old, new))


# 1) NumberBond: a resposta e numerica e vive nos botoes externos. O circulo
#    com '?' NAO pode anunciar clique se clicar nele nao responde a questao.
#    O componente ja aceita interactivePart opcional; o contrato do Composer
#    estava mais estreito que a propria UI e e alinhado aqui.
replace_once(
    "src/curriculum/fichaQuestionContract.ts",
    '  | { whole: number | "?"; part1: number | "?"; part2: number | "?"; interactivePart: "whole" | "part1" | "part2" }\n',
    '  | { whole: number | "?"; part1: number | "?"; part2: number | "?"; interactivePart?: "whole" | "part1" | "part2" }\n',
)
replace_once(
    "src/curriculum/Composer.ts",
    "uiProps = { whole: '?', part1, part2, interactivePart: 'whole' };",
    "uiProps = { whole: '?', part1, part2 };",
)
replace_once(
    "src/curriculum/Composer.ts",
    "            interactivePart: hide1 ? 'part1' : 'part2',\n",
    "",
)

# 2) O contrato P17 passa a proibir a affordance falsa nos dois bonds novos.
replace_once(
    "src/curriculum/fichas/jornada/parteTodoProgressao.test.ts",
    '''    expect([(l5.uiProps as any).part1, (l5.uiProps as any).part2]).toContain("?");
    expect(l5.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });''',
    '''    expect([(l5.uiProps as any).part1, (l5.uiProps as any).part2]).toContain("?");
    expect(l5.uiProps).not.toHaveProperty("interactivePart");
    expect(l5.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });''',
)
replace_once(
    "src/curriculum/fichas/jornada/parteTodoProgressao.test.ts",
    '''    expect(bond.kind).toBe("bond");
    expect((bond.uiProps as any).whole).toBe(10);''',
    '''    expect(bond.kind).toBe("bond");
    expect((bond.uiProps as any).whole).toBe(10);
    expect(bond.uiProps).not.toHaveProperty("interactivePart");''',
)

# 3) A sonda antiga fotografava N1.10 L5 e N1.11 L3/L5 como se ainda fossem
#    moldura. Atualiza para a progressao real e mede tambem os degraus completos
#    que foram realocados para o Jardim do Dojo.
p = Path("sonda/cenas.tsx")
text = p.read_text()
import_anchor = 'import { N1_11 } from "../src/curriculum/fichas/jornada/N1.11";\n'
if text.count(import_anchor) != 1:
    raise SystemExit("sonda: import N1.11 inesperado")
text = text.replace(
    import_anchor,
    import_anchor + 'import { JD3, JD5 } from "../src/curriculum/fichas/dojo/jardim";\n',
)

inicio = text.find("  // N1.11 (JD3) — a moldura relâmpago.")
fim = text.find('  { nome: "N1.07 numeral na reta (nível 2)"', inicio)
if inicio < 0 or fim < 0 or fim <= inicio:
    raise SystemExit(f"sonda: bloco N1.10/N1.11 nao localizado ({inicio}, {fim})")

novo = '''  // N1.11 — uma competência, duas fontes. A Jornada instala a percepção com
  // JD3 e depois TRANSFERE para F28: moldura -> number bond -> símbolo. A escada
  // perceptual completa continua no Jardim, e também é fotografada aqui.
  { nome: "N1.11 rollback: amigos do 10 legados (nível 2)", render: (s) => <Exercicio id="N1.11" lvl={2} semente={s} /> },
  ...[1, 2].flatMap(lvl => ([
    {
      nome: `N1.11 JD3 mostrando (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={lvl} semente={s} fase="mostrando" />,
    },
    {
      nome: `N1.11 JD3 pergunta (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={lvl} semente={s} fase="perguntando" />,
    },
  ])),
  {
    nome: "N1.11 JD3 vazio sozinho (nível 2)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={2} semente={s} fase="vazio" />,
  },
  {
    nome: "N1.11 F28 number bond (nível 3)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={3} semente={s} />,
  },
  {
    nome: "N1.11 F28 símbolo (nível 4)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={4} semente={s} />,
  },
  {
    nome: "N1.11 F28 símbolo automático (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_11} lvl={5} semente={s} />,
  },
  {
    nome: "JD3 Jardim topo mostrando (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={JD3} lvl={5} semente={s} fase="mostrando" />,
  },
  {
    nome: "JD3 Jardim topo pergunta (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={JD3} lvl={5} semente={s} fase="perguntando" />,
  },

  // N1.10 — a JD5 instala a relação parte-todo na cabeça; só depois o L5 dá
  // nome/forma à mesma relação com o NumberBond. O Jardim guarda a JD5 inteira,
  // inclusive o topo sem moldura, sem criar outro nó no DAG.
  { nome: "N1.10 rollback: parte-todo legado (nível 2)", render: (s) => <Exercicio id="N1.10" lvl={2} semente={s} /> },
  ...[1, 4].flatMap(lvl => ([
    {
      nome: `N1.10 JD5 antes da tampa (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_10} lvl={lvl} semente={s} fase="mostrando" />,
    },
    {
      nome: `N1.10 JD5 com a tampa (nível ${lvl})`,
      render: (s: number) => <ExercicioDaFicha ficha={N1_10} lvl={lvl} semente={s} fase="perguntando" />,
    },
  ])),
  {
    nome: "N1.10 formalização NumberBond (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={N1_10} lvl={5} semente={s} />,
  },
  {
    nome: "JD5 Jardim topo sem moldura mostrando (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={JD5} lvl={5} semente={s} fase="mostrando" />,
  },
  {
    nome: "JD5 Jardim topo sem moldura pergunta (nível 5)",
    render: (s: number) => <ExercicioDaFicha ficha={JD5} lvl={5} semente={s} fase="perguntando" />,
  },
  {
    nome: "N1.10 micro-aula: vou esconder um",
    render: (s: number) => (
      <ExercicioDaFicha ficha={N1_10} lvl={1} semente={s} mostrar={{ taparN: 1 }} />
    ),
  },
'''

p.write_text(text[:inicio] + novo + text[fim:])
print("QA visual P17 preparado")
