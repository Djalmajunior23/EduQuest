import React, { useState, useEffect } from 'react';
import { Play, Users, FileText, CheckCircle, BarChart, Bot, AlertCircle, Sparkles, LogOut, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import { MVPService } from '../../services/mvp/MVPService';

export const EduQuestMVP: React.FC = () => {
  const [role, setRole] = useState<'home' | 'professor' | 'aluno'>('home');
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col items-center p-8">
      {role === 'home' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-5xl font-black mb-4 flex items-center gap-3">
            <Sparkles className="text-emerald-400 w-12 h-12" />
            EduQuest <span className="text-emerald-500">MVP</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 text-center max-w-lg">
             A versão mais enxuta para provar que a IA resolve a dor do professor sem gerar complexidade.
          </p>
          <div className="flex gap-6">
            <Button onClick={() => setRole('professor')} className="bg-emerald-600 hover:bg-emerald-500 px-8 py-6 rounded-2xl text-xl font-bold flex flex-col items-center gap-2">
              <Users className="w-8 h-8" /> Sou Professor
            </Button>
            <Button onClick={() => setRole('aluno')} className="bg-indigo-600 hover:bg-indigo-500 px-8 py-6 rounded-2xl text-xl font-bold flex flex-col items-center gap-2">
              <FileText className="w-8 h-8" /> Sou Aluno
            </Button>
          </div>
        </motion.div>
      )}

      {role === 'professor' && <ProfessorView onExit={() => setRole('home')} />}
      {role === 'aluno' && <AlunoView onExit={() => setRole('home')} />}
    </div>
  );
};

