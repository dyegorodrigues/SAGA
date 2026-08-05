export interface PmdAnimationDefinition {
  name: string;
  index: number;
  copyOf?: string;
  frameWidth: number;
  frameHeight: number;
  durations: number[];
  rushFrame?: number;
  hitFrame?: number;
  returnFrame?: number;
}

export interface ParsedPmdAnimData {
  shadowSize: number;
  animations: PmdAnimationDefinition[];
  warnings: string[];
}

export class PmdAnimDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PmdAnimDataError";
  }
}

function textOf(parent: Element, selector: string): string | undefined {
  const value = parent.querySelector(`:scope > ${selector}`)?.textContent?.trim();
  return value || undefined;
}

function optionalInteger(value: string | undefined): number | undefined {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

function requiredPositiveInteger(value: string | undefined, field: string, animation: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new PmdAnimDataError(
      `A animação '${animation}' possui ${field} inválido: ${value ?? "ausente"}.`,
    );
  }
  return parsed;
}

function parseDurations(anim: Element, animationName: string): number[] {
  const values = Array.from(anim.querySelectorAll(":scope > Durations > Duration")).map((node) =>
    requiredPositiveInteger(node.textContent?.trim(), "Duration", animationName),
  );
  if (!values.length) {
    throw new PmdAnimDataError(`A animação '${animationName}' não possui durações.`);
  }
  return values;
}

/**
 * Parser estrito do AnimData.xml usado pelo PMDCollab. CopyOf é resolvido sem
 * fabricar dimensões ou durações e ciclos são rejeitados explicitamente.
 */
export function parsePmdAnimData(xml: string): ParsedPmdAnimData {
  if (!xml.trim()) throw new PmdAnimDataError("AnimData.xml está vazio.");
  if (typeof DOMParser === "undefined") {
    throw new PmdAnimDataError("DOMParser não está disponível neste ambiente.");
  }

  const document = new DOMParser().parseFromString(xml, "application/xml");
  const parseError = document.querySelector("parsererror");
  if (parseError) {
    throw new PmdAnimDataError(`AnimData.xml inválido: ${parseError.textContent?.trim() || "erro XML"}.`);
  }

  const root = document.querySelector("AnimData") || document.documentElement;
  if (!root) throw new PmdAnimDataError("Elemento raiz <AnimData> não encontrado.");

  const shadowSize = Number(textOf(root, "ShadowSize") ?? 1);
  if (!Number.isFinite(shadowSize) || shadowSize < 0) {
    throw new PmdAnimDataError("ShadowSize inválido.");
  }

  const rawAnimations = Array.from(root.querySelectorAll(":scope > Anims > Anim"));
  if (!rawAnimations.length) {
    throw new PmdAnimDataError("AnimData.xml não contém animações.");
  }

  const warnings: string[] = [];
  const unresolved = rawAnimations.map((anim) => {
    const name = textOf(anim, "Name");
    if (!name) throw new PmdAnimDataError("Uma animação não possui <Name>.");
    const copyOf = textOf(anim, "CopyOf");
    if (copyOf) {
      return {
        name,
        index: optionalInteger(textOf(anim, "Index")) ?? -1,
        copyOf,
        frameWidth: 0,
        frameHeight: 0,
        durations: [] as number[],
        rushFrame: optionalInteger(textOf(anim, "RushFrame")),
        hitFrame: optionalInteger(textOf(anim, "HitFrame")),
        returnFrame: optionalInteger(textOf(anim, "ReturnFrame")),
      };
    }

    const frameWidth = requiredPositiveInteger(textOf(anim, "FrameWidth"), "FrameWidth", name);
    const frameHeight = requiredPositiveInteger(textOf(anim, "FrameHeight"), "FrameHeight", name);
    if (frameWidth % 2 !== 0 || frameHeight % 2 !== 0) {
      warnings.push(`A animação '${name}' usa uma célula ímpar (${frameWidth}×${frameHeight}).`);
    }
    return {
      name,
      index: optionalInteger(textOf(anim, "Index")) ?? -1,
      frameWidth,
      frameHeight,
      durations: parseDurations(anim, name),
      rushFrame: optionalInteger(textOf(anim, "RushFrame")),
      hitFrame: optionalInteger(textOf(anim, "HitFrame")),
      returnFrame: optionalInteger(textOf(anim, "ReturnFrame")),
    };
  });

  const byName = new Map<string, (typeof unresolved)[number]>();
  for (const animation of unresolved) {
    if (byName.has(animation.name)) {
      throw new PmdAnimDataError(`Animação duplicada: '${animation.name}'.`);
    }
    byName.set(animation.name, animation);
  }

  const resolving = new Set<string>();
  const resolved = new Map<string, PmdAnimationDefinition>();
  const resolve = (name: string): PmdAnimationDefinition => {
    const cached = resolved.get(name);
    if (cached) return cached;
    const animation = byName.get(name);
    if (!animation) throw new PmdAnimDataError(`CopyOf referencia '${name}', que não existe.`);
    if (resolving.has(name)) throw new PmdAnimDataError(`Ciclo de CopyOf detectado em '${name}'.`);
    resolving.add(name);

    let result: PmdAnimationDefinition;
    if (animation.copyOf) {
      const source = resolve(animation.copyOf);
      result = {
        ...source,
        name: animation.name,
        index: animation.index >= 0 ? animation.index : source.index,
        copyOf: animation.copyOf,
        durations: [...source.durations],
        rushFrame: animation.rushFrame ?? source.rushFrame,
        hitFrame: animation.hitFrame ?? source.hitFrame,
        returnFrame: animation.returnFrame ?? source.returnFrame,
      };
    } else {
      result = { ...animation, durations: [...animation.durations] };
    }

    resolving.delete(name);
    resolved.set(name, result);
    return result;
  };

  const animations = unresolved.map((animation) => resolve(animation.name));
  return { shadowSize, animations, warnings };
}

export function getPmdAnimation(
  parsed: ParsedPmdAnimData,
  animationName: string,
): PmdAnimationDefinition | undefined {
  return parsed.animations.find(
    (animation) => animation.name.toLocaleLowerCase("en-US") === animationName.toLocaleLowerCase("en-US"),
  );
}

export function validatePmdSheetDimensions(
  imageWidth: number,
  imageHeight: number,
  animation: PmdAnimationDefinition,
): { frameCount: number; directionCount: 1 | 8 } {
  if (imageWidth % animation.frameWidth !== 0 || imageHeight % animation.frameHeight !== 0) {
    throw new PmdAnimDataError(
      `A sheet '${animation.name}' (${imageWidth}×${imageHeight}) não é divisível pela célula ${animation.frameWidth}×${animation.frameHeight}.`,
    );
  }
  const frameCount = imageWidth / animation.frameWidth;
  const directionCount = imageHeight / animation.frameHeight;
  if (directionCount !== 1 && directionCount !== 8) {
    throw new PmdAnimDataError(
      `A sheet '${animation.name}' possui ${directionCount} linhas; esperado 1 ou 8 direções.`,
    );
  }
  if (frameCount !== animation.durations.length) {
    throw new PmdAnimDataError(
      `A sheet '${animation.name}' possui ${frameCount} frames, mas o XML declara ${animation.durations.length}.`,
    );
  }
  return { frameCount, directionCount: directionCount as 1 | 8 };
}
