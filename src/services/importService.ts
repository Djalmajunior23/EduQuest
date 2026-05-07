import { api } from '../lib/api';



export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

/**
 * Serviço para processar importação de dados em lote. */
export const importService = {  /**
   * Processa um arquivo CSV de alunos.
   */
  async importStudents(csvContent: string): Promise<ImportResult> {    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    
    let success = 0;
    let failed = 0;
    let errors: string[] = [];
    
    const studentsToProcess = lines.slice(1).filter(line => line.trim() !== '');
    
    for (const [index, line] of studentsToProcess.entries()) {
      try {
        const values = line.split(',');
        const student: any = {};
        
        headers.forEach((header, i) => {
          student[header.trim()] = values[i]?.trim();
        });

        // Validações básicas
        if (!student.email || !student.nome) {
          throw new Error('Nome e Email são obrigatórios');
        }

        // Adicionar ao Database
        const { error } = await api.from('usuarios').insert({
          ...student,
          perfil: student.perfil || 'ALUNO',
          status: student.status || 'PENDENTE',
          saldo_tokens_ia: 0,
          created_at: new Date().toISOString(),
          primeiro_acesso_completo: false
        });

        if (error) throw error;

        success++;
      } catch (error) {
        failed++;
        errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    return {
      total: studentsToProcess.length,
      success,
      failed,
      errors
    };
  }
};
