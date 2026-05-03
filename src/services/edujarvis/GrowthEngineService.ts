// src/services/edujarvis/GrowthEngineService.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class GrowthEngineService {
  public static async analyzeGrowth(data: {
    tenantId: string; // the meta-tenant or system admin
    activeTenants: number;
    monthlyActiveUsers: number;
    aiInteractions: number;
    churnRiskTenants: number;
    averageUsagePerTenant: number;
  }) {
    const healthScore = Math.max(
      0,
      Math.min(
        100,
        data.activeTenants * 2 +
          data.monthlyActiveUsers * 0.1 +
          data.averageUsagePerTenant * 0.2 -
          data.churnRiskTenants * 10
      )
    );
    
    const insights = [
      data.churnRiskTenants > 0
        ? "Existem clientes com risco de cancelamento."
        : "Base de clientes estável.",
      data.aiInteractions > 1000
        ? "Alto uso dos recursos de IA. Avaliar monetização por créditos."
        : "Uso de IA ainda pode crescer."
    ];

    const recommendations = [
      "Criar relatório mensal de valor entregue por tenant.",
      "Identificar módulos mais usados para estratégia comercial.",
      "Oferecer upgrade para tenants com alto consumo."
    ];

    const result = {
      healthScore,
      insights,
      recommendations
    };

    await addDoc(collection(db, "saas_growth_metrics"), {
      tenantId: data.tenantId,
      metricsRaw: JSON.stringify(data),
      healthScore: result.healthScore,
      insights: result.insights,
      recommendations: result.recommendations,
      createdAt: serverTimestamp()
    });

    return result;
  }
}
