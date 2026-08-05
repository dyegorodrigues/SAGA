import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getPmdAnimation, parsePmdAnimData } from "./pmdAnimData";
import { PmdLabSprite, PmdLabSpriteMeta } from "./PmdLabSprite";
import {
  CreatureCatalogEntry,
  CreatureCharacterData,
  creatureAssetUrl,
  fetchCreatureCatalog,
  fetchCreatureCharacter,
  findCreatureAction,
  resolveCreatureActionAsset,
} from "./spriteCollabClient";

const DEFAULT_ROSTER = ["0001", "0004", "0007", "0025", "0133", "0447"];
const ROSTER_STORAGE_KEY = "saga-creature-lab-roster-v1";
const CONFIG_STORAGE_KEY = "saga-creature-lab-config-v1";

const DIRECTIONS = [
  { index: 0, icon: "↓", label: "Frente / baixo" },
  { index: 1, icon: "↘", label: "Baixo-direita" },
  { index: 2, icon: "→", label: "Direita" },
  { index: 3, icon: "↗", label: "Cima-direita" },
  { index: 4, icon: "↑", label: "Costas / cima" },
  { index: 5, icon: "↖", label: "Cima-esquerda" },
  { index: 6, icon: "←", label: "Esquerda" },
  { index: 7, icon: "↙", label: "Baixo-esquerda" },
] as const;

const PREFERRED_BEHAVIOR = [
  "Idle",
  "Walk",
  "Happy",
  "Attack",
  "Bite",
  "Sleep",
  "Eat",
  "Sit",
];

type InspectorTab = "actions" | "frames" | "behavior" | "assets";

interface SavedLabConfig {
  selectedId?: string;
  speed?: number;
  scale?: number;
  showShadow?: boolean;
  behaviorQueue?: string[];
}

export function normalizeLabCreatureId(value: string | number): string {
  const digits = String(value).replace(/\D/g, "");
  const parsed = Number(digits);
  if (!digits || !Number.isInteger(parsed) || parsed < 1 || parsed > 9999) {
    throw new Error("Informe um ID numérico entre 1 e 9999.");
  }
  return String(parsed).padStart(4, "0");
}

function normalizedAction(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

export function buildPreferredBehavior(actions: readonly string[]): string[] {
  const result: string[] = [];
  for (const preferred of PREFERRED_BEHAVIOR) {
    const match = actions.find((action) => normalizedAction(action) === normalizedAction(preferred));
    if (match && !result.includes(match)) result.push(match);
  }
  if (!result.length && actions[0]) result.push(actions[0]);
  return result;
}

function loadRoster(): string[] {
  if (typeof window === "undefined") return DEFAULT_ROSTER;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ROSTER_STORAGE_KEY) || "null");
    if (!Array.isArray(parsed)) return DEFAULT_ROSTER;
    const ids = parsed
      .map((value) => {
        try {
          return normalizeLabCreatureId(value);
        } catch {
          return null;
        }
      })
      .filter((value): value is string => Boolean(value));
    return ids.length ? [...new Set(ids)] : DEFAULT_ROSTER;
  } catch {
    return DEFAULT_ROSTER;
  }
}

function loadSavedConfig(): SavedLabConfig {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(CONFIG_STORAGE_KEY) || "{}") as SavedLabConfig;
  } catch {
    return {};
  }
}

function messageFromError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function downloadTextFile(name: string, content: string, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    slate: "border-slate-700 bg-slate-800 text-slate-200",
    blue: "border-blue-700 bg-blue-950/70 text-blue-200",
    green: "border-emerald-700 bg-emerald-950/70 text-emerald-200",
    amber: "border-amber-700 bg-amber-950/70 text-amber-200",
    violet: "border-violet-700 bg-violet-950/70 text-violet-200",
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}

function EmptyPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-5 text-center text-sm font-bold text-slate-400">
      {children}
    </div>
  );
}

