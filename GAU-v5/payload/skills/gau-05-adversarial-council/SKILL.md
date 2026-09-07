---
name: gau-05-adversarial-council
description: Buscar falhas concretas numa solução de alto risco. Integra a ideia 5 do GAU v5.
---

# Adversarial Council

## 1. Entrada e Ativação

- **Gatilho**: Buscar falhas concretas numa solução de alto risco.
- **Parâmetros Obrigatórios**:
  - `mission_id`: ID da missão ativa.
  - `requirements`: Requisitos do baseline relevantes para esta execução.
  - `scope`: Arquivos permitidos, limites de atuação e diretórios excluídos.
  - `evidence`: IDs de evidências PASS já validadas que fundamentam esta execução.
  - `budget`: Orçamento atribuído pelo Compute Governor (`max_brains`, `max_seconds`, etc.).

Consulte `.gau/docs/OPERACAO.md` para sintaxe dos comandos e `.gau/docs/CONTRATOS.md` para o contrato `adversarial`.

## 2. Procedimento Operacional Específico

- usar pelo menos 6 cérebros adversariais especializados;
- procurar falhas em bugs lógicos, segurança, edge cases, regressões, performance e requisitos ignorados;
- adicionar um Counterexample Generator para criar casos concretos capazes de quebrar a solução;
- sintetizar os achados em uma etapa de Red Team Synthesis;
- exigir correção antes da aprovação quando forem encontrados problemas relevantes;
- atuar principalmente em código crítico, autenticação, pagamentos, migrations, concorrência, tarefas long-horizon e `/goal` em níveis altos;
- ser acionado pelo Adaptive Model Router 3.0 quando risco ou incerteza forem elevados.

## 3. Execução Integrada com Runtime Local

1. **Validação do Estado**:
   - Inspecione a missão com `python .gau/runtime/gau.py --project . status <mission_id>`.
2. **Apoio Executável**:
   - Utilize o comando de apoio: `python .gau/runtime/gau.py --project . record --kind finding`.
   - Utilize os modelos JSON de `.gau/examples/` correspondentes.
3. **Geração do Artefato Verificável**:
   - Produza o artefato em `.gau/missions/<mission_id>/adversarial.json`.
   - Registre: `mission`, `idea_id` (5), `status` (VERIFIED/FAILED/BLOCKED/SERIAL_LIMITED), `source`, `scope`, `evidence`, `findings`, `unknowns` e `next_actions`.
4. **Delegação Rigorosa**:
   - Se houver múltiplos agentes, siga `.gau/docs/DELEGACAO.md`: faça a reserva com `gau.py reserve`, execute em worktrees isoladas quando houver concorrência de código e recolha pareceres de forma independente.
5. **Registro de Provas e Bloqueios**:
   - Registre evidências com `verify` ou `attest`. Falha crítica válida impede encerramento até resolução formal com `resolve`.

## 4. Adaptação ao Host e Recursos

- Respeite o limite do Compute Governor (padrão 8 cérebros, profundidade 2, até 3 rodadas).
- Se a capacidade nativa de subagentes independentes não estiver disponível, registre `SERIAL_LIMITED`. Não declare falso paralelismo.

## 5. Critérios de Conclusão e Parada

- Entregue o artefato `adversarial.json`, os IDs de evidências registrados e o relatório ao coordenador.
- Condições de parada:
  - **Sucesso**: Critérios comprovados com evidência `PASS` e freshness auditado.
  - **Bloqueio**: Falha crítica identificada sem contorno viável (`BLOCKED_EXTERNALLY`).
  - **Esgotamento**: Teto de orçamento ou rodadas atingido.