// --- Professor View ---
const ProfessorView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [turmas, setTurmas] = useState<any[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<any>(null);
  const [newTurmaName, setNewTurmaName] = useState('');
  
  const [alunos, setAlunos] = useState<any[]>([]);
  const [simulados, setSimulados] = useState<any[]>([]);
  
  const [newSimuladoName, setNewSimuladoName] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    const data = await MVPService.listarTurmas();
    setTurmas(data);
  };

  const criarTurma = async () => {
    if(!newTurmaName) return;
    setLoading(true);
    await MVPService.criarTurma(newTurmaName);
    setNewTurmaName('');
    await fetchTurmas();
    setLoading(false);
  };

  const selectTurma = async (t) => {
    setSelectedTurma(t);
    const [resAlunos, resSimulados] = await Promise.all([
      MVPService.listarAlunos(t.id),
      MVPService.listarSimulados(t.id)
    ]);
    setAlunos(resAlunos);
    setSimulados(resSimulados);
  };

  const criarSimulado = async () => {
    if(!newSimuladoName || !selectedTurma) return;
    setLoading(true);
    await MVPService.criarSimulado(newSimuladoName, selectedTurma.id);
    setNewSimuladoName('');
    const resSimulados = await MVPService.listarSimulados(selectedTurma.id);
    setSimulados(resSimulados);
    setLoading(false);
  };

  const analisarAlunoIA = async (aluno: any) => {
    const mockScore = Math.floor(Math.random() * 100);
    setLoading(true);
    try {
      const res = await fetch('/api/mvp/analisar', {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: mockScore })
      });
      const aiData = await res.json();
      const planoBasico = MVPService.gerarPlanoBasico(mockScore);
      
      await MVPService.salvarAnaliseEPlano(aluno.id, aiData, planoBasico);
      
      alert(`Score: ${mockScore}\n\nPlano Básico: ${planoBasico}\n\nIA: ${aiData.planoEstudoContextual || "N/A"}`);
    } finally {
      setLoading(false);
    }
  };

  const analisarTurma = async () => {
    if (!selectedTurma) return;
    setLoading(true);
    try {
      const data = await MVPService.analisarTurma(selectedTurma.id);
      if (data) {
        alert(`Análise da Turma:\nMédia Geral: ${data.media_geral}%\nTotal de Respostas: ${data.total_respostas}\nAlunos em Risco (<60): ${data.alunos_em_risco}\nAlunos Excelentes (>=80): ${data.alunos_bons}`);
      } else {
        alert("Sem dados na turma ou erro na execução.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <header className="flex justify-between items-center mb-10">
        <div>
           <h2 className="text-3xl font-bold flex items-center gap-2"><Users className="text-emerald-400" /> Dashboard do Professor</h2>
           <p className="text-slate-400">Gerencie turmas, simulados e acompanhe análises da IA.</p>
        </div>
        <Button onClick={onExit} variant="outline" className="flex items-center gap-2 border-slate-700 text-slate-300">
           <LogOut className="w-4 h-4" /> Sair
        </Button>
      </header>

      {!selectedTurma ? (
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold mb-4">Minhas Turmas</h3>
          <div className="flex gap-4 mb-6">
            <input 
              value={newTurmaName} onChange={e => setNewTurmaName(e.target.value)} 
              placeholder="Nome da nova turma..." className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 flex-grow"
            />
            <Button disabled={loading} onClick={criarTurma} className="bg-emerald-600 hover:bg-emerald-500">Nova Turma</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(turmas || []).map(t => (
              <div key={t.id} onClick={() => selectTurma(t)} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 cursor-pointer hover:border-emerald-500 hover:bg-slate-800/80 transition-colors">
                <h4 className="font-bold text-lg">{t.nome}</h4>
              </div>
            ))}
            {(turmas || []).length === 0 && <p className="text-slate-500">Nenhuma turma cadastrada. Crie uma acima.</p>}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
           <Button onClick={() => setSelectedTurma(null)} variant="outline" className="self-start text-emerald-400 border-emerald-900 bg-emerald-950/20 hover:bg-emerald-900/40">
             ← Voltar para Turmas
           </Button>
           
           <div className="flex gap-6 flex-col md:flex-row">
              {/* Simulados Panel */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex-1">
                 <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle className="text-indigo-400 w-5 h-5"/> Simulados</h4>
                 <div className="flex gap-2 mb-4">
                    <input 
                      value={newSimuladoName} onChange={e => setNewSimuladoName(e.target.value)} 
                      placeholder="Título do simulado..." className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex-grow text-sm"
                    />
                    <Button disabled={loading} onClick={criarSimulado} className="bg-indigo-600 hover:bg-indigo-500 text-sm">Criar</Button>
                 </div>
                 <ul className="space-y-3">
                   {(simulados || []).map(s => (
                     <li key={s.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm flex justify-between items-center">
                       {s.titulo}
                     </li>
                   ))}
                   {(simulados || []).length === 0 && <p className="text-sm text-slate-500">Nenhum simulado. Crie um para começar.</p>}
                 </ul>
              </div>

              {/* Alunos Panel */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex-1">
                 <div className="flex justify-between items-center mb-4">
                   <h4 className="font-bold text-lg flex items-center gap-2"><Users className="text-blue-400 w-5 h-5"/> Alunos e Análises</h4>
                   <Button onClick={analisarTurma} disabled={loading} size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs">Analisar Turma</Button>
                 </div>
                 <ul className="space-y-3">
                   {(alunos || []).map(a => (
                     <li key={a.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                       <span className="font-medium text-sm">{a.nome}</span>
                       <Button onClick={() => analisarAlunoIA(a)} size="sm" variant="outline" className="text-xs border-indigo-700 text-indigo-300 hover:bg-indigo-900/50">
                         Analisar com IA
                       </Button>
                     </li>
                   ))}
                   {(alunos || []).length === 0 && <p className="text-sm text-slate-500">Nenhum aluno. Os alunos devem entrar nesta turma para aparecerem aqui.</p>}
                 </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};


// --- Aluno View ---
const AlunoView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [turmas, setTurmas] = useState<any[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<any>(null);
  
  const [nomeAluno, setNomeAluno] = useState('');
  const [alunoRegistrado, setAlunoRegistrado] = useState<any>(null);
  
  const [simulados, setSimulados] = useState<any[]>([]);
  const [simuladoAtivo, setSimuladoAtivo] = useState<any>(null);
  const [scoreFinal, setScoreFinal] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    MVPService.listarTurmas().then(setTurmas);
  }, []);

  const entrarNaTurma = async () => {
    if(!nomeAluno || !selectedTurma) return;
    setLoading(true);
    const aluno = await MVPService.criarAluno(nomeAluno, selectedTurma.id);
    setAlunoRegistrado(aluno);

    const resSimulados = await MVPService.listarSimulados(selectedTurma.id);
    setSimulados(resSimulados);
    setLoading(false);
  };

  const enviarSimulado = async () => {
    if(!alunoRegistrado || !simuladoAtivo) return;
    setLoading(true);
    // Mocking 40 questions answers to demonstrate the endpoint MVP
    const mockRespostas = Array.from({length: 40}).map(() => ({ correta: Math.random() > 0.4 })); 

    const result = await MVPService.enviarResposta(alunoRegistrado.id, simuladoAtivo.id, mockRespostas);
    setScoreFinal(result.score);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl">
       <header className="flex justify-between items-center mb-10">
        <div>
           <h2 className="text-3xl font-bold flex items-center gap-2"><FileText className="text-indigo-400" /> Portal do Aluno</h2>
           <p className="text-slate-400">Responda aos simulados e converse com o EduJarvis.</p>
        </div>
        <Button onClick={onExit} variant="outline" className="flex items-center gap-2 border-slate-700 text-slate-300">
           <LogOut className="w-4 h-4" /> Sair
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            {!alunoRegistrado ? (
               <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-4">Entrar em uma Turma</h3>
                  <div className="space-y-4 max-w-sm">
                    <input 
                      value={nomeAluno} onChange={e => setNomeAluno(e.target.value)} 
                      placeholder="Seu nome..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                    />
                    <select 
                      value={selectedTurma?.id || ""} 
                      onChange={e => setSelectedTurma(turmas.find(t => t.id === e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300"
                    >
                      <option value="">Selecione a turma...</option>
                      {(turmas || []).map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                    <Button disabled={loading || !nomeAluno || !selectedTurma} onClick={entrarNaTurma} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-xl font-bold">
                       Acessar Ambiente
                    </Button>
                  </div>
               </div>
            ) : (
               <div className="space-y-6">
                 {!simuladoAtivo && scoreFinal === null && (
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                       <h3 className="text-xl font-bold mb-4">Simulados Disponíveis</h3>
                       <div className="space-y-3">
                         {(simulados || []).map(s => (
                            <div key={s.id} className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex justify-between items-center">
                              <span className="font-medium">{s.titulo}</span>
                              <Button onClick={() => setSimuladoAtivo(s)} className="bg-emerald-600 hover:bg-emerald-500">Realizar Simulado</Button>
                            </div>
                         ))}
                         {(simulados || []).length === 0 && <p className="text-slate-500">Nenhum simulado disponível nesta turma.</p>}
                       </div>
                    </div>
                 )}

                 {simuladoAtivo && scoreFinal === null && (
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                       <h3 className="text-2xl font-bold mb-2">{simuladoAtivo.titulo}</h3>
                       <p className="text-slate-400 mb-8">40 questões no estilo SAEP. Para fins deste MVP, as respostas serão simuladas nos bastidores ao clicar no botão.</p>
                       <Button disabled={loading} onClick={enviarSimulado} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-2xl text-lg font-bold">
                          {loading ? 'Enviando...' : 'Finalizar Simulado (Mock)'}
                       </Button>
                    </div>
                 )}

                 {scoreFinal !== null && (
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center">
                       <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                       <h3 className="text-3xl font-black mb-2">Simulado Concluído!</h3>
                       <p className="text-slate-400 mb-6">Sua pontuação estimada foi calculada.</p>
                       <div className="inline-block bg-slate-950 border border-slate-800 rounded-3xl p-8 mb-8">
                          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-2">Score Final</p>
                          <p className="text-6xl font-black text-indigo-400">{scoreFinal}%</p>
                       </div>
                       <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
                         O professor agora pode visualizar seus resultados e a IA criará um plano de recuperação exclusivo caso necessário.
                       </p>
                       <Button onClick={() => {setScoreFinal(null); setSimuladoAtivo(null);}} variant="outline" className="border-slate-700">
                          Voltar ao início
                       </Button>
                    </div>
                 )}
               </div>
            )}
         </div>

         {/* EduJarvis Chat Sidebar */}
         <div className="lg:col-span-1">
            <EduJarvisChatMVP />
         </div>
      </div>
    </div>
  );
};

const EduJarvisChatMVP = () => {
   const [msg, setMsg] = useState("");
   const [chat, setChat] = useState<{role:'jarvis'|'user', text: string}[]>([
     {role:'jarvis', text: 'Olá! Sou o EduJarvis, seu tutor IA. Em que posso te ajudar hoje?'}
   ]);
   const [loading, setLoading] = useState(false);
 
   async function send() {
     if(!msg) return;
     const currentMsg = msg;
     setChat(prev => [...prev, {role:'user', text: currentMsg}]);
     setMsg("");
     setLoading(true);
     try {
       const res = await fetch("/api/mvp/edujarvis", {
         method: "POST", headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ message: currentMsg })
       });
       const data = await res.json();
       setChat(prev => [...prev, {role:'jarvis', text: data.response}]);
     } catch (e) {
       setChat(prev => [...prev, {role:'jarvis', text: 'Erro de conexão.'}]);
     } finally {
       setLoading(false);
     }
   }
 
   return (
     <div className="bg-slate-900 border border-slate-800 rounded-3xl flex flex-col h-[600px] overflow-hidden">
       <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center gap-3">
         <Bot className="text-indigo-400 w-6 h-6" />
         <span className="font-bold">EduJarvis Tutor</span>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {chat.map((c, i) => (
           <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm ${c.role === 'jarvis' ? 'bg-slate-800 text-slate-200 self-start rounded-tl-none mr-auto' : 'bg-indigo-600 text-white self-end rounded-tr-none ml-auto'}`}>
             {c.text}
           </div>
         ))}
         {loading && <div className="text-xs text-slate-500">EduJarvis está digitando...</div>}
       </div>
       <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
         <input 
           value={msg} 
           onChange={(e) => setMsg(e.target.value)} 
           onKeyDown={e => e.key === 'Enter' && send()}
           placeholder="Pergunte ao tutor..." 
           className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 text-sm focus:outline-none focus:border-indigo-500"
         />
         <Button onClick={send} disabled={loading} size="sm" className="bg-indigo-600 hover:bg-indigo-500 w-10 h-10 rounded-xl shrink-0">
            <MessageSquare className="w-4 h-4" />
         </Button>
       </div>
     </div>
   );
 }
