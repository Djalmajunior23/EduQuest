import { EduJarvisAgent, EduJarvisOrchestrator } from "../core/orchestrator";

export interface PedagogicalRequest {
  objective: string;
  targetAudience: string;
  constraints?: string[];
}

export class PedagogicalAgent {
  private orchestrator: EduJarvisOrchestrator;

  constructor(orchestrator: EduJarvisOrchestrator) {
    this.orchestrator = orchestrator;
  }

  async plan(request: PedagogicalRequest) {
    return await this.orchestrator.run({
      agent: EduJarvisAgent.PEDAGOGICAL,
      context: {
        objective: request.objective,
        audience: request.targetAudience,
        constraints: (request.constraints || []).join(', ')
      }
    });
  }
}
