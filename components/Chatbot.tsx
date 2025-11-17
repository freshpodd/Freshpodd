
import React, { useState, useRef, useEffect } from 'react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { type ChatMessage, type GeminiChatSession, type Currency } from '../types';
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleIcon, UserCircleIcon } from './icons';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, currency }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const geminiSessionRef = useRef<GeminiChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !geminiSessionRef.current) {
        geminiSessionRef.current = createChatSession(currency);
        setMessages([{
            id: 'initial',
            role: 'model',
            text: "Hi! I'm FreshBot. How can I help you with FreshPodd today?",
        }]);
    }
  }, [isOpen, currency]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '' || !geminiSessionRef.current) return;
    
    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const stream = await sendMessageToGemini(geminiSessionRef.current, input);
        let modelResponseText = '';
        let modelMessageId = Date.now().toString() + '-model';

        setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

        for await (const chunk of stream) {
            modelResponseText += chunk.text;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, text: modelResponseText } : msg
            ));
        }
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        const errorMessage: ChatMessage = { id: Date.now().toString(), role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 sm:mb-6 sm:mr-6 w-[calc(100%-2rem)] max-w-sm h-[70vh] z-50">
        <div className="flex flex-col h-full bg-freshpodd-blue border-2 border-freshpodd-teal/50 rounded-lg shadow-2xl">
            <header className="flex items-center justify-between p-4 bg-freshpodd-gray/30 border-b border-freshpodd-teal/30">
                <div className="flex items-center space-x-3">
                    <ChatBubbleIcon className="w-7 h-7 text-freshpodd-teal" />
                    <h2 className="text-lg font-bold text-white">FreshBot Support</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-freshpodd-teal flex items-center justify-center font-bold text-white text-sm shrink-0">FP</div>}
                        <div className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.role === 'user' ? 'bg-freshpodd-teal text-white' : 'bg-freshpodd-gray/50 text-freshpodd-light'}`}>
                            <p className="text-sm break-words">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && <UserCircleIcon className="w-8 h-8 text-freshpodd-light shrink-0"/>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-freshpodd-teal flex items-center justify-center font-bold text-white text-sm shrink-0">FP</div>
                        <div className="bg-freshpodd-gray/50 text-freshpodd-light rounded-xl px-4 py-3">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-0"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 bg-freshpodd-gray/30 border-t border-freshpodd-teal/30">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-freshpodd-gray text-white p-3 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-freshpodd-teal"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="bg-freshpodd-teal text-white p-3 rounded-full hover:bg-teal-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </footer>
        </div>
    </div>
  );
};

export default Chatbot;