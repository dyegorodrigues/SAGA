import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NumberBond, TenFrame } from "/home/user/Matem-gica/src/components/Mascot";
import { writeFileSync } from "fs";
const html = renderToStaticMarkup(
  <div style={{ display: "flex", gap: 24, padding: 24, flexWrap: "wrap", alignItems: "center", background: "#F1F5F9", fontFamily: "system-ui" }}>
    <div style={{ background: "#fff", padding: 16, borderRadius: 16 }}><div>Amigo do 10 (falta 1 parte)</div><NumberBond whole={10} part={6} /></div>
    <div style={{ background: "#fff", padding: 16, borderRadius: 16 }}><div>Amigos: falta o TODO</div><NumberBond whole={9} part={4} missingWhole /></div>
    <div style={{ background: "#fff", padding: 16, borderRadius: 16 }}><div>Moldura: quantos vê?</div><TenFrame filled={7} /></div>
    <div style={{ background: "#fff", padding: 16, borderRadius: 16 }}><div>Moldura: soma duas</div><TenFrame filled={8} filled2={5} /></div>
  </div>
);
writeFileSync("/tmp/claude-0/-home-user-Matem-gica/196f98a9-c43a-5306-b369-ed5074adef5e/scratchpad/scenes.html",
  `<!DOCTYPE html><html><head><meta charset="utf-8"><style>.mk-pop,.mk-pulse{}</style></head><body>${html}</body></html>`);
console.log("ok");
