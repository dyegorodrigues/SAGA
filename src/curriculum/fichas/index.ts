import { dojo_add } from './dojo/sensei/dojo_add';
import { dojo_sub } from './dojo/sensei/dojo_sub';
import { dojo_mul } from './dojo/sensei/dojo_mul';
import { dojo_div } from './dojo/sensei/dojo_div';

import { N1_01 } from './jornada/N1.01';
import { N1_02 } from './jornada/N1.02';
import { N1_03 } from './jornada/N1.03';
import { N1_04 } from './jornada/N1.04';
import { N1_06 } from './jornada/N1.06';
import { N1_07 } from './jornada/N1.07';
import { N1_08 } from './jornada/N1.08';
import { N1_09 } from './jornada/N1.09';
import { N1_10 } from './jornada/N1.10';
import { N2_01 } from './jornada/N2.01';
import { GM_04 } from './jornada/GM.04';
import { AL_05 } from './jornada/AL.05';
import { AL_01 } from './jornada/AL.01';
import { AL_02 } from './jornada/AL.02';
import { JARDIM_FICHAS } from './dojo/jardim';
import { N3_09 } from './jornada/N3.09';
import { N3_10 } from './jornada/N3.10';
import { N3_11 } from './jornada/N3.11';
import { N4_02 } from './jornada/N4.02';

export const AllFichas = [
  dojo_add, dojo_sub, dojo_mul, dojo_div,
  N1_01, N1_02, N1_03, N1_04, N1_06, N1_07, N1_08, N1_09, N1_10, N2_01, N3_09, N3_10, N3_11, N4_02, GM_04, AL_01, AL_02, AL_05,
  // O Jardim do Dojo: trilhas de automaticidade, não nós do grafo. Entram aqui
  // (a Oficina e o Sandbox precisam encontrá-las) e NÃO em `JOURNEY_FICHAS`,
  // que é a lista de competências da Jornada. Ver `dojo/jardim/index.ts`.
  ...JARDIM_FICHAS,
];

export { JARDIM, JARDIM_FICHAS } from './dojo/jardim';

export const JOURNEY_FICHAS = [
  N1_01, N1_02, N1_03, N1_04, N1_06, N1_07, N1_08, N1_09, N1_10,
  N2_01, N3_09, N3_10, N3_11, N4_02, GM_04, AL_01, AL_02, AL_05,
];
