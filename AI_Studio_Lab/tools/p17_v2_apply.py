from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {count}x")
    p.write_text(text.replace(old, new))


# ---------------------------------------------------------------------------
# 1. Evidência explícita da retirada REAL de andaime da JD5.
# ---------------------------------------------------------------------------
replace_once(
    "src/constants/evidencias.ts",
    '''  TOTAL_ALEM_DE_CINCO: "total-alem-de-cinco",\n} as const;''',
    '''  TOTAL_ALEM_DE_CINCO: "total-alem-de-cinco",

  /**
   * JD5 (N1.10): um acerto com os objetos realmente SOLTOS, sem a geometria
   * residual da moldura. É a prova de retirada do andaime antes da notação.
   */
  SEM_MOLDURA: "sem-moldura",
} as const;''',
)

# ---------------------------------------------------------------------------
# 2. Contrato genérico: uma micro pode exigir uma evidência ANTES de avançar
#    para a próxima representação, sem transformar isso em regra global.
# ---------------------------------------------------------------------------
replace_once(
    "src/curriculum/schema.ts",
    '''  exige?: { evidencia: string; descricao: string };\n}''',
    '''  exige?: { evidencia: string; descricao: string };
  /**
   * Ponte representacional: impede subir de nível enquanto uma condição desta
   * micro ainda não foi demonstrada. Útil quando o próximo nível troca de
   * linguagem (concreto/perceptual -> diagrama -> símbolo).
   */
  gateAntesDeAvancar?: { evidencia: string; descricao: string };
}''',
)
replace_once(
    "src/types.ts",
    '''  exigeEvidencia?: string;
  /** Regra de dominio da micro que gerou esta questao. */''',
    '''  exigeEvidencia?: string;
  /** Evidência que precisa existir antes de esta micro liberar o próximo nível. */
  gateEvidenceBeforeAdvance?: string;
  /** Regra de dominio da micro que gerou esta questao. */''',
)
replace_once(
    "src/curriculum/motores/progressEngine.ts",
    '''  exigeEvidencia?: string;
  /** Regra de dominio da micro que gerou a questao. */''',
    '''  exigeEvidencia?: string;
  /** Evidência que esta micro exige antes de liberar o próximo nível. */
  gateEvidenceBeforeAdvance?: string;
  /** Regra de dominio da micro que gerou a questao. */''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''      exigeEvidencia: q.exigeEvidencia,
      masteryRule: q.masteryRule,''',
    '''      exigeEvidencia: q.exigeEvidencia,
      gateEvidenceBeforeAdvance: q.gateEvidenceBeforeAdvance,
      masteryRule: q.masteryRule,''',
)
replace_once(
    "src/curriculum/Composer.ts",
    '''      ...(micro.dominio?.exige ? { exigeEvidencia: micro.dominio.exige.evidencia } : {}),
      ...(micro.dominio ? {''',
    '''      ...(micro.dominio?.exige ? { exigeEvidencia: micro.dominio.exige.evidencia } : {}),
      ...(micro.dominio?.gateAntesDeAvancar
        ? { gateEvidenceBeforeAdvance: micro.dominio.gateAntesDeAvancar.evidencia }
        : {}),
      ...(micro.dominio ? {''',
)

# O motor já atualiza a evidência depois de calcular a transição. Se a subida
# ocorreu sem a evidência-gate, desfaz SOMENTE a subida; quando a própria resposta
# colhe a evidência, ela libera o nível no mesmo gesto.
replace_once(
    "src/curriculum/motores/progressEngine.ts",
    '''    progress.masteryEvidence = mastery;
    if (!progress.dom && mastery.crownedBy === "multidimensional") {''',
    '''    progress.masteryEvidence = mastery;

    if (
      transition?.type === "level-up"
      && masteryAttempt.gateEvidenceBeforeAdvance
      && !(mastery.evidenciasVistas || []).includes(masteryAttempt.gateEvidenceBeforeAdvance)
    ) {
      progress.lvl = current.lvl;
      progress.maxLvl = current.maxLvl || current.lvl;
      // Mantém a prontidão: o próximo acerto que trouxer a evidência libera o
      // nível imediatamente, sem obrigar três acertos NOVOS depois da prova.
      progress.streak = Math.max(progress.streak, mode.kind === "rescue" ? 2 : 3);
      transition = null;
    }

    if (!progress.dom && mastery.crownedBy === "multidimensional") {''',
)

