import React from "react";
import { Progress } from "../../types";

export interface MasteryDimension {
  id: "comprehension" | "fluency" | "retention" | "independence";
  label: string;
  value: number | null;
  color: string;
}

export interface MasteryViewModel {
  legacy: boolean;
  crowned: boolean;
  dimensions: MasteryDimension[];
}

const pct = (value: number, target: number) =>
  Math.max(0, Math.min(100, Math.round((value / target) * 100)));

export function getMasteryViewModel(progress: Progress): MasteryViewModel {
  const evidence = progress.masteryEvidence;
  const legacy = evidence?.crownedBy === "legacy" || (progress.dom === true && !evidence);
  const dimensions: MasteryDimension[] = [
    {
      id: "comprehension",
      label: "Compreensão",
      value: legacy ? null : pct(progress.maxLvl || progress.lvl || 1, 5),
      color: "#6366F1",
    },
    {
      id: "fluency",
      label: "Fluência",
      value: legacy ? null : pct(evidence?.fluencyStreak || 0, 3),
      color: "#F59E0B",
    },
    {
      id: "retention",
      label: "Retenção",
      value: legacy ? null : pct(evidence?.retentionPasses || 0, 1),
      color: "#10B981",
    },
    {
      id: "independence",
      label: "Independência",
      value: legacy ? null : pct(evidence?.independenceStreak || 0, 3),
      color: "#EC4899",
    },
  ];

  return { legacy, crowned: progress.dom === true, dimensions };
}

export function MasteryDimensions({ progress }: { progress: Progress }) {
  if (!progress.tot && !progress.dom) return null;
  const model = getMasteryViewModel(progress);

  return (
    <details className="mt-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
      <summary className="cursor-pointer select-none text-xs font-extrabold text-slate-600">
        {model.crowned ? "👑 Evidências de domínio" : "📊 Dimensões de aprendizagem"}
      </summary>
      {model.legacy && (
        <p className="mt-2 text-[11px] font-semibold leading-relaxed text-slate-500">
          Coroa anterior preservada. As quatro dimensões ainda não eram medidas nessa conquista.
        </p>
      )}
      <div className="mt-2 grid grid-cols-2 gap-2">
        {model.dimensions.map(dimension => (
          <div key={dimension.id}>
            <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-bold text-slate-500">
              <span>{dimension.label}</span>
              <span>{dimension.value === null ? "não medida" : `${dimension.value}%`}</span>
            </div>
            <div
              role="progressbar"
              aria-label={dimension.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={dimension.value ?? undefined}
              className="h-2 overflow-hidden rounded-full bg-slate-100"
            >
              {dimension.value !== null && (
                <div
                  className="h-full rounded-full transition-transform"
                  style={{
                    backgroundColor: dimension.color,
                    transform: `scaleX(${dimension.value / 100})`,
                    transformOrigin: "left",
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
