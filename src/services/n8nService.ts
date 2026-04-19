/**
 * Serviço responsável por despachar eventos para o orquestrador n8n.
 */
export async function dispatchEvent(eventName: string, payload: any) {
  const webhookUrl = '/api/webhook/n8n'; // Rota proxy que criamos no server.ts
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        payload,
        timestamp: new Date().toISOString(),
        eventId: crypto.randomUUID(),
      }),
    });
    
    if (!response.ok) {
      throw new Error(`n8n event failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error dispatching ${eventName} to n8n:`, error);
    // Não bloqueamos a UI caso o n8n falhe, apenas logamos o erro.
    return null;
  }
}
