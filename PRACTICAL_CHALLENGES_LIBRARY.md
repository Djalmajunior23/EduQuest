# ⚔️ NEXUS: BIBLIOTECA DE DESAFIOS PRÁTICOS

Este documento detalha o framework de **Micro-Desafios Técnicos**, projetados para reforçar a aprendizagem prática e a resiliência dos alunos em cada trilha pedagógica.

---

## 1. CATEGORIAS DE DESAFIOS

Os desafios são divididos em 4 pilares técnicos:
- **DEBUG (DB):** Foco em encontrar e corrigir erros de sintaxe ou lógica.
- **BUILD (BL):** Foco em criar componentes, scripts ou estruturas do zero.
- **HARDEN (HD):** Foco em segurança e proteção de sistemas/códigos existentes.
- **OPTIMIZE (OP):** Foco em performance e melhores práticas (Clean Code, Refatoração).

---

## 2. MATRIZ DE DIFICULDADE E RECOMPENSA

| Nível | Cor | XP Base | Tokens IA | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **INICIANTE** | Bronze | 300 - 450 | 5 - 10 | Problemas isolados, foco em sintaxe e conceitos básicos. |
| **INTERMEDIÁRIO** | Prata | 600 - 900 | 15 - 20 | Problemas que exigem integração de conceitos ou refatoração. |
| **AVANÇADO** | Ouro | 1000 - 1500 | 25 - 40 | Cenários complexos, validação robusta e segurança avançada. |
| **CORRETIVO** | Roxo | 1500+ | 40+ | Desafio de resgate após falha simulada ou reforço necessário. |
| **BÔNUS** | Diamante | 2000+ | 50+ | Desafios "fora da caixa" ou automações de alta complexidade. |

---

## 3. EXEMPLOS POR CURSO (BIBLIOTECA V1)

### 3.1 Desenvolvimento de Sistemas
- **Iniciante:** O Bug do if Perdido (Lógica condicional).
- **Intermediário:** Refatoração de Método Complexo (Clean Code/SRP).
- **Avançado:** Implementação de Autenticação Manual (JWT/Security).

### 3.2 Informática para Internet
- **Iniciante:** Resgate de Layout Quebrado (Flexbox/Grid).
- **Intermediário:** Consumo de API Externa com Tratamento de Erro.
- **Avançado:** Validação de Formulário com RegEx (Full Match).

### 3.3 Técnico em Cibersegurança
- **Iniciante:** Triagem de Log Suspeito (Análise de logs Apache).
- **Intermediário:** Identificação de Ataque SQL Injection (LAB).
- **Corretivo:** Forense de Defacement de Site (Recuperação).

### 3.4 Linux e Cibersegurança
- **Iniciante:** Correção de Permissões Críticas (chmod/chown).
- **Intermediário:** Configuração de Firewall Adaptativo (UFW).
- **Bônus:** Script de Monitoramento e Alerta em Bash.

---

## 4. INTEGRAÇÃO COM IA E MISSÕES ADAPTATIVAS

O **Motor de IA Nexus** utiliza esta biblioteca para:
1. **Recuperação de Competência:** Se o aluno falha em um simulado de "Linux", a IA dispara automaticamente um `DESAFIO_CORRETIVO` da categoria Linux.
2. **Nivelamento:** Se o aluno termina a fase de "Lógica" muito rápido, a IA desbloqueia um `DESAFIO_BONUS` de algoritmo avançado.
3. **Feedback Dinâmico:** Cada desafio submetido é analisado para gerar feedbacks técnicos precisos, não apenas "Correto/Incorreto".
