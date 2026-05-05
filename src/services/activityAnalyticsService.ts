import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Activity, ActivitySubmission } from '../types/activities';

export const activityAnalyticsService = {
  async getTeacherDashboardMetrics(teacherId: string) {
    // Buscar atividades
    const qActivities = query(collection(db, 'activities'), where('teacherId', '==', teacherId));
    const activitiesSnap = await getDocs(qActivities);
    const activities = activitiesSnap.docs.map(d => ({id: d.id, ...d.data()} as Activity));

    if (activities.length === 0) return { totalActivities: 0, pendingSubmissions: 0, averageScore: 0 };

    const activityIds = activities.map(a => a.id);
    
    // ATENTION: In operator max 10 elements. To keep it simple, we may fetch all by a class id or map
    // For this scope, let's just fetch all submissions for these activities where status != 'returned' or similar, but since we can't easily `in` more than 10, we can fetch all and filter client side if small.
    // For production, we'd do this by classId or pagination.
    let submissions: ActivitySubmission[] = [];
    
    // Split into chunks of 10
    for (let i = 0; i < activityIds.length; i += 10) {
      const chunk = activityIds.slice(i, i + 10);
      const qSubs = query(collection(db, 'activity_submissions'), where('activityId', 'in', chunk));
      const subsSnap = await getDocs(qSubs);
      submissions = [...submissions, ...subsSnap.docs.map(d => d.data() as ActivitySubmission)];
    }

    const pending = submissions.filter(s => s.status === 'submitted' || s.status === 'corrected').length;
    
    const reviewed = submissions.filter(s => s.status === 'reviewed' || s.status === 'returned');
    const avgScore = reviewed.length > 0 
      ? reviewed.reduce((acc, s) => acc + (s.finalScore || 0), 0) / reviewed.length
      : 0;

    return {
      totalActivities: activities.length,
      pendingSubmissions: pending,
      averageScore: avgScore,
      totalSubmissions: submissions.length
    };
  }
};
