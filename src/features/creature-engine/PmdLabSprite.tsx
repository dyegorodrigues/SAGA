import React, { useEffect, useMemo, useState } from "react";

import {
  getPmdAnimation,
  parsePmdAnimData,
  PmdAnimationDefinition,
  validatePmdSheetDimensions,
} from "./pmdAnimData";
import {
  CreatureCharacterData,
  creatureAssetUrl,
  resolveCreatureActionAsset,
} from "./spriteCollabClient";

interface ImageMeta {
  width: number;
  height: number;
}

export interface PmdLabSpriteMeta {
  actionName: string;
  frameCount: number;
  directionCount: 1 | 8;
  frameWidth: number;
  frameHeight: number;
  sheetWidth: number;
  sheetHeight: number;
  durations: number[];
  rushFrame?: number;
  hitFrame?: number;
  returnFrame?: number;
  copyOf?: string;
}

interface Props {
  character: CreatureCharacterData;
  actionName: string;
  direction: number;
  scale?: number;
  speed?: number;
  paused?: boolean;
  frameOverride?: number | null;
  showShadow?: boolean;
  spriteUrlOverride?: string;
  shadowUrlOverride?: string;
  className?: string;
  onFrameChange?: (frame: number) => void;
  onMeta?: (meta: PmdLabSpriteMeta) => void;
}

function messageFromError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function useImageMeta(url: string | undefined): { meta?: ImageMeta; error?: string } {
  const [state, setState] = useState<{ meta?: ImageMeta; error?: string }>({});

  useEffect(() => {
    setState({});
    if (!url) {
      setState({ error: "A ação não possui spritesheet." });
      return;
    }

    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) {
        setState({ meta: { width: image.naturalWidth, height: image.naturalHeight } });
      }
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

function safeDefinition(
  character: CreatureCharacterData,
  actionName: string,
): { definition?: PmdAnimationDefinition; error?: string } {
  try {
    const parsed = parsePmdAnimData(character.animDataXml);
    const definition = getPmdAnimation(parsed, actionName);
    if (!definition) return { error: `A ação '${actionName}' não existe no AnimData.xml.` };
    return { definition };
  } catch (error) {
    return { error: messageFromError(error) };
  }
}

export function PmdLabSprite({
  character,
  actionName,
  direction,
  scale = 4,
  speed = 1,
  paused = false,
  frameOverride = null,
  showShadow = true,
  spriteUrlOverride,
  shadowUrlOverride,
  className = "",
  onFrameChange,
  onMeta,
}: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const definitionResult = useMemo(
    () => safeDefinition(character, actionName),
    [actionName, character],
  );
  const definition = definitionResult.definition;

  const actionAsset = useMemo(
    () => resolveCreatureActionAsset(character.actions, actionName),
    [actionName, character.actions],
  );
  const spriteUrl = spriteUrlOverride || creatureAssetUrl(actionAsset?.animUrl);
  const shadowUrl = shadowUrlOverride || creatureAssetUrl(actionAsset?.shadowsUrl);
  const { meta, error: imageError } = useImageMeta(spriteUrl);
  const [internalFrame, setInternalFrame] = useState(0);

  useEffect(() => {
    setInternalFrame(0);
  }, [actionName, spriteUrl]);

  const sheetResult = useMemo(() => {
    if (!definition || !meta) return {} as {
      sheet?: { frameCount: number; directionCount: 1 | 8 };
      error?: string;
    };
    try {
      return { sheet: validatePmdSheetDimensions(meta.width, meta.height, definition) };
    } catch (error) {
      return { error: messageFromError(error) };
    }
  }, [definition, meta]);
  const sheet = sheetResult.sheet;

  const controlledFrame =
    frameOverride == null || !sheet
      ? internalFrame
      : Math.max(0, Math.min(sheet.frameCount - 1, frameOverride));

  useEffect(() => {
    onFrameChange?.(controlledFrame);
  }, [controlledFrame, onFrameChange]);

  useEffect(() => {
    if (!definition || !sheet || paused || reducedMotion || frameOverride != null || document.hidden) {
      return;
    }
    const ticks = definition.durations[internalFrame] || definition.durations[0] || 8;
    const safeSpeed = Math.max(0.1, Math.min(4, speed));
    const timeout = window.setTimeout(
      () => setInternalFrame((current) => (current + 1) % sheet.frameCount),
      Math.max(25, Math.round((ticks * 1000) / 60 / safeSpeed)),
    );
    return () => window.clearTimeout(timeout);
  }, [definition, frameOverride, internalFrame, paused, reducedMotion, sheet, speed]);

  useEffect(() => {
    if (!definition || !sheet || !meta) return;
    onMeta?.({
      actionName,
      frameCount: sheet.frameCount,
      directionCount: sheet.directionCount,
      frameWidth: definition.frameWidth,
      frameHeight: definition.frameHeight,
      sheetWidth: meta.width,
      sheetHeight: meta.height,
      durations: [...definition.durations],
      rushFrame: definition.rushFrame,
      hitFrame: definition.hitFrame,
      returnFrame: definition.returnFrame,
      copyOf: definition.copyOf,
    });
  }, [actionName, definition, meta, onMeta, sheet]);

  const failure = definitionResult.error || imageError || sheetResult.error;
  if (failure || !definition || !sheet || !meta || !spriteUrl) {
    return (
      <div
        className={`flex min-h-28 min-w-28 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/70 px-4 text-center text-xs font-bold text-slate-300 ${className}`}
        role="status"
      >
        {failure || "Carregando animação PMD…"}
      </div>
    );
  }

  const effectiveDirection = sheet.directionCount === 8 ? ((direction % 8) + 8) % 8 : 0;
  const x = controlledFrame * definition.frameWidth;
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
      aria-label={`${character.displayName}, ação ${actionName}, direção ${effectiveDirection}, frame ${controlledFrame + 1}`}
      data-action={actionName}
      data-frame={controlledFrame}
      data-direction={effectiveDirection}
    >
      {showShadow && shadowUrl && (
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
