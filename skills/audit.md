# Workflow: /audit

**Objetivo do Sistema**: Executar uma avaliação profunda de dívida técnica e saúde arquitetural do projeto atual, identificando gargalos sistêmicos de longo prazo.

**Protocolo de Execução**:
Ao invocar `/audit`, o agente age como um Arquiteto de Software realizando due diligence no repositório.

**Vetores de Avaliação (Os 8 Pilares):**
1. **Acoplamento Inadequadro**: Identificação de módulos com dependências circulares ou alto acoplamento (violações do Dependency Inversion).
2. **Cobertura e Testabilidade**: Mapeamento de funções/pipelines críticas sem cobertura automatizada e código difícil de mockar/testar isoladamente.
3. **Padronização e Estilo**: Avaliação da consistência em nomenclaturas, linting, tipagem (TypeScript/MyPy) e docstrings.
4. **Gerenciamento de Estado**: Análise do fluxo de dados (Data Flow) em UIs ou de gerenciamento de cache/sessão em APIs.
5. **Observabilidade (O11y)**: Avaliação da instrumentação de logs, tracing e métricas de erro.
6. **Gerenciamento de Dependências**: Identificação de bibliotecas obsoletas, inchadas ou vulneráveis.
7. **Performance de I/O**: Avaliação do padrão de consultas (ex: N+1 em ORMs) e do uso de banco de dados.
8. **Segurança de Configuração**: Checagem de secrets versionados indevidamente (hardcoded) e privilégios mínimos (Least Privilege).

**Saída Final**:
Fornecer um relatório tabular priorizado (Baixa, Média, Alta Criticidade) listando cada dívida técnica encontrada, seguidas de um **Roadmap de Refatoração de 3 Etapas** (Curto, Médio e Longo Prazo) para sanar o débito gradual e inteligentemente.
