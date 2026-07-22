# 🎙️ LUNA — Roteiro de gravação das AULINHAS e falas fixas (lote 2)

*Complementa `luna-roteiro-audios.md` (lote 1, 39 itens). Este lote cobre as falas que
NASCERAM nas rodadas 24-27: aulinhas narradas com imagens, mãozinhas, elogios curtos e
o banco de NUMERAIS que monta as falas dinâmicas. Gere no Luna Studio em lote; salve
cada MP3 com o NOME EXATO da coluna "arquivo" em `public/audio/`. O app usa o áudio se
o arquivo existir; senão cai no TTS do navegador (fallback automático — plugar depois
não quebra nada).*

**Regras de gravação:** voz feminina suave OU a voz da família · pt-BR natural · frase
COMPLETA por arquivo (nunca colar pedaços de palavras — anti-coarticulação) · 44.1kHz,
mono, MP3 ~64kbps · sem música de fundo · ~0,3s de silêncio nas pontas.

## A. Numerais e conectivos (montam QUALQUER contagem — grava 1×, usa pra sempre)
| arquivo | fala |
|---|---|
| `num-1.mp3` … `num-20.mp3` | "Um!" · "Dois!" · … · "Vinte!" (entusiasmo de contagem) |
| `sao-1.mp3` … `sao-10.mp3` | "São um!" … "São dez!" (fechamento de cardinalidade) |
| `conn-mais.mp3` / `conn-menos.mp3` / `conn-igual.mp3` | "mais" / "menos" / "é igual a" |

## B. Aulinhas com mãozinha (intros + fechos — GameLoop)
| arquivo | fala |
|---|---|
| `aula-contar-intro.mp3` | "Vamos contar juntos! Aponte com o dedinho, um por um:" |
| `aula-contar-fim.mp3` | "O último número que a gente fala é o total!" |
| `aula-somar-intro.mp3` | "Somar é JUNTAR os dois grupos! Vamos contar tudo, um por um:" |
| `aula-somar-fim.mp3` | "Contamos tudo junto!" |
| `aula-tirar-intro.mp3` | "Tirar é ver o que SOBRA! Os riscados foram embora. Vamos contar só o que ficou:" |
| `aula-tens-1.mp3` | "Cada barra dessas é uma DEZENA: dez unidades juntinhas!" |
| `aula-tens-2.mp3` | "E esses cubinhos soltos são as unidades." |
| `aula-tens-3.mp3` | "Dezena com unidade: tudo junto forma o número!" |

## C. Aulinhas narradas com IMAGENS (tutorials.ts — texto EXATO do código)
| arquivo | fala |
|---|---|
| `tut-tenframe-1..3.mp3` | (as 3 frases da Moldura de 10 em `tutorials.ts`) |
| `tut-bond-1..3.mp3` | (Amigos dos Números) |
| `tut-weather-1..4.mp3` | (O Tempo: sol → chuva → frio → "agora olhe o céu…") |
| `tut-grow-1..4.mp3` | (Ciclo da Planta: semente → raiz/broto → folhas → árvore) |
| `tut-daypart-1..4.mp3` | (Meu Dia: manhã nascendo → tarde a pino → noite → "é sempre nessa ordem…") |
| `tut-emotion-1..5.mp3` | (Emoções) |
| `tut-lifestage-1..4.mp3` | (Fases da Vida) |
| `tut-animal-1..4.mp3` | (Ciclo Animal) |
> 📋 O texto literal de cada frase está em `src/utils/tutorials.ts` — copiar dali SEM
> mudar uma vírgula (o app casa a fala com o arquivo pelo índice do passo).

## D. Elogios e amparo (curtos — o grosso da experiência)
| arquivo | fala |
|---|---|
| `ok-isso.mp3` / `ok-muitobem.mp3` / `ok-boa.mp3` / `ok-acertou.mp3` / `ok-perfeito.mp3` | "Isso!" / "Muito bem!" / "Boa!" / "Acertou!" / "Perfeito!" |
| `oops-1.mp3` | "Tudo bem, errar faz parte do jogo!" |
| `oops-2.mp3` | "Quase! Olha a resposta certa:" |
| `aula-convite.mp3` | "Tá difícil? Vem ver a aulinha!" |
| `missao-fim.mp3` | "Parabéns! Missão completa!" |

## E. Integração (como o app vai usar — já projetado, plugo quando os MP3 chegarem)
1. Pasta: `public/audio/` (servida estática). 2. Camada de voz: `speak()` ganha um
lookup `audioBank(textoOuId)` — se o MP3 existe, toca `<audio>`; senão, TTS (zero
quebra). 3. Falas dinâmicas ("São cinco!") montam por sequência de arquivos A.
4. Depois de plugado: gravar = melhorar; nunca é pré-requisito.
