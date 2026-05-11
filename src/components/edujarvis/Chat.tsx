import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, Sparkles, User, Minimize2, Terminal, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../lib/AuthContext';
import { cn } from '../../lib/utils';
import { EduJarvisQuickActions } from './QuickActions';

// Componente de Mensagem com Efeito de Digitação
const MessageBubble = ({ msg, isLast }: { msg: any; isLast: boolean }) => {
  const [displayedText, setDisplayedText] = useState(msg.role === 'USER' ? msg.content : '');
  const [isTyping, setIsTyping] = useState(msg.role === 'ASSISTANT' && isLast && !msg.contentLoaded);

  useEffect(() => {
    if (msg.role === 'ASSISTANT' && isLast && !msg.contentLoaded) {
      let i = 0;
      const fullText = msg.content;
      const interval = setInterval(() => {
        setDisplayedText(fullText.slice(0, i));
        i += 5; // Velocidade de digitação
        if (i > fullText.length) {
          setDisplayedText(fullText);
          setIsTyping(false);
          msg.contentLoaded = true;
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    } else {
      setDisplayedText(msg.content);
    }
  }, [msg, isLast]);

  return (
    <motion.div
      initial={{ opacity: 0, x: msg.role === 'USER' ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex gap-3",
        msg.role === 'USER' ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-lg",
        msg.role === 'USER' ? "bg-white text-indigo-600 border border-slate-200" : "bg-indigo-600 text-white"
      )}>
        {msg.role === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={cn(
        "max-w-[85%] p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm",
        msg.role === 'USER' 
          ? "bg-white border border-slate-200 text-slate-700" 
          : "bg-indigo-600 text-white shadow-indigo-100 shadow-xl"
      )}>
        <article className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline ? (
                  <div className="relative group my-4">
                     <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Terminal className="w-4 h-4 text-slate-500" />
                     </div>
                     <pre className="p-4 bg-slate-900 rounded-xl overflow-x-auto border border-white/10 font-mono text-xs">
                        <code className={className} {...props}>
                           {children}
                        </code>
                     </pre>
                  </div>
                ) : (
                  <code className="bg-white/10 px-1 rounded text-indigo-200 font-mono" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {displayedText}
          </ReactMarkdown>
        </article>
        {isTyping && (
           <span className="inline-block w-2 h-4 bg-white/50 animate-pulse ml-1 align-middle" />
        )}
      </div>
    </motion.div>
  );
};

export function EduJarvisChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('tutor');
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
      const resp = await fetch('/api/edujarvis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: textToSend, 
            profile, 
            agentId: selectedAgent 
        })
      });
      
      const response = await resp.json();
      setMessages(prev => [...prev, {
        role: response.role || 'ASSISTANT',
        content: response.message || response.content,
        timestamp: response.timestamp || new Date(),
        contentLoaded: false // For typing effect
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ASSISTANT', 
        content: "Houve um erro na comunicação com o cérebro neural. Por favor, tente novamente.", 
        error: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    if (profile?.perfil === 'ALUNO') {
      return "Olá! Eu sou o EduJarvis. Como posso potencializar seu aprendizado hoje?";
    }
    return "Olá, professor! Sou seu copiloto pedagógico. O que vamos projetar agora?";
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
            className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-indigo-700 transition-colors group relative border-4 border-white"
          >
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
             <Bot className="w-8 h-8 group-hover:scale-110 transition-transform" />
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
              "bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col border border-slate-100 overflow-hidden",
              isMinimized ? "w-80 h-16" : "w-[450px] h-[700px]"
            )}
          >
            {/* Header */}
            <div className="bg-indigo-600 p-5 flex items-center justify-between text-white relative">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                 <Sparkles className="w-24 h-24" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <Bot className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-black text-xs uppercase tracking-[0.2em] leading-none mb-1">EduJarvis OS 4.0</h3>
                   <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-200 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      Neural Link Active
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                   <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                   <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Agent Selector Header */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-4 overflow-x-auto no-scrollbar">
                    {['tutor', 'correction', 'pedagogical', 'analytics', 'gamification'].map(id => (
                        <button 
                            key={id}
                            onClick={() => setSelectedAgent(id)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                selectedAgent === id 
                                    ? "bg-indigo-600 text-white shadow-lg" 
                                    : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"
                            )}
                        >
                            {id}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth bg-white"
                >
                  {messages.length === 0 && (
                    <div className="text-center py-12 space-y-6">
                       <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                          <Bot className="w-10 h-10" />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Nexus Intelligence</h4>
                          <p className="text-slate-400 text-xs px-12 font-medium leading-relaxed">
                             {getWelcomeMessage()}
                          </p>
                       </div>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <MessageBubble key={idx} msg={msg} isLast={idx === messages.length - 1} />
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                       <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg">
                          <Bot className="w-4 h-4" />
                       </div>
                       <div className="bg-indigo-50 p-4 rounded-2xl flex gap-1 items-center">
                          <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                       </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <div className="mb-4 overflow-x-auto no-scrollbar pb-2">
                    <EduJarvisQuickActions role={profile?.perfil} onSelect={(text) => handleSend(text)} />
                  </div>
                  
                  <div className="relative group">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Comande o Nexus..."
                      className="w-full pl-6 pr-14 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none text-slate-700 shadow-sm"
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={isLoading}
                      className="absolute right-2.5 top-2.5 w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                     <Sparkles className="w-3 h-3 text-indigo-400" />
                     <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                        Powered by Antigravity Neural Framework
                     </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
