import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Target, Award, Briefcase, ChevronRight, Activity, TrendingUp, CheckCircle2 } from "lucide-react";

interface Props {
  tenantId: string;
  alunoId: string;
}

export const CareerDashboardPro: React.FC<Props> = ({ tenantId, alunoId }) => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [tenantId, alunoId]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/phase12-advanced/career/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          alunoId,
          skills: {
            "Lógica de Programação": 0.9,
            "Java": 0.85,
            "React": 0.6,
            "Banco de Dados SQL": 0.75,
            "Cloud DevOps": 0.4
          },
          credentials: ["cert-java-101", "badge-clean-code"],
          projects: ["Sistema Bancário Simulado"],
          interests: ["Desenvolvimento Backend", "Engenharia de Software"]
        })
      });
      const data = await response.json();
      setDashboard(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboard) {
    return (
      <div className="flex h-64 items-center justify-center p-6 border rounded-2xl bg-slate-50">
        <Activity className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
           <TrendingUp className="text-indigo-600" /> Career Dashboard Pro
         </h2>
         <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">Education to Workforce</span>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 hover:shadow-md transition-shadow">
          <p className="text-xs text-slate-500 font-bold uppercase mb-2 flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500"/> Prontidão</p>
          <p className="text-4xl font-extrabold text-slate-800">{dashboard.readinessScore}<span className="text-lg text-slate-400">%</span></p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 hover:shadow-md transition-shadow">
          <p className="text-xs text-slate-500 font-bold uppercase mb-2 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500"/> Credenciais</p>
          <p className="text-4xl font-extrabold text-slate-800">{dashboard.credentialsCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 hover:shadow-md transition-shadow">
          <p className="text-xs text-slate-500 font-bold uppercase mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-500"/> Projetos</p>
          <p className="text-4xl font-extrabold text-slate-800">{dashboard.projectsCount}</p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 hover:shadow-md transition-shadow">
          <p className="text-xs text-indigo-500 font-bold uppercase mb-2 flex items-center gap-2">Ação Recomendada</p>
          <p className="text-sm font-bold text-indigo-900 leading-snug">{dashboard.recommendedNextAction}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 border-b pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Competências Fortes
          </h3>
          <div className="flex flex-wrap gap-2">
            {dashboard.strongSkills?.map((skill: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium">
                {skill}
              </span>
            ))}
            {(!dashboard.strongSkills || dashboard.strongSkills.length === 0) && (
               <span className="text-sm text-slate-400">Nenhuma registrada</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 border-b pb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            Lacunas e Focos
          </h3>
          <div className="flex flex-wrap gap-2">
            {dashboard.gaps?.map((gap: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-medium">
                {gap}
              </span>
            ))}
            {(!dashboard.gaps || dashboard.gaps.length === 0) && (
               <span className="text-sm text-slate-400">Nenhuma lacuna crítica</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t flex justify-end">
         <button className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
            Acessar Portfolio Builder IA <ChevronRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}
