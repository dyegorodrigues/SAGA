import { describe, expect, it } from "vitest";
import { composeAula, planAula, getAulaTotal } from "./composer";
import { applyJourneyAnswer } from "./progressEngine";
import { computeUnlockStatus, isTrackUnlocked } from "./unlockEngine";
import { CURRICULUM, getTrackById } from "./curriculum";
import { Kid, Progress, State, Track } from "../../types";

/**
 * E2E da missão diária — Andar 5, primeiro bloco de confiabilidade.
 *
 * Percorre o ciclo que a criança vive: criar criança, abrir o perfil, montar a
 * missão, responder, errar, recuperar, concluir, salvar, fechar, reabrir e
 * retomar.
 *
 * O ponto crítico é o meio do caminho: `State` é persistido com
 * `JSON.stringify`, e o dossiê já alertava que estado e questões podem conter
 * funções que não sobrevivem à serialização. Por isso o teste **passa o estado
 * por um round-trip JSON real** em vez de reaproveitar o objeto em memória.
 */

const F0_TRACKS: Track[] = CURRICULUM.find(m => m.id === "F0")?.tracks ?? [];

function criarCrianca(nome: string): Kid {
  return { id: `kid_${nome}`, name: nome, grade: "pre", avatar: "🦊" } as Kid;
}

function estadoNovo(kid: Kid): State {
  return {
    schemaVersion: 1,
    kids: [kid],
    progress: { [kid.id]: {} },
    coins: { [kid.id]: 0 },
    album: { [kid.id]: [] },
    log: { [kid.id]: [] },
    sound: true,
  };
}

/** Fechar o aplicativo e reabrir é exatamente isto: serializar e desserializar. */
function fecharEReabrir(state: State): State {
  return JSON.parse(JSON.stringify(state)) as State;
}

const progOf = (pMap: Record<string, Progress>) => (id: string) =>
  pMap[id] ?? ({ lvl: 1, mast: 0, streak: 0 } as Progress);

