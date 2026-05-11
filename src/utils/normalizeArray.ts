/**
 * Utilitário de normalização de arrays para evitar erros de .map()
 * Garante que sempre teremos um array, mesmo que a API falhe ou retorne objetos aninhados.
 */
export function normalizeArray<T = any>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (value && typeof value === "object") {
    const obj = value as any;

    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.results)) return obj.results;
    if (Array.isArray(obj.users)) return obj.users;
    if (Array.isArray(obj.usuarios)) return obj.usuarios;
    if (Array.isArray(obj.plans)) return obj.plans;
    if (Array.isArray(obj.questions)) return obj.questions;
    if (Array.isArray(obj.simulados)) return obj.simulados;
    if (Array.isArray(obj.notifications)) return obj.notifications;
    if (Array.isArray(obj.data?.items)) return obj.data.items;
    if (Array.isArray(obj.data?.users)) return obj.data.users;
  }

  return [];
}
