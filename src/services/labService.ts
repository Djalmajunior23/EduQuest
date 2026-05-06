// src/services/labService.ts
import { supabase } from '../lib/supabase';
import { LaboratorioPratico } from '../types/laboratorio';

export const labService = {
  async getLaboratoriosByTenant(tenantId: string): Promise<LaboratorioPratico[]> {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
      .from('laboratorios_praticos')
      .select('*')
      .eq('id', labId)
      .single();
    
    if (error) {
      console.error(error);
      return null;
    }
    return data;
  }
};
