# Regras de Negócio Implementáveis: Módulo de Gamificação

Este documento define as regras lógicas e matemáticas para o motor de gamificação do **Sistema Interativo de Aprendizagem (IEI)**.

---

## 1. Regras de Pontuação (Moeda de Troca)
Os Pontos são utilizados para resgate de recompensas (tokens IA, cosméticos).

- **Exercício Concluído:** +10 pontos por acerto (máximo 100 por set).
- **Simulado Concluído:** +100 pontos base + 50 pontos por a cada 10% de acerto acima de 60%.
- **Missão Diária:** +150 pontos.
- **Missão Semanal:** +500 pontos.
- **Desafio Adaptativo:** +300 pontos.
- **Bônus de Melhora:** +200 pontos (quando o desempenho atual é 20% superior à média histórica).
- **Consistência Semanal:** +400 pontos (completar 5 dias ativos na mesma semana).
- **Anti-Abuso:** 
  - Limite diário de 2000 pontos por atividades repetitivas.
  - Delay de 30 segundos entre conclusões de exercícios curtos para evitar bots.

---

## 2. Regras de XP e Níveis (Progressão de Carreira)
XP mede o esforço e tempo investido. XP nunca diminui.

- **Atividade Curta (Video/Leitura):** +50 XP.
- **Exercício Prático:** +120 XP.
- **Simulado/Prova:** +300 XP.
- **Acesso Diário:** +20 XP.
- **Subida de Nível:**
  - Fórmula: `XP_Prox_Nivel = 1000 * (Level ^ 1.5)`.
  - Ex: Nível 1 p/ 2 = 1000 XP; Nível 10 p/ 11 ≈ 31,600 XP.
- **Unlocks por Nível:**
  - Nível 5: Desbloqueia Missões Adaptativas.
  - Nível 10: Desbloqueia Boss Challenges.
  - Recompensa de Level Up: +2 Tokens IA + Badge de Nível.

---

## 3. Regras de Streak (Ofício Diário)
- **Dia Ativo:** Concluir pelo menos uma atividade avaliativa (Exercício ou Simulado).
- **Aumento:** Incrementar +1 a cada ciclo de 24h com atividade.
- **Quebra:** Se passar de 36h sem atividade registrada, o contador volta a 0.
- **Bônus de Streak:**
  - 3 dias: Multiplicador de XP x1.1.
  - 7 dias: Multiplicador de XP x1.25 + 500 Pontos.
  - 30 dias: Multiplicador de XP x1.5 + Badge "Inabalável".

---

## 4. Regras de Missões
- **Geração Diária:** 3 missões geradas às 04:00 (1 Fácil, 1 Média, 1 Técnica).
- **Geração Semanal:** 1 missão complexa gerada às segundas (focada em colaboração ou projeto).
- **Missões Adaptativas (IA):**
  - Geradas ao detectar erro em 3 questões seguidas do mesmo tema.
  - Objetivo: Recuperação imediata. Recompensa dobrada se concluída no mesmo dia.

---

## 5. Desafios e Boss Challenge
- **Desafios:** Liberados a cada 25% de progresso em uma Unidade Curricular (UC).
- **Boss Challenge:** 
  - Liberado apenas após concluir 100% dos exercícios da Trilha.
  - Requisito: Nota mínima de 80% em uma avaliação abrangente sob tempo limitado.
  - Recompensa: Badge da Trilha + Frame Especial no Perfil + 1000 XP.

---

## 6. Conquistas e Badges
- **Raridade:**
  - **Bronze (Comum):** Realizar tarefas básicas (ex: completar 1 perfil).
  - **Prata (Raro):** Concluir 5 trilhas.
  - **Ouro (Épico):** Top 1 no Ranking Semanal.
  - **Platina (Lendário):** Concluir Boss Challenge com 100% de acerto.
- **Bônus:** Badges Épicas podem conceder "Tokens Infinitos" por 1 hora.

---

## 7. Ranking Educacional (Arena Saudável)
- **Cálculo por Evolução:** Baseado na diferença entre a nota inicial e final de um módulo.
- **Cálculo por Esforço:** Baseado no total de XP acumulado na semana (Reset semanal aos domingos).
- **Cálculo por Consistência:** Baseado na média de dias ativos por mês.
- **Saúde do Ranking:** Alunos que ultrapassam 50 horas semanais recebem alerta de "Descanso Obrigatório" (bloqueio temporário de ganhos de XP para saúde mental).

---

## 8. Metas Inteligentes
- **Semanais:** "Completar 10 questões de Redes".
- **Por Conhecimento:** "Atingir Domínio 80% em Lógica de Programação".
- **Corretivas:** "Revisar os 5 temas onde houve mais erros na semana".
  - Recompensa: Apaga um "erro" das estatísticas históricas ao acertar na revisão.

---

## 9. Recompensas e Economia
- **Tokens IA:** 100 pontos = 1 Token.
- **Visual:** Cores de nome no chat, frames de avatar, temas de interface.
- **Pedagógico:** "Pular um exercício opcional", "Dica extra da IA em simulado", "Certificado de Mérito Digital".

---

## 10. Feedback e UX Motivacional
- **Momento:** Imediatamente após o acerto/conclusão.
- **Mensagens:** Tom encorajador ("Operação bem sucedida!", "Sistemas otimizados!").
- **Intensidade:** Efeitos visuais de partículas no Level Up; apenas sons discretos em exercícios comuns.
- **Equilíbrio:** Sem notificações entre 22:00 e 07:00 para respeitar o sono do adolescente.

---

## 11. Diretrizes Pedagógicas
1. **Foco no Erro:** O sistema premia mais a "Recuperação após o erro" do que o acerto de primeira sem esforço.
2. **Autonomia:** O aluno escolhe quais missões quer "equipar" para o dia.
3. **Anti-Toxicidade:** Ranking exibe apenas os top 10 e a posição ao redor do aluno (ex: você e os 2 acima/abaixo), evitando exposição de notas baixas.
