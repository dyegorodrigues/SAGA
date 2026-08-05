import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { CreatureLab } from "./features/creature-engine/CreatureLab";

const root = document.getElementById("creature-lab-root");
if (!root) throw new Error("Elemento #creature-lab-root não encontrado.");

createRoot(root).render(
  <React.StrictMode>
    <CreatureLab />
  </React.StrictMode>,
);
