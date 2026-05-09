import { EduJarvisAgent, EduJarvisOrchestrator } from "../core/orchestrator";

export interface TutorRequest {
  query: string;
  course: string;
  uc: string;
  history: any[];
}

export class TutorAgent {
  private orchestrator: EduJarvisOrchestrator;

  constructor(orchestrator: EduJarvisOrchestrator) {
    this.orchestrator = orchestrator;
  }

  async chat(request: TutorRequest) {
    return await this.orchestrator.run({
      agent: EduJarvisAgent.TUTOR,
      context: {
        query: request.query,
        course: request.course,
        uc: request.uc
      },
      history: request.history
    });
  }
}
