import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saService, LearningSituation } from '../../../services/saService';
import { useAuth } from '../../../lib/AuthContext';
import { 
  FilePlus, 
  Sparkles, 
  BookOpen, 
  MoreVertical, 
  Search, 
  Filter,
  Copy,
  Trash2,
  ExternalLink,
  ChevronRight,
  Clock,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';

export default function SAPanel() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [sas, setSas] = useState<LearningSituation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchSAs() {
      try {
        const data = await saService.listSAs(profile?.perfil === 'ADMIN' ? undefined : profile?.uid);
        setSas(data);
      } catch (error) {
        console.error("Erro ao buscar SAs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSAs();
  }, [profile]);

  const filteredSAs = sas.filter(sa => 
    sa.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const seedModelSA = async () => {
    setLoading(true);
    try {
      const modelSA = {
        titulo: "SISTEMA DE GESTÃO DE MANUTENÇÃO (SGM) - INDÚSTRIA 4.0",
        contexto: "A empresa 'Metalúrgica Futuro' está passando por um processo de digitalização. Atualmente, todas as ordens de serviço de manutenção são feitas em papel, o que gera atrasos, perda de dados e falta de controle sobre o tempo de inatividade das máquinas.",
        problema_desafio: "Você e sua equipe foram contratados para desenvolver o protótipo funcional de um Dashboard Web de Gestão de Manutenção. O sistema deve permitir que operadores enviem alertas de falha e que a equipe de manutenção visualize e priorize as correções em tempo real.",
        objetivo_geral: "Desenvolver uma aplicação web CRUD completa com integração de banco de dados em tempo real utilizando React e Firebase.",
        objetivos_especificos: [
          "Modelar o banco de dados NoSQL para suportar Máquinas, Operadores e Ordens de Serviço.",
          "Implementar autenticação de usuários diferenciada por nível de acesso.",
          "Desenvolver uma interface responsiva focada em usabilidade industrial."
        ],
        entregas: [
          { descricao: "Documento de Modelagem de Dados", prazo: "Semana 1" },
          { descricao: "Protótipo de Interface", prazo: "Semana 2" }
        ],
        criterios_avaliacao: ["Funcionalidade CRUD", "Segurança", "UX/UI Industrial"],
        evidencias: ["Prints das telas", "Código fonte"],
        ucId: "web_dev",
        conhecimentoTecnicoIds: ["react", "firebase"],
        capacidadeTecnicaIds: ["analise", "dev"],
        recursos_necessarios: ["VS Code", "Firebase"],
        cronograma: "4 Semanas",
        orientacoes_aluno: "Trabalhem em squads. Foquem no MVP.",
        orientacoes_professor: "Acompanhe as dailies.",
        status: 'PUBLISHED',
        isTemplate: true,
        createdBy: profile?.uid
      };
      await saService.createSA(modelSA as any);
      const data = await saService.listSAs(profile?.perfil === 'ADMIN' ? undefined : profile?.uid);
      setSas(data);
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4 italic uppercase">
            Produção de SA
            <span className="text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full not-italic tracking-normal">Beta</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-xs tracking-widest">
            Metodologia Inteligência Educacional Interativa de Ensino por Competências
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={seedModelSA}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            Seed Modelo Inteligência Educacional Interativa
          </button>
          <button 
            onClick={() => navigate('/sa/create')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200"
          >
            <FilePlus className="w-5 h-5" />
            Nova SA Manual
          </button>
          <button 
            onClick={() => navigate('/sa/create?ia=true')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-200"
          >
            <Sparkles className="w-5 h-5" />
            Gerar com IA
          </button>
        </div>
      </header>

      {/* Filters & Library */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Pesquisar por título ou UC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">
          <Filter className="w-5 h-5" />
          Filtros
        </button>
        <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">
          <BookOpen className="w-5 h-5" />
          Biblioteca de Modelos
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl" />)}
        </div>
      ) : (filteredSAs || []).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(filteredSAs || []).map((sa) => (
            <motion.div 
              key={sa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-slate-200 transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  sa.status === 'PUBLISHED' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {sa.status === 'PUBLISHED' ? 'Publicada' : 'Rascunho'}
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                  <MoreVertical className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                {sa.titulo}
              </h2>
              <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 italic">
                {sa.contexto}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Criada em 12/04/2026</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider truncate max-w-[200px]">UC: Desenvolvimento Web</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(`/sa/${sa.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-900 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </button>
                <button 
                  onClick={() => navigate(`/sa/edit/${sa.id}`)}
                  className="flex items-center justify-center w-12 bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <BookOpen className="w-20 h-20 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-900 mb-2">Nenhuma SA encontrada</h3>
          <p className="text-slate-500 font-medium mb-8">Comece criando sua primeira Situação de Aprendizagem com IA!</p>
          <button 
            onClick={() => navigate('/sa/create?ia=true')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Gerar com IA
          </button>
        </div>
      )}
    </div>
  );
}
