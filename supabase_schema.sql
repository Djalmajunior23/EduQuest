-- Esquema de Banco de Dados EduQuest (Supabase/PostgreSQL)

CREATE SCHEMA IF NOT EXISTS eduquest;

-- Configurações Institucionais
CREATE TABLE IF NOT EXISTS configuracoes_institucionais (
    id TEXT PRIMARY KEY, -- 'global', 'saas', etc.
    nome_instituicao TEXT,
    logo_url TEXT,
    ia_rules JSONB,
    planos_liberados TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID
);

-- Usuários e Perfis
CREATE TABLE IF NOT EXISTS usuarios (
    uid UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE,
    nome TEXT,
    perfil TEXT, -- 'ALUNO', 'PROFESSOR', 'ADMIN', 'COORDENADOR'
    tenant_id TEXT,
    turma_id TEXT,
    plano TEXT DEFAULT 'free',
    plano_expiracao TIMESTAMP WITH TIME ZONE,
    xp INTEGER DEFAULT 0,
    ai_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cursos (Grade Matricial)
CREATE TABLE IF NOT EXISTS cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    tenant_id TEXT,
    status TEXT DEFAULT 'ATIVO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unidades Curriculares (UCs / Disciplinas)
CREATE TABLE IF NOT EXISTS unidades_curriculares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    carga_horaria INTEGER DEFAULT 0,
    curso_id UUID REFERENCES cursos(id),
    tenant_id TEXT,
    status TEXT DEFAULT 'ATIVO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Capacidades Técnicas (Conhecimentos práticos / Habilidades)
CREATE TABLE IF NOT EXISTS capacidades_tecnicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    nivel TEXT DEFAULT 'INTERMEDIARIO',
    unidade_curricular_id UUID REFERENCES unidades_curriculares(id),
    tenant_id TEXT,
    status TEXT DEFAULT 'ATIVO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turmas
CREATE TABLE IF NOT EXISTS turmas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    codigo TEXT UNIQUE,
    tenant_id TEXT,
    professor_id UUID REFERENCES usuarios(uid),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atividades
CREATE TABLE IF NOT EXISTS atividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT, -- 'code', 'database', 'discursive', etc.
    professor_id UUID REFERENCES usuarios(uid),
    turma_id UUID REFERENCES turmas(id),
    configuracoes JSONB,
    prazo TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissões/Respostas
CREATE TABLE IF NOT EXISTS submissoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atividade_id UUID REFERENCES atividades(id),
    aluno_id UUID REFERENCES usuarios(uid),
    resposta TEXT,
    codigo TEXT,
    status TEXT DEFAULT 'pendente',
    nota DECIMAL(5,2),
    feedback_ia TEXT,
    feedback_professor TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamificação: Missões
CREATE TABLE IF NOT EXISTS missoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT, -- 'daily', 'achievement', 'adaptive'
    xp INTEGER DEFAULT 0,
    ai_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamificação: Progresso
CREATE TABLE IF NOT EXISTS progresso_missoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID REFERENCES usuarios(uid),
    missao_id UUID REFERENCES missoes(id),
    status TEXT DEFAULT 'em_progresso',
    progresso INTEGER DEFAULT 0,
    concluido_em TIMESTAMP WITH TIME ZONE,
    UNIQUE(aluno_id, missao_id)
);

-- Perfil Adaptativo (Motor de IA)
CREATE TABLE IF NOT EXISTS perfis_aluno (
    uid UUID PRIMARY KEY REFERENCES usuarios(uid),
    classificacao_atual TEXT,
    taxa_acerto_geral DECIMAL(5,2),
    pontos_fortes TEXT[],
    pontos_fracos TEXT[],
    xp_motor INTEGER DEFAULT 0,
    config_ia JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planos de Estudo
CREATE TABLE IF NOT EXISTS planos_estudo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES usuarios(uid),
    semana INTEGER,
    foco_principal TEXT,
    tarefas_recomendadas JSONB,
    status TEXT DEFAULT 'ATIVO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
