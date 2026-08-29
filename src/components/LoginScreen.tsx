import React, { useState } from "react";
import { loginAnonymously, loginWithGoogle } from "../lib/firebase";
import { C, FONT, sfx } from "./Mascot";
import { entrarSemConta, recadoDaEntradaLocal } from "../lib/entradaSemConta";
import { Sparkles, Shield, User, Chrome } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
  onContinueAsVisitor: () => void;
}

export function LoginScreen({ onLoginSuccess, onContinueAsVisitor }: LoginScreenProps) {
  const [keepConnected, setKeepConnected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Recado de entrada local. Não é erro: é convite, e por isso não usa `error`. */
  const [aviso, setAviso] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    sfx.level();

    try {
      const { email } = await loginWithGoogle();
      
      if (keepConnected && typeof window !== "undefined") {
        window.localStorage.setItem("mk-keep-connected", "true");
      }

      onLoginSuccess(email);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-blocked") {
        setError("Ops! O navegador bloqueou a janela de login do Google. Ative os pop-ups e tente novamente! 🔑");
      } else if (err.code === "auth/popup-closed-by-user" || err.code === "auth/user-cancelled" || err.message?.includes("auth/user-cancelled")) {
        setError("Login cancelado. Quando estiver pronto, clique para tentar novamente! 😊");
      } else {
        setError("Erro ao conectar com a Conta Google. Verifique sua conexão e tente novamente!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    setError(null);
    sfx.level();

    // A sessão anônima continua sendo tentada primeiro — é ela que deixa o
    // progresso subir para a nuvem. Mas ela deixa de ser CONDIÇÃO para jogar:
    // quem toca aqui é justamente a criança que não tem conta e pode não ter
    // internet boa. Sem o prazo, uma rede ruim deixava o botão girando para
    // sempre, e `onContinueAsVisitor` — o caminho local, pronto — nunca era
    // chamado.
    const entrada = await entrarSemConta(loginAnonymously);
    if (entrada.via === "nuvem") {
      if (keepConnected && typeof window !== "undefined") {
        window.localStorage.setItem("mk-keep-connected", "true");
      }
      onLoginSuccess(entrada.email);
    } else {
      setAviso(recadoDaEntradaLocal(entrada.porque));
      onContinueAsVisitor();
    }
    setLoading(false);
  };

  return (
    <div className="mk-pop text-center max-w-sm mx-auto px-5 py-8 bg-white rounded-[32px] border-4 border-indigo-400 shadow-xl relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-indigo-50 rounded-full opacity-60 pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-emerald-50 rounded-full opacity-60 pointer-events-none" />
      <div className="absolute top-4 left-4 text-2xl opacity-20 pointer-events-none">⭐</div>
      <div className="absolute bottom-4 right-4 text-2xl opacity-20 pointer-events-none">✨</div>

      <div className="mb-6 relative z-10">
        <span className="text-6xl inline-block mb-3 animate-[mkSway_3.5s_ease-in-out_infinite] transform-origin-bottom">
          🥋
        </span>
        <h2 className="text-3.5xl font-black text-slate-850 tracking-tight leading-none" style={{ fontFamily: FONT }}>
          SAGA <span className="text-indigo-600">IA</span>
        </h2>
        <div className="flex items-center justify-center gap-1 mt-2">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
            Jogos Educativos 🎮
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
            Nuvem Ativa ☁️
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-[280px] mx-auto">
          Crie ou recupere o progresso das crianças com segurança na nuvem!
        </p>

        {/* Primary Action: Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full relative overflow-hidden select-none transition-all active:translate-y-1 active:scale-[0.98] py-3 px-4 text-white font-black cursor-pointer text-base rounded-2xl border-none outline-none shadow-md hover:brightness-105 flex items-center justify-center gap-2.5"
          style={{
            fontFamily: FONT,
            background: "#4285F4",
            boxShadow: "0 5px 0 #2A64C5",
          }}
        >
          <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <span>Entrar com Conta Google</span>
        </button>

        {/* Optional checkbox to keep logged in */}
        <label className="flex items-center justify-center gap-2 cursor-pointer select-none py-1">
          <input
            type="checkbox"
            checked={keepConnected}
            onChange={(e) => {
              sfx.tick();
              setKeepConnected(e.target.checked);
            }}
            className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            disabled={loading}
          />
          <span className="text-xs font-bold text-slate-500">
            Lembrar minha conta neste aparelho
          </span>
        </label>

        {error && (
          <div className="bg-rose-50 border-2 border-rose-100 text-rose-700 rounded-2xl px-4 py-2.5 text-xs font-bold leading-relaxed text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Jogar offline não é falha: o aviso é sereno e não usa a cor de erro. */}
        {aviso && (
          <div className="bg-sky-50 border-2 border-sky-100 text-sky-800 rounded-2xl px-4 py-2.5 text-xs font-bold leading-relaxed text-center">
            {aviso}
          </div>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-2 relative z-10">
        <span className="text-xs text-slate-400 font-bold">
          Quer começar rápido sem e-mail?
        </span>
        <button
          onClick={handleAnonymousLogin}
          disabled={loading}
          className="w-full relative overflow-hidden select-none transition-all active:translate-y-1 active:scale-[0.98] py-2.5 px-4 text-slate-700 font-black cursor-pointer text-sm rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2"
          style={{ fontFamily: FONT }}
        >
          <span>Começar sem Conta (Rápido) ⚡</span>
        </button>
      </div>
    </div>
  );
}
