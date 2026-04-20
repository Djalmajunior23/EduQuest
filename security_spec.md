# Security Spec for NEXUSINTAI Firestore

## Data Invariants
1. A resource (Curso, Turma, Questão, SA) must have a `tenantId`.
2. A user must have a `tenantId`.
3. A user can only access resources where `resource.data.tenantId == request.auth.token.tenantId` (or the `tenantId` fetched from `usuarios`).

## The "Dirty Dozen" Payloads (Insecure Current State)
- Accessing `/cursos/{id}`: Any authenticated user can read any course from ANY school. (LEAK)
- Accessing `/questoes/{id}`: Any professor can read questions from ANY other school. (LEAK)
- Updating `/usuarios/{id}`: A user can change their own `perfil` to 'ADMIN'. (PRIVILEGE ESCALATION)
- Creating `/turmas/{id}`: Anyone can create a turma with a random `tenantId` that isn't their own. (DATA POISONING)
- Listing `/questoes` without `tenantId` filter: Client can scrape all questions. (DENIAL OF WALLET/DATA LEAK)

## The Plan
- Force `tenantId` checking on EVERY operation.
- Remove broad `isSignedIn()` OR `isAdmin()` rules without tenant checks.
- Pre-fetch the user's `tenantId` into `request.auth.token` OR fetch it via `get()` efficiently. Since `getUserData()` is already fetching once, I will rely on that.
