import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Utensils, MapPin, CheckCircle, Phone, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { sendMessage, ChatMessage } from '../services/geminiService';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Automatic welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: "model",
        text: "Olá! Seja bem-vindo ao **LG Restaurante**. 🥘\n\nSou seu assistente virtual. Como posso te ajudar hoje? Deseja ver nosso cardápio de marmitex?"
      }]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botResponse = await sendMessage(messages, input);
    setMessages(prev => [...prev, { role: "model", text: botResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-brand-surface shadow-2xl border-x border-gray-200">
      <header className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-lg">
            <Utensils size={20} />
          </div>
          <div>
            <h1 className="text-xl tracking-tight">LG Restaurant Agent</h1>
            <p className="text-[10px] uppercase tracking-widest text-brand-primary font-bold opacity-70">Atendimento Virtual</p>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-brand-primary text-white rounded-br-none' 
                    : 'bg-white border border-gray-100 rounded-bl-none text-gray-800'
                }`}
              >
                <div className="markdown-body">
                  <Markdown>{m.text}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs font-medium uppercase tracking-tighter">Preparando resposta...</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="w-full pl-6 pr-14 py-4 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md group"
          >
            <Send size={18} className="group-active:translate-x-1 transition-transform" />
          </button>
        </form>
        <p className="text-[10px] text-center mt-4 text-gray-400 font-medium">
          Powered by Gemini • LG Restaurante LTDA
        </p>
      </div>
    </div>
  );
}
