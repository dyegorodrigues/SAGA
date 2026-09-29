import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { lerChaveDaURL } from "./curriculum/motores/modoDeTeste";

// O `?destravado=123` é lido UMA vez, na subida, antes de qualquer tela.
lerChaveDaURL();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
