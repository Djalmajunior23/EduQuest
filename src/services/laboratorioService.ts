import { supabase } from '../lib/supabase';

export interface Laboratorio {
  id?: string;
  titulo: string;
  versaoProfessor: string;
  versaoAluno: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tenantId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface LaboratorioCategoria {
  id?: string;
  nome: string;
  descricao: string;
  cursoId?: string;
  unidadeCurricularId?: string;
  tenantId: string;
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION = 'laboratorios_praticos';
const CATEGORIA_COLLECTION = 'laboratorio_categorias';

export const laboratorioService = {
  getLaboratorios: async (tenantId: string) => {
    const { data, error } = await supabase
      .from(COLLECTION)
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      tenantId: d.tenant_id,
      versaoProfessor: d.versao_professor,
      versaoAluno: d.versao_aluno,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    } as Laboratorio));
  },
  
  createLaboratorio: async (lab: Laboratorio) => {
    const { data, error } = await supabase
      .from(COLLECTION)
      .insert({
        titulo: lab.titulo,
        versao_professor: lab.versaoProfessor,
        versao_aluno: lab.versaoAluno,
        status: lab.status,
        tenant_id: lab.tenantId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateLaboratorio: async (id: string, lab: Partial<Laboratorio>) => {
    const { error } = await supabase
      .from(COLLECTION)
      .update({
        ...lab,
        versao_professor: lab.versaoProfessor,
        versao_aluno: lab.versaoAluno,
        tenant_id: lab.tenantId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Categorias
  getCategorias: async (tenantId: string) => {
    const { data, error } = await supabase
      .from(CATEGORIA_COLLECTION)
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      tenantId: d.tenant_id,
      cursoId: d.curso_id,
      unidadeCurricularId: d.unidade_curricular_id,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    } as LaboratorioCategoria));
  },

  createCategoria: async (categoria: LaboratorioCategoria) => {
    const { data, error } = await supabase
      .from(CATEGORIA_COLLECTION)
      .insert({
        nome: categoria.nome,
        descricao: categoria.descricao,
        curso_id: categoria.cursoId,
        unidade_curricular_id: categoria.unidadeCurricularId,
        tenant_id: categoria.tenantId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateCategoria: async (id: string, categoria: Partial<LaboratorioCategoria>) => {
    const { error } = await supabase
      .from(CATEGORIA_COLLECTION)
      .update({
        ...categoria,
        curso_id: categoria.cursoId,
        unidade_curricular_id: categoria.unidadeCurricularId,
        tenant_id: categoria.tenantId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  deleteCategoria: async (id: string) => {
    const { error } = await supabase
      .from(CATEGORIA_COLLECTION)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
