import { Evidencia } from "../../constants/evidencias";
export function evidenciasFracoesEquivalentes(nivel:number,correta:boolean):string[]{return nivel===4&&correta?[Evidencia.FRACAO_MESMO_NUMERADOR]:[]}
