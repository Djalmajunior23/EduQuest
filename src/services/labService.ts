import { api } from '../lib/api';


// src/services/labService.ts
import { LaboratorioPratico } from '../types/laboratorio';export const labService = {
  async getLaboratoriosByTenant(tenantId: string): Promise<LaboratorioPratico[]> {
    const { data, error } = await api
      .from('laboratorios_praticos')
      .select('*')
      .eq('tenantId', tenantId);
    
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  },
  
  async getLaboratorioById(labId: string): Promise<LaboratorioPratico | null> {
    const { data, error } = await api
      .from('laboratorios_praticos')
      .select('*')
      .eq('id', labId)
      .maybeSingle();
    
    if (error) {
      console.error(error);
      return null;
    }
    return data;
  }
};
