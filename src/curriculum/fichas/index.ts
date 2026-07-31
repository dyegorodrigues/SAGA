import { dojo_add } from './dojo/sensei/dojo_add';
import { dojo_sub } from './dojo/sensei/dojo_sub';
import { dojo_mul } from './dojo/sensei/dojo_mul';
import { dojo_div } from './dojo/sensei/dojo_div';

import { N1_01 } from './jornada/N1.01';
import { N1_02 } from './jornada/N1.02';
import { N1_03 } from './jornada/N1.03';
import { N1_04 } from './jornada/N1.04';
import { N1_07 } from './jornada/N1.07';
import { N1_08 } from './jornada/N1.08';
import { N1_09 } from './jornada/N1.09';
import { N1_10 } from './jornada/N1.10';
import { N2_01 } from './jornada/N2.01';
import { GM_04 } from './jornada/GM.04';
import { AL_05 } from './jornada/AL.05';
import { AL_01 } from './jornada/AL.01';

export const AllFichas = [
  dojo_add, dojo_sub, dojo_mul, dojo_div,
  N1_01, N1_02, N1_03, N1_04, N1_07, N1_08, N1_09, N1_10, N2_01, GM_04, AL_01, AL_05
];

export const JOURNEY_FICHAS = [
  N1_01, N1_02, N1_03, N1_04, N1_07, N1_08, N1_09, N1_10,
  N2_01, GM_04, AL_01, AL_05,
];
