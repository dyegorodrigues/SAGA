export function shellRootClass(screenName?: string): string {
  const viewport = screenName === "game" ? "h-[100dvh] pb-0" : "min-h-screen pb-16";
  return `relative w-full overflow-hidden transition-colors duration-500 ${viewport}`;
}
