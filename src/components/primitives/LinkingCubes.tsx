import React from "react";
import { FONT } from "../Mascot";

export interface LinkingCubeGroup {
  n: number;
  color: string;
  /** Quantos cubos desta parcela já foram sincronizados a um salto da reta. */
  highlightCount?: number;
}

export interface LinkingCubesProps {
  groups: LinkingCubeGroup[];
  showNumbers?: boolean;
  numberAbove?: boolean;
  showPlus?: boolean;
  /** Encosta as parcelas num único trem contínuo; padrão preserva o espaçamento legado. */
  joinGroups?: boolean;
  /** Variante menor para trens até 10 caberem em phone sem alterar consumidores legados. */
  compact?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  "bg-emerald-400": "#34d399",
  "bg-indigo-400": "#818cf8",
  "bg-blue-400": "#60a5fa",
  "bg-rose-400": "#fb7185",
  "bg-amber-400": "#fbbf24",
  "bg-purple-400": "#c084fc",
};

export function LinkingCubes({
  groups,
  showNumbers = false,
  numberAbove = false,
  showPlus = false,
  joinGroups = false,
  compact = false,
}: LinkingCubesProps) {
  const renderCubes = (group: LinkingCubeGroup, groupIndex: number) => {
    const hexColor = COLOR_MAP[group.color] || group.color || "#34d399";
    const hasProgress = group.highlightCount !== undefined;
    const width = compact ? 34 : 46;
    const height = compact ? 30 : 40;
    const overlap = compact ? -6 : -8;

    return Array.from({ length: group.n }).map((_, i) => {
      const highlighted = !hasProgress || i < Math.max(0, group.highlightCount ?? 0);
      return (
        <div
          key={i}
          className="relative transition-all"
          data-linking-cube
          data-group-index={groupIndex}
          data-cube-index={i}
          data-synced={highlighted ? "true" : "false"}
          style={{
            marginLeft: i === 0 ? 0 : overlap,
            zIndex: 10 - i,
            opacity: highlighted ? 1 : 0.42,
            transform: hasProgress && highlighted ? "translateY(-2px)" : "none",
          }}
        >
          <svg width={width} height={height} viewBox="0 0 54 40" className="drop-shadow-sm overflow-visible" aria-hidden="true">
            <rect x="2" y="2" width="38" height="36" rx="4" fill={hexColor} stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" />
            <path d="M 40 14 L 48 14 L 48 26 L 40 26" fill={hexColor} stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="6" y="6" width="30" height="12" rx="2" fill="white" opacity="0.35" />
          </svg>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center gap-2" data-linking-cubes>
      <div className="flex flex-row items-end" style={{ paddingRight: compact ? 4 : 8 }}>
        {groups.map((g, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-2">
              {numberAbove && (
                <div className={`${compact ? "text-2xl" : "text-3xl"} font-black text-slate-700`} style={{ fontFamily: FONT }}>
                  {g.n}
                </div>
              )}
              <div className="flex items-center">
                {renderCubes(g, idx)}
              </div>
            </div>

            {idx < groups.length - 1 && !joinGroups && (
              <div className="flex items-center justify-center px-4 mb-2">
                {showPlus ? (
                  <span className="text-4xl font-black text-slate-500" style={{ fontFamily: FONT }}>+</span>
                ) : (
                  <div className="w-4" />
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {showNumbers && !numberAbove && (
        <div className="flex gap-4 items-center mt-2 text-4xl font-black text-slate-700" style={{ fontFamily: FONT }}>
          {groups.map((g, idx) => (
            <React.Fragment key={idx}>
              <span className="px-4 py-2 bg-slate-100 rounded-xl">{g.n}</span>
              {idx < groups.length - 1 && <span className="text-slate-500">+</span>}
            </React.Fragment>
          ))}
          <span className="text-slate-500">=</span>
          <span className="px-4 py-2 bg-slate-100 rounded-xl">
            {groups.reduce((sum, g) => sum + g.n, 0)}
          </span>
        </div>
      )}
    </div>
  );
}