export function CreatureLab() {
  const savedConfig = useMemo(loadSavedConfig, []);
  const [rosterIds, setRosterIds] = useState<string[]>(loadRoster);
  const [catalog, setCatalog] = useState<CreatureCatalogEntry[]>([]);
  const [customEntries, setCustomEntries] = useState<Record<string, CreatureCatalogEntry>>({});
  const [catalogError, setCatalogError] = useState("");
  const [idInput, setIdInput] = useState(savedConfig.selectedId || "0025");
  const [selectedId, setSelectedId] = useState(() => {
    try {
      return normalizeLabCreatureId(savedConfig.selectedId || "0025");
    } catch {
      return "0025";
    }
  });
  const [character, setCharacter] = useState<CreatureCharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedAction, setSelectedAction] = useState("Idle");
  const [actionQuery, setActionQuery] = useState("");
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(savedConfig.speed || 1);
  const [scale, setScale] = useState(savedConfig.scale || 4);
  const [showShadow, setShowShadow] = useState(savedConfig.showShadow !== false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [frameOverride, setFrameOverride] = useState<number | null>(null);
  const [spriteMeta, setSpriteMeta] = useState<PmdLabSpriteMeta | null>(null);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("actions");
  const [behaviorQueue, setBehaviorQueue] = useState<string[]>(savedConfig.behaviorQueue || []);
  const [autoMode, setAutoMode] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);
  const [stagePosition, setStagePosition] = useState(50);
  const [xmlOverride, setXmlOverride] = useState<string | null>(null);
  const [xmlOverrideName, setXmlOverrideName] = useState("");
  const [spriteOverrides, setSpriteOverrides] = useState<Record<string, string>>({});
  const [shadowOverrides, setShadowOverrides] = useState<Record<string, string>>({});
  const objectUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    const controller = new AbortController();
    fetchCreatureCatalog(controller.signal)
      .then((items) => {
        setCatalog(items);
        setCatalogError("");
      })
      .catch((error) => setCatalogError(messageFromError(error)));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError("");
    setCharacter(null);
    setSpriteMeta(null);
    setFrameOverride(null);
    setCurrentFrame(0);
    setAutoMode(false);
    setXmlOverride(null);
    setXmlOverrideName("");

    for (const url of objectUrls.current) URL.revokeObjectURL(url);
    objectUrls.current.clear();
    setSpriteOverrides({});
    setShadowOverrides({});

    fetchCreatureCharacter(selectedId, controller.signal)
      .then((value) => {
        setCharacter(value);
        const actionNames = value.actions.map((action) => action.action);
        const nextAction =
          actionNames.find((action) => normalizedAction(action) === "idle") || actionNames[0] || "Idle";
        setSelectedAction(nextAction);
        setBehaviorQueue((current) => {
          const stillValid = current.filter((action) => actionNames.includes(action));
          return stillValid.length ? stillValid : buildPreferredBehavior(actionNames);
        });
        setCustomEntries((current) => ({
          ...current,
          [selectedId]: {
            numericId: selectedId,
            name: value.displayName,
            path: value.path,
            portraitUrl: value.portraitUrl,
            phase: value.phase,
            phaseRaw: value.phaseRaw,
          },
        }));
        setRosterIds((current) => (current.includes(selectedId) ? current : [...current, selectedId]));
      })
      .catch((error) => {
        if (!controller.signal.aborted) setLoadError(messageFromError(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [selectedId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(rosterIds));
  }, [rosterIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const value: SavedLabConfig = {
      selectedId,
      speed,
      scale,
      showShadow,
      behaviorQueue,
    };
    window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(value));
  }, [behaviorQueue, scale, selectedId, showShadow, speed]);

  useEffect(
    () => () => {
      for (const url of objectUrls.current) URL.revokeObjectURL(url);
      objectUrls.current.clear();
    },
    [],
  );

  const workingCharacter = useMemo(
    () => (character && xmlOverride ? { ...character, animDataXml: xmlOverride } : character),
    [character, xmlOverride],
  );

  const availableActions = useMemo(
    () => workingCharacter?.actions.map((action) => action.action) || [],
    [workingCharacter],
  );
  const filteredActions = useMemo(() => {
    const query = normalizedAction(actionQuery);
    if (!query) return workingCharacter?.actions || [];
    return (workingCharacter?.actions || []).filter((action) =>
      normalizedAction(action.action).includes(query),
    );
  }, [actionQuery, workingCharacter]);

  const selectedActionRecord = useMemo(
    () => (workingCharacter ? findCreatureAction(workingCharacter.actions, selectedAction) : undefined),
    [selectedAction, workingCharacter],
  );
  const selectedConcreteAsset = useMemo(
    () => (workingCharacter ? resolveCreatureActionAsset(workingCharacter.actions, selectedAction) : undefined),
    [selectedAction, workingCharacter],
  );
  const selectedDefinition = useMemo(() => {
    if (!workingCharacter) return undefined;
    try {
      return getPmdAnimation(parsePmdAnimData(workingCharacter.animDataXml), selectedAction);
    } catch {
      return undefined;
    }
  }, [selectedAction, workingCharacter]);

  const rosterItems = useMemo(() => {
    const byId = new Map<string, CreatureCatalogEntry>();
    for (const item of catalog) byId.set(item.numericId, item);
    for (const item of Object.values(customEntries)) byId.set(item.numericId, item);
    return rosterIds.map(
      (id) =>
        byId.get(id) || {
          numericId: id,
          name: `Pokémon #${Number(id)}`,
          path: "",
          phase: "desconhecida",
          phaseRaw: 0,
        },
    );
  }, [catalog, customEntries, rosterIds]);

  const concreteCount = useMemo(
    () => workingCharacter?.actions.filter((action) => action.kind === "sprite").length || 0,
    [workingCharacter],
  );
  const copyCount = (workingCharacter?.actions.length || 0) - concreteCount;

  const handleMeta = useCallback((value: PmdLabSpriteMeta) => {
    setSpriteMeta((current) => {
      if (
        current &&
        current.actionName === value.actionName &&
        current.frameCount === value.frameCount &&
        current.directionCount === value.directionCount &&
        current.sheetWidth === value.sheetWidth &&
        current.sheetHeight === value.sheetHeight
      ) {
        return current;
      }
      return value;
    });
  }, []);

  const chooseAction = useCallback((action: string) => {
    setSelectedAction(action);
    setFrameOverride(null);
    setCurrentFrame(0);
    setPaused(false);
  }, []);

  const loadByInput = () => {
    try {
      const id = normalizeLabCreatureId(idInput);
      setIdInput(id);
      setSelectedId(id);
    } catch (error) {
      setLoadError(messageFromError(error));
    }
  };

  const removeFromRoster = (id: string) => {
    setRosterIds((current) => {
      if (current.length <= 1) return current;
      const next = current.filter((value) => value !== id);
      if (selectedId === id) setSelectedId(next[0]);
      return next;
    });
  };

  const setObjectOverride = (
    file: File | undefined,
    setter: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  ) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLoadError("O override precisa ser uma imagem PNG/WebP válida.");
      return;
    }
    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    setter((current) => {
      const previous = current[selectedAction];
      if (previous) {
        URL.revokeObjectURL(previous);
        objectUrls.current.delete(previous);
      }
      return { ...current, [selectedAction]: url };
    });
  };

  const loadXmlOverride = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      parsePmdAnimData(text);
      setXmlOverride(text);
      setXmlOverrideName(file.name);
      setLoadError("");
    } catch (error) {
      setLoadError(`AnimData.xml rejeitado: ${messageFromError(error)}`);
    }
  };

  const resetOverrides = () => {
    for (const url of objectUrls.current) URL.revokeObjectURL(url);
    objectUrls.current.clear();
    setSpriteOverrides({});
    setShadowOverrides({});
    setXmlOverride(null);
    setXmlOverrideName("");
    setSpriteMeta(null);
  };

  const nextManualFrame = (delta: number) => {
    const frameCount = spriteMeta?.frameCount || 1;
    const base = frameOverride ?? currentFrame;
    setPaused(true);
    setFrameOverride((base + delta + frameCount) % frameCount);
  };

  const queueAction = () => {
    if (!selectedAction) return;
    setBehaviorQueue((current) => [...current, selectedAction]);
  };

  const moveQueueItem = (index: number, delta: number) => {
    setBehaviorQueue((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeQueueItem = (index: number) => {
    setBehaviorQueue((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const runQueueItem = useCallback(
    (index: number) => {
      const validQueue = behaviorQueue.filter((action) => availableActions.includes(action));
      if (!validQueue.length) return;
      const normalizedIndex = ((index % validQueue.length) + validQueue.length) % validQueue.length;
      const action = validQueue[normalizedIndex];
      chooseAction(action);
      setAutoIndex(normalizedIndex);

      const movement = /walk|run|dash|hop|jump/i.test(action);
      if (movement) {
        setStagePosition((current) => {
          const goRight = current < 30 ? true : current > 70 ? false : direction !== 2;
          setDirection(goRight ? 2 : 6);
          return Math.max(18, Math.min(82, current + (goRight ? 20 : -20)));
        });
      } else if (/sleep|sit|idle|eat/i.test(action)) {
        setDirection(0);
      }
    },
    [availableActions, behaviorQueue, chooseAction, direction],
  );

  useEffect(() => {
    if (!autoMode) return;
    const validQueue = behaviorQueue.filter((action) => availableActions.includes(action));
    if (!validQueue.length) {
      setAutoMode(false);
      return;
    }

    runQueueItem(autoIndex);
    const interval = window.setInterval(() => {
      setAutoIndex((current) => {
        const next = (current + 1) % validQueue.length;
        window.setTimeout(() => runQueueItem(next), 0);
        return next;
      });
    }, 3_200);
    return () => window.clearInterval(interval);
  }, [autoIndex, autoMode, availableActions, behaviorQueue, runQueueItem]);

  const exportConfig = () => {
    const payload = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      source: "SAGA Creature Lab",
      creature: {
        numericId: selectedId,
        displayName: workingCharacter?.displayName,
        sourceCommit: workingCharacter?.sourceCommit,
      },
      playback: { selectedAction, direction, speed, scale, showShadow },
      behaviorQueue,
      localOverrides: {
        animDataXml: Boolean(xmlOverride),
        spriteActions: Object.keys(spriteOverrides),
        shadowActions: Object.keys(shadowOverrides),
      },
    };
    downloadTextFile(`saga-creature-${selectedId}-lab.json`, JSON.stringify(payload, null, 2));
  };

  const importConfig = async (file: File | undefined) => {
    if (!file) return;
    try {
      const value = JSON.parse(await file.text()) as {
        creature?: { numericId?: string };
        playback?: {
          selectedAction?: string;
          direction?: number;
          speed?: number;
          scale?: number;
          showShadow?: boolean;
        };
        behaviorQueue?: string[];
      };
      if (value.creature?.numericId) {
        const id = normalizeLabCreatureId(value.creature.numericId);
        setIdInput(id);
        setSelectedId(id);
      }
      if (Array.isArray(value.behaviorQueue)) setBehaviorQueue(value.behaviorQueue.map(String));
      if (typeof value.playback?.direction === "number") setDirection(value.playback.direction);
      if (typeof value.playback?.speed === "number") setSpeed(value.playback.speed);
      if (typeof value.playback?.scale === "number") setScale(value.playback.scale);
      if (typeof value.playback?.showShadow === "boolean") setShowShadow(value.playback.showShadow);
      if (value.playback?.selectedAction) setSelectedAction(value.playback.selectedAction);
      setLoadError("");
    } catch (error) {
      setLoadError(`Configuração inválida: ${messageFromError(error)}`);
    }
  };

  const sourceSpriteUrl = creatureAssetUrl(selectedConcreteAsset?.animUrl);
  const sourceOffsetsUrl = creatureAssetUrl(selectedConcreteAsset?.offsetsUrl);
  const sourceShadowUrl = creatureAssetUrl(selectedConcreteAsset?.shadowsUrl);
  const visibleDirectionCount = spriteMeta?.directionCount || 8;
  const visibleDirections = DIRECTIONS.slice(0, visibleDirectionCount === 1 ? 1 : 8);
  const visibleFrames = Array.from({ length: spriteMeta?.frameCount || selectedDefinition?.durations.length || 0 });

  return (
    <main className="min-h-screen bg-[#07101f] text-slate-100">
      <div className="mx-auto max-w-[1700px] p-3 sm:p-5">
        <header className="mb-4 flex flex-col gap-3 rounded-3xl border border-slate-700 bg-slate-900/90 p-4 shadow-2xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Pill tone="violet">SAGA Creature Lab</Pill>
              <Pill tone="blue">PMDCollab real</Pill>
              <Pill tone="green">Sem Gemini/API paga</Pill>
            </div>
            <h1 className="text-2xl font-black sm:text-3xl">Laboratório de Pokémon, sprites e comportamento</h1>
            <p className="mt-1 max-w-4xl text-sm font-medium text-slate-400">
              Catálogo, ações PMD, direções, frames, reprodução manual, teste automático, fila de comportamento e overrides locais — sem alterar o save infantil.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-black hover:bg-slate-700">
              Importar configuração
              <input type="file" accept="application/json,.json" className="hidden" onChange={(event) => void importConfig(event.target.files?.[0])} />
            </label>
            <button onClick={exportConfig} className="rounded-xl border border-indigo-600 bg-indigo-700 px-3 py-2 text-xs font-black hover:bg-indigo-600">
              Exportar configuração
            </button>
          </div>
        </header>

        {(catalogError || loadError) && (
          <div className="mb-4 rounded-2xl border border-rose-700 bg-rose-950/70 p-3 text-sm font-bold text-rose-200">
            {loadError || catalogError}
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_390px]">
          <aside className="rounded-3xl border border-slate-700 bg-slate-900/90 p-3 xl:sticky xl:top-3 xl:h-[calc(100vh-24px)] xl:overflow-y-auto">
            <h2 className="px-1 text-sm font-black uppercase tracking-wider text-slate-300">Catálogo da bancada</h2>
            <div className="mt-3 flex gap-2">
              <input
                value={idInput}
                inputMode="numeric"
                onChange={(event) => setIdInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && loadByInput()}
                placeholder="ID: 25, 150…"
                aria-label="ID nacional do Pokémon"
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-950 px-3 text-sm font-black outline-none focus:border-indigo-400"
              />
              <button onClick={loadByInput} className="min-h-11 rounded-xl bg-indigo-600 px-3 text-xs font-black hover:bg-indigo-500">
                Puxar
              </button>
            </div>
            <p className="mt-2 px-1 text-[11px] font-medium text-slate-500">
              Digite qualquer ID numérico disponível no PMDCollab. O item é adicionado localmente à bancada.
            </p>

            <div className="mt-4 space-y-2">
              {rosterItems.map((item) => {
                const selected = item.numericId === selectedId;
                const portrait = creatureAssetUrl(item.portraitUrl);
                return (
                  <div key={item.numericId} className={`group flex items-center gap-2 rounded-2xl border p-2 ${selected ? "border-indigo-500 bg-indigo-950/60" : "border-slate-700 bg-slate-950/50"}`}>
                    <button onClick={() => setSelectedId(item.numericId)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800">
                        {portrait ? <img src={portrait} alt="" className="h-full w-full object-contain [image-rendering:pixelated]" /> : <span className="text-xs font-black text-slate-500">#{Number(item.numericId)}</span>}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-black text-white">{item.name}</div>
                        <div className="text-[10px] font-bold text-slate-500">#{item.numericId} • fase {item.phaseRaw}</div>
                      </div>
                    </button>
                    <button
                      onClick={() => removeFromRoster(item.numericId)}
                      className="min-h-10 min-w-10 rounded-xl text-slate-600 hover:bg-rose-950 hover:text-rose-300"
                      aria-label={`Remover ${item.name} da bancada`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className="min-w-0 space-y-4">
            <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/90 shadow-2xl">
              <div className="flex flex-col gap-3 border-b border-slate-700 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-xl font-black">{workingCharacter?.displayName || `Pokémon #${Number(selectedId)}`}</h2>
                    {workingCharacter && <Pill tone="amber">#{workingCharacter.numericId}</Pill>}
                    {workingCharacter && <Pill>{workingCharacter.phase}</Pill>}
                  </div>
                  <p className="mt-1 truncate text-xs font-medium text-slate-500">{workingCharacter?.path || "Carregando metadados…"}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-black">
                  <span className="rounded-xl bg-slate-800 px-3 py-2">{workingCharacter?.actions.length || 0} ações</span>
                  <span className="rounded-xl bg-slate-800 px-3 py-2">{concreteCount} sheets</span>
                  <span className="rounded-xl bg-slate-800 px-3 py-2">{copyCount} CopyOf</span>
                </div>
              </div>

              <div
                className="relative h-[430px] overflow-hidden border-b border-slate-700 bg-[#0b1830] sm:h-[500px]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(30,64,175,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(30,64,175,.12) 1px, transparent 1px), linear-gradient(180deg,#14294a 0%,#173b4e 58%,#31543d 59%,#213b2b 100%)",
                  backgroundSize: "32px 32px, 32px 32px, 100% 100%",
                }}
              >
                <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
                  <Pill tone={autoMode ? "green" : "slate"}>{autoMode ? "Motor automático ativo" : "Controle manual"}</Pill>
                  <Pill tone="violet">{selectedAction}</Pill>
                  {spriteMeta && <Pill>{spriteMeta.frameCount}f × {spriteMeta.directionCount} dir.</Pill>}
                  {xmlOverride && <Pill tone="amber">XML local: {xmlOverrideName}</Pill>}
                </div>

                <div className="absolute inset-x-0 bottom-8 h-px bg-white/10" />
                <div
                  className="absolute bottom-10 transition-[left] duration-1000 ease-linear"
                  style={{ left: `${stagePosition}%`, transform: "translateX(-50%)" }}
                >
                  {workingCharacter && !loading ? (
                    <PmdLabSprite
                      key={`${selectedId}:${selectedAction}`}
                      character={workingCharacter}
                      actionName={selectedAction}
                      direction={direction}
                      scale={scale}
                      speed={speed}
                      paused={paused}
                      frameOverride={frameOverride}
                      showShadow={showShadow}
                      spriteUrlOverride={spriteOverrides[selectedAction]}
                      shadowUrlOverride={shadowOverrides[selectedAction]}
                      onFrameChange={setCurrentFrame}
                      onMeta={handleMeta}
                    />
                  ) : (
                    <div className="rounded-2xl border border-slate-600 bg-slate-950/80 p-5 text-sm font-black text-slate-300">
                      {loading ? "Carregando personagem e AnimData.xml…" : "Nenhum personagem carregado."}
                    </div>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 rounded-xl bg-slate-950/70 px-3 py-2 text-[11px] font-black text-slate-300">
                  Frame {(frameOverride ?? currentFrame) + 1}/{spriteMeta?.frameCount || "?"} • direção {direction} • {speed.toFixed(2)}×
                </div>
              </div>

              <div className="space-y-3 p-3 sm:p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setPaused((value) => !value);
                      setFrameOverride(null);
                    }}
                    className={`min-h-11 rounded-xl px-4 text-sm font-black ${paused ? "bg-emerald-600 hover:bg-emerald-500" : "bg-amber-600 hover:bg-amber-500"}`}
                  >
                    {paused ? "▶ Reproduzir" : "⏸ Pausar"}
                  </button>
                  <button onClick={() => nextManualFrame(-1)} className="min-h-11 rounded-xl bg-slate-800 px-4 text-sm font-black hover:bg-slate-700">← Frame</button>
                  <button onClick={() => nextManualFrame(1)} className="min-h-11 rounded-xl bg-slate-800 px-4 text-sm font-black hover:bg-slate-700">Frame →</button>
                  <button
                    onClick={() => {
                      setPaused(true);
                      setFrameOverride(0);
                      setCurrentFrame(0);
                    }}
                    className="min-h-11 rounded-xl bg-slate-800 px-4 text-sm font-black hover:bg-slate-700"
                  >
                    Reiniciar
                  </button>
                  <button
                    onClick={() => {
                      setAutoIndex(0);
                      setAutoMode((value) => !value);
                    }}
                    className={`min-h-11 rounded-xl px-4 text-sm font-black ${autoMode ? "bg-rose-700 hover:bg-rose-600" : "bg-indigo-600 hover:bg-indigo-500"}`}
                  >
                    {autoMode ? "Parar automático" : "Testar automático"}
                  </button>
                  <button
                    onClick={() => {
                      setBehaviorQueue([...availableActions]);
                      setAutoIndex(0);
                      setAutoMode(true);
                    }}
                    disabled={!availableActions.length}
                    className="min-h-11 rounded-xl border border-violet-600 bg-violet-950 px-4 text-sm font-black text-violet-200 hover:bg-violet-900 disabled:opacity-40"
                  >
                    Rodar todas as ações
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="rounded-2xl border border-slate-700 bg-slate-950/50 p-3 text-xs font-black text-slate-300">
                    Velocidade: {speed.toFixed(2)}×
                    <input type="range" min="0.25" max="3" step="0.25" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="mt-2 w-full" />
                  </label>
                  <label className="rounded-2xl border border-slate-700 bg-slate-950/50 p-3 text-xs font-black text-slate-300">
                    Escala: {scale.toFixed(1)}×
                    <input type="range" min="1" max="8" step="0.5" value={scale} onChange={(event) => setScale(Number(event.target.value))} className="mt-2 w-full" />
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="Direções PMD">
                  {DIRECTIONS.map((item) => (
                    <button
                      key={item.index}
                      onClick={() => setDirection(item.index)}
                      title={item.label}
                      className={`min-h-12 rounded-xl border text-lg font-black ${direction === item.index ? "border-indigo-400 bg-indigo-600 text-white" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>

                {visibleFrames.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Timeline de frames">
                    {visibleFrames.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setPaused(true);
                          setFrameOverride(index);
                        }}
                        className={`min-h-10 min-w-10 rounded-lg border text-xs font-black ${index === (frameOverride ?? currentFrame) ? "border-amber-400 bg-amber-500 text-slate-950" : "border-slate-700 bg-slate-800 text-slate-300"}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-4">
              <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-300">Comparação de direções no frame selecionado</h3>
              {workingCharacter && spriteMeta ? (
                <div className={`grid gap-2 ${visibleDirectionCount === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-4"}`}>
                  {visibleDirections.map((item) => (
                    <button
                      key={item.index}
                      onClick={() => setDirection(item.index)}
                      className={`flex min-h-40 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border bg-slate-950/60 p-2 ${direction === item.index ? "border-indigo-400" : "border-slate-700"}`}
                    >
                      <PmdLabSprite
                        character={workingCharacter}
                        actionName={selectedAction}
                        direction={item.index}
                        scale={Math.min(2, scale)}
                        paused
                        frameOverride={frameOverride ?? currentFrame}
                        showShadow={showShadow}
                        spriteUrlOverride={spriteOverrides[selectedAction]}
                        shadowUrlOverride={shadowOverrides[selectedAction]}
                      />
                      <span className="text-[10px] font-black text-slate-400">{item.icon} {item.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyPanel>Carregue uma ação válida para comparar as direções.</EmptyPanel>
              )}
            </div>
          </section>

          <aside className="min-w-0 rounded-3xl border border-slate-700 bg-slate-900/90 xl:sticky xl:top-3 xl:h-[calc(100vh-24px)] xl:overflow-hidden">
            <div className="grid grid-cols-4 border-b border-slate-700 bg-slate-950/50 p-2">
              {([
                ["actions", "Ações"],
                ["frames", "Frames"],
                ["behavior", "Motor"],
                ["assets", "Assets"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setInspectorTab(value)}
                  className={`min-h-11 rounded-xl text-xs font-black ${inspectorTab === value ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="max-h-none overflow-y-auto p-3 xl:h-[calc(100vh-82px)]">
              {inspectorTab === "actions" && (
                <div>
                  <input
                    value={actionQuery}
                    onChange={(event) => setActionQuery(event.target.value)}
                    placeholder="Buscar Idle, Walk, Attack…"
                    className="mb-3 min-h-11 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 text-sm font-bold outline-none focus:border-indigo-400"
                  />
                  <div className="space-y-2">
                    {filteredActions.map((action) => (
                      <button
                        key={action.action}
                        onClick={() => chooseAction(action.action)}
                        className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left ${selectedAction === action.action ? "border-indigo-400 bg-indigo-950/70" : "border-slate-700 bg-slate-950/50 hover:bg-slate-800"}`}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-black text-white">{action.action}</div>
                          <div className="mt-1 text-[10px] font-bold text-slate-500">
                            {action.kind === "copy" ? `CopyOf → ${action.copyOf || "?"}` : "Spritesheet própria"}
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          {action.locked && <Pill tone="amber">lock</Pill>}
                          <Pill tone={action.kind === "copy" ? "violet" : "green"}>{action.kind}</Pill>
                        </div>
                      </button>
                    ))}
                    {!filteredActions.length && <EmptyPanel>Nenhuma ação corresponde à busca.</EmptyPanel>}
                  </div>
                </div>
              )}

              {inspectorTab === "frames" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-black">
                    <div className="rounded-2xl bg-slate-950/60 p-3"><div className="text-xl text-white">{spriteMeta?.frameCount || "—"}</div><div className="text-slate-500">frames</div></div>
                    <div className="rounded-2xl bg-slate-950/60 p-3"><div className="text-xl text-white">{spriteMeta?.directionCount || "—"}</div><div className="text-slate-500">direções</div></div>
                    <div className="rounded-2xl bg-slate-950/60 p-3"><div className="text-xl text-white">{spriteMeta ? `${spriteMeta.frameWidth}×${spriteMeta.frameHeight}` : "—"}</div><div className="text-slate-500">célula</div></div>
                    <div className="rounded-2xl bg-slate-950/60 p-3"><div className="text-xl text-white">{spriteMeta ? `${spriteMeta.sheetWidth}×${spriteMeta.sheetHeight}` : "—"}</div><div className="text-slate-500">sheet</div></div>
                  </div>

                  {workingCharacter && spriteMeta ? (
                    <div className="grid grid-cols-2 gap-2">
                      {visibleFrames.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setPaused(true);
                            setFrameOverride(index);
                          }}
                          className={`flex min-h-36 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border bg-slate-950/60 p-2 ${index === (frameOverride ?? currentFrame) ? "border-amber-400" : "border-slate-700"}`}
                        >
                          <PmdLabSprite
                            character={workingCharacter}
                            actionName={selectedAction}
                            direction={direction}
                            scale={Math.min(2, scale)}
                            paused
                            frameOverride={index}
                            showShadow={showShadow}
                            spriteUrlOverride={spriteOverrides[selectedAction]}
                            shadowUrlOverride={shadowOverrides[selectedAction]}
                          />
                          <span className="text-[10px] font-black text-slate-400">Frame {index + 1} • {spriteMeta.durations[index]} ticks</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyPanel>Os frames aparecerão depois que a spritesheet for validada.</EmptyPanel>
                  )}

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-3 text-xs font-bold text-slate-400">
                    <div>Rush: {spriteMeta?.rushFrame ?? "—"}</div>
                    <div>Hit: {spriteMeta?.hitFrame ?? "—"}</div>
                    <div>Return: {spriteMeta?.returnFrame ?? "—"}</div>
                    <div>CopyOf XML: {spriteMeta?.copyOf || "não"}</div>
                  </div>
                </div>
              )}

              {inspectorTab === "behavior" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button onClick={queueAction} className="min-h-11 flex-1 rounded-xl bg-indigo-600 px-3 text-xs font-black hover:bg-indigo-500">Adicionar ação atual</button>
                    <button onClick={() => setBehaviorQueue(buildPreferredBehavior(availableActions))} className="min-h-11 rounded-xl bg-slate-800 px-3 text-xs font-black hover:bg-slate-700">Padrão</button>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">Edite a sequência executada pelo modo automático. A fila é persistida apenas neste navegador.</p>

                  <div className="space-y-2">
                    {behaviorQueue.map((action, index) => (
                      <div key={`${action}:${index}`} className={`flex items-center gap-2 rounded-2xl border p-2 ${autoMode && index === autoIndex ? "border-emerald-400 bg-emerald-950/50" : "border-slate-700 bg-slate-950/50"}`}>
                        <button onClick={() => runQueueItem(index)} className="min-w-0 flex-1 truncate text-left text-sm font-black text-white">{index + 1}. {action}</button>
                        <button onClick={() => moveQueueItem(index, -1)} className="min-h-10 min-w-10 rounded-xl bg-slate-800">↑</button>
                        <button onClick={() => moveQueueItem(index, 1)} className="min-h-10 min-w-10 rounded-xl bg-slate-800">↓</button>
                        <button onClick={() => setBehaviorQueue((current) => [...current.slice(0, index + 1), action, ...current.slice(index + 1)])} className="min-h-10 min-w-10 rounded-xl bg-slate-800" aria-label={`Duplicar ${action}`}>⧉</button>
                        <button onClick={() => removeQueueItem(index)} className="min-h-10 min-w-10 rounded-xl bg-rose-950 text-rose-300">×</button>
                      </div>
                    ))}
                    {!behaviorQueue.length && <EmptyPanel>Adicione ações para montar o comportamento automático.</EmptyPanel>}
                  </div>

                  <button
                    onClick={() => {
                      setAutoIndex(0);
                      setAutoMode((value) => !value);
                    }}
                    className={`min-h-12 w-full rounded-xl text-sm font-black ${autoMode ? "bg-rose-700" : "bg-emerald-600"}`}
                  >
                    {autoMode ? "Parar sequência" : "Executar sequência"}
                  </button>
                </div>
              )}

              {inspectorTab === "assets" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-3">
                    <div className="text-sm font-black text-white">{selectedAction}</div>
                    <div className="mt-1 text-xs font-bold text-slate-500">
                      {selectedActionRecord?.kind === "copy" ? `CopyOf → ${selectedActionRecord.copyOf}` : "Asset concreto"}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {sourceSpriteUrl && <a href={sourceSpriteUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs font-black text-blue-300 hover:bg-slate-700">Abrir spritesheet original</a>}
                    {sourceOffsetsUrl && <a href={sourceOffsetsUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs font-black text-blue-300 hover:bg-slate-700">Abrir offsets original</a>}
                    {sourceShadowUrl && <a href={sourceShadowUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs font-black text-blue-300 hover:bg-slate-700">Abrir shadow original</a>}
                    {workingCharacter && (
                      <button onClick={() => downloadTextFile(`${selectedId}-AnimData.xml`, workingCharacter.animDataXml, "application/xml")} className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-left text-xs font-black text-blue-300 hover:bg-slate-700">Baixar AnimData.xml atual</button>
                    )}
                  </div>

                  <div className="rounded-2xl border border-amber-800 bg-amber-950/30 p-3">
                    <h4 className="text-xs font-black uppercase tracking-wide text-amber-200">Overrides locais de teste</h4>
                    <p className="mt-1 text-[11px] font-medium text-amber-200/70">Substituem a visualização sem escrever no PMDCollab nem alterar o repositório.</p>
                    <div className="mt-3 grid gap-2">
                      <label className="cursor-pointer rounded-xl bg-amber-900/60 p-3 text-xs font-black text-amber-100 hover:bg-amber-800">
                        Substituir PNG da ação
                        <input type="file" accept="image/png,image/webp" className="hidden" onChange={(event) => setObjectOverride(event.target.files?.[0], setSpriteOverrides)} />
                      </label>
                      <label className="cursor-pointer rounded-xl bg-amber-900/60 p-3 text-xs font-black text-amber-100 hover:bg-amber-800">
                        Substituir PNG da sombra
                        <input type="file" accept="image/png,image/webp" className="hidden" onChange={(event) => setObjectOverride(event.target.files?.[0], setShadowOverrides)} />
                      </label>
                      <label className="cursor-pointer rounded-xl bg-amber-900/60 p-3 text-xs font-black text-amber-100 hover:bg-amber-800">
                        Importar AnimData.xml
                        <input type="file" accept="application/xml,text/xml,.xml" className="hidden" onChange={(event) => void loadXmlOverride(event.target.files?.[0])} />
                      </label>
                      <button onClick={resetOverrides} className="rounded-xl border border-amber-700 p-3 text-left text-xs font-black text-amber-200 hover:bg-amber-900/50">Limpar todos os overrides</button>
                    </div>
                  </div>

                  <label className="flex min-h-12 items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/50 p-3 text-xs font-black text-slate-300">
                    Renderizar sombra
                    <input type="checkbox" checked={showShadow} onChange={(event) => setShowShadow(event.target.checked)} className="h-5 w-5" />
                  </label>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-3 text-xs font-bold text-slate-400">
                    <div>Commit-fonte: {workingCharacter?.sourceCommit || "não informado"}</div>
                    <div className="mt-1">Atualização: {workingCharacter?.sourceUpdatedAt || "não informada"}</div>
                    <div className="mt-3 text-[11px] leading-relaxed">{workingCharacter?.license}</div>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-3">
                    <h4 className="text-xs font-black uppercase text-slate-300">Créditos</h4>
                    <div className="mt-2 space-y-1 text-xs font-bold text-slate-500">
                      {(workingCharacter?.credits.length ? workingCharacter.credits : [{ id: "—", name: "Não informado" }]).map((credit) => (
                        <div key={credit.id}>{credit.name || credit.id}{credit.contact ? ` • ${credit.contact}` : ""}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
