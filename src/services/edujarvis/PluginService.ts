// src/services/edujarvis/PluginService.ts

export interface EduJarvisPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  type: 'content' | 'assessment' | 'governance' | 'integration';
  config?: Record<string, any>;
}

export class PluginService {
  private static plugins: EduJarvisPlugin[] = [
    { 
      id: 'plugin-enem-2026', 
      name: 'Simulados ENEM 2026', 
      version: '1.0.0', 
      description: 'Questões e pesos oficiais calibrados para o ENEM.', 
      enabled: true,
      type: 'assessment'
    },
    { 
      id: 'plugin-cyber-safety', 
      name: 'EduSafe Cyber', 
      version: '2.1.0', 
      description: 'Módulo de proteção contra bullying e conteúdo impróprio avançado.', 
      enabled: true,
      type: 'governance'
    }
  ];

  public static getActivePlugins(): EduJarvisPlugin[] {
    return this.plugins.filter(p => p.enabled);
  }

  public static togglePlugin(id: string, enabled: boolean) {
    const plugin = this.plugins.find(p => p.id === id);
    if (plugin) plugin.enabled = enabled;
  }
}
