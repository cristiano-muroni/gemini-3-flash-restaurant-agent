# Gemini Restaurant Agent - Interface Conversacional 🥘

Este projeto é uma interface de atendimento virtual inteligente para o **Gemini Restaurante**, especializado na venda de marmitex. Ele utiliza a **IA Gemini (Google)** para conduzir o fluxo de pedidos de forma orgânica e acolhedora.
O Gemini Restaurant Agent é uma versão semelhante do "lg-restaurant-agent". A principal diferença está que o Gemini Restaurant Agent não utiliza o LangGraph, portanto ustiliza uma arquitetura simples e eficiente. Enquanto o LG Restaurant Agent utiliza uma arquitetura mais complexa de gerenciamento de fluxo com Nodes e Edges que são ideais para um projeto mais robusto.

<div align="center">
  <video src="https://github.com/user-attachments/assets/a9658c38-7b67-480e-93b1-325a5c316196" width="80%" autoplay loop muted playsinline></video>
</div>

Vamos testar e provar que é possível criar a experiência de um fluxo conversacional com estados, contanto somente com a evolução atual das IAs e do desenvolvimento de agentes. Vamos analisar os motivos técnicos e de design:

1. **Instruções de Sistema (System Instructions) vs. Grafos Rígidos**
No seu projeto original, o LangGraph é usado para criar um "mapa" explícito (Nós e Arestas). Isso é ótimo para fluxos extremamente complexos e não lineares, mas para um atendimento de restaurante que é majoritariamente linear (Saudação → Pedido → Endereço → Fim), ele pode adicionar uma camada de complexidade desnecessária.
O que eu fiz: Usei o recurso nativo de System Instruction do Gemini. Modelos modernos como o Gemini 1.5 e 2.0 são excepcionalmente bons em seguir "scripts" textuais. Ao definir as 4 etapas claramente no prompt, a própria IA atua como o "orquestrador do grafo" internamente. Ela entende contextualmente em qual fase está sem que precisemos "forçar" a transição de um código para outro.

2. **Function Calling como Gatilho de Estado**
Em vez de criar um nó no LangGraph chamado validate_cep, eu usei o Function Calling.
A IA decide sozinha: "O usuário me deu um CEP, eu preciso chamar a ferramenta de validação agora".
Isso torna o fluxo mais fluido, porque se o usuário mudar de ideia no meio do endereço e perguntar algo sobre uma marmita, a IA consegue lidar com isso sem "quebrar" a lógica do nó do grafo.

3. **Histórico como Estado (User State)**
No React, o estado da conversa é mantido no array de messages. Toda vez que enviamos uma mensagem, mandamos o histórico completo. Como o Gemini tem uma janela de contexto enorme e alta precisão, ele lê o histórico e "se situa": "Ah, eu já mostrei o cardápio e ele já escolheu a Marmitex Premium, agora falta o telefone".

## 🚀 Funcionalidades


- **Atendimento Automatizado**: Saudação e identificação de intenção (pedido ou status).
- **Fluxo de Pedido Guiado**: Apresentação do cardápio e coleta de itens.
- **Validação de Endereço**: Integração via Function Calling com a API do ViaCEP para garantir entrega correta.
- **Resumo e Confirmação**: Fechamento do pedido com resumo detalhado.
- **Interface Polida**: Design "Warm Organic" com tipografia clássica (Cormorant Garamond) e animações suaves via `motion`.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript
- **Bundler**: Vite
- **Estilização**: Tailwind CSS 4.0
- **Animações**: Motion (antigo Framer Motion)
- **IA**: Google Gemini SDK (@google/genai)
- **Iconografia**: Lucide React
- **Docker**: Dockerfile + Docker Compose

## 📋 Pré-requisitos

- Node.js 20+ (se rodar localmente)
- Uma chave de API do Google Gemini ([Obtenha aqui](https://aistudio.google.com/app/apikey))
- Docker instalado (opcional)

## ⚙️ Configuração

1. Clone o repositório:
```bash
git clone https://github.com/cristiano-muroni/gemini-3-flash-restaurant-agent.git
cd gemini-3-flash-restaurant-agent
```

2. Crie um arquivo `.env` na raiz:
```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

## 🏃 Como Rodar

### Via NPM
```bash
npm install
npm run dev
```
Acesse: `http://localhost:3000`

### Via Docker
```bash
docker-compose up --build
```
Acesse: `http://localhost:3000`

## 📂 Estrutura do Projeto

- `src/components/ChatInterface.tsx`: Componente principal do Chat.
- `src/services/geminiService.ts`: Lógica de integração com a IA e Function Calling para CEP.
- `src/index.css`: Definições de tema e design system.
- `Dockerfile` & `docker-compose.yml`: Configurações de containerização.

---
Desenvolvido com ❤️ por [Cristiano Muroni](https://github.com/cristiano-muroni)
