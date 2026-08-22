# Gate B′ — checkpoint de ativação e primeira prioridade

Data: 2026-08-21  
Fase: **Gate B′ — reparação das saídas CODIGO do Gate B**  
Base certificada: `c710719cbd50f0f1eef4cc82536a1264da7daf67`

## 1. Motivo

Gate B foi encerrado e certificado: 90/90 competências auditadas, 54 candidatas individuais ativas (49 CODIGO / 1 SIMULACAO / 4 CRIANCA), oito classes estruturais e zero correções funcionais dentro da auditoria.

A instrução humana posterior autorizou continuar autonomamente o workflow depois da autoverificação do fechamento. A proposta de Gate B′ registrada na Issue #47 passa, portanto, a reger operacionalmente a fase de reparo, sem reescrever retrospectivamente o Gate B AUDIT-ONLY.

## 2. Regras

- CODIGO: provar/refutar antes de editar;
- defeito confirmado: regression-first → recibo vermelho → correção mínima → CI + transversal no SHA final;
- classes estruturais: gate por descoberta/medição, nunca allowlist positiva manual;
- SIMULACAO segue para Gate G; CRIANCA segue para Gate J;
- nenhuma candidata CODIGO chega aberta ao Gate J;
- `DECISAO-001/GM.04` permanece bloqueada por decisão humana;
- main, ready, auto-merge, merge e Creature Engine permanecem fora de escopo.

## 3. Primeira prioridade

`GAP-054 — GM.06/F62 — vazamento de resposta no enunciado/suporte`.

Rationale: defeitos que revelam o gabarito contaminam diretamente a validade de assessment/mastery e devem ser tratados antes de melhorias representacionais. O item é verificável por código e não depende de decisão semântica humana.

A abertura técnica de GAP-054 só ocorre depois deste checkpoint documental ser publicado e certificado no HEAD final.
