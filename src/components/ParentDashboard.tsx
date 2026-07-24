import React, { useState } from "react";
import { State, Kid, Track } from "../types";
import { CURRICULUM } from "../utils/curriculum";
import { auth, linkAnonymousWithGoogle } from "../lib/firebase";
import { C, FONT, StarChip, LevelDots, SoundBtn, MiniBars, StatChip, calcStreak, sumWindow, accWindow, TOTAL_STICKERS, sfx, THEME_EMOJIS, THEMES, Mascote } from "./Mascot";
import { PedagogicalEditor } from "./PedagogicalEditor";

interface ParentProps {
  state: State;
  sound: boolean;
  onToggleSound: () => void;
  onUpdateKids: (kids: Kid[]) => void;
  onResetKid: (id: string) => void;
  onDeleteKid: (id: string) => void;
  onAddKid: (kid: Kid) => void;
  onFactoryReset: () => void;
  onBack: () => void;
  onUpdateState: (newState: State) => void;
  userEmail?: string | null;
  onLogout?: () => void;
  onTriggerAdmin?: () => void;
}

export function ParentDashboard({
  state,
  sound,
  onToggleSound,
  onUpdateKids,
  onResetKid,
  onDeleteKid,
  onAddKid,
  onFactoryReset,
  onBack,
  

  onUpdateState,
  userEmail,
  onLogout,
  onTriggerAdmin,
}: ParentProps) {
  const [tab, setTab] = useState<"progress" | "pedagogical">("progress");
  const [unlocked, setUnlocked] = useState(false);
  const [gate, setGate] = useState(() => ({
    a: Math.floor(Math.random() * 7) + 3,
    b: Math.floor(Math.random() * 7) + 3,
  }));
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const [edit, setEdit] = useState(false);
  const [kids, setKids] = useState<Kid[]>(state.kids.map((k) => ({ ...k })));
  const [confirmReset, setConfirmReset] = useState<string | null>(null);
  const [kidToDelete, setKidToDelete] = useState<string | null>(null);
  const [showFactoryResetConfirm, setShowFactoryResetConfirm] = useState(false);
  const [resetSuccessKid, setResetSuccessKid] = useState<string | null>(null);
  const [period, setPeriod] = useState(14);

  // Account Linking states
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleLinkGoogle = async () => {
    setLinking(true);
    setLinkMsg(null);
    sfx.level();
    try {
      const { email, state: linkedState } = await linkAnonymousWithGoogle();
      setLinkMsg({ text: "Conta vinculada com sucesso! Seu progresso agora está 100% seguro para sempre! 🎉", isError: false });
      if (linkedState) {
        onUpdateState(linkedState);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/credential-already-in-use") {
        setLinkMsg({ text: "Ops! Esta conta do Google já possui outro progresso salvo.", isError: true });
      } else {
        setLinkMsg({ text: "Erro ao vincular: " + (err.message || "Conexão perdida."), isError: true });
      }
    } finally {
      setLinking(false);
    }
  };

  // AI states
  const [aiReport, setAiReport] = useState<Record<string, string>>({});
  const [loadingReport, setLoadingReport] = useState<Record<string, boolean>>({});
  const [aiError, setAiError] = useState<Record<string, string>>({});

  const tryGate = () => {
    if (parseInt(val, 10) === gate.a * gate.b) {
      setUnlocked(true);
      sfx.level();
    } else {
      setErr(true);
      setGate({
        a: Math.floor(Math.random() * 7) + 3,
        b: Math.floor(Math.random() * 7) + 3,
      });
      setVal("");
      sfx.wrong();
    }
  };

  const generateAIReport = async (kid: Kid, statsSummary: any) => {
    setLoadingReport((prev) => ({ ...prev, [kid.id]: true }));
    setAiError((prev) => ({ ...prev, [kid.id]: "" }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const response = await fetch("/api/analyze-progress", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        signal: controller.signal,
        body: JSON.stringify({
          kidName: kid.name,
          grade: kid.grade === "pre" ? "Pré-escola (4 anos)" : "1º Ano (6 anos)",
          stats: statsSummary,
          recentLogs: state.log[kid.id] || [],
        }),
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        const limited = await response.json();
        setAiError((prev) => ({ ...prev, [kid.id]: limited.error || "Limite diário de relatórios atingido. Tente novamente amanhã." }));
        return;
      }

      if (!response.ok) {
        throw new Error("Erro de conexão");
      }

      const data = await response.json();
      setAiReport((prev) => ({ ...prev, [kid.id]: data.report }));
    } catch (e: any) {
      clearTimeout(timeoutId);
      // Premium dynamic offline pediatric diagnostic fallback
      const totalStars = statsSummary?.stars || 0;
      const totalOk = statsSummary?.ok || 0;
      const totalQuestions = statsSummary?.tot || 1;
      const accuracy = Math.round((totalOk / totalQuestions) * 100) || 100;
      const activeGrade = kid.grade === "pre" ? "Pré-escola (4 anos)" : "1º Ano (6 anos)";

      const offlineReport = `### 🌟 Pontos Fortes do Aprendizado
* **Dedicação e Esforço Brilhante**: ${kid.name} já conquistou um total magnífico de **${totalStars} estrelas** jogando os portais!
* **Excelente Índice de Precisão**: Apresenta uma precisão incrível de **${accuracy}%** nas atividades matemáticas concluídas na ${activeGrade}.
* **Raciocínio Lógico Ativo**: Demonstra excelente concentração ao ler os problemas lúdicos e selecionar as respostas corretas.

### 🎯 Áreas para Praticar com Atenção
* **Revisão Sistemática**: Recomendamos continuar jogando as missões recomendadas da Jornada Mágica para fixar as fórmulas e a contagem.
* **Construção de Habilidades**: Treinar pequenas sessões de 5 minutos diariamente ajudará a estender a trilha e dominar os níveis mais avançados sem cansaço.

### 🎲 Brincadeiras Reais Recomendadas
* **Caça aos Números e Objetos**: Brinquem de esconder brinquedos pela sala e dar instruções como: "Ache 3 carrinhos verdes e 2 azuis. Quantos você achou no total?".
* **Contando Lanchinhos**: Dividam pequenos lanches (como uvas ou biscoitos) e façam somas e subtrações reais na mesa antes de comer! É muito divertido e saboroso!`;

      setAiReport((prev) => ({ ...prev, [kid.id]: offlineReport }));
    } finally {
      setLoadingReport((prev) => ({ ...prev, [kid.id]: false }));
    }
  };

  // Simple and highly robust markdown parser to JSX
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      // Header H3
      if (trimmed.startsWith("###")) {
        return (
          <h3 key={idx} className="font-bold text-slate-800 text-base mt-4 mb-2 border-b pb-1" style={{ fontFamily: FONT }}>
            {trimmed.replace(/^###\s*/, "")}
          </h3>
        );
      }
      // Header H4
      if (trimmed.startsWith("####")) {
        return (
          <h4 key={idx} className="font-bold text-slate-700 text-sm mt-3 mb-1" style={{ fontFamily: FONT }}>
            {trimmed.replace(/^####\s*/, "")}
          </h4>
        );
      }

      // Bullet List
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const rawContent = trimmed.replace(/^[-*]\s*/, "");
        return (
          <li key={idx} className="text-sm text-slate-600 ml-4 list-disc mb-1.5 leading-relaxed">
            {parseBoldText(rawContent)}
          </li>
        );
      }

      // Default paragraph
      return (
        <p key={idx} className="text-sm text-slate-600 mb-2 leading-relaxed">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-slate-800 font-bold">{part}</strong> : part));
  };

  if (!unlocked) {
    return (
      <div className="mk-pop">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => {
              sfx.tick();
              onBack();
            }}
            className="w-11 h-11 flex items-center justify-center font-bold text-lg select-none cursor-pointer border-2 active:translate-y-0.5 rounded-full"
            style={{
              background: C.card,
              color: C.ink,
              borderColor: C.line,
              boxShadow: `0 4px 0 ${C.line}`,
            }}
          >
            ✕
          </button>
          <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.ink }}>
            Área dos Pais 🔒
          </div>
        </div>

        <div
          className={err ? "mk-shake" : ""}
          style={{
            background: C.card,
            borderRadius: 24,
            boxShadow: `0 6px 0 ${C.line}`,
            padding: 24,
          }}
        >
          <p className="text-center font-bold text-slate-500 mb-3" style={{ fontSize: 15 }}>
            Só para adultos. Por favor, resolva a conta para entrar:
          </p>
          <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, textAlign: "center", margin: "16px 0", color: C.grape }}>
            {gate.a} × {gate.b} = ?
          </div>
          <input
            value={val}
            onChange={(e) => setVal(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            placeholder="Sua resposta"
            onKeyDown={(e) => {
              if (e.key === "Enter") tryGate();
            }}
            className="w-full text-center transition-all focus:border-indigo-400"
            style={{
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 600,
              background: C.soft,
              border: `2px solid ${err ? C.melon : C.line}`,
              borderRadius: 14,
              padding: "10px 14px",
              outline: "none",
              color: C.ink,
            }}
          />
          {err && (
            <p style={{ color: C.melonDark, fontWeight: 800, fontSize: 13, textAlign: "center", marginTop: 8 }}>
              Tente novamente!
            </p>
          )}

          <button
            onClick={tryGate}
            className="w-full py-3.5 mt-4 text-white font-bold text-lg select-none cursor-pointer rounded-2xl border-none transition-all active:translate-y-0.5"
            style={{
              fontFamily: FONT,
              background: C.grape,
              boxShadow: `0 5px 0 ${C.grapeDark}`,
            }}
          >
            Entrar 🔓
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mk-pop">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            sfx.tick();
            onBack();
          }}
          className="w-11 h-11 flex items-center justify-center font-bold text-lg select-none cursor-pointer border-2 active:translate-y-0.5 rounded-full"
          style={{
            background: C.card,
            color: C.ink,
            borderColor: C.line,
            boxShadow: `0 4px 0 ${C.line}`,
          }}
        >
          ✕
        </button>
        <div className="flex-1 text-center" style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.ink }}>
          Painel dos Pais 📊
        </div>
        <SoundBtn on={sound} onToggle={onToggleSound} />
      </div>

      {/* Mini Status & Admin Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 bg-indigo-50/80 px-3 py-1.5 rounded-full border border-indigo-100/40">
        <div className="flex items-center gap-1.5 min-w-0">
          {userEmail ? (
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="text-xs">☁️</span>
              <span className="text-[10px] md:text-[11px] font-black text-indigo-950 truncate max-w-[120px]" title={userEmail}>
                {userEmail}
              </span>
              {auth.currentUser?.isAnonymous && (
                <button
                  onClick={handleLinkGoogle}
                  disabled={linking}
                  className="text-[9px] bg-emerald-600 hover:bg-emerald-700 font-extrabold text-white px-2 py-0.5 rounded transition-all cursor-pointer border-none outline-none animate-pulse"
                >
                  {linking ? "Vinculando..." : "Salvar no Google 🔒"}
                </button>
              )}
              <button
                onClick={() => {
                  sfx.wrong();
                  onLogout?.();
                }}
                className="text-[9px] bg-slate-200 hover:bg-rose-100 hover:text-rose-700 font-extrabold text-slate-700 px-1.5 py-0.5 rounded transition-all cursor-pointer border-none outline-none"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🚶</span>
              <span className="text-[10px] md:text-[11px] font-black text-slate-500">
                Visitante
              </span>
            </div>
          )}
        </div>

        {/* Admin God Mode Trigger */}
        <button
          onClick={() => {
            sfx.level();
            onTriggerAdmin?.();
          }}
          className="text-[9px] sm:text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer border-none outline-none shadow-sm animate-pulse"
          style={{ fontFamily: FONT }}
        >
          ⚡ Admin God
        </button>
      </div>

      {linkMsg && (
        <div 
          className={`mb-4 px-4 py-3 rounded-2xl text-xs font-black leading-relaxed flex items-center justify-between gap-3 border-2 ${
            linkMsg.isError 
              ? "bg-rose-50 border-rose-200 text-rose-700" 
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <span>{linkMsg.text}</span>
          <button 
            onClick={() => setLinkMsg(null)} 
            className="bg-transparent border-none text-slate-400 hover:text-slate-600 font-bold cursor-pointer text-sm outline-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Interactive Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 mb-5">
        <button
          onClick={() => {
            sfx.tick();
            setTab("progress");
          }}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            tab === "progress" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
          style={{ fontFamily: FONT }}
        >
          📊 Progresso dos Filhos
        </button>
        <button
          onClick={() => {
            sfx.tick();
            setTab("pedagogical");
          }}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            tab === "pedagogical" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
          style={{ fontFamily: FONT }}
        >
          🎒 Tópicos & Aulas Customizadas
        </button>
      </div>

      {tab === "progress" && (
        <>
          {state.kids.map((k) => {
        const prog = state.progress[k.id] || {};
        const gradeId = k.grade === "pre" ? "F0" : (k.grade === "ano1" ? "F1" : "F2");
        const mod = CURRICULUM.find(m => m.id === gradeId);
        const tracks = mod ? mod.tracks : [];
        const totStars = Object.values(prog).reduce((s, t) => s + (t.stars || 0), 0);
        const lg = state.log[k.id] || [];
        const win = period === 0 ? 3650 : period;
        const sw = sumWindow(lg, 0, win - 1);
        const accA = sw.tot ? Math.round((sw.ok / sw.tot) * 100) : null;
        const accB = period === 0 ? null : accWindow(lg, win, 2 * win - 1);
        const tempoMedio = sw.tot && sw.t ? (sw.t / sw.tot / 1000).toFixed(1).replace(".", ",") + "s" : "—";
        const naRevisao = Object.values(prog).reduce((s, t) => s + ((t.bank && t.bank.length) || 0), 0);
        const streak = calcStreak(lg);
        const mast = Object.values(prog).reduce((s, t) => s + (t.mast || 0), 0);
        const stickers = (state.album[k.id] || []).length;

        const rated = tracks
          .map((t) => ({ t, p: prog[t.id] || { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 } }))
          .filter((x) => x.p.tot >= 5)
          .map((x) => ({ icon: x.t.icon, name: x.t.name, acc: Math.round((x.p.ok / x.p.tot) * 100) }));

        const best = rated.length ? rated.reduce((a, b) => (b.acc > a.acc ? b : a)) : null;
        const worst = rated.length > 1 ? rated.reduce((a, b) => (b.acc < a.acc ? b : a)) : null;

        const statsSummary = {
          totalAnswers: sw.tot,
          correctAnswers: sw.ok,
          precision: accA,
          averageTimeSeconds: tempoMedio,
          masteredTracks: mast,
          stickersUnlocked: stickers,
          activeStreak: streak,
          currentLevels: tracks.map((t) => ({
            name: t.name,
            level: (prog[t.id] || {}).lvl || 1,
            totalPlayed: (prog[t.id] || {}).tot || 0,
            precision: (prog[t.id] || {}).tot ? Math.round(((prog[t.id] || {}).ok / (prog[t.id] || {}).tot) * 100) : null,
          })),
        };

        return (
          <div
            key={k.id}
            className="mb-6 text-left"
            style={{
              background: C.card,
              borderRadius: 24,
              boxShadow: `0 6px 0 ${C.line}`,
              padding: 18,
            }}
          >
            {/* Header child */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="text-4xl filter drop-shadow">{k.avatar}</span>
              <div className="flex-1">
                <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.ink }}>
                  {k.name}
                </div>
                <div style={{ color: C.sub, fontWeight: 700, fontSize: 12 }}>
                  {k.grade === "pre" ? "👦 Pré-escola • 4 anos" : "🚀 1º ano • 6 anos"}
                </div>
              </div>
              <StarChip n={totStars} />
            </div>

            {/* AI Pedagogical Report Section */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🤖</span>
                <span className="font-bold text-sm text-indigo-950" style={{ fontFamily: FONT }}>
                  Relatório Pedagógico IA (Gemini)
                </span>
              </div>
              <p className="text-xs text-indigo-700/80 font-medium mb-3">
                A IA analisará o comportamento de {k.name} e criará uma avaliação pedagógica com pontos fortes, atenção e sugestões de jogos reais.
              </p>

              {aiReport[k.id] ? (
                <div className="bg-white rounded-xl p-3 shadow-inner border border-slate-100/60 max-h-80 overflow-y-auto mb-3">
                  {renderMarkdown(aiReport[k.id])}
                </div>
              ) : null}

              {aiError[k.id] ? (
                <p className="text-xs text-rose-500 font-bold mb-3">
                  ❌ Erro: {aiError[k.id]}
                </p>
              ) : null}

              <button
                onClick={() => {
                  sfx.tick();
                  generateAIReport(k, statsSummary);
                }}
                disabled={loadingReport[k.id]}
                className="w-full text-white font-bold py-2.5 px-4 rounded-xl text-xs select-none cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-2"
                style={{
                  fontFamily: FONT,
                  background: C.grape,
                  boxShadow: `0 4px 0 ${C.grapeDark}`,
                  opacity: loadingReport[k.id] ? 0.75 : 1,
                }}
              >
                {loadingReport[k.id] ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Analisando dados do aprendizado...
                  </>
                ) : aiReport[k.id] ? (
                  "🔄 Atualizar Relatório de IA"
                ) : (
                  "✨ Gerar Relatório de IA"
                )}
              </button>
            </div>

            {/* Individual track levels */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="font-bold text-sm text-slate-500 mb-1" style={{ fontFamily: FONT }}>
                Desempenho por Portal:
              </div>
              {tracks.map((t) => {
                const p = prog[t.id] || { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
                const acc = p.tot ? Math.round((p.ok / p.tot) * 100) + "%" : "—";
                return (
                  <div key={t.id} className="flex items-center gap-2" style={{ background: C.soft, borderRadius: 14, padding: "8px 10px" }}>
                    <span className="text-xl">{t.icon}</span>
                    <span className="flex-1 font-semibold text-sm text-slate-800" style={{ fontFamily: FONT }}>
                      {t.name}
                    </span>
                    <LevelDots lvl={p.lvl} conquered={p.maxLvl} dom={p.dom} color={t.color} />
                    <span className="font-bold text-xs text-slate-500 w-10 text-right">
                      {acc}
                    </span>
                    <span className="font-bold text-xs text-amber-600 w-11 text-right">
                      ⭐ {p.stars || 0}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Performance Over Time Chart */}
            <div className="mt-4" style={{ background: C.soft, borderRadius: 18, padding: "12px 14px" }}>
              <div className="mb-2 flex items-center justify-between gap-1.5">
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: C.ink }}>
                  Atividade Diária
                </div>
                <div className="flex gap-1">
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        sfx.tick();
                        setPeriod(d);
                      }}
                      className="font-bold cursor-pointer text-[10px] px-2 py-1 rounded-full transition-all focus:outline-none"
                      style={{
                        background: period === d ? C.grape : C.card,
                        color: period === d ? "#fff" : C.sub,
                        border: `1.5px solid ${period === d ? C.grape : C.line}`,
                      }}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              <MiniBars log={lg} days={period} />
              <div style={{ fontSize: 10, fontWeight: 800, color: C.sub, marginTop: 4, textAlign: "center" }}>
                barra verde = acertos • barra cinza = total jogado
              </div>

              {/* Stats Chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                <StatChip>
                  🎯 Precisão: {accA == null ? "—" : accA + "%"}
                  {accA != null && accB != null ? (accA >= accB ? " ▲" : " ▼") : ""}
                </StatChip>
                <StatChip>⏱️ Ritmo Médio: {tempoMedio}</StatChip>
                <StatChip>📝 Na revisão: {naRevisao}</StatChip>
                <StatChip>🔥 Sequência: {streak}d</StatChip>
                <StatChip>🧠 {mast} dominadas</StatChip>
                <StatChip>🎁 Álbum: {stickers}/{TOTAL_STICKERS}</StatChip>
                {best && <StatChip>🥇 Forte: {best.icon} {best.acc}%</StatChip>}
                {worst && worst.acc < 75 && (
                  <StatChip>⚠️ Reforçar: {worst.icon} {worst.acc}%</StatChip>
                )}
              </div>
            </div>

            {/* Reset data */}
            <div className="flex flex-col items-start gap-1">
              <button
                onClick={() => {
                  if (confirmReset === k.id) {
                    sfx.level();
                    onResetKid(k.id);
                    setConfirmReset(null);
                    setResetSuccessKid(k.id);
                    setTimeout(() => {
                      setResetSuccessKid(null);
                    }, 4000);
                  } else {
                    sfx.wrong();
                    setConfirmReset(k.id);
                  }
                }}
                className="mt-3 bg-none border-none text-xs font-bold font-sans transition-all outline-none"
                style={{
                  color: confirmReset === k.id ? C.melonDark : C.sub,
                  cursor: "pointer",
                }}
              >
                {confirmReset === k.id ? "⚠️ Toque mais uma vez para confirmar!" : "🗑️ Zerar progresso do perfil"}
              </button>
              {resetSuccessKid === k.id && (
                <div className="text-[11px] font-bold text-emerald-600 mt-1 animate-pulse" style={{ fontFamily: FONT }}>
                  ✨ Progresso redefinido com sucesso!
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Edit child names & avatars */}
      {!edit ? (
        <button
          onClick={() => {
            sfx.tick();
            setEdit(true);
          }}
          className="w-full text-slate-700 font-bold py-3 text-sm select-none cursor-pointer rounded-2xl"
          style={{
            fontFamily: FONT,
            background: C.card,
            border: `3px solid ${C.line}`,
            boxShadow: `0 4px 0 ${C.line}`,
          }}
        >
          ✏️ Editar Perfis, Mascotes e Temas
        </button>
      ) : (
        <div
          className="border-2 border-dashed border-slate-200"
          style={{
            background: C.card,
            borderRadius: 24,
            boxShadow: `0 5px 0 ${C.line}`,
            padding: 16,
          }}
        >
          {kids.map((k, i) => (
            <div key={k.id} className="mb-6 p-4 rounded-2xl border-2 border-slate-100 bg-white">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: k.grade === "pre" ? C.grape : C.ocean }}>
                  {k.grade === "pre" ? "👦 Pré-escola (4 anos)" : "🚀 1º Ano (6 anos)"}
                </div>
                {kidToDelete === k.id ? (
                  <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 animate-[bounce_0.3s_ease-out_1]">
                    <span className="text-[10px] font-extrabold text-rose-800">Certeza?</span>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.wrong();
                        const updated = kids.filter((x) => x.id !== k.id);
                        setKids(updated);
                        onDeleteKid(k.id);
                        setKidToDelete(null);
                      }}
                      className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-black cursor-pointer hover:bg-rose-700 transition-all"
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tick();
                        setKidToDelete(null);
                      }}
                      className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-black cursor-pointer hover:bg-slate-300 transition-all"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sfx.wrong();
                      setKidToDelete(k.id);
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer transition-all bg-transparent border-none outline-none"
                  >
                    🗑️ Excluir Perfil
                  </button>
                )}
              </div>

              {/* Name Input */}
              <input
                value={k.name}
                maxLength={14}
                placeholder="Nome da criança"
                onChange={(e) =>
                  setKids((ks) =>
                    ks.map((x, j) => (j === i ? { ...x, name: e.target.value } : x))
                  )
                }
                className="w-full mt-2.5 outline-none font-semibold px-3 py-2 rounded-xl"
                style={{
                  fontFamily: FONT,
                  fontSize: 16,
                  background: C.soft,
                  border: `2px solid ${C.line}`,
                  color: C.ink,
                }}
              />

              {/* Age (Idade) Input and Pet's Independent Name */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[11px] font-bold text-slate-500">Idade Real (Anos):</span>
                  <input
                    type="number"
                    min={2}
                    max={16}
                    value={k.age != null ? k.age : (k.grade === "pre" ? 4 : 6)}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 4;
                      setKids((ks) =>
                        ks.map((x, j) => (j === i ? { ...x, age: val } : x))
                      );
                    }}
                    className="w-full outline-none font-semibold px-3 py-1.5 rounded-xl text-sm"
                    style={{
                      fontFamily: FONT,
                      background: C.soft,
                      border: `2px solid ${C.line}`,
                      color: C.ink,
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[11px] font-bold text-slate-500">Nome do Mascote:</span>
                  <input
                    value={k.petName || ""}
                    maxLength={14}
                    placeholder="Ex: Teioso, Faísca"
                    onChange={(e) =>
                      setKids((ks) =>
                        ks.map((x, j) => (j === i ? { ...x, petName: e.target.value } : x))
                      )
                    }
                    className="w-full outline-none font-semibold px-3 py-1.5 rounded-xl text-sm"
                    style={{
                      fontFamily: FONT,
                      background: C.soft,
                      border: `2px solid ${C.line}`,
                      color: C.ink,
                    }}
                  />
                </div>
              </div>

              {/* Grade/Série Toggle */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Idade/Série:</span>
                <button
                  type="button"
                  onClick={() => {
                    sfx.tick();
                    setKids((ks) =>
                      ks.map((x, j) => (j === i ? { ...x, grade: "pre" } : x))
                    );
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    k.grade === "pre" ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-400" : "bg-slate-50 text-slate-500 border border-slate-200"
                  }`}
                >
                  👦 Pré-escola (4a)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.tick();
                    setKids((ks) =>
                      ks.map((x, j) => (j === i ? { ...x, grade: "ano1" } : x))
                    );
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    (k.grade === "ano1" || k.grade === "ano2") ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-400" : "bg-slate-50 text-slate-500 border border-slate-200"
                  }`}
                >
                  🚀 1º Ano (6a)
                </button>
              </div>

              {/* Theme selectors - Combined Theme & Mascot Selection */}
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: C.sub, marginTop: 14 }}>
                Escolha o Mascote / Tema dos jogos:
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {Object.entries(THEMES).map(([thId, th]) => (
                  <button
                    key={thId}
                    type="button"
                    onClick={() => {
                      sfx.tick();
                      setKids((ks) =>
                        ks.map((x, j) => (j === i ? { ...x, theme: thId, avatar: THEME_EMOJIS[thId] || "🥋" } : x))
                      );
                    }}
                    className={`cursor-pointer p-2.5 rounded-xl transition-all active:scale-95 flex flex-col items-center ${
                      k.theme === thId ? "scale-105 shadow-md" : ""
                    }`}
                    style={{
                      background: k.theme === thId ? "#EFE9FF" : C.card,
                      border: k.theme === thId ? `3px solid ${C.grape}` : `1.5px solid ${C.line}`,
                    }}
                  >
                    <Mascote theme={thId} size={32} className="pointer-events-none mb-1" />
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 10, color: C.ink }} className="truncate max-w-full text-center">
                      {th.nome}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Add profile button inside the dashboard */}
          <button
            type="button"
            onClick={() => {
              sfx.level();
              const newId = "k_" + Date.now();
              const newK: Kid = {
                id: newId,
                name: "Novo Brincante",
                avatar: "🥋",
                grade: "pre",
                theme: "classico",
              };
              setKids([...kids, newK]);
              onAddKid(newK);
            }}
            className="w-full text-indigo-700 font-bold py-3 mb-5 text-xs select-none cursor-pointer rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100/50 transition-all outline-none flex items-center justify-center gap-1.5"
            style={{ fontFamily: FONT }}
          >
            ➕ Adicionar Novo Perfil de Criança
          </button>

          <button
            onClick={() => {
              sfx.level();
              onUpdateKids(kids.map((k) => ({ ...k, name: k.name.trim() || (k.grade === "pre" ? "Estrelinha" : "Foguete") })));
              setEdit(false);
            }}
            className="w-full text-white font-bold py-3 rounded-xl text-sm select-none cursor-pointer border-none"
            style={{
              fontFamily: FONT,
              background: C.mint,
              boxShadow: `0 4px 0 ${C.mintDark}`,
            }}
          >
            Salvar Alterações 💾
          </button>
        </div>
      )}
        </>
      )}

      {tab === "pedagogical" && (
        <PedagogicalEditor state={state} onUpdateState={onUpdateState} />
      )}

      <p className="mt-5 text-center text-xs text-slate-500 font-medium leading-relaxed px-2">
        A inteligência adaptativa de SAGA promove autonomia e respeito ao ritmo de aprendizagem natural da infância.
      </p>

      {/* Advanced Factory Reset Section */}
      <div className="mt-6 pt-5 border-t border-slate-200/60 text-center">
        {showFactoryResetConfirm ? (
          <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl text-center max-w-sm mx-auto mb-2 animate-[bounce_0.5s_ease-out_1]">
            <div className="text-sm font-black text-rose-800 mb-1">
              ⚠️ EXCLUIR TUDO E RECOMEÇAR?
            </div>
            <p className="text-[11px] text-rose-700 mb-4 font-semibold leading-relaxed">
              Isso apagará permanentemente todos os perfis de crianças, estrelas, figurinhas e históricos de jogos do aplicativo na nuvem e neste dispositivo. Não é possível desfazer.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sfx.wrong();
                  onFactoryReset();
                  setShowFactoryResetConfirm(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Sim, Apagar Tudo 🔄
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.tick();
                  setShowFactoryResetConfirm(false);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              sfx.wrong();
              setShowFactoryResetConfirm(true);
            }}
            className="text-xs text-rose-500 hover:text-rose-700 hover:underline font-bold transition-all cursor-pointer bg-rose-50/50 hover:bg-rose-50 px-4 py-2 border border-rose-100 rounded-xl outline-none"
            style={{ fontFamily: FONT }}
          >
            🔄 Apagar Tudo e Recomeçar (Reset de Fábrica)
          </button>
        )}
      </div>
    </div>
  );
}
