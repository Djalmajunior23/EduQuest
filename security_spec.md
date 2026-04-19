# Security Specification - Plataforma Educacional Inteligente SENAI

## Data Invariants
1. **User Identity**: A user can only modify their own profile, except for ADMINs.
2. **Access Control**: Students can only read their own scores and assigned activities. Professors can only read/write data for their assigned classes.
3. **Immutability**: Fields like `createdAt` and `createdBy` must never change after creation.
4. **Relational Integrity**: A question or activity must reference a valid Curricular Unit (UC).
5. **IA Token Guard**: Only the system (n8n or backend) can update `saldoTokensIA`. Users cannot self-allocate tokens.
6. **Gamification Integrity**: Users cannot manually increase their XP or level.

## The Dirty Dozen (Attack Payloads)

| Payload ID | Target Path | Action | Content | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| A1 | `usuarios/{userId}` | Update | `{"perfil": "ADMIN"}` | PERMISSION_DENIED |
| A2 | `usuarios/{userId}` | Update | `{"saldoTokensIA": 1000}` | PERMISSION_DENIED |
| A3 | `questoes/{qId}` | Create | `{"createdBy": "attack_uid"}` | PERMISSION_DENIED (Must be PROFESSOR) |
| A4 | `ranking/{rankId}` | Update | `{"points": 99999}` | PERMISSION_DENIED |
| A5 | `usuarios/{otherId}` | Read | `{}` | PERMISSION_DENIED (unless ADMIN/PROF for own class) |
| A6 | `questoes/{qId}` | Delete | `{}` | PERMISSION_DENIED (Must be original PROF or ADMIN) |
| A7 | `configuracoes/global` | Update | `{"freeTokens": 1000}` | PERMISSION_DENIED (Must be ADMIN) |
| A8 | `respostas/{resId}` | Create | `{"correct": true}` | PERMISSION_DENIED (Must match real system evaluation) |
| A9 | `situacoes_aprendizagem/{saId}`| Update | `{"status": "PUBLISHED"}` | PERMISSION_DENIED (Unless creator PROF) |
| A10 | `notificacoes/{notifId}` | Update | `{"read": true}` | ALLOWED (Owner only) |
| A11 | `tokens_ia/{tokenId}` | Update | `{"balance": 100}` | PERMISSION_DENIED |
| A12 | `logs/{logId}` | Delete | `{}` | PERMISSION_DENIED |
