// src/services/n8nService.ts

// Service centralizado para disparar webhooks do N8n (Section 4.3)
export const n8nService = {
  async triggerWorkflow(workflowId: string, payload: any) {
    const WEBHOOK_URL = (import.meta as any).env.VITE_N8N_WEBHOOK_BASE_URL;
    
    if (!WEBHOOK_URL) return;

    try {
      await fetch(`${WEBHOOK_URL}/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Erro ao disparar workflow do N8n", error);
    }
  }
};
