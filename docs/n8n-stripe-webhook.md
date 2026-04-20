## Fluxo n8n: Stripe Billing Webhook

### Objetivo
Ativar o acesso do tenant após a confirmação do pagamento.

### 1. Gatilho (Webhook)
- **POST** `/webhook/stripe`
- **Configuração:** O Stripe envia o `checkout.session.completed`.

### 2. Fluxo de nós no n8n
1.  **Webhook Node**: Recebe o evento do Stripe.
2.  **Filter Node**: Confirma que o `event.type` é `checkout.session.completed`.
3.  **Set Node**: Extrai o `tenantId` (que você passou no `client_reference_id` do Stripe) e o `customer_email`.
4.  **Firestore Node (Update)**: 
    -   Busca o documento em `tenants/{tenantId}`.
    -   Atualiza:
        ```json
        {
          "status": "active",
          "billingCycle": "monthly",
          "activatedAt": "current_timestamp",
          "stripeCustomerId": "cus_..."
        }
        ```
5.  **Webhook (Return)**: Retorna `200 OK` para o Stripe.
