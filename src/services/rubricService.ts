import { supabase } from '../lib/supabase';
import { Rubric } from '../types/activities';

const RUBRICS_COLLECTION = 'rubrics';

export const rubricService = {
  async createRubric(rubric: Omit<Rubric, 'id' | 'createdAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from(RUBRICS_COLLECTION)
        .insert({
          ...rubric,
          teacher_id: rubric.teacherId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (e) {
      console.error('Supabase Error (rubric create):', e);
      throw e;
    }
  },

  async getTeacherRubrics(teacherId: string): Promise<Rubric[]> {
    try {
      const { data, error } = await supabase
        .from(RUBRICS_COLLECTION)
        .select('*')
        .eq('teacher_id', teacherId);
      
      if (error) throw error;
      return (data || []).map(r => ({
        ...r,
        teacherId: r.teacher_id,
        createdAt: r.created_at
      } as Rubric));
    } catch (e) {
      console.error('Supabase Error (rubric list):', e);
      return [];
    }
  },

  async getRubric(id: string): Promise<Rubric | null> {
    try {
      const { data, error } = await supabase
        .from(RUBRICS_COLLECTION)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        teacherId: data.teacher_id,
        createdAt: data.created_at
      } as Rubric;
    } catch (e) {
      console.error('Supabase Error (rubric get):', e);
      return null;
    }
  },

  async updateRubric(id: string, updates: Partial<Rubric>): Promise<void> {
     try {
       const { error } = await supabase
         .from(RUBRICS_COLLECTION)
         .update({
           ...updates,
           teacher_id: updates.teacherId,
         })
         .eq('id', id);
       
       if (error) throw error;
     } catch (e) {
       console.error('Supabase Error (rubric update):', e);
       throw e;
     }
  },

  async deleteRubric(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(RUBRICS_COLLECTION)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (e) {
      console.error('Supabase Error (rubric delete):', e);
      throw e;
    }
  }
};
