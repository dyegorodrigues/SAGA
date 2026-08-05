import React, { useEffect, useMemo, useState } from "react";

import { CreatureIntent, resolvePmdAction } from "./domain";
import { getPmdAnimation, parsePmdAnimData, validatePmdSheetDimensions } from "./pmdAnimData";
import {
  CreatureCharacterData,
  creatureAssetUrl,
  resolveCreatureActionAsset,
} from "./spriteCollabClient";

interface ImageMeta {
  width: number;
  height: number;
}

interface Props {
  character: CreatureCharacterData;
  intent: CreatureIntent;
  direction: number;
  scale?: number;
  paused?: boolean;
  className?: string;
  onResolvedAction?: (actionName: string) => void;
}

function useImageMeta(url: string | undefined): { meta?: ImageMeta; error?: string } {
  const [state, setState] = useState<{ meta?: ImageMeta; error?: string }>({});

  useEffect(() => {
    if (!url) {
      setState({ error: "A animação não possui spritesheet." });
      return;
    }
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) setState({ meta: { width: image.naturalWidth, height: image.naturalHeight } });
    };
    image.onerror = () => {
      if (!cancelled) setState({ error: "Não foi possível carregar a spritesheet." });
    };
    image.src = url;
    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [url]);

  return state;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export function PmdCreatureSprite({
  character,
  intent,
  direction,
  scale = 3,
  paused = false,
  className = "",
  onResolvedAction,
}: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const parsed = useMemo(() => parsePmdAnimData(character.animDataXml), [character.animDataXml]);
  const availableActions = useMemo(
    () => character.actions.map((action) => action.action),
    [character.actions],
  );
  const actionName = useMemo(
    () => resolvePmdAction(intent, availableActions) || availableActions[0],
    [availableActions, intent],
  );
  const actionAsset = useMemo(
    () => (actionName ? resolveCreatureActionAsset(character.actions, actionName) : undefined),
    [actionName, character.actions],
  );
  const definition = useMemo(
    () => (actionName ? getPmdAnimation(parsed, actionName) : undefined),
    [actionName, parsed],
  );
  const spriteUrl = creatureAssetUrl(actionAsset?.animUrl);
  const shadowUrl = creatureAssetUrl(actionAsset?.shadowsUrl);
  const { meta, error } = useImageMeta(spriteUrl);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
    if (actionName) onResolvedAction?.(actionName);
  }, [actionName, onResolvedAction]);

  const sheet = useMemo(() => {
    if (!meta || !definition) return undefined;
    try {
      return validatePmdSheetDimensions(meta.width, meta.height, definition);
    } catch {
      return undefined;
    }
  }, [definition, meta]);

  useEffect(() => {
    if (!definition || !sheet || paused || reducedMotion || document.hidden) return;
    const ticks = definition.durations[frameIndex] || definition.durations[0] || 8;
    const timeout = window.setTimeout(
      () => setFrameIndex((current) => (current + 1) % sheet.frameCount),
      Math.max(50, Math.round((ticks * 1000) / 60)),
    );
    return () => window.clearTimeout(timeout);
  }, [definition, frameIndex, paused, reducedMotion, sheet]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setFrameIndex(0);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (error || !definition || !sheet || !spriteUrl || !meta) {
    return (
      <div
        className={`flex min-h-24 min-w-24 items-center justify-center rounded-2xl bg-white/70 px-3 text-center text-xs font-bold text-slate-500 ${className}`}
        role="status"
      >
        {error || "Carregando animação PMD…"}
      </div>
    );
  }

  const effectiveDirection = sheet.directionCount === 8 ? ((direction % 8) + 8) % 8 : 0;
  const x = frameIndex * definition.frameWidth;
  const y = effectiveDirection * definition.frameHeight;
  const width = definition.frameWidth * scale;
  const height = definition.frameHeight * scale;
  const layerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: definition.frameWidth,
    height: definition.frameHeight,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `-${x}px -${y}px`,
    backgroundSize: `${meta.width}px ${meta.height}px`,
    imageRendering: "pixelated",
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };

  return (
    <div
      className={`relative shrink-0 select-none ${className}`}
      style={{ width, height }}
      role="img"
      aria-label={`${character.displayName}, animação ${actionName}`}
      data-action={actionName}
      data-frame={frameIndex}
      data-direction={effectiveDirection}
    >
      {shadowUrl && (
        <div
          aria-hidden="true"
          style={{
            ...layerStyle,
            backgroundImage: `url(${shadowUrl})`,
            opacity: 0.72,
          }}
        />
      )}
      <div
        aria-hidden="true"
        style={{
          ...layerStyle,
          backgroundImage: `url(${spriteUrl})`,
        }}
      />
    </div>
  );
}
