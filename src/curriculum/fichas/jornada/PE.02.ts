import { FichaCompetencia, FichaDominio } from "../../schema";
import { JornalTurmaMisconception } from "../../procedimentos/jornalTurmaContract";

const dominio:FichaDominio={acertos:3,de:3,sessoes:2};
const tutorial=[
  {fala:"Cada linha da tabela vira uma barra.",show:{destacarLinha:0}},
  {fala:"Leia a altura pela escala do eixo.",show:{destacarEscala:true}},
];
/** F64 — O Jornal da Turma: coletar, tabular, representar e interpretar. */
export const PE_02:FichaCompetencia={
  id:"PE.02",nome:"O Jornal da Turma",strand:"PE",faixa:"F2",prereqs:["PE.01","N2.02"],
  howto:"Olhe o número na tabela e faça a barra chegar até ele na escala.",
  explain:"Confira a escala do eixo. Cada marca vale quanto?",
  distratores:[
    {regra:"lê a barra sem considerar a escala",tag:JornalTurmaMisconception.IGNORA_ESCALA},
    {regra:"associa o valor ao rótulo errado",tag:JornalTurmaMisconception.BARRA_ERRADA},
    {regra:"trata possível e provável como sinônimos",tag:JornalTurmaMisconception.CONFUNDE_POSSIVEL_PROVAVEL},
  ],
  niveis:{
    1:{primitiva:"storypanel",micro:"ler-barra",andaime:"alto"},
    2:{primitiva:"storypanel",micro:"comparar-barras",andaime:"medio"},
    3:{primitiva:"storypanel",micro:"completar-barra",andaime:"minimo"},
    4:{primitiva:"storypanel",micro:"construir-grafico",andaime:"minimo"},
    5:{primitiva:"storypanel",micro:"probabilidade",andaime:"nenhum",rt_alvo:18000},
  },
  micros:[
    {id:"ler-barra",fonte:"F64",alvo:"ler uma barra usando rótulo e escala",kinds:["storypanel"],params:{suporte:"SingaporeBars-vertical",tutorial},dominio},
    {id:"comparar-barras",fonte:"F64",alvo:"comparar alturas preservando rótulo e escala",kinds:["storypanel"],params:{suporte:"SingaporeBars-vertical",tutorial},dominio},
    {id:"completar-barra",fonte:"F64",alvo:"completar a barra faltante a partir da tabela",kinds:["storypanel"],params:{suporte:"SingaporeBars-vertical"},dominio},
    {id:"construir-grafico",fonte:"F64",alvo:"construir o gráfico inteiro a partir dos dados brutos",kinds:["storypanel"],params:{suporte:"SingaporeBars-vertical"},dominio},
    {id:"probabilidade",fonte:"F64",alvo:"distinguir certo, possível, impossível e mais provável",kinds:["storypanel"],params:{suporte:"linguagem-probabilidade"},dominio},
  ],
  erros_tipicos:[
    {id:JornalTurmaMisconception.IGNORA_ESCALA,descricao:"Ignora os números do eixo ao ler a barra."},
    {id:JornalTurmaMisconception.BARRA_ERRADA,descricao:"Não relaciona a barra ao rótulo correto."},
    {id:JornalTurmaMisconception.CONFUNDE_POSSIVEL_PROVAVEL,descricao:"Confunde algo possível com algo mais provável."},
  ],
};
