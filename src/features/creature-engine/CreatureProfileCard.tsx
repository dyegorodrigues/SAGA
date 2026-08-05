import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Kid, State } from "../../types";
import { FONT, sfx } from "../../components/Mascot";
import {
  CreatureInteraction,
  CreatureIntent,
  CreatureSaveV1,
  LearningSnapshot,
  advanceCreatureClock,
  applyCreatureInteraction,
  applyLearningSnapshot,
  changeCreatureSpecies,
  chooseAutonomousIntent,
  creatureStatesEqual,
  createCreatureSave,
  normalizeCreatureSave,
} from "./domain";
import {
  DEFAULT_CREATURE_ID,
  STARTER_CREATURES,
  StarterCreatureSpec,
  getStarterCreature,
} from "./catalog";
import { PmdCreatureSprite } from "./PmdCreatureSprite";
import {
  CreatureCatalogEntry,
  CreatureCharacterData,
  creatureAssetUrl,
  fetchCreatureCatalog,
  fetchCreatureCharacter,
} from "./spriteCollabClient";

interface Props {
  kid: Kid;
  state: State;
  onUpdateKid: (kid: Kid) => void;
}

type KidWithCreature = Kid & { creature?: CreatureSaveV1 };

type CatalogItem = StarterCreatureSpec & Partial<CreatureCatalogEntry>;

