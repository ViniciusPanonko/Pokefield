# Workflow: /review

**Objetivo do Sistema**: Acionar uma revisão adversarial e sistemática, atuando como um Engenheiro Staff/Principal focado em Segurança, Escalabilidade e Performance.

**Protocolo de Execução**:
Ao invocar `/review`, o agente suspende imediatamente qualquer execução ou escrita de código e avalia o plano de implementação (ou diff atual) através de uma análise rigorosa em duas etapas.

---

### Fase 1: Auditoria Estrita (Análise Adversarial)
Realize uma triagem minuciosa e técnica, assumindo que o código possui falhas inerentes sob alta carga:
- **Segurança (AppSec)**: Audite rigorosamente com base em OWASP Top 10 (Injeções, XSS, SSRF, Autenticação Quebrada, BOLA/IDOR).
- **Complexidade e Escalabilidade**: Escrutine a eficiência assintótica (Big-O). Rejeite iterações excessivas (O(n²)) e gargalos de I/O bloqueantes.
- **Resiliência**: Identifique ausência de tratamento de erros, possíveis vazamentos de memória (memory leaks), deadlocks e condições de corrida (race conditions).

### Fase 2: Resolução Arquitetural (Alinhamento Pragmático)
Equilibre as descobertas da Fase 1, filtrando o que é viável para o ciclo de desenvolvimento atual:
- **Mitigação Direta**: Forneça estratégias de correção objetivas para os riscos de segurança e performance sem introduzir complexidade acidental (Over-engineering).
- **Boas Práticas**: Garanta aderência a SOLID, DRY e composição correta de dependências.
- **Filtro de Ruído**: Descarte críticas teóricas de baixo impacto que apenas atrasariam a entrega.

---

**Saída Final**:
Apresente um **Sumário Executivo** formatado em Markdown contendo:
1. **Riscos Críticos Encontrados:** Tabela listando vulnerabilidades ou ineficiências identificadas.
2. **Correções Obrigatórias (Action Items):** Lista do que precisa ser alterado antes do deploy.
3. **Plano Revisado:** O novo caminho de implementação aprovado e pronto para ser executado.