# ---------------------------------------------------------------------------
# 3. Composer: uma micro de moldura pode fazer fade entre dois degraus canônicos.
#    É genérico e explícito na ficha; nenhum id é hardcoded.
# ---------------------------------------------------------------------------
replace_once(
    "src/curriculum/fichaQuestionContract.ts",
    '''  moldura?: number;
  soma_max?: number;''',
    '''  moldura?: number;
  /** Degrau canônico usado pela primitiva moldura, quando difere do nível da Jornada. */
  source_level?: number;
  /** Segundo degrau para fade de andaime dentro da mesma micro. */
  source_level_alt?: number;
  soma_max?: number;''',
)
replace_once(
    "src/curriculum/fichaQuestionContract.ts",
    '''  "n_min", "n_max", "flash_ms", "start", "end", "jump_size", "moldura",
  "soma_max",''',
    '''  "n_min", "n_max", "flash_ms", "start", "end", "jump_size", "moldura",
  "source_level", "source_level_alt", "soma_max",''',
)
replace_once(
    "src/curriculum/Composer.ts",
    '''        const spec = construirMolduraSpec(params.modo as ModoDaMoldura, lvl, Math.random);''',
    '''        const fonteA = params.source_level ?? lvl;
        const fonteB = params.source_level_alt;
        for (const fonte of [fonteA, fonteB].filter((v): v is number => v !== undefined)) {
          if (!Number.isInteger(fonte) || fonte < 1 || fonte > 5) {
            throw new Error(`${ficha.id}/${micro.id}: source_level da moldura deve estar entre 1 e 5.`);
          }
        }
        // Quando há dois degraus, esta micro é um fade de andaime: o mesmo
        // conceito aparece ora com a estrutura anterior, ora sem ela.
        const nivelDaMoldura = fonteB !== undefined && Math.random() < 0.5 ? fonteB : fonteA;
        const spec = construirMolduraSpec(params.modo as ModoDaMoldura, nivelDaMoldura, Math.random);''',
)

# ---------------------------------------------------------------------------
# 4. Procedimento JD5: emite duas provas independentes — escala >5 e retirada de
#    moldura. Uma não substitui a outra.
# ---------------------------------------------------------------------------
replace_once(
    "src/curriculum/procedimentos/tenFrameProcedure.ts",
    '''export function evidenciasDe(acao: AcaoDaMoldura): string[] {
  if (acao.resposta !== acao.alvo) return [];
  if (acao.modo === "contar" && acao.cheias >= 6) return [Evidencia.ESTRUTURA_DAS_DUAS_FILEIRAS];
  if (acao.modo === "escondidos" && (acao.total ?? 0) > 5) return [Evidencia.TOTAL_ALEM_DE_CINCO];
  return [];
}''',
    '''export function evidenciasDe(acao: AcaoDaMoldura): string[] {
  if (acao.resposta !== acao.alvo) return [];
  const evidencias: string[] = [];
  if (acao.modo === "contar" && acao.cheias >= 6) {
    evidencias.push(Evidencia.ESTRUTURA_DAS_DUAS_FILEIRAS);
  }
  if (acao.modo === "escondidos" && (acao.total ?? 0) > 5) {
    evidencias.push(Evidencia.TOTAL_ALEM_DE_CINCO);
  }
  if (acao.modo === "escondidos" && acao.semMoldura) {
    evidencias.push(Evidencia.SEM_MOLDURA);
  }
  return evidencias;
}''',
)

# ---------------------------------------------------------------------------
# 5. N1.10: L4 passa a fazer fade JD5-4 -> JD5-5 e NÃO libera o bond sem um
#    acerto realmente sem moldura. L5 continua sendo a formalização do MESMO todo.
# ---------------------------------------------------------------------------
p = Path("src/curriculum/fichas/jornada/N1.10.ts")
text = p.read_text()
text = text.replace(
    '    4: { primitiva: "moldura", micro: "ate_dez", andaime: "minimo" },',
    '    4: { primitiva: "moldura", micro: "retira_moldura", andaime: "minimo" },',
)
old_micro = '''    {
      id: "ate_dez",
      fonte: "JD5",
      alvo: "ate dez — memoria de trabalho real antes da formalizacao",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
      },
      dominio,
    },'''
new_micro = '''    {
      id: "retira_moldura",
      fonte: "JD5",
      alvo: "ate dez, alternando a moldura e os objetos realmente soltos antes da formalizacao",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        source_level: 4,
        source_level_alt: 5,
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
      },
      dominio: {
        ...dominio,
        gateAntesDeAvancar: {
          evidencia: Evidencia.SEM_MOLDURA,
          descricao: "Resolver pelo menos uma vez com os objetos soltos, sem a geometria da moldura.",
        },
      },
    },'''
if text.count(old_micro) != 1:
    raise SystemExit(f"N1.10 micro ate_dez: {text.count(old_micro)}")
p.write_text(text.replace(old_micro, new_micro))

