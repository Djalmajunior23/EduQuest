import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  Info, 
  History, 
  AlertCircle,
  Loader2,
  BrainCircuit,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import { studentAiService } from '../../../services/studentAiService';
import { cn } from '../../../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function StudentAITutor() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Olá, Operador ${profile?.nome}! Eu sou o Cyber-Sensei. Estou aqui para te ajudar a decodificar os segredos da tecnologia. O que vamos aprender hoje?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await studentAiService.askTutor(
        profile.uid, 
        profile.saldoTokensIA || 0, 
        input
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Erro no sistema: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-100">
              <Bot className="w-7 h-7" />
           </div>
           <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Cyber-Sensei</h1>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sistema Online
              </p>
           </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
           <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tokens IA</p>
              <p className="text-lg font-black text-slate-900 leading-none">{profile?.saldoTokensIA || 0}</p>
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative">
         <div 
           ref={scrollRef}
           className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
         >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-5 rounded-[1.5rem] text-sm font-medium leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100" 
                    : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-4 mr-auto animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="p-5 rounded-[1.5rem] bg-slate-50 text-slate-400 rounded-tl-none border border-slate-100 italic text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  Processando dados...
                </div>
              </div>
            )}
         </div>

         <footer className="p-6 bg-slate-50/50 border-t border-slate-100">
            <div className="flex gap-4 items-center bg-white p-2 rounded-3xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
               <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Digite sua dúvida técnica..."
                 className="flex-1 bg-transparent border-none outline-none px-4 py-3 font-medium text-slate-900"
               />
               <button 
                 onClick={handleSend}
                 disabled={!input.trim() || isTyping}
                 className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    input.trim() 
                      ? "bg-slate-900 text-white hover:scale-110 active:scale-95" 
                      : "bg-slate-100 text-slate-300"
                 )}
               >
                 <Send className="w-5 h-5" />
               </button>
            </div>
            <div className="mt-4 flex justify-between items-center px-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3" /> Custo: 5 Tokens por consulta
               </p>
               <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-2">
                  <History className="w-3 h-3" /> Ver Histórico
               </button>
            </div>
         </footer>
      </main>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-600 p-6 rounded-[2rem] text-white flex gap-4 items-center shadow-lg shadow-indigo-100 group cursor-pointer hover:bg-indigo-700 transition-all">
            <div className="p-3 bg-indigo-500 rounded-xl group-hover:rotate-12 transition-transform">
               <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Tutorial</p>
               <h3 className="font-black italic uppercase tracking-tighter leading-none">Dicas de Prompts</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex gap-4 items-center shadow-sm group cursor-pointer hover:bg-slate-50 transition-all">
            <div className="p-3 bg-slate-100 rounded-xl text-slate-900 group-hover:scale-110 transition-transform">
               <MessageCircle className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suporte</p>
               <h3 className="font-black italic uppercase tracking-tighter leading-none text-slate-900">Perguntas Frequentes</h3>
            </div>
         </div>
         <div className="bg-amber-500 p-6 rounded-[2rem] text-slate-900 flex gap-4 items-center shadow-lg shadow-amber-100 group cursor-pointer hover:bg-amber-600 transition-all">
            <div className="p-3 bg-amber-400 rounded-xl group-hover:animate-bounce transition-all">
               <Sparkles className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Tokens</p>
               <h3 className="font-black italic uppercase tracking-tighter leading-none">Ganhar Tokens</h3>
            </div>
         </div>
      </div>
    </div>
  );
}
