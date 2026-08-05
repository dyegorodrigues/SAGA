// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import {
  PmdAnimDataError,
  getPmdAnimation,
  parsePmdAnimData,
  validatePmdSheetDimensions,
} from "../pmdAnimData";

const VALID_XML = `
<AnimData>
  <ShadowSize>1</ShadowSize>
  <Anims>
    <Anim>
      <Name>Idle</Name>
      <Index>0</Index>
      <FrameWidth>24</FrameWidth>
      <FrameHeight>32</FrameHeight>
      <Durations>
        <Duration>8</Duration>
        <Duration>10</Duration>
      </Durations>
    </Anim>
    <Anim>
      <Name>Wait</Name>
      <Index>1</Index>
      <CopyOf>Idle</CopyOf>
    </Anim>
    <Anim>
      <Name>Attack</Name>
      <Index>2</Index>
      <FrameWidth>32</FrameWidth>
      <FrameHeight>40</FrameHeight>
      <Durations>
        <Duration>4</Duration>
        <Duration>4</Duration>
        <Duration>8</Duration>
      </Durations>
      <RushFrame>0</RushFrame>
      <HitFrame>1</HitFrame>
      <ReturnFrame>2</ReturnFrame>
    </Anim>
  </Anims>
</AnimData>`;

describe("PMD AnimData parser", () => {
  it("parses concrete animations and resolves CopyOf", () => {
    const parsed = parsePmdAnimData(VALID_XML);
    const idle = getPmdAnimation(parsed, "Idle");
    const wait = getPmdAnimation(parsed, "wait");

    expect(parsed.shadowSize).toBe(1);
    expect(idle).toMatchObject({ frameWidth: 24, frameHeight: 32, durations: [8, 10] });
    expect(wait).toMatchObject({
      name: "Wait",
      copyOf: "Idle",
      frameWidth: 24,
      frameHeight: 32,
      durations: [8, 10],
    });
  });

  it("preserves attack event frames", () => {
    const attack = getPmdAnimation(parsePmdAnimData(VALID_XML), "Attack");
    expect(attack).toMatchObject({ rushFrame: 0, hitFrame: 1, returnFrame: 2 });
  });

  it("validates one-direction and eight-direction sheets", () => {
    const idle = getPmdAnimation(parsePmdAnimData(VALID_XML), "Idle")!;

    expect(validatePmdSheetDimensions(48, 32, idle)).toEqual({ frameCount: 2, directionCount: 1 });
    expect(validatePmdSheetDimensions(48, 256, idle)).toEqual({ frameCount: 2, directionCount: 8 });
  });

  it("rejects a sheet with an invented direction count", () => {
    const idle = getPmdAnimation(parsePmdAnimData(VALID_XML), "Idle")!;
    expect(() => validatePmdSheetDimensions(48, 64, idle)).toThrow(/1 ou 8 direções/);
  });

  it("rejects mismatched frame counts instead of repeating columns", () => {
    const idle = getPmdAnimation(parsePmdAnimData(VALID_XML), "Idle")!;
    expect(() => validatePmdSheetDimensions(72, 32, idle)).toThrow(/3 frames.*2/);
  });

  it("rejects missing CopyOf targets and cycles", () => {
    const missing = `<AnimData><Anims><Anim><Name>A</Name><CopyOf>B</CopyOf></Anim></Anims></AnimData>`;
    expect(() => parsePmdAnimData(missing)).toThrow(/não existe/);

    const cycle = `<AnimData><Anims>
      <Anim><Name>A</Name><CopyOf>B</CopyOf></Anim>
      <Anim><Name>B</Name><CopyOf>A</CopyOf></Anim>
    </Anims></AnimData>`;
    expect(() => parsePmdAnimData(cycle)).toThrow(/Ciclo de CopyOf/);
  });

  it("rejects malformed XML and missing durations", () => {
    expect(() => parsePmdAnimData("<AnimData>")) .toThrow(PmdAnimDataError);
    const noDurations = `<AnimData><Anims><Anim>
      <Name>Idle</Name><FrameWidth>24</FrameWidth><FrameHeight>32</FrameHeight>
    </Anim></Anims></AnimData>`;
    expect(() => parsePmdAnimData(noDurations)).toThrow(/não possui durações/);
  });
});
