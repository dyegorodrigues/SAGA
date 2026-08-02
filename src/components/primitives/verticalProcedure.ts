export interface VerticalColumnStep {
  expectedDigit: number;
  carry: boolean;
  borrow: boolean;
}

/** Calculates one right-to-left column without coupling the procedure to React. */
export function getVerticalColumnStep(
  top: number,
  bottom: number,
  operation: "+" | "-",
  columnIndex: number,
): VerticalColumnStep {
  const topDigits = String(top);
  const bottomDigits = String(bottom);
  let incoming = 0;
  let raw = 0;

  for (let index = 0; index <= columnIndex; index += 1) {
    const topDigit = Number(topDigits[topDigits.length - 1 - index] ?? 0);
    const bottomDigit = Number(bottomDigits[bottomDigits.length - 1 - index] ?? 0);
    raw = operation === "+"
      ? topDigit + bottomDigit + incoming
      : topDigit - bottomDigit + incoming;
    if (index < columnIndex) incoming = operation === "+" ? (raw >= 10 ? 1 : 0) : (raw < 0 ? -1 : 0);
  }

  return {
    expectedDigit: operation === "+" ? raw % 10 : (raw < 0 ? raw + 10 : raw),
    carry: operation === "+" && raw >= 10,
    borrow: operation === "-" && raw < 0,
  };
}

export function verticalDigitChoices(expectedDigit: number, seed: number): number[] {
  return [...new Set([
    expectedDigit,
    (expectedDigit + 1) % 10,
    (expectedDigit + 9) % 10,
  ])].sort((a, b) => ((a * 7 + seed) % 11) - ((b * 7 + seed) % 11));
}
