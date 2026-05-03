// src/services/edujarvis/SkillsGraphService.ts

export class SkillsGraphService {
  public static recommendPath(data: {
    currentSkills: string[];
    targetSkill: string;
    graph: Array<{
      skill_name: string;
      prerequisites: string[];
      related_skills: string[];
    }>;
  }) {
    const target = data.graph.find((s) => s.skill_name === data.targetSkill);

    if (!target) {
      return { found: false, path: [] };
    }

    const missingPrerequisites = target.prerequisites.filter(
      (skill) => !data.currentSkills.includes(skill)
    );

    return {
      found: true,
      targetSkill: data.targetSkill,
      missingPrerequisites,
      recommendedPath: [...missingPrerequisites, data.targetSkill],
      relatedSkills: target.related_skills
    };
  }
}
