// src/services/edujarvis/CareerDashboardService.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class CareerDashboardService {
  public static async buildDashboard(data: {
    tenantId: string;
    alunoId: string;
    skills: Record<string, number>;
    credentials: string[];
    projects: string[];
    interests: string[];
  }) {
    const skillValues = Object.values(data.skills);
    const readiness =
      skillValues.length === 0
        ? 0
        : Math.round(
            (skillValues.reduce((sum, value) => sum + value, 0) / skillValues.length) * 100
          );

    const gaps = Object.entries(data.skills)
      .filter(([, value]) => value < 0.6)
      .map(([skill]) => skill);

    const strongSkills = Object.entries(data.skills)
      .filter(([, value]) => value >= 0.75)
      .map(([skill]) => skill);

    const recommendedNextAction =
        readiness >= 80
          ? "Montar portfólio profissional e preparar entrevista técnica."
          : "Concluir projetos práticos nas competências com menor domínio.";

    const dashboard = {
      readinessScore: readiness,
      credentialsCount: (data.credentials || []).length,
      projectsCount: (data.projects || []).length,
      strongSkills,
      gaps,
      recommendedNextAction
    };

    // Save snapshot
    await addDoc(collection(db, 'career_dashboard_snapshots'), {
      tenantId: data.tenantId,
      alunoId: data.alunoId,
      readinessScore: readiness,
      skillsSummary: JSON.stringify(data.skills),
      gaps,
      nextProjects: (data.projects || []).length > 0 ? [data.projects[0]] : [],
      createdAt: serverTimestamp()
    });

    return dashboard;
  }
}