# ---------------------------------------------------------------------------
# 6. TenFrame: SEM moldura agora é outro layout. Não existem dez casas invisíveis
#    alinhadas; só existem os objetos ocupados, em coordenadas irregulares.
# ---------------------------------------------------------------------------
replace_once(
    "src/components/primitives/TenFrame.tsx",
    '''  const porLinha = 5;
  const linhas = Math.ceil(casas / porLinha);

  return (''',
    '''  const porLinha = 5;
  const linhas = Math.ceil(casas / porLinha);

  if (semMoldura) {
    return (
      <ConjuntoSolto
        ocupadas={soAMoldura ? [] : ocupadas}
        tapadas={tapadas}
        revelados={revelados}
        emoji={emoji}
      />
    );
  }

  return (''',
)

insert_anchor = '''/**
 * A tampa da JD5, fatiada por fileira.'''
loose_component = '''/**
 * JD5 nível 5 — retirada REAL da moldura.
 *
 * Esconder só a borda e manter os pontos em `grid-cols-5` era um falso fade de
 * andaime: a criança ainda recebia a geometria 5x2. Aqui não há casas vazias nem
 * colunas implícitas; só os objetos que realmente existem, em um percurso
 * irregular estável (estável para a memória, irregular para não virar ten-frame).
 */
const PONTOS_SOLTOS = [
  { x: 24, y: 34 }, { x: 88, y: 12 }, { x: 154, y: 42 }, { x: 222, y: 20 }, { x: 292, y: 46 },
  { x: 304, y: 112 }, { x: 238, y: 132 }, { x: 168, y: 104 }, { x: 98, y: 134 }, { x: 30, y: 110 },
] as const;

function ConjuntoSolto({
  ocupadas,
  tapadas,
  revelados,
  emoji,
}: {
  ocupadas: number[];
  tapadas: number[];
  revelados: number[];
  emoji?: string;
}) {
  const tampas = retangulosDaTampaSolta(tapadas);
  return (
    <div
      role="group"
      aria-label={`conjunto solto com ${ocupadas.length} objetos`}
      className="relative select-none"
      style={{ width: 340, height: 170 }}
    >
      {ocupadas.filter(i => !tapadas.includes(i)).map(i => {
        const ponto = PONTOS_SOLTOS[i];
        return (
          <motion.span
            key={i}
            data-testid="objeto-solto"
            aria-hidden
            className="absolute flex items-center justify-center"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ left: ponto.x, top: ponto.y, width: 34, height: 34 }}
          >
            {emoji ? (
              <span style={{ fontSize: 30, lineHeight: 1 }}>{emoji}</span>
            ) : (
              <span
                className="block rounded-full"
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: revelados.includes(i) ? "#D97706" : tokens.cor.elementos.base_A,
                }}
              />
            )}
          </motion.span>
        );
      })}

      {tampas.map((tampa, i) => (
        <motion.div
          key={i}
          data-testid="tampa-solta"
          role="img"
          aria-label="a tampa"
          className="absolute pointer-events-none"
          style={{
            left: tampa.x,
            top: tampa.y,
            width: tampa.w,
            height: tampa.h,
            borderRadius: 18,
            backgroundColor: "#64748B",
          }}
          initial={{ x: 38, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
      ))}
    </div>
  );
}

/**
 * A tampa continua sendo uma superfície, nunca um quadradinho por objeto — se
 * cada escondido ganhasse sua própria tampa, bastaria contar as tampas. Quando o
 * grupo cruza a curva do percurso, usamos no máximo duas faixas amplas.
 */
export function retangulosDaTampaSolta(tapadas: number[]): { x: number; y: number; w: number; h: number }[] {
  const grupos = [tapadas.filter(i => i <= 4), tapadas.filter(i => i >= 5)].filter(g => g.length > 0);
  return grupos.map(grupo => {
    const pontos = grupo.map(i => PONTOS_SOLTOS[i]);
    const minX = Math.min(...pontos.map(p => p.x));
    const maxX = Math.max(...pontos.map(p => p.x));
    const minY = Math.min(...pontos.map(p => p.y));
    const maxY = Math.max(...pontos.map(p => p.y));
    const pad = 12;
    return {
      x: Math.max(0, minX - pad),
      y: Math.max(0, minY - pad),
      w: Math.max(62, maxX - minX + 34 + pad * 2),
      h: Math.max(58, maxY - minY + 34 + pad * 2),
    };
  });
}

'''
p = Path("src/components/primitives/TenFrame.tsx")
text = p.read_text()
if text.count(insert_anchor) != 1:
    raise SystemExit(f"TenFrame insert anchor {text.count(insert_anchor)}")
p.write_text(text.replace(insert_anchor, loose_component + insert_anchor))

