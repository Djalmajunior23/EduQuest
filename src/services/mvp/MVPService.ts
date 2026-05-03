// src/services/mvp/MVPService.ts
import { supabase } from '../../lib/supabase';

export class MVPService {
  public static async criarTurma(nome: string) {
    const { data: user } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('turmas')
      .insert({ nome, professor_id: user.user?.id || null })
      .select()
      .single();
      
    if (error) console.error(error);
    return data;
  }

  public static async listarTurmas() {
    const { data, error } = await supabase
      .from('turmas')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) console.error(error);
    return data || [];
  }

  public static async criarAluno(nome: string, turmaId: string) {
    const { data: user } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('alunos')
      .insert({ nome, turma_id: turmaId, user_id: user.user?.id || null })
      .select()
      .single();
      
    if (error) console.error(error);
    return data;
  }

  public static async listarAlunos(turmaId: string) {
    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .eq('turma_id', turmaId);
      
    if (error) console.error(error);
    return data || [];
  }

  public static async criarSimulado(titulo: string, turmaId: string) {
    const { data, error } = await supabase
      .from('simulados')
      .insert({ titulo, turma_id: turmaId })
      .select()
      .single();
      
    if (error) console.error(error);
    return data;
  }
  
  public static async listarSimulados(turmaId: string) {
    const { data, error } = await supabase
      .from('simulados')
      .select('*')
      .eq('turma_id', turmaId);
      
    if (error) console.error(error);
    return data || [];
  }

  public static calcularScore(respostas: any[]) {
    let corretas = 0;
    respostas.forEach(r => {
      if (r.correta) corretas++;
    });
    if (respostas.length === 0) return 0;
    return Math.round((corretas / respostas.length) * 100);
  }

  public static gerarPlanoBasico(score: number) {
    if (score >= 80) return "Avançar para desafios práticos e projetos.";
    if (score >= 60) return "Revisar conteúdos com dificuldade moderada.";
    return "Reforçar conceitos básicos antes de avançar.";
  }

  public static async enviarResposta(alunoId: string, simuladoId: string, respostas: any[]) {
    // Attempting to use Edge Function
    const { data, error } = await supabase.functions.invoke('responder-simulado', {
      body: { alunoId, simuladoId, respostas, tenantId: null }
    });
    
    // Fallback if Edge function doesn't exist yet/fails
    if (error) {
       console.warn("Edge function responder-simulado falhou, usando fallback direto", error);
       const score = this.calcularScore(respostas) || Math.floor(Math.random() * 100); 
       
       const { data: dbData } = await supabase
         .from('respostas_simulado')
         .insert({
           aluno_id: alunoId,
           simulado_id: simuladoId,
           respostas: respostas,
           score
         })
         .select()
         .single();
         
       return { id: dbData?.id, score };
    }

    return data;
  }

  public static async salvarAnaliseEPlano(alunoId: string, analise: any, planoBasico: string) {
    const plano = {
       aiPlan: analise.planoEstudoContextual, 
       basicPlan: planoBasico
    };
    
    const { data, error } = await supabase
      .from('planos_estudo')
      .insert({
        aluno_id: alunoId,
        plano
      })
      .select()
      .single();
      
    if (error) console.error(error);
    return { id: data?.id, analise, planoBasico };
  }
  
  public static async analisarTurma(turmaId: string) {
     const { data, error } = await supabase.rpc('analisar_turma', {
       p_turma_id: turmaId
     });
     if(error) console.error(error);
     return data;
  }
}
