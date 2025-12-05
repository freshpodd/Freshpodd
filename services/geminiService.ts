import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { type GeminiChatSession, type Currency, type QuoteRequest } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const CONVERSION_RATES: Record<Currency, number> = {
    USD: 1,
    INR: 83.50,
    EUR: 0.92,
    GBP: 0.79
};

const getSystemInstruction = (currency: Currency) => {
    const rate = CONVERSION_RATES[currency];
    const price = 1299.99 * rate;
    const formattedPrice = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(price);

    return `You are FreshBot, a friendly and knowledgeable customer support agent for FreshPodd, a company that sells innovative solar-powered cold storage units. 

Your primary goal is to assist users with their questions about the FreshPodd product, ordering, shipping, and general inquiries.

Product Information:
- Name: FreshPodd Solar Cooler
- Price: Approximately ${formattedPrice} (price varies by model)
- Key Features: Solar-powered, up to 72 hours of cooling, durable construction, portable design with wheels.
- Capacity: Varies by model (e.g., 150 Liters)
- Ideal for: Camping, farming, fishing, emergency preparedness, and off-grid living.

Company Policies:
- Shipping: Worldwide from our global warehouses. Standard shipping takes 5-10 business days.
- Warranty: 2-year limited warranty.
- Returns: 30-day money-back guarantee.
- Customization: We offer custom solutions! If a user needs a different size, special features, or a bulk order, inform them that they can get a personalized quote by visiting our "Custom Quote" page.

Your persona:
- Be helpful, polite, and enthusiastic.
- Keep your answers concise and easy to understand.
- If you don't know an answer, politely say that you can't find the information but can connect them to a human agent (hypothetically).
- Do not make up information about policies or product specifications not listed above.`;
}


export function createChatSession(currency: Currency): GeminiChatSession {
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(currency),
      },
    });

    return {
        chat,
        history: [],
    };
}


export async function sendMessageToGemini(session: GeminiChatSession, message: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    const result = await session.chat.sendMessageStream({ message });
    return result;
}

const getCurrencySymbol = (currency: Currency) => {
    switch(currency) {
        case 'USD': return '$';
        case 'INR': return '₹';
        case 'EUR': return '€';
        case 'GBP': return '£';
        default: return '$';
    }
}


export async function getQuoteFromGemini(request: Omit<QuoteRequest, 'id' | 'status' | 'date'>, currency: Currency): Promise<string> {
    const currencySymbol = getCurrencySymbol(currency);
    const conversionRate = CONVERSION_RATES[currency];

    const prompt = `
        You are a sales engineer for FreshPodd. Your task is to provide an estimated price quote for a custom solar cooler based on the user's specifications. 
        
        **CRITICAL INSTRUCTIONS:**
        1.  Your final response MUST be ONLY the total estimated price, formatted as a string with currency symbols and commas where appropriate (e.g., "$15,500.00" or "€14,260.00").
        2.  DO NOT include any other text, explanation, breakdown, or introductory phrases. ONLY the final formatted number.
        3.  Use the specified currency: ${currency} (${currencySymbol}).

        **Pricing Rules (all in USD):**
        *   Base Price: A standard 150L unit costs $1300.
        *   Capacity Scaling: The price per unit scales linearly from the base. Use the formula: (Capacity in Liters / 150) * $1300.
        *   Feature Costs (per unit):
            *   'Dual-zone temperature control': +$400
            *   'Integrated GPS tracking': +$250
            *   'Heavy-duty battery upgrade': +$300
            *   'Custom branding/logo': +$150
            *   'Stainless steel interior': +$200
        *   Bulk Discount (applied to the total price):
            *   10-20 units: 5% discount
            *   21-50 units: 10% discount
            *   51+ units: 15% discount

        **User's Request:**
        *   Capacity: ${request.capacity} Liters
        *   Quantity: ${request.quantity} units
        *   Selected Features: ${request.features.join(', ') || 'None'}
        *   Other Custom Features: ${request.otherFeatures || 'None'}

        Calculate the total estimated price based on these rules. If the currency is not USD, convert the final USD total using a rate of 1 USD = ${conversionRate} ${currency}.
        
        Remember, your only output should be the final formatted price string.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
}