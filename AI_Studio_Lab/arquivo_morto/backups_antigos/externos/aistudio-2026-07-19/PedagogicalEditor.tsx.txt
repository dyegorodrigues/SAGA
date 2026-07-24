import React, { useState } from "react";
import { State } from "../types";
import { C, FONT, BODY, sfx } from "./Mascot";

interface QuestionData {
  prompt: string;
  kind: "plain" | "count" | "sum";
  emoji?: string;
  n?: number;
  a?: number;
  b?: number;
  expr?: string;
  answer: number;
  options: { label: string; value: number }[];
}

interface CustomTrack {
  id: string;
  name: string;
  icon: string;
  grade: "pre" | "ano1";
  description: string;
  questions: QuestionData[];
}

interface PedagogicalEditorProps {
  state: State;
  onUpdateState: (newState: State) => void;
}

export function PedagogicalEditor({ state, onUpdateState }: PedagogicalEditorProps) {
  const [tracks, setTracks] = useState<CustomTrack[]>(() => state.customTracks || []);
  const [activeForm, setActiveForm] = useState<boolean>(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍎");
  const [grade, setGrade] = useState<"pre" | "ano1">("pre");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  // Current editing question index
  const [qEditIndex, setQEditIndex] = useState<number | null>(null);
  const [qPrompt, setQPrompt] = useState("");
  const [qKind, setQKind] = useState<"plain" | "count" | "sum">("count");
  const [qEmoji, setQEmoji] = useState("🍓");
  const [qN, setQN] = useState(5);
  const [qA, setQA] = useState(3);
  const [qB, setQB] = useState(2);
  const [qExpr, setQExpr] = useState("");
  const [qAns, setQAns] = useState(5);
  const [qOptsRaw, setQOptsRaw] = useState("3, 4, 5, 6");

  const openNewForm = () => {
    sfx.tick();
    setSelectedTrackId(null);
    setName("");
    setIcon("⭐");
    setGrade("pre");
    setDescription("");
    setQuestions([]);
    setQEditIndex(null);
    setActiveForm(true);
  };

  const openEditForm = (t: CustomTrack) => {
    sfx.tick();
    setSelectedTrackId(t.id);
    setName(t.name);
    setIcon(t.icon);
    setGrade(t.grade);
    setDescription(t.description);
    setQuestions([...t.questions]);
    setQEditIndex(null);
    setActiveForm(true);
  };

  const handleAddOrUpdateQuestion = () => {
    sfx.tick();
    let finalAns = qAns;
    let finalExpr = "";
    
    if (qKind === "count") {
      finalAns = qN;
    } else if (qKind === "sum") {
      finalAns = qA + qB;
      finalExpr = `${qA} + ${qB}`;
    }

    // Auto generate balanced options based on raw comma split or mathematical neighbors
    const parsedOpts = qOptsRaw
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((n) => !isNaN(n));

    // Make sure answer is included
    if (!parsedOpts.includes(finalAns)) {
      parsedOpts.push(finalAns);
    }
    
    // De-duplicate and sort
    const uniqueSorted: number[] = [...new Set<number>(parsedOpts)].sort((x: number, y: number) => x - y);
    const options: { label: string; value: number }[] = uniqueSorted.map((n: number) => ({ label: String(n), value: n }));

    const newQ: QuestionData = {
      prompt: qPrompt || (qKind === "count" ? "Quantos objetos fofos você vê?" : qKind === "sum" ? "Junte as figuras e faça a soma!" : "Pense com calma e responda!"),
      kind: qKind,
      emoji: qEmoji,
      n: qKind === "count" ? qN : undefined,
      a: qKind === "sum" ? qA : undefined,
      b: qKind === "sum" ? qB : undefined,
      expr: qKind === "sum" ? finalExpr : qKind === "plain" ? qExpr : undefined,
      answer: finalAns,
      options,
    };

    if (qEditIndex !== null) {
      const copy = [...questions];
      copy[qEditIndex] = newQ;
      setQuestions(copy);
      setQEditIndex(null);
    } else {
      setQuestions([...questions, newQ]);
    }

    // Reset question form
    setQPrompt("");
    setQExpr("");
  };

  const handleRemoveQuestion = (idx: number) => {
    sfx.tick();
    setQuestions(questions.filter((_, i) => i !== idx));
    if (qEditIndex === idx) setQEditIndex(null);
  };

  const handleEditQuestion = (idx: number) => {
    sfx.tick();
    const cur = questions[idx];
    setQEditIndex(idx);
    setQPrompt(cur.prompt);
    setQKind(cur.kind);
    if (cur.emoji) setQEmoji(cur.emoji);
    if (cur.n) setQN(cur.n);
    if (cur.a) setQA(cur.a);
    if (cur.b) setQB(cur.b);
    if (cur.expr) setQExpr(cur.expr);
    setQAns(cur.answer);
    setQOptsRaw(cur.options.map((o) => o.value).join(", "));
  };

  const handleSaveTrack = () => {
    if (!name.trim()) return;
    sfx.level();

    const trackId = selectedTrackId || "cust_" + Math.random().toString(36).substring(2, 9);
    const newTrack: CustomTrack = {
      id: trackId,
      name: name.trim(),
      icon,
      grade,
      description: description.trim() || "Tópico pedagógico criado pelos responsáveis.",
      questions: questions.length > 0 ? questions : [
        {
          prompt: "Quantas maçãs deliciosas você vê?",
          kind: "count",
          emoji: "🍎",
          n: 4,
          answer: 4,
          options: [{ label: "3", value: 3 }, { label: "4", value: 4 }, { label: "5", value: 5 }]
        }
      ]
    };

    let updatedTracks: CustomTrack[] = [];
    if (selectedTrackId) {
      updatedTracks = tracks.map((t) => (t.id === selectedTrackId ? newTrack : t));
    } else {
      updatedTracks = [...tracks, newTrack];
    }

    setTracks(updatedTracks);
    setActiveForm(false);

    // Save and synchronize State
    onUpdateState({
      ...state,
      customTracks: updatedTracks
    });
  };

  const handleDeleteTrack = (id: string) => {
    if (window.confirm("Deseja realmente apagar este material didático?")) {
      sfx.tick();
      const updated = tracks.filter((t) => t.id !== id);
      setTracks(updated);
      onUpdateState({
        ...state,
        customTracks: updated
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
        <div>
          <h4 className="font-extrabold text-purple-950 text-base" style={{ fontFamily: FONT }}>
            🎒 Criador de Atividades & Tópicos
          </h4>
          <p className="text-xs text-purple-900/80 leading-relaxed mt-1" style={{ fontFamily: BODY }}>
            Desenvolva lições modulares exclusivas! Insira emojis e perguntas personalizadas de acordo com o nível da criança. O sistema converte tudo automaticamente em portais gamificados!
          </p>
        </div>
        {!activeForm && (
          <button
            onClick={openNewForm}
            className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-4 py-2.5 rounded-xl active:scale-95 shadow transition-all cursor-pointer"
            style={{ fontFamily: FONT }}
          >
            ➕ Novo Tópico
          </button>
        )}
      </div>

      {!activeForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* List of Custom Topics */}
          {tracks.length === 0 ? (
            <div className="md:col-span-2 text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <span className="text-4xl">📚</span>
              <h5 className="font-bold text-slate-700 mt-2">Nenhum Tópico Customizado</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Crie materiais personalizados (como tabuada especial, figuras divertidas, etc.) clicando no botão "Novo Tópico" acima!
              </p>
            </div>
          ) : (
            tracks.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-white border-2 border-slate-200 rounded-2xl text-left flex justify-between items-start gap-3 shadow-sm hover:border-purple-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {t.grade === "pre" ? "Pré-Escola" : "1º Ano"}
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-800 text-md" style={{ fontFamily: FONT }}>
                    {t.name}
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {t.description}
                  </p>
                  <div className="mt-2.5 inline-block bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {t.questions.length} atividades didáticas
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => openEditForm(t)}
                    className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeleteTrack(t.id)}
                    className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 active:scale-95 transition-all cursor-pointer"
                  >
                    🗑️ Apagar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Creator Form */
        <div className="p-5 bg-white border-2 border-slate-200 rounded-2xl text-left space-y-4">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h4 className="font-black text-slate-800 text-base" style={{ fontFamily: FONT }}>
              {selectedTrackId ? "✏️ Editar Material Didático" : "➕ Criar Material Didático"}
            </h4>
            <button
              onClick={() => {
                sfx.tick();
                setActiveForm(false);
              }}
              className="text-slate-500 font-bold hover:text-slate-800 text-sm"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Meta Inputs */}
            <div className="space-y-3 md:col-span-1 border-r border-slate-100 pr-0 md:pr-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Nome do Tópico</label>
                <input
                  type="text"
                  placeholder="Ex: Geometria Espacial, Desafio de Lanches"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl font-semibold outline-none text-sm text-slate-800 focus:border-purple-400 transition-colors"
                  style={{ fontFamily: FONT }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">Ícone/Emoji</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-lg outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Nível Escolar</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as any)}
                    className="w-full mt-1 px-2 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-800"
                  >
                    <option value="pre">Pré-Escola</option>
                    <option value="ano1">1º Ano</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Descrição Curta</label>
                <textarea
                  rows={2}
                  placeholder="Para que serve este tópico matemático?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-xs text-slate-700"
                />
              </div>

              <button
                onClick={handleSaveTrack}
                disabled={!name.trim()}
                className="w-full mt-2 text-white bg-purple-600 hover:bg-purple-700 font-bold py-3 rounded-xl shadow-md disabled:bg-slate-200 disabled:text-slate-400 active:scale-[0.98] transition-all cursor-pointer text-sm text-center"
                style={{ fontFamily: FONT }}
              >
                Salvar Material Didático 💾
              </button>
            </div>

            {/* Questions Builder Grid */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="text-xs font-black text-slate-800" style={{ fontFamily: FONT }}>
                    {qEditIndex !== null ? "✏️ Editando Exercício" : "💡 Adicionar Novo Exercício"}
                  </span>
                  {qEditIndex !== null && (
                    <button
                      onClick={() => {
                        sfx.tick();
                        setQEditIndex(null);
                        setQPrompt("");
                        setQExpr("");
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Criar Novo
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Tipo de Atividade</label>
                    <select
                      value={qKind}
                      onChange={(e) => setQKind(e.target.value as any)}
                      className="w-full mt-0.5 px-1 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none text-slate-800"
                    >
                      <option value="count">Contar Emojis 🎈</option>
                      <option value="sum">Somar Emojis ➕</option>
                      <option value="plain">Texto / Livre 🧠</option>
                    </select>
                  </div>

                  {qKind !== "plain" && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">Emoji Visual</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={qEmoji}
                        onChange={(e) => setQEmoji(e.target.value)}
                        className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center text-sm outline-none text-slate-800"
                      />
                    </div>
                  )}

                  {qKind === "count" && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">Quantidade (1-10)</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={qN}
                        onChange={(e) => {
                          const v = Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1));
                          setQN(v);
                          // Auto configure raw options based on correct answer
                          setQOptsRaw(`${Math.max(1, v - 2)}, ${v - 1}, ${v}, ${v + 1}`);
                        }}
                        className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-800"
                      />
                    </div>
                  )}

                  {qKind === "sum" && (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600">Valor Esquerdo (A)</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={qA}
                          onChange={(e) => {
                            const val = Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1));
                            setQA(val);
                            setQOptsRaw(`${val + qB - 2}, ${val + qB - 1}, ${val + qB}, ${val + qB + 1}`);
                          }}
                          className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600">Valor Direito (B)</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={qB}
                          onChange={(e) => {
                            const val = Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1));
                            setQB(val);
                            setQOptsRaw(`${qA + val - 2}, ${qA + val - 1}, ${qA + val}, ${qA + val + 1}`);
                          }}
                          className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-800"
                        />
                      </div>
                    </>
                  )}

                  {qKind === "plain" && (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600">Pergunta Grande (Texto)</label>
                        <input
                          type="text"
                          placeholder="Ex: 5 + 5"
                          value={qExpr}
                          onChange={(e) => setQExpr(e.target.value)}
                          className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600">Resposta Correta</label>
                        <input
                          type="number"
                          value={qAns}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10) || 0;
                            setQAns(v);
                            setQOptsRaw(`${v - 2}, ${v - 1}, ${v}, ${v + 1}`);
                          }}
                          className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-800"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Enunciado Falado</label>
                    <input
                      type="text"
                      placeholder="Ex: Conte cada morango com calma."
                      value={qPrompt}
                      onChange={(e) => setQPrompt(e.target.value)}
                      className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Opções Disponíveis (separadas por vírgula)</label>
                    <input
                      type="text"
                      placeholder="Ex: 3, 4, 5, 6"
                      value={qOptsRaw}
                      onChange={(e) => setQOptsRaw(e.target.value)}
                      className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleAddOrUpdateQuestion}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-4 py-2 rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    {qEditIndex !== null ? "Atualizar Exercício" : "Adicionar à Lista ➕"}
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">
                  Exercícios deste Tópico ({questions.length})
                </span>
                
                {questions.length === 0 ? (
                  <div className="text-center p-6 border-2 border-dashed rounded-xl border-slate-100 text-slate-400 text-xs">
                    Nenhum exercício adicionado ainda. Preencha os campos acima para adicionar!
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                    {questions.map((q, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs gap-2 hover:border-slate-300"
                      >
                        <div className="text-left">
                          <span className="font-bold text-slate-800">
                            #{i + 1}: {q.kind === "count" ? `Contar ${q.emoji} (${q.answer})` : q.kind === "sum" ? `Soma de ${q.emoji} (${q.expr} = ${q.answer})` : `Texto (${q.expr || q.prompt})`}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                            Falar: "{q.prompt}" | Opções: {q.options.map((o) => o.label).join(", ")}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditQuestion(i)}
                            className="bg-white border text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50 font-bold"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleRemoveQuestion(i)}
                            className="bg-white border text-red-600 px-2 py-1 rounded hover:bg-red-50 font-bold"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
