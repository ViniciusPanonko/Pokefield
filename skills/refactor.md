# Workflow: /refactor

**Objetivo do Sistema**: Auditar a estrutura do código alvo para detectar violações de princípios de Design de Software e gerar um Plano de Implementação Modular para promover um alto nível de desacoplamento.

**Protocolo de Execução**:
Ao invocar `/refactor`, analise o escopo de atuação e aplique estratégias de refatoração maduras antes de alterar qualquer código.

**Critérios de Refatoração:**
- **Single Responsibility Principle (SRP)**: Divida componentes "Deus" (god-classes ou modulos gigantes) em funções/classes atômicas.
- **Inversão e Injeção de Dependências**: Substitua dependências estáticas ou instanciadas internamente por parâmetros injetados, favorecendo o uso de interfaces/contratos.
- **Design de API / Assinaturas**: Simplifique objetos complexos e reduza a quantidade de argumentos passados, usando DTOs ou padrões como Builder se necessário.
- **Substituição de Condicionais (Polimorfismo/Estratégia)**: Elimine cadeias de `if/else` ou arquivos de `switch` densos a favor de polimorfismo, design patterns como Strategy, State ou Chain of Responsibility.

**Saída Final**:
1. Mostre o **Problema de Design Atual** de forma clara.
2. Esboce a **Nova Estrutura** (ex: usando Mermaid para diagramas de classe/componente ou estrutura de arquivos modular).
3. Produza o `Plano de Implementação` passo a passo (Phase 1, Phase 2, etc.) que o usuário deve aprovar antes da execução direta no código, garantindo que o software permaneça compilável/funcional entre os passos.
