import React, { useState } from "react";
import { Brain, Loader2, Info, ChevronRight, AlertTriangle, Lightbulb, Target } from "lucide-react";
import { cn } from "../lib/utils";

interface Props {
  tituloGrafico: string;
  dados: any;
  perfilUsuario?: "professor" | "coordenador" | "admin";
}

export function DashboardInsightCard({ tituloGrafico, dados, perfilUsuario = "professor" }: Props) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  async function gerarInsight() {
    setLoading(true);

    try {
      // Usando a rota do servidor que acabamos de criar
      const response = await fetch('/api/advanced-ai/dashboard-insight', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tituloGrafico,
          dados,
          perfilUsuario
        })
      });

      if (!response.ok) throw new Error("Falha na API");
      
      const data = await response.json();
      setInsight(data.insight);
    } catch (error) {
      setInsight("Desculpe, não consegui analisar os dados deste gráfico no momento. Verifique sua conexão ou tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-xl">
          <Brain className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Análise Inteligente (Jarvis)</h3>
      </div>

      {!insight && (
        <button
          onClick={gerarInsight}
          disabled={loading}
          className="group w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Analisar dados com IA
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      )}

      {insight && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {insight}
          </div>
          
          <button 
            onClick={() => setInsight("")}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Refazer análise
          </button>
        </div>
      )}
      
      {!insight && !loading && (
        <p className="mt-4 text-xs text-slate-500 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Clique para obter recomendações pedagógicas baseadas nestes dados.
        </p>
      )}
    </div>
  );
}
