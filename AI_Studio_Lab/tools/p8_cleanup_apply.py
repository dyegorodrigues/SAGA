from pathlib import Path
import re


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    s = p.read_text()
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {n}x")
    p.write_text(s.replace(old, new))


# KidHome: apaga a superfície do Garden CRA antigo. O Garden real vive em
# DojoTab/JARDIM e não usa LevelPicker nem SUBJECTS para descobrir trilhas.
# `C` permanece: o cabeçalho global ainda usa C.ink.
p = Path("src/components/KidHomeScreen.tsx")
s = p.read_text()
s = s.replace(
    'import { C, FONT, CoinChip, LevelDots, sfx, FRESH, TOTAL_STICKERS, THEMES, Mascote } from "./Mascot";',
    'import { C, FONT, CoinChip, sfx, THEMES } from "./Mascot";',
)
s = s.replace(
    'import { MascotEvolutionCard, getKidLifetimeStars, getMascotStage } from "./MascotEvolution";',
    'import { getKidLifetimeStars, getMascotStage } from "./MascotEvolution";',
)
s = s.replace('import { LearningPath } from "./LearningPath";\n', '')
s = s.replace('import { SUBJECTS } from "../subjects";\n', '')
s = s.replace('  onDojo: () => void;\n', '')
s = s.replace('  mixedDoneToday: boolean;\n', '')
s = s.replace('  onDojo,\n', '')
s = s.replace('  mixedDoneToday,\n', '')

pattern = re.compile(
    r'''  // Amostra do que cada nível pergunta.*?\n  const renderTrackCard = \(t: Track\) => \{.*?\n  \};\n\n''',
    re.S,
)
s, count = pattern.subn('', s, count=1)
if count != 1:
    raise SystemExit(f"KidHome: bloco CRA antigo esperado 1x, encontrado {count}x")
p.write_text(s)

# App: remove props que só existiam para o caminho morto da home.
p = Path("src/App.tsx")
s = p.read_text()
old = '''          onDojo={() => {
            setScreen({ name: "game", kid: screen.kid, track: "dojo" });
          }}

'''
if s.count(old) != 1:
    raise SystemExit(f"App: onDojo antigo esperado 1x, encontrado {s.count(old)}x")
s = s.replace(old, '')
old = '            mixedDoneToday={kidById(screen.kid!).lastMixedDay === localDay()}\n'
if s.count(old) != 1:
    raise SystemExit(f"App: mixedDoneToday esperado 1x, encontrado {s.count(old)}x")
s = s.replace(old, '')
p.write_text(s)

print("higiene P8 preparada")
