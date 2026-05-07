import { api } from '../../lib/api';


// src/services/edujarvis/StudentDigitalTwinService.ts

export interface StudentDigitalTwin {
  alunoId: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  engajamento: number; // 0-100
  riscoPedagogico: 'baixo' | 'medio' | 'alto';
  velocidadeAprendizagem: number; // escala 0-1
  pontosFortes: string[];
  dificuldades: string[];
  previsoes: {
    chanceAprovacao: number;
    riscoEvasao: number;
  };
  lastUpdate: any;
}

export class StudentDigitalTwinService {
  private static TABLE = 'student_digital_twins';

  public static async getTwin(alunoId: string): Promise<StudentDigitalTwin | null> {
    const { data, error } = await api
      .from(this.TABLE)
      .select('*')
      .eq('alunoId', alunoId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  public static async updateTwin(alunoId: string, data: Partial<StudentDigitalTwin>) {
    const { error } = await api
      .from(this.TABLE)
      .upsert({
        ...data,
        alunoId,
        last_update: new Date().toISOString()
      }, { onConflict: 'alunoId' });
    
    if (error) throw error;
  }

  /**
   * Reconstrói o gêmeo digital baseado no histórico behavioral
   */
  public static async reconstruct(alunoId: string) {
    // 1. Buscar logs de comportamento
    const { data: logs, error } = await api
      .from('behavioral_logs')
      .select('*')
      .eq('alunoId', alunoId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    
    // 2. Buscar desempenho acadêmico (simulados, tarefas)
    // ... lógica de agregação ...

    // Exemplo de atualização simplificada
    const twinUpdate: Partial<StudentDigitalTwin> = {
      engajamento: Math.min((logs?.length || 0) * 5, 100),
      riscoPedagogico: (logs?.length || 0) < 5 ? 'alto' : 'baixo',
      lastUpdate: new Date().toISOString()
    };

    await this.updateTwin(alunoId, twinUpdate);
    return twinUpdate;
  }
}
