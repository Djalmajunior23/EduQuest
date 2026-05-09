export function normalizeArray<T = any>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (value && typeof value === "object") {
    const obj = value as any;

    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.plans)) return obj.plans;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.results)) return obj.results;
    if (Array.isArray(obj.rows)) return obj.rows;
    if (Array.isArray(obj.records)) return obj.records;
    if (Array.isArray(obj.data?.plans)) return obj.data.plans;
    if (Array.isArray(obj.data?.items)) return obj.data.items;
    if (Array.isArray(obj.data?.results)) return obj.data.results;
  }

  return [];
}
