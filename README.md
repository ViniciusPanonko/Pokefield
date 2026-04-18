# 🛡️ Pokéfield Dex & Team Builder

🚀 **Aplicativo Online (Live Demo):** [pokefield.vercel.app](https://pokefield.vercel.app)

Bem-vindo ao **Pokéfield**, um projeto universitário e portfólio de nível **Profissional Pleno** desenvolvido para a engenharia de busca, análise estrutural e modelagem de times táticos dentro do ecossistema competitivo Pokémon.

## 🎥 Aplicação em Ação

*(Veja abaixo uma execução real das escolhas, fluxos e design arquitetural no app nativo)*

![Demonstração do Fluxo Pokéfield](public/docs/showcase_hq.webp)

---

## ⚡ Diferenciais da Arquitetura de Software

Esta aplicação foi desenvolvida descartando soluções limitadas padrão (como chamadas REST infinitas e UIs engessadas). Destacam-se as seguintes engenharias:

- **1. Migração Avançada para GraphQL (`PokeAPI v1beta`)**: 
   Comumente, obter ataques, status, instâncias de `flavor text` num projeto PokeAPI requer bater em várias dezenas de `endpoints` simultâneos para quebrar o Payload. Transformamos a requisição para um Gateway de Nuvem da Beta, extraindo **todas as informações massivas de uma única vez**, reduzindo o Overhead de conexão e evitando `Rate Limits`.

- **2. Padrão de Design: *Red Dark Glassmorphism***: 
   Uma UX polida, reativa e minimalista voltada para times competitivos (Darkmode Absoluto com detalhes em vermelho `#ef4444`). Modal e dropdowns sobrepostos que funcionam com desfocagem do fundo (*blur*) evitando a poluição visual recorrente em webapps universitárias.

- **3. Background Pattern Geométrico (Sem uso de Imagens Pesadas)**:
   A marca d'água no cenário utiliza a extração bruta e escalonamento geométrico em tela cheia com Opacidade Matemática implementada no Kernel de visualização (React DOM).

- **4. State Management Offline (*No-DB Approach*)**:
   Uso orgânico de `Context API` ancorada na arquitetura local persistente (`LocalStorage`), simulando uma gestão complexa de banco de dados e edição restrita (como limites de `4 ataques` ou `Evs até 510`) sem custo para a máquina cliente.

## 💻 Tech Stack Adotada

- **Frontend Core**: React.js 18 + Vite (Para HMR ultra-rápido) + TypeScript.
- **Requisições de Nuvem**: Axios HTTP Client enviando injeção em String Graph.
- **Roteamento Dinâmico**: React Router DOM (Mapeando o estado `uid` via queries `/pokemon/:id?uid`).
- **Styling**: Vanilla Custom CSS Properties (Sem dependências em bibliotecas pre-compiladas, foco em performance raiz).

---

## 🚀 Como Rodar o Projeto

1. Clone o projeto para a sua máquina:
```bash
git clone https://github.com/ViniciusPanonko/Pokefield.git
cd Pokefield
```
2. Instale os módulos:
```bash
npm install
```
3. Rode na sua máquina o servidor de desenvolvimento ultra leve do Vite:
```bash
npm run dev
```

---

📝 **Desenvolvido por Vinícius Panonko** - Projeto Acadêmico (2026).