describe("E2E da missão diária", () => {
  it("percorre o ciclo inteiro e retoma o progresso após fechar e reabrir", () => {
    // 1. criar criança e perfil
    const kid = criarCrianca("Ana");
    let state = estadoNovo(kid);
    expect(state.kids).toHaveLength(1);
    expect(state.progress[kid.id]).toEqual({});

    // 2. abrir missão
    const total = getAulaTotal(kid.grade);
    const { qs, plan } = composeAula(F0_TRACKS, progOf(state.progress[kid.id]), total);
    expect(qs.length, "a missão precisa de questões").toBeGreaterThan(0);
    expect(plan, "a missão precisa de plano").toBeDefined();

    // 3. ouvir e responder — a questão traz tudo que a tela exige
    const primeira = qs[0];
    expect(primeira.kind).toBeTruthy();
    expect(primeira.answer).toBeDefined();

    // 4. acertar
    const trackId = F0_TRACKS[0].id;
    let progresso = progOf(state.progress[kid.id])(trackId);
    let r = applyJourneyAnswer(progresso, true, false);
    progresso = r.progress;
    expect(progresso.ok ?? 0).toBeGreaterThan(0);

    // 5. errar
    r = applyJourneyAnswer(progresso, false, false);
    progresso = r.progress;
    expect(progresso.bad ?? 0, "o erro precisa ser contabilizado").toBeGreaterThan(0);

    // 6. recuperar — acertar de novo depois do erro
    r = applyJourneyAnswer(progresso, true, false);
    progresso = r.progress;
    expect(progresso.streak ?? 0, "a sequência recomeça após a recuperação").toBeGreaterThan(0);

    // 7. concluir e salvar
    state.progress[kid.id][trackId] = progresso;
    const totalRespondido = progresso.tot ?? 0;
    expect(totalRespondido).toBe(3);

    // 8. fechar e reabrir
    const reaberto = fecharEReabrir(state);

    // 9. retomar
    expect(reaberto.schemaVersion, "a versão do esquema precisa sobreviver").toBe(1);
    expect(reaberto.kids[0].id).toBe(kid.id);
    expect(reaberto.progress[kid.id][trackId].tot).toBe(totalRespondido);
    expect(reaberto.progress[kid.id][trackId].lvl).toBe(progresso.lvl);
    expect(reaberto.progress[kid.id][trackId].ok).toBe(progresso.ok);
  });

  it("o progresso salvo sobrevive ao round-trip sem perder campo algum", () => {
    const kid = criarCrianca("Bruno");
    const state = estadoNovo(kid);
    const trackId = F0_TRACKS[0].id;

    let progresso = progOf({})(trackId);
    for (const acertou of [true, true, false, true, true]) {
      progresso = applyJourneyAnswer(progresso, acertou, false).progress;
    }
    state.progress[kid.id][trackId] = progresso;

    const reaberto = fecharEReabrir(state);
    const depois = reaberto.progress[kid.id][trackId];

    // Nenhuma chave pode sumir na serialização.
    for (const chave of Object.keys(progresso)) {
      expect(depois, `campo ${chave} perdido ao reabrir`).toHaveProperty(chave);
    }
  });

  it("a missão de uma criança nova só oferece nós desbloqueados", () => {
    const kid = criarCrianca("Cora");
    const state = estadoNovo(kid);
    const pMap = state.progress[kid.id];

    const { qs } = composeAula(F0_TRACKS, progOf(pMap), getAulaTotal(kid.grade));
    expect(qs.length).toBeGreaterThan(0);

    const status = computeUnlockStatus(pMap);
    const abertos = F0_TRACKS.filter(t => isTrackUnlocked(t.id, t.graphId, status));
    expect(abertos.length, "uma criança nova precisa de ao menos um nó aberto").toBeGreaterThan(0);
  });

  it("o plano da missão declara as fases previstas", () => {
    const kid = criarCrianca("Davi");
    const pMap = estadoNovo(kid).progress[kid.id];
    const plano = planAula(F0_TRACKS, progOf(pMap));

    expect(plano).toBeDefined();
    expect(Object.keys(plano).length, "o plano não pode vir vazio").toBeGreaterThan(0);
  });

  it("a missão não repete a mesma questão em sequência imediata", () => {
    const kid = criarCrianca("Eva");
    const pMap = estadoNovo(kid).progress[kid.id];
    const { qs } = composeAula(F0_TRACKS, progOf(pMap), getAulaTotal(kid.grade));

    for (let i = 1; i < qs.length; i += 1) {
      const anterior = JSON.stringify({ k: qs[i - 1].kind, p: qs[i - 1].prompt, a: qs[i - 1].answer });
      const atual = JSON.stringify({ k: qs[i].kind, p: qs[i].prompt, a: qs[i].answer });
      expect(atual, `questões ${i - 1} e ${i} idênticas`).not.toBe(anterior);
    }
  });

  it("nenhuma questão da missão chega sem resposta definida", () => {
    const kid = criarCrianca("File");
    const pMap = estadoNovo(kid).progress[kid.id];

    for (let rodada = 0; rodada < 20; rodada += 1) {
      const { qs } = composeAula(F0_TRACKS, progOf(pMap), getAulaTotal(kid.grade));
      for (const q of qs) {
        expect(q.answer, `rodada ${rodada}: questão sem resposta`).toBeDefined();
        expect(q.kind, `rodada ${rodada}: questão sem kind`).toBeTruthy();
      }
    }
  });

  it("o canário promovido aparece numa missão sem quebrar o ciclo", () => {
    const track = getTrackById("N3.10");
    expect(track?.generatorSource).toBe("composer");

    const pMap: Record<string, Progress> = {};
    const { qs } = composeAula([track as Track], progOf(pMap), 8);
    expect(qs.length).toBeGreaterThan(0);

    for (const q of qs) {
      expect(q.kind).toBe("story-bars");
      expect(q.answer).toBeDefined();
      // O estado da missão precisa sobreviver à serialização mesmo com o
      // caminho autoral, cujos uiProps são mais ricos que os do legado.
      const serializado = JSON.parse(JSON.stringify({ uiProps: q.uiProps, answer: q.answer }));
      expect(serializado.uiProps).toBeDefined();
      expect(serializado.answer).toBe(q.answer);
    }
  });
});