const localDay = (dt = new Date()) =>
  `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

function calculateStreak(log: State["log"][string]): number {
  if (!log?.length) return 0;
  const days = new Set(log.map((entry) => entry.d));
  let cursor = new Date();
  if (!days.has(localDay(cursor))) cursor = new Date(cursor.getTime() - 86_400_000);
  let streak = 0;
  while (days.has(localDay(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 86_400_000);
  }
  return streak;
}

function buildLearningSnapshot(state: State, kidId: string): LearningSnapshot {
  const progress = state.progress[kidId] || {};
  const log = state.log[kidId] || [];
  let stars = 0;
  let correct = 0;
  let questions = 0;
  for (const value of Object.values(progress)) {
    stars += value.stars || 0;
    correct += value.ok || 0;
    questions += value.tot || 0;
  }
  return {
    stars,
    correct,
    questions,
    streak: calculateStreak(log),
    lastDay: log[log.length - 1]?.d,
  };
}

function interactionIntent(interaction: CreatureInteraction): CreatureIntent {
  if (interaction === "feed") return "eat";
  if (interaction === "rest") return "sleep";
  if (interaction === "train") return "attack";
  return "happy";
}

function interactionMessage(interaction: CreatureInteraction, name: string): string {
  if (interaction === "feed") return `Nham! ${name} recuperou energia para a próxima missão.`;
  if (interaction === "play") return `${name} adorou brincar com você!`;
  if (interaction === "rest") return `Shhh… ${name} está descansando um pouquinho.`;
  if (interaction === "train") return `${name} treinou um movimento novo do Dojo!`;
  return `${name} recebeu seu carinho e ficou muito feliz.`;
}

function moodLabel(save: CreatureSaveV1): string {
  const labels: Record<CreatureSaveV1["mood"], string> = {
    curioso: "Curioso",
    feliz: "Feliz",
    calmo: "Calmo",
    sonolento: "Sonolento",
    com_fome: "Com fome",
    orgulhoso: "Orgulhoso",
  };
  return labels[save.mood];
}

function NeedsBar({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="min-w-0 flex-1" aria-label={`${label}: ${Math.round(value)} de 100`}>
      <div className="mb-1 flex items-center justify-between gap-1 text-[9px] font-black uppercase tracking-wide text-white/90">
        <span>{icon} {label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border border-white/30 bg-slate-950/40">
        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export function CreatureProfileCard({ kid, state, onUpdateKid }: Props) {
  const kidWithCreature = kid as KidWithCreature;
  const initialSpec = getStarterCreature(kidWithCreature.creature?.speciesId || DEFAULT_CREATURE_ID);
  const normalizedFromProps = useMemo(
    () =>
      normalizeCreatureSave(
        kidWithCreature.creature,
        initialSpec.numericId,
        initialSpec.name,
        kid.petName || initialSpec.defaultNickname,
      ),
    [initialSpec.defaultNickname, initialSpec.name, initialSpec.numericId, kid.petName, kidWithCreature.creature],
  );
  const [creature, setCreature] = useState<CreatureSaveV1>(normalizedFromProps);
  const [catalog, setCatalog] = useState<CreatureCatalogEntry[]>([]);
  const [character, setCharacter] = useState<CreatureCharacterData | null>(null);
  const [loadingCharacter, setLoadingCharacter] = useState(true);
  const [remoteError, setRemoteError] = useState<string>("");
  const [intent, setIntent] = useState<CreatureIntent>(normalizedFromProps.lastReaction || "idle");
  const [direction, setDirection] = useState(0);
  const [position, setPosition] = useState(50);
  const [feedback, setFeedback] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [typedName, setTypedName] = useState(normalizedFromProps.nickname);
  const feedbackTimer = useRef<number | null>(null);

  const learning = useMemo(() => buildLearningSnapshot(state, kid.id), [kid.id, state]);
  const learningKey = `${learning.stars}:${learning.correct}:${learning.questions}:${learning.streak}:${learning.lastDay || ""}`;

  const commit = useCallback(
    (next: CreatureSaveV1) => {
      setCreature(next);
      onUpdateKid({ ...kid, petName: next.nickname, creature: next } as KidWithCreature);
    },
    [kid, onUpdateKid],
  );

  useEffect(() => {
    if (!creatureStatesEqual(creature, normalizedFromProps)) setCreature(normalizedFromProps);
  }, [creature, normalizedFromProps]);

  useEffect(() => {
    const advanced = advanceCreatureClock(creature);
    const synced = applyLearningSnapshot(advanced, learning);
    if (!creatureStatesEqual(creature, synced)) {
      commit(synced);
      if (synced.lastReaction === "celebrate") setIntent("celebrate");
    }
    // learningKey representa toda a evidência pedagógica relevante.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kid.id, learningKey]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCreatureCatalog(controller.signal)
      .then((items) => setCatalog(items))
      .catch(() => setCatalog([]));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingCharacter(true);
    setRemoteError("");
    setCharacter(null);
    fetchCreatureCharacter(creature.speciesId, controller.signal)
      .then((value) => setCharacter(value))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setRemoteError(error instanceof Error ? error.message : "Falha ao carregar o sprite.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCharacter(false);
      });
    return () => controller.abort();
  }, [creature.speciesId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const next = chooseAutonomousIntent(creature, Math.random());
      setIntent(next);
      if (next === "walk") {
        setPosition((current) => {
          const goRight = current < 35 ? true : current > 65 ? false : Math.random() > 0.5;
          setDirection(goRight ? 2 : 6);
          return Math.min(76, Math.max(24, current + (goRight ? 14 : -14)));
        });
      } else if (next === "idle" || next === "look" || next === "sit") {
        setDirection(0);
      }
    }, 5_200);
    return () => window.clearInterval(timer);
  }, [creature]);

  useEffect(
    () => () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    },
    [],
  );

  const catalogItems = useMemo<CatalogItem[]>(
    () =>
      STARTER_CREATURES.map((starter) => ({
        ...starter,
        ...(catalog.find((item) => item.numericId === starter.numericId) || {}),
      })),
    [catalog],
  );
  const selected = catalogItems.find((item) => item.numericId === creature.speciesId) || catalogItems[3];

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setFeedback(""), 3_400);
  }, []);

  const interact = useCallback(
    (interaction: CreatureInteraction) => {
      sfx.tick();
      const next = applyCreatureInteraction(creature, interaction);
      commit(next);
      setIntent(interactionIntent(interaction));
      if (interaction === "train") setDirection(Math.random() > 0.5 ? 2 : 6);
      showFeedback(interactionMessage(interaction, next.nickname));
    },
    [commit, creature, showFeedback],
  );

  const selectSpecies = (item: CatalogItem) => {
    sfx.level();
    const next = changeCreatureSpecies(creature, item.numericId, item.name);
    const nicknameWasGeneric = creature.nickname === creature.speciesName || !creature.nickname.trim();
    const withName = nicknameWasGeneric ? { ...next, nickname: item.defaultNickname } : next;
    commit(withName);
    setTypedName(withName.nickname);
    setIntent("celebrate");
    setShowPicker(false);
    showFeedback(`${item.name} agora é seu parceiro no SAGA!`);
  };

  const saveName = () => {
    const nickname = typedName.trim().slice(0, 18) || selected.defaultNickname;
    commit({ ...creature, nickname, updatedAt: Date.now() });
    setTypedName(nickname);
    setIsRenaming(false);
    showFeedback(`Pronto! Agora ele se chama ${nickname}.`);
  };

  const portrait = creatureAssetUrl(character?.portraitUrl || selected.portraitUrl);

  return (
    <section
      className="relative overflow-hidden rounded-[28px] border-2 border-slate-200 bg-white shadow-[0_8px_0_#D9E5F8]"
      aria-label={`Tamagotchi ${creature.nickname}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-indigo-700">
              Creature Engine
            </span>
            <span className="rounded-full border px-2 py-1 text-[9px] font-black" style={{ color: selected.accent, borderColor: selected.accent, background: selected.softAccent }}>
              Estágio {creature.evolutionStage}
            </span>
          </div>

          <div className="mt-2 flex min-h-10 items-center gap-2">
            {isRenaming ? (
              <>
                <input
                  value={typedName}
                  maxLength={18}
                  onChange={(event) => setTypedName(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && saveName()}
                  aria-label="Nome do mascote"
                  className="min-h-11 min-w-0 flex-1 rounded-xl border-2 border-indigo-300 bg-slate-50 px-3 text-base font-black text-slate-900 outline-none focus:border-indigo-500"
                  style={{ fontFamily: FONT }}
                />
                <button onClick={saveName} className="min-h-11 min-w-11 rounded-xl bg-emerald-500 px-3 font-black text-white" aria-label="Salvar nome">✓</button>
              </>
            ) : (
              <>
                <h3 className="truncate text-xl font-black text-slate-900" style={{ fontFamily: FONT }}>{selected.emoji} {creature.nickname}</h3>
                <button
                  onClick={() => { setTypedName(creature.nickname); setIsRenaming(true); }}
                  className="min-h-11 min-w-11 rounded-xl bg-slate-100 text-base"
                  aria-label="Trocar nome do mascote"
                >
                  ✏️
                </button>
              </>
            )}
          </div>
          <p className="mt-0.5 text-xs font-bold text-slate-500">{selected.name} • {selected.element} • {moodLabel(creature)}</p>
        </div>

        <button
          onClick={() => setShowPicker((value) => !value)}
          className="min-h-12 shrink-0 rounded-2xl border-2 px-3 text-xs font-black active:translate-y-0.5"
          style={{ borderColor: selected.accent, color: selected.accent, background: selected.softAccent }}
        >
          Trocar<br />parceiro
        </button>
      </div>

      {showPicker && (
        <div className="border-b border-slate-100 bg-slate-50 p-3" role="dialog" aria-label="Escolher mascote">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {catalogItems.map((item) => (
              <button
                key={item.numericId}
                onClick={() => selectSpecies(item)}
                className="min-h-[76px] rounded-2xl border-2 p-2 text-left transition-transform active:scale-[0.98]"
                style={{
                  borderColor: item.numericId === creature.speciesId ? item.accent : "#E2E8F0",
                  background: item.numericId === creature.speciesId ? item.softAccent : "white",
                }}
              >
                <div className="text-xl">{item.emoji}</div>
                <div className="text-xs font-black text-slate-900">{item.name}</div>
                <div className="text-[9px] font-bold text-slate-500">{item.element}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => interact("pet")}
        className="relative block h-[245px] w-full overflow-hidden text-left"
        aria-label={`Fazer carinho em ${creature.nickname}`}
        style={{
          background: `linear-gradient(180deg, ${selected.softAccent} 0%, #DCEAFE 52%, #87B57A 53%, #628B58 100%)`,
          imageRendering: "pixelated",
        }}
      >
        <div className="absolute inset-x-0 top-0 z-20 grid grid-cols-4 gap-2 bg-slate-950/65 p-3 backdrop-blur-[2px]">
          <NeedsBar label="Energia" icon="⚡" value={creature.needs.energy} color="#60A5FA" />
          <NeedsBar label="Comida" icon="🍎" value={creature.needs.satiety} color="#FBBF24" />
          <NeedsBar label="Alegria" icon="💛" value={creature.needs.joy} color="#F472B6" />
          <NeedsBar label="Vínculo" icon="🤝" value={creature.needs.bond} color="#A78BFA" />
        </div>

        <div className="absolute bottom-4 left-1/2 z-10 transition-[left] duration-[1300ms] ease-linear" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
          {character ? (
            <PmdCreatureSprite character={character} intent={intent} direction={direction} scale={3.25} />
          ) : portrait ? (
            <img src={portrait} alt={selected.name} className="h-28 w-28 object-contain [image-rendering:pixelated]" />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/70 text-6xl shadow-lg">{selected.emoji}</div>
          )}
        </div>

        <div className="absolute bottom-2 left-3 z-20 rounded-full bg-slate-950/60 px-2.5 py-1 text-[9px] font-black text-white">
          {loadingCharacter ? "Carregando movimentos…" : remoteError ? "Modo retrato — sprites indisponíveis" : `${character?.actions.length || 0} ações PMD disponíveis`}
        </div>
        <div className="absolute bottom-2 right-3 z-20 rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-black text-slate-700">Toque para carinho</div>
      </button>

      {feedback && (
        <div className="border-t border-amber-100 bg-amber-50 px-4 py-2.5 text-center text-xs font-black text-amber-900" role="status">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-5 gap-1.5 border-t border-slate-100 p-3">
        {[
          { id: "feed" as const, icon: "🍎", label: "Comer", color: "#F59E0B" },
          { id: "play" as const, icon: "🎾", label: "Brincar", color: "#EC4899" },
          { id: "rest" as const, icon: "💤", label: "Dormir", color: "#6366F1" },
          { id: "pet" as const, icon: "🤍", label: "Carinho", color: "#8B5CF6" },
          { id: "train" as const, icon: "🥋", label: "Treinar", color: "#0F766E" },
        ].map((action) => (
          <button
            key={action.id}
            onClick={() => interact(action.id)}
            className="flex min-h-[62px] flex-col items-center justify-center rounded-2xl border-b-4 px-1 text-white active:translate-y-1 active:border-b-0"
            style={{ background: action.color, borderColor: `${action.color}CC` }}
          >
            <span className="text-xl" aria-hidden="true">{action.icon}</span>
            <span className="mt-1 text-[9px] font-black">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[9px] font-bold text-slate-500">
        <span>⭐ {learning.stars} XP escolar • 🔥 {learning.streak} dia(s)</span>
        {character?.credits.length ? (
          <details className="text-right">
            <summary className="cursor-pointer font-black text-indigo-600">Créditos PMD</summary>
            <div className="absolute right-4 z-30 mt-1 max-w-[260px] rounded-xl border bg-white p-3 text-left shadow-xl">
              {character.credits.map((credit) => (
                <div key={credit.id}>{credit.name || credit.id}</div>
              ))}
              <div className="mt-1 text-slate-400">{character.license}</div>
            </div>
          </details>
        ) : (
          <span>Protótipo PMD</span>
        )}
      </div>
    </section>
  );
}
