// src/types/payment.ts
export interface PaymentProviderConfig {
  id: string;
  tenantId: string;
  nomeProvedor: string;
  tipoProvedor: 'stripe' | 'mercadopago';
  ambiente: 'sandbox' | 'producao';
  status: 'ativo' | 'inativo' | 'standby';
  chavePublicaMasked?: string;
  criadoPor: string;
  createdAt: any;
  updatedAt?: any;
  updatedBy?: string;
}
