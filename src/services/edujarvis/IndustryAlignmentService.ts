// src/services/edujarvis/IndustryAlignmentService.ts

export class IndustryAlignmentService {
  public static calculate(data: {
    curriculumSkills: string[];
    marketSkills: string[];
  }) {
    const matched = data.curriculumSkills.filter((skill) =>
      data.marketSkills.includes(skill)
    );

    const missing = data.marketSkills.filter(
      (skill) => !data.curriculumSkills.includes(skill)
    );

    return {
      alignmentScore:
        data.marketSkills.length === 0
          ? 0
          : Math.round((matched.length / data.marketSkills.length) * 100),
      matchedSkills: matched,
      missingMarketSkills: missing,
      recommendation:
        missing.length > 0
          ? "Atualizar currículo ou atividades práticas para cobrir lacunas do mercado."
          : "Currículo bem alinhado às habilidades de mercado informadas."
    };
  }
}
