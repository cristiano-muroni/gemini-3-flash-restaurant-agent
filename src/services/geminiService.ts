import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const validateCEPTool: FunctionDeclaration = {
  name: "validateCEP",
  description: "Valida um CEP brasileiro e retorna o endereço completo.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      cep: {
        type: Type.STRING,
        description: "O CEP a ser validado (somente números ou formatado).",
      },
    },
    required: ["cep"],
  },
};

async function fetchCEP(cep: string) {
  try {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return { error: "CEP inválido. Deve ter 8 dígitos." };
    
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) return { error: "CEP não encontrado." };
    
    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf
    };
  } catch (error) {
    return { error: "Erro ao consultar o serviço de CEP." };
  }
}

const SYSTEM_INSTRUCTION = `
Você é o Assistente Virtual do LG Restaurante, especialista em venda de marmitex.
Seu objetivo é conduzir o cliente por 4 etapas claras:

1. ATENDIMENTO: Saude o cliente e identifique se ele quer fazer um pedido ou consultar status.
2. PEDIDO: Se o cliente quiser pedir, mostre o cardápio (informado abaixo) e colete os itens. Confirme se o pedido está completo antes de avançar.
3. ENDEREÇO: Colete Telefone, Endereço Completo e CEP. 
   - IMPORTANTE: Sempre que o cliente fornecer um CEP, use a ferramenta 'validateCEP' para confirmar o endereço.
   - Só avance se o endereço for validado com sucesso.
4. CONFIRMAÇÃO: Mostre um resumo final (itens + valor + endereço) e peça a confirmação final.

CARDÁPIO:
- Marmitex Tradicional: R$ 22,00 (Arroz, feijão, carne, batata frita e salada)
- Marmitex Vegetariana: R$ 20,00 (Arroz integral, feijão preto, omelete de legumes, purê e salada)
- Marmitex Premium: R$ 32,00 (Arroz à grega, feijão, picanha acebolada, farofa e vinagrete)
- Bebidas (Coca-Cola, Suco de Laranja, Água): R$ 6,00 cada

REGRAS:
- Seja sempre cordial e acolhedor (Warm Organic Style).
- Mantenha o estado da conversa e não pule etapas.
- Se o cliente confirmar o pedido no final, diga que o pedido foi enviado para a cozinha e encerre de forma amigável.
`;

export async function sendMessage(history: ChatMessage[], message: string) {
  try {
    const contents = [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: "user", parts: [{ text: message }] }
    ];

    let response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: [validateCEPTool] }]
      }
    });

    // Handle tool calls
    if (response.functionCalls) {
      const call = response.functionCalls[0];
      if (call.name === 'validateCEP') {
        const cepResult = await fetchCEP((call.args as any).cep);
        
        // Return tool result to model
        response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            ...contents,
            response.candidates[0].content, // The assistant's call
            {
              role: "model", // Actually 'function' result but mapped to history
              parts: [{
                functionResponse: {
                  name: "validateCEP",
                  response: cepResult
                }
              }]
            }
          ],
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ functionDeclarations: [validateCEPTool] }]
          }
        });
      }
    }

    return response.text || "Desculpe, tive um problema ao processar sua mensagem.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Tivemos um problema técnico. Por favor, tente novamente em instantes.";
  }
}