# ---------------------------------------------------------------------------
# 7. Testes: representação solta, gate de progressão e evidências independentes.
# ---------------------------------------------------------------------------
p = Path("src/curriculum/motores/progressEngine.test.ts")
text = p.read_text()
text += '''\n\ndescribe("ponte representacional — evidência antes de avançar", () => {\n  it("segura o nível até a evidência e libera no mesmo acerto que a demonstra", () => {\n    let p: Progress = { lvl: 4, streak: 2, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0, maxLvl: 4 };\n    const base: MasteryAttempt = {\n      durationMs: 3000, helpUsed: false, isReview: false, practiceDay: "2026-08-08",\n      gateEvidenceBeforeAdvance: "sem-moldura",\n    };\n    let r = applyJourneyAnswer(p, true, false, base);\n    expect(r.progress.lvl).toBe(4);\n    expect(r.transition).toBeNull();\n    expect(r.progress.streak).toBeGreaterThanOrEqual(3);\n\n    r = applyJourneyAnswer(r.progress, true, false, { ...base, evidencias: ["sem-moldura"] });\n    expect(r.progress.lvl).toBe(5);\n    expect(r.transition).toEqual({ type: "level-up", level: 5 });\n    expect(r.progress.masteryEvidence?.evidenciasVistas).toContain("sem-moldura");\n  });\n});\n'''
p.write_text(text)

p = Path("src/curriculum/procedimentos/tenFrameProcedure.test.ts")
text = p.read_text()
anchor = '''  it("a JD5 sempre deixa alguém à mostra e alguém escondido", () => {'''
addition = '''  it("JD5 distingue escala >5 de retirada da moldura", () => {
    const comMoldura = construirMolduraSpec("escondidos", 4, semente(7));
    const semMoldura = construirMolduraSpec("escondidos", 5, semente(7));
    const acao = (spec: typeof comMoldura): AcaoDaMoldura => ({
      modo: "escondidos",
      nivel: spec.nivel,
      resposta: spec.resposta,
      alvo: spec.resposta,
      cheias: spec.cheias,
      casas: spec.casas,
      visiveis: spec.visiveis,
      total: spec.total,
      semMoldura: spec.semMoldura,
    });
    expect(evidenciasDe(acao(comMoldura))).not.toContain(Evidencia.SEM_MOLDURA);
    expect(evidenciasDe(acao(semMoldura))).toContain(Evidencia.SEM_MOLDURA);
  });

'''
if text.count(anchor) != 1:
    raise SystemExit("tenFrameProcedure test anchor")
p.write_text(text.replace(anchor, addition + anchor))

p = Path("src/components/primitives/MolduraStage.test.tsx")
text = p.read_text()
anchor = '''  it("a JD5 levanta a tampa na revelação", () => {'''
addition = '''  it("JD5 L5 não deixa uma grade 5x2 invisível: renderiza só objetos soltos", () => {
    const q = Composer.generate(JD5, 5);
    const spec5 = q.uiProps as MolduraSpec;
    const { rerender } = render(<MolduraStage spec={spec5} fase="mostrando" />);
    expect(screen.getByRole("group", { name: /conjunto solto/ })).toBeTruthy();
    expect(screen.getAllByTestId("objeto-solto")).toHaveLength(spec5.ocupadas.length);

    rerender(<MolduraStage spec={spec5} fase="perguntando" />);
    expect(screen.getAllByTestId("objeto-solto")).toHaveLength(spec5.visiveis);
    expect(screen.getAllByTestId("tampa-solta").length).toBeLessThanOrEqual(2);
  });

'''
if text.count(anchor) != 1:
    raise SystemExit("MolduraStage test anchor")
p.write_text(text.replace(anchor, addition + anchor))

p = Path("src/curriculum/fichas/jornada/parteTodoProgressao.test.ts")
text = p.read_text()
text = text.replace('import { describe, expect, it } from "vitest";', 'import { describe, expect, it, vi } from "vitest";')
anchor = '''  it("N1.11 progride de JD3 para F28: moldura -> bond -> simbolo", () => {'''
addition = '''  it("N1.10 L4 faz fade moldura -> sem moldura e exige a retirada antes do bond", () => {
    const spyA = vi.spyOn(Math, "random").mockReturnValue(0.9);
    const comEstrutura = Composer.generate(N1_10, 4);
    spyA.mockRestore();
    const spyB = vi.spyOn(Math, "random").mockReturnValue(0.1);
    const semEstrutura = Composer.generate(N1_10, 4);
    spyB.mockRestore();

    expect((comEstrutura.uiProps as any).semMoldura).not.toBe(true);
    expect((semEstrutura.uiProps as any).semMoldura).toBe(true);
    expect(comEstrutura.gateEvidenceBeforeAdvance).toBe("sem-moldura");
    expect(semEstrutura.gateEvidenceBeforeAdvance).toBe("sem-moldura");
  });

'''
if text.count(anchor) != 1:
    raise SystemExit("parteTodo test anchor")
p.write_text(text.replace(anchor, addition + anchor))

print("P17 v2 patch aplicado")
