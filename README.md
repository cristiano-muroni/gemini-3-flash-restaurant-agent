# Gemini Restaurant Agent - Interface Conversacional 🥘

Este projeto é uma interface de atendimento virtual inteligente para o **Gemini Restaurante**, especializado na venda de marmitex. Ele utiliza a **IA Gemini (Google)** para conduzir o fluxo de pedidos de forma orgânica e acolhedora.

<div align="center">
  <video src="https://github.com/user-attachments/assets/a9658c38-7b67-480e-93b1-325a5c316196" width="80%" autoplay loop muted playsinline></video>
</div>

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
