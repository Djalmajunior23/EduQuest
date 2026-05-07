import { api } from '../lib/api';


import { Activity, ActivitySubmission } from '../types/activities';export const activityAnalyticsService = {
  async getTeacherDashboardMetrics(teacherId: string) {
    // Buscar atividades
    const { data: activitiesData, error: activitiesError } = await api
      .from('atividades')
      .select('*')
      .eq('teacher_id', teacherId);
    
    if (activitiesError) throw activitiesError;
    const activities = activitiesData || [];

    if ((activities || []).length === 0) return { totalActivities: 0, pendingSubmissions: 0, averageScore: 0 };

    const activityIds = (activities || []).map(a => a.id);
    
    // Fetch all submissions for these activities
    const { data: submissionsData, error: submissionsError } = await api
      .from('submissoes')
      .select('*')
      .in('activity_id', activityIds);
    
    if (submissionsError) throw submissionsError;
    const submissions = (submissionsData || []).map(s => ({
      ...s,
      finalScore: s.final_score
    } as any)) as ActivitySubmission[];

    const pending = submissions.filter(s => s.status === 'submitted' || s.status === 'corrected').length;
    
    const reviewed = submissions.filter(s => s.status === 'reviewed' || s.status === 'returned');
    const avgScore = reviewed.length > 0 
      ? reviewed.reduce((acc: number, s: any) => acc + (s.finalScore || 0), 0) / reviewed.length
      : 0;

    return {
      totalActivities: (activities || []).length,
      pendingSubmissions: pending,
      averageScore: avgScore,
      totalSubmissions: submissions.length
    };
  }
};
