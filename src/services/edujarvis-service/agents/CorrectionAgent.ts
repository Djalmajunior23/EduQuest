import { EduJarvisAgent, EduJarvisOrchestrator } from "../core/orchestrator";

export interface CorrectionRequest {
  studentAnswer: string;
  expectedAnswer: string;
  rubric: string;
  context?: any;
}

export class CorrectionAgent {
  private orchestrator: EduJarvisOrchestrator;

  constructor(orchestrator: EduJarvisOrchestrator) {
    this.orchestrator = orchestrator;
  }

  async correct(request: CorrectionRequest) {
    const result = await this.orchestrator.run({
      agent: EduJarvisAgent.CORRECTION,
      context: {
        answer: request.studentAnswer,
        expectedAnswer: request.expectedAnswer,
        rubric: request.rubric,
        ...request.context
      }
    });

    try {
      // Intent: Ensure JSON response
      return JSON.parse(result);
    } catch (e) {
      console.warn("[CorrectionAgent] Response was not valid JSON, returning raw text.");
      return { feedback: result, raw: true };
    }
  }
}
