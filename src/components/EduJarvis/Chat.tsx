// src/components/EduJarvis/Chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, Sparkles, User, Minimize2 } from 'lucide-react';
import { EduJarvisService } from '../../services/edujarvis/EduJarvisService';
import { useAuth } from '../../lib/AuthContext';
import { cn } from '../../lib/utils';
import { EduJarvisQuickActions } from './QuickActions';

export function EduJarvisChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { role: 'USER', content: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await EduJarvisService.sendMessage(textToSend, profile);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ASSISTANT', content: 'Ops, tive um problema neural aqui. Pode repetir?', error: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    if (profile?.perfil === 'ALUNO') {
      return "Olá! Eu sou o EduJarvis. Estou aqui para te ajudar a aprender melhor. O que vamos estudar hoje?";
    }
    return "Olá, professor! Eu sou o EduJarvis. Posso ajudar a criar atividades, analisar desempenho e gerar estratégias pedagógicas.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-indigo-700 transition-colors group relative"
          >
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
             <Sparkles className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={cn(
              "bg-white rounded-[2rem] shadow-2xl flex flex-col border border-indigo-100 overflow-hidden",
              isMinimized ? "w-80 h-16" : "w-[450px] h-[650px]"
            )}
          >
            {/* Header */}
            <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                   <Bot className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-black text-sm uppercase tracking-widest">EduJarvis</h3>
                   <div className="flex items-center gap-1.5 text-[10px] text-indigo-200">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      Agente Neural Ativo
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded">
                   <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                   <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/50"
                >
                  {messages.length === 0 && (
                    <div className="text-center py-10 space-y-4">
                       <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bot className="w-8 h-8" />
                       </div>
                       <p className="text-slate-500 text-sm px-10 font-medium">
                          {getWelcomeMessage()}
                       </p>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: msg.role === 'USER' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex gap-3",
                        msg.role === 'USER' ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                        msg.role === 'USER' ? "bg-indigo-100 text-indigo-600" : "bg-indigo-600 text-white"
                      )}>
                        {msg.role === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={cn(
                        "max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed",
                        msg.role === 'USER' 
                          ? "bg-white border border-slate-200 text-slate-700 shadow-sm" 
                          : "bg-indigo-600 text-white shadow-indigo-100 shadow-xl"
                      )}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                       <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                       </div>
                       <div className="bg-indigo-50 p-4 rounded-3xl flex gap-1 items-center">
                          <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                       </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-6 bg-white border-t border-slate-100">
                  <EduJarvisQuickActions role={profile?.perfil} onSelect={(text) => handleSend(text)} />
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Pergunte qualquer coisa..."
                      className="w-full pl-6 pr-14 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-700"
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={isLoading}
                      className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-4 text-center font-medium uppercase tracking-widest">
                    Energizado por EduJarvis Neural Engine
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
