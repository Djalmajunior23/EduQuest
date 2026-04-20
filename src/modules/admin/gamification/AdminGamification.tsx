import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Database, 
  Globe, 
  Cpu, 
  LayoutGrid, 
  BarChart, 
  PieChart,
  HardDrive,
  Activity,
  Layers,
  Settings2,
  FileJson
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function AdminGamification() {
  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-10">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">
              <Shield className="w-3 h-3" /> Core System Architecture
           </div>
           <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
              Nexus <span className="text-indigo-600">Gamification Admin</span>
           </h1>
           <p className="text-slate-500 font-medium">Controle central de regras, motores de XP e integrações BI/n8n.</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg">
              <FileJson className="w-4 h-4" /> Export Config
           </button>
        </div>
      </header>

      {/* System Infrastructure Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {[
           { label: 'Uptime do Motor', value: '99.9%', sub: 'N8N Workflows OK', icon: Activity, color: 'text-indigo-600' },
           { label: 'Eventos Processados', value: '1.2M', sub: 'Last 30 days', icon: Database, color: 'text-blue-600' },
           { label: 'Sincronização BI', value: 'Sync Ativo', sub: 'Last: 2 min ago', icon: BarChart, color: 'text-emerald-600' },
           { label: 'Nível de Abastecimento', value: 'IA OK', sub: 'Tokens Disponíveis', icon: Cpu, color: 'text-amber-600' },
         ].map((stat, i) => (
           <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center text-center">
              <stat.icon className={cn("w-6 h-6 mb-4", stat.color)} />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black italic mt-1">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{stat.sub}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Config Modules */}
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
               <Layers className="w-6 h-6 text-indigo-600" /> Módulos Nucleares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { title: 'Motor de XP & Níveis', desc: 'Configure as fórmulas de progressão (Logarítmica/Linear) e curvas de dificuldade.', icon: Settings2 },
                 { title: 'Workflows de Automação', desc: 'Gerencie as conexões n8n para eventos de gamificação (webhook/firebase).', icon: Globe },
                 { title: 'Loja de Recompensas', desc: 'Defina custos, tipos de tokens e inventário global de prêmios.', icon: LayoutGrid },
                 { title: 'BI & Analytics Center', desc: 'Integre com PowerBI/Superset para dashboards gerenciais avançados.', icon: PieChart },
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -5 }}
                   className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                 >
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                       <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black italic uppercase tracking-tight mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                    <button className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Configurar Módulo &rarr;</button>
                 </motion.div>
               ))}
            </div>

            <section className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8">
               <header className="flex justify-between items-center">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Status das Integrações n8n</h3>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full animate-pulse">Monitoramento Ativo</span>
               </header>
               <div className="space-y-4">
                  {[
                    { hook: 'CONCEDER_PONTOS', status: 'Healthy', latency: '45ms' },
                    { hook: 'ATUALIZAR_RANKING', status: 'Healthy', latency: '120ms' },
                    { hook: 'GERAR_MISSAO_IA', status: 'Warning', latency: '1.2s' },
                    { hook: 'PROCESSAR_BADGE', status: 'Healthy', latency: '30ms' },
                  ].map((hook, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-4">
                          <HardDrive className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-mono text-slate-300">{hook.hook}</span>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Lat: {hook.latency}</span>
                          <span className={cn("text-[10px] font-black uppercase", hook.status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400')}>{hook.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
         </div>

         {/* Side Analysis */}
         <aside className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-8">
               <h3 className="text-xs font-black uppercase tracking-tighter italic text-slate-900 border-b border-slate-100 pb-4">Indicadores KPI (BI)</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Retenção Gamificada', val: 92, color: 'bg-indigo-500' },
                    { label: 'Utilização de Tokens IA', val: 45, color: 'bg-amber-500' },
                    { label: 'Conclusão de Trilhas', val: 78, color: 'bg-emerald-500' },
                  ].map((kpi, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                          <span>{kpi.label}</span>
                          <span>{kpi.val}%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full", kpi.color)} style={{ width: `${kpi.val}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full py-4 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all">Ver Dashboard BI &rarr;</button>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] space-y-4">
               <h3 className="text-lg font-black italic uppercase tracking-tight text-indigo-900">Segurança de Dados</h3>
               <p className="text-sm font-medium text-indigo-700 leading-relaxed">
                  Todas as regras de escrita do Firebase estão configuradas via ABAC (Attribute-Based Access Control). 
                  Integridade de XP verificada via HMAC nos hooks n8n.
               </p>
               <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                  <Shield className="w-4 h-4" /> Protocolo Nexus v2.0
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
}
