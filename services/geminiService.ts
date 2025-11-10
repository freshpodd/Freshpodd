
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { type GeminiChatSession } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// FIX: Replaced Content object with a plain string for systemInstruction and removed deprecated model instantiation as per guidelines.
const systemInstruction = `You are FreshBot, a friendly and knowledgeable customer support agent for FreshPodd, a company that sells innovative solar-powered cold storage units. 

Your primary goal is to assist users with their questions about the FreshPodd product, ordering, shipping, and general inquiries.

Product Information:
- Name: FreshPodd Solar Cooler
- Price: $1299.99
- Key Features: Solar-powered, up to 72 hours of cooling, durable construction, portable design with wheels.
- Capacity: 150 Liters
- Ideal for: Camping, farming, fishing, emergency preparedness, and off-grid living.

Company Policies:
- Shipping: Worldwide. Standard shipping takes 5-7 business days.
- Warranty: 2-year limited warranty.
- Returns: 30-day money-back guarantee.

Your persona:
- Be helpful, polite, and enthusiastic.
- Keep your answers concise and easy to understand.
- If you don't know an answer, politely say that you can't find the information but can connect them to a human agent (hypothetically).
- Do not make up information about policies or product specifications not listed above.`;

// FIX: Updated createChatSession to use ai.chats.create and pass systemInstruction in config as per guidelines.
export function createChatSession(): GeminiChatSession {
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return {
        chat,
        // The chat object now manages history internally.
        // The GeminiChatSession type includes history, so we provide an empty array.
        history: [],
    };
}


export async function sendMessageToGemini(session: GeminiChatSession, message: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    const result = await session.chat.sendMessageStream({ message });
    return result;
}
