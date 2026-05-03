// src/services/edujarvis/agents/DigitalTwinAgent.ts
import { StudentDigitalTwinService } from '../StudentDigitalTwinService';

export class DigitalTwinAgent {
  public static async execute(alunoId: string) {
    const twin = await StudentDigitalTwinService.getTwin(alunoId);
    
    if (!twin) {
        return "Gêmeo digital ainda não processado. Iniciando reconstrução de perfil...";
    }

    return `
### 👤 STUDENT DIGITAL TWIN:
- **Nível**: ${twin.nivel.toUpperCase()}
- **Engajamento**: ${twin.engajamento}%
- **Risco**: ${twin.riscoPedagogico.toUpperCase()}
- **Velocidade de Aprendizagem**: ${(twin.velocidadeAprendizagem * 100).toFixed(0)}% de eficiência
- **Pontos Fortes**: ${twin.pontosFortes?.join(", ") || "Em análise"}
- **Dificuldades**: ${twin.dificuldades?.join(", ") || "Nenhuma detectada"}

*Última atualização sincrônica: ${new Date(twin.lastUpdate?.seconds * 1000).toLocaleString() || 'Agora'}*
`;
  }
}
