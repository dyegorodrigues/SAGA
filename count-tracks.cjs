const { TRACKS_PRE, TRACKS_ANO1, TRACKS_ANO2 } = require('./src/utils/curriculum');
const { TRACKS_MAT_ELITE_PRE, TRACKS_MAT_ELITE_ANO1 } = require('./src/subjects/matElite');
const { TRACKS_LOGICA_ANO1 } = require('./src/subjects/logica');
const { TRACKS_PORT_PRE, TRACKS_PORT_ANO1 } = require('./src/subjects/port');
const { TRACKS_ENG_PRE, TRACKS_ENG_ANO1 } = require('./src/subjects/eng');
const { TRACKS_SCI_PRE, TRACKS_SCI_ANO1 } = require('./src/subjects/sci');

console.log('Legacy (Elite, Logica, Port, Eng, Sci):',
  TRACKS_MAT_ELITE_PRE.length +
  TRACKS_MAT_ELITE_ANO1.length +
  TRACKS_LOGICA_ANO1.length +
  TRACKS_PORT_PRE.length +
  TRACKS_PORT_ANO1.length +
  TRACKS_ENG_PRE.length +
  TRACKS_ENG_ANO1.length +
  TRACKS_SCI_PRE.length +
  TRACKS_SCI_ANO1.length
);

console.log('SAGA (PRE, ANO1, ANO2):',
  TRACKS_PRE.length +
  TRACKS_ANO1.length +
  TRACKS_ANO2.length
);
