# Workflow: /onboard

**Objetivo do Sistema**: Inicializar o contexto da missão varrendo recursivamente o repositório atual para criar um alinhamento abrangente da arquitetura local. 

**Protocolo de Execução**:
Sempre que um novo projeto ou sessão complexa for iniciada, o usuário poderá acionar `/onboard`.

**Passos do Agente:**
1. **Varredura (Discovery)**: Identificar rapidamente root markers (como `package.json`, `Cargo.toml`, `requirements.txt`, `pom.xml`, ou arquivos `.sln`).
2. **Mapeamento de Dependências**: Entender o stack tecnológico base (Framework principal, ferramentas de lint, ORM/DB drivers, frameworks de teste).
3. **Padrões de Arquitetura**: Detectar os domínios da aplicação (ex: se o projeto usa MVC, Clean Architecture, monorepo de microserviços, App Router do Next.js).
4. **Padrões Existentes**: Analisar como o tratamento de erros e os logs são controlados atualmente para manter a consistência, não introduzindo bibliotecas ou abordagens alienígenas sem necessidade.

**Saída Final**:
Produza um rápido **Context Checklist** para o usuário afirmando o que já foi deduzido da stack, e formule **até 3 perguntas arquiteturais críticas** (se existirem ambiguidades cruciais - como "Qual a estratégia de ambiente dev/prod?") para selar o contrato de trabalho. Após isso, declare-se "Onboarded e Pronto para a Missão".
