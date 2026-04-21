// src/types/integracoes.ts
export type IntegrationCategory = 'AI' | 'PAYMENT' | 'ANALYTICS' | 'COMMUNICATION';
export type SubCategory = 'FREE' | 'HYBRID' | 'PREMIUM';

export interface IntegrationProviderConfig {
  id: string;
  tenantId: string;
  nomeProvedor: string;
  categoria: IntegrationCategory;
  subCategoria: SubCategory;
  ambiente: 'sandbox' | 'producao';
  status: 'ativo' | 'inativo' | 'standby';
  prioridade: number;
  fallbackPara?: string;
  chavePublicaMasked?: string;
  criadoPor: string;
  createdAt: any;
  updatedAt?: any;
  updatedBy?: string;
}
