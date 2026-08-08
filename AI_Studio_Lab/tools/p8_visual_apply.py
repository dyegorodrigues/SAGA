from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    s = p.read_text()
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {n}x")
    p.write_text(s.replace(old, new))


# A primeira sonda P8 encontrou contraste abaixo de 4.5:1 em quatro grupos de
# texto. Corrige o COMPONENTE, nunca o fiscal: aba inativa, aviso bloqueado,
# melhor degrau e rótulos das estatísticas.
p = Path("src/components/home/DojoTab.tsx")
s = p.read_text()
old_tab = '"text-slate-400 hover:text-slate-600"'
new_tab = '"text-slate-600 hover:text-slate-800"'
if s.count(old_tab) != 2:
    raise SystemExit(f"DojoTab: abas inativas esperadas 2x, encontradas {s.count(old_tab)}x")
s = s.replace(old_tab, new_tab)
for old, new in [
    ('text-slate-500 bg-slate-100 rounded-xl px-3 py-2', 'text-slate-700 bg-slate-100 rounded-xl px-3 py-2'),
    ('<span className="text-slate-400">Melhor:', '<span className="text-slate-600">Melhor:'),
    ('text-[9px] font-bold text-slate-400 uppercase', 'text-[9px] font-bold text-slate-600 uppercase'),
]:
    if s.count(old) != 1:
        raise SystemExit(f"DojoTab: contraste {old!r} esperado 1x, encontrado {s.count(old)}x")
    s = s.replace(old, new)
p.write_text(s)

replace_once(
    "sonda/cenas.tsx",
    'import { FaseDaMoldura } from "../src/components/primitives/MolduraStage";\n',
    'import { FaseDaMoldura } from "../src/components/primitives/MolduraStage";\nimport { DojoTab } from "../src/components/home/DojoTab";\n',
)

helper = '''
function progressoP8(lvl: number, maxLvl = lvl) {
  return {
    lvl, maxLvl, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0,
  };
}

function JardimProbe({ modo }: { modo: "locked" | "partial" | "advanced" }) {
  const prog = modo === "locked" ? {} : modo === "partial" ? {
    "N1.03": progressoP8(1, 3),
    "N1.08": progressoP8(3, 3),
    "N1.11": progressoP8(2, 2),
    "N1.10": progressoP8(2, 2),
  } : {
    "N1.03": progressoP8(3, 5),
    "N1.08": progressoP8(4, 5),
    "N1.11": progressoP8(3, 3),
    "N1.10": progressoP8(3, 4),
  };

  const dojoTracks = modo === "locked" ? {} : modo === "partial" ? {
    JD1: {
      unlocked: true, mastered: false, family: "JD", currentStep: 2, highestStep: 3,
      goodRounds: 1, weakRounds: 0, rounds: 3, attempts: 24, correct: 20,
    },
    JD2: {
      unlocked: true, mastered: false, family: "JD", currentStep: 1, highestStep: 1,
      goodRounds: 0, weakRounds: 0, rounds: 1, attempts: 8, correct: 6,
    },
  } : {
    JD1: {
      unlocked: true, mastered: true, family: "JD", currentStep: 4, highestStep: 5,
      goodRounds: 0, weakRounds: 1, rounds: 12, attempts: 96, correct: 87,
    },
    JD2: {
      unlocked: true, mastered: false, family: "JD", currentStep: 3, highestStep: 4,
      goodRounds: 1, weakRounds: 0, rounds: 7, attempts: 56, correct: 48,
    },
    JD3: {
      unlocked: true, mastered: false, family: "JD", currentStep: 2, highestStep: 2,
      goodRounds: 0, weakRounds: 0, rounds: 4, attempts: 32, correct: 26,
    },
    JD5: {
      unlocked: true, mastered: true, family: "JD", currentStep: 3, highestStep: 5,
      goodRounds: 0, weakRounds: 0, rounds: 10, attempts: 80, correct: 70,
    },
  };

  return (
    <div className="p-3" style={{ background: "#F8FAFC" }}>
      <DojoTab
        prog={prog as never}
        dojoTracks={dojoTracks as never}
        onGardenTrack={nada}
        onMixed={nada}
        onOpenPicker={nada}
      />
    </div>
  );
}
'''

anchor = '''/**
 * O catálogo. Cresce a cada competência construída — uma cena por estado que
 * vale olhar, não uma por competência.
 */
export const CENAS: Cena[] = [
'''
replacement = helper + '''
/**
 * O catálogo. Cresce a cada competência construída — uma cena por estado que
 * vale olhar, não uma por competência.
 */
export const CENAS: Cena[] = [
  {
    nome: "P8 Jardim home — todas as trilhas bloqueadas",
    render: () => <JardimProbe modo="locked" />,
  },
  {
    nome: "P8 Jardim home — JD1 e JD2 abertas",
    render: () => <JardimProbe modo="partial" />,
  },
  {
    nome: "P8 Jardim home — progresso avancado e reflexos",
    render: () => <JardimProbe modo="advanced" />,
  },
'''
replace_once("sonda/cenas.tsx", anchor, replacement)
print("contraste + sonda P8 preparados")
