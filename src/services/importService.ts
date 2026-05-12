import { api } from '../lib/api';

export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export const importService = {
  async importStudents(csvContent: string): Promise<ImportResult> {
    try {
      const { data, error } = await api.post('/api/usuarios/import', { csvContent });
      if (error) throw new Error(error);
      return data;
    } catch (e: any) {
      return { total: 0, success: 0, failed: 0, errors: [e.message] };
    }
  }
};
