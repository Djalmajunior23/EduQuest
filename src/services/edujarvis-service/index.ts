import { EduJarvisOrchestrator, EduJarvisAgent } from "./core/orchestrator";
import { TutorAgent } from "./agents/TutorAgent";
import { CorrectionAgent } from "./agents/CorrectionAgent";
import { PedagogicalAgent } from "./agents/PedagogicalAgent";
import { EduJarvisMemory } from "./memory";

export class EduJarvisService {
  private static instance: EduJarvisService;
  public orchestrator: EduJarvisOrchestrator;
  public tutor: TutorAgent;
  public correction: CorrectionAgent;
  public pedagogical: PedagogicalAgent;
  public memory: EduJarvisMemory;

  private constructor(apiKey: string) {
    this.orchestrator = new EduJarvisOrchestrator(apiKey);
    this.tutor = new TutorAgent(this.orchestrator);
    this.correction = new CorrectionAgent(this.orchestrator);
    this.pedagogical = new PedagogicalAgent(this.orchestrator);
    this.memory = EduJarvisMemory.getInstance();
  }

  public static getInstance(): EduJarvisService {
    if (!EduJarvisService.instance) {
      const apiKey = process.env.GEMINI_API_KEY || '';
      EduJarvisService.instance = new EduJarvisService(apiKey);
    }
    return EduJarvisService.instance;
  }

  public static async sendMessage(text: string, profile: any, context: any = {}) {
    const service = EduJarvisService.getInstance();
    
    // Neural Intent Identification & Routing
    let agentType = EduJarvisAgent.TUTOR;
    
    if (profile?.perfil === 'PROFESSOR' || profile?.perfil === 'ADMIN' || profile?.perfil === 'COORDENADOR') {
      agentType = EduJarvisAgent.PEDAGOGICAL;
    }

    if (text.toLowerCase().includes('corrija') || text.toLowerCase().includes('avalie')) {
      agentType = EduJarvisAgent.CORRECTION;
    }

    const response = await service.orchestrator.run({
      agent: agentType,
      context: {
        ...context,
        query: text,
        userName: profile?.nome,
        course: context.course || 'Tecnologia',
        uc: context.uc || 'Geral',
        userRole: profile?.perfil
      }
    });

    return {
      role: 'ASSISTANT',
      content: response,
      timestamp: new Date().toISOString(),
      agent: agentType
    };
  }
}
