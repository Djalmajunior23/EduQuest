# Migração EduQuest: Firebase para Supabase

Este documento descreve a estrutura de tabelas e o guia de migração para o uso do Supabase como banco de dados principal.

## Estrutura de Tabelas (SQL)

Execute este script no Editor SQL do Supabase para criar a estrutura necessária.

```sql
-- 1. Tabela de Usuários (Profiles)
CREATE TABLE IF NOT EXISTS public.usuarios (
    uid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nome TEXT,
    perfil TEXT DEFAULT 'ALUNO', -- ADMIN, PROFESSOR, ALUNO, COORDINATOR
    plano TEXT DEFAULT 'FREE',
    tenant_id TEXT DEFAULT 'nexus_default',
    status TEXT DEFAULT 'ATIVO',
    saldo_tokens_ia INTEGER DEFAULT 50,
    xp INTEGER DEFAULT 0,
    permissoes_granulares TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Realtime para usuários
alter publication supabase_realtime add table usuarios;

-- 2. Escolas / Instituições (Tenants)
CREATE TABLE IF NOT EXISTS public.tenants (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    configuracoes JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Cursos
CREATE TABLE IF NOT EXISTS public.cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT REFERENCES tenants(id),
    nome TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Turmas
CREATE TABLE IF NOT EXISTS public.turmas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID REFERENCES cursos(id),
    professor_id UUID REFERENCES auth.users(id),
    nome TEXT NOT NULL,
    ano_letivo INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Atividades
CREATE TABLE IF NOT EXISTS public.atividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turma_id UUID REFERENCES turmas(id),
    professor_id UUID REFERENCES auth.users(id),
    titulo TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT, -- code, sa, case_study, discursive, practical, sql, free
    max_score NUMERIC,
    status TEXT DEFAULT 'draft',
    test_cases JSONB DEFAULT '[]',
    competencies TEXT[],
    skills TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Submissões
CREATE TABLE IF NOT EXISTS public.submissoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atividade_id UUID REFERENCES atividades(id),
    aluno_id UUID REFERENCES auth.users(id),
    answer_text TEXT,
    code_answer TEXT,
    programming_language TEXT,
    ai_score NUMERIC,
    ai_feedback TEXT,
    teacher_feedback TEXT,
    status TEXT DEFAULT 'pending', -- pending, corrected
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) Básico
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON usuarios FOR SELECT USING (auth.uid() = uid);
CREATE POLICY "Users can update their own profile" ON usuarios FOR UPDATE USING (auth.uid() = uid);

-- Adicione políticas adicionais conforme necessário para admins e professores
```

## Checklist de Testes

1. [ ] Login com Google está redirecionando corretamente?
2. [ ] Perfil de usuário é criado automaticamente no primeiro login?
3. [ ] Atualizações no perfil são refletidas em tempo real?
4. [ ] Listagem de atividades filtra corretamente por usuário/turma?
5. [ ] Submissões estão sendo salvas com o `auth.uid()` correto?
6. [ ] Transição de Firestore para Tabelas Supabase em todos os serviços.

## Variáveis de Ambiente Necessárias

Certifique-se de configurar no seu `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
