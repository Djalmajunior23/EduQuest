export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export const importService = {
  async importStudents(csvContent: string): Promise<ImportResult> {
    try {
      const response = await fetch('/api/usuarios/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.result;
    } catch (e: any) {
      return { total: 0, success: 0, failed: 0, errors: [e.message] };
    }
  }
};
