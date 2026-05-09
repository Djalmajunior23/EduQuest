export interface ChatContext {
  userId: string;
  tenantId: string;
  courseId?: string;
  history: { role: 'user' | 'model'; content: string }[];
  metadata: Record<string, any>;
}

export class EduJarvisMemory {
  private static instance: EduJarvisMemory;
  private sessions: Map<string, ChatContext> = new Map();

  private constructor() {}

  public static getInstance(): EduJarvisMemory {
    if (!EduJarvisMemory.instance) {
      EduJarvisMemory.instance = new EduJarvisMemory();
    }
    return EduJarvisMemory.instance;
  }

  public getSession(sessionId: string): ChatContext | undefined {
    return this.sessions.get(sessionId);
  }

  public updateSession(sessionId: string, update: Partial<ChatContext>) {
    const current = this.sessions.get(sessionId) || {
      userId: '',
      tenantId: '',
      history: [],
      metadata: {}
    };
    this.sessions.set(sessionId, { ...current, ...update });
  }

  public clearSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}
