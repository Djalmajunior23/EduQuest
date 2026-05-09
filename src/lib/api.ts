import axios from "axios";
import { reportGlobalError } from "./ErrorContext";

const axiosInstance = axios.create({
  baseURL: "/",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthMe = error.config?.url?.includes('/api/auth/me');
    
    // Captura erros de rede e falhas críticas de sistema
    if (error.code === 'ERR_NETWORK' || !error.response) {
      reportGlobalError("O servidor parece estar indisponível no momento. Por favor, verifique sua conexão e tente novamente.");
    } else if (error.response.status >= 500) {
      reportGlobalError("Ocorreu um erro interno no servidor ao processar sua solicitação.");
    } else if (isAuthMe && error.response.status !== 401) {
      // Se falhar o /me por outro motivo que não seja não estar logado
      reportGlobalError("Não foi possível validar sua sessão. Por favor, tente recarregar a página.");
    }
    
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("eduquest_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Padronização do retorno para o frontend: { data: T, error: string | null }
async function requestWrap<T = any>(promise: Promise<any>): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await promise;
    // O backend agora retorna { success: true, data: ... }
    if (response.data && response.data.success !== undefined) {
       return { data: response.data.data as T, error: null };
    }
    return { data: response.data as T, error: null };
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
    return { data: null, error: errorMsg };
  }
}

export const api = {
  get: <T = any>(url: string, config?: any) => requestWrap<T>(axiosInstance.get(url, config)),
  post: <T = any>(url: string, data?: any, config?: any) => requestWrap<T>(axiosInstance.post(url, data, config)),
  put: <T = any>(url: string, data?: any, config?: any) => requestWrap<T>(axiosInstance.put(url, data, config)),
  delete: <T = any>(url: string, config?: any) => requestWrap<T>(axiosInstance.delete(url, config)),
  from: (table: string) => {
    const builder: any = {
      _table: table,
      _method: 'GET',
      _filters: {} as any,
      _data: null as any,
      _single: false,
      _order: null as any,
      _limit: null as any,
      _columns: '*' as any,
      _options: null as any,

      select(columns: string = '*', options?: any) {
        this._method = 'GET';
        this._columns = columns;
        this._options = options;
        return this;
      },
      insert(data: any, options?: any) {
        this._method = 'POST';
        this._data = data;
        this._options = options;
        return this;
      },
      update(data: any, options?: any) {
        this._method = 'PUT';
        this._data = data;
        this._options = options;
        return this;
      },
      delete(filters?: any, options?: any) {
        this._method = 'DELETE';
        this._options = options;
        return this;
      },
      upsert(data: any, options?: any) {
        this._method = 'POST';
        this._data = data;
        this._options = options;
        return this;
      },
      eq(col: string, val: any) {
        this._filters[col] = val;
        return this;
      },
      in(col: string, vals: any[]) {
        this._filters[col] = vals;
        return this;
      },
      contains(col: string, val: any) {
        this._filters[col] = val;
        return this;
      },
      order(col: string, opts?: any) {
        this._order = { col, opts };
        return this;
      },
      limit(n: number) {
        this._limit = n;
        return this;
      },
      single() {
        this._single = true;
        return this;
      },
      maybeSingle() {
        this._single = true;
        return this;
      },
      channel(name: string) {
        return {
          on: (event: string, filter: any, callback: any) => ({ 
            subscribe: () => ({}) 
          }),
          subscribe: () => ({})
        };
      },
      removeChannel(channel: any) {
        return {};
      },
      async then(onfulfilled?: any, onrejected?: any) {
        let url = `/api/${this._table}`;
        
        // Se temos um filtro de ID simples (comum em updates/gets únicos)
        const id = this._filters.id || this._filters.uid || this._filters.aluno_id || this._filters.user_id;
        
        if (id && this._method !== 'POST') {
          url += `/${id}`;
        }

        let promise;
        if (this._method === 'GET') {
          promise = axiosInstance.get(url, { params: { ...this._filters, _limit: this._limit, _order: this._order?.col, _columns: this._columns } });
        } else if (this._method === 'POST') {
          promise = axiosInstance.post(url, this._data);
        } else if (this._method === 'PUT') {
          promise = axiosInstance.put(url, this._data);
        } else if (this._method === 'DELETE') {
          promise = axiosInstance.delete(url);
        }

        return requestWrap(promise!).then(onfulfilled, onrejected);
      }
    };
    return builder;
  },
  rpc: (name: string, params?: any) => requestWrap(axiosInstance.post(`/api/rpc/${name}`, params)),
  functions: {
    invoke: (name: string, opts?: any) => requestWrap(axiosInstance.post(`/api/functions/${name}`, opts?.body))
  },
  channel: (name: string) => ({
    on: (event: string, filter: any, callback: any) => ({ 
      subscribe: () => ({}) 
    }),
    subscribe: () => ({})
  }),
  removeChannel: (channel: any) => ({})
};

// Compatibility exports for legacy code that hasn't been refactored yet
export const db = {};
export const collection = (db: any, name: string) => name;
export const doc = (db: any, coll: string, id: string) => ({ coll, id });
export const query = (q: any, ...args: any[]) => q;
export const where = (...args: any[]) => ({});
export const orderBy = (...args: any[]) => ({});
export const limit = (...args: any[]) => ({});
export const serverTimestamp = () => new Date().toISOString();
export const increment = (v: number) => v;

export const addDoc = async (coll: any, data: any) => {
  const table = typeof coll === 'string' ? coll : (coll?._table || 'logs_ai');
  return api.post(`/api/${table}`, data);
};

export const setDoc = async (ref: any, data: any, options?: any) => {
  const table = typeof ref === 'string' ? ref : (ref.coll || 'logs_ai');
  const id = typeof ref === 'object' ? ref.id : null;
  if (id) {
    return api.put(`/api/${table}/${id}`, data);
  }
  return api.post(`/api/${table}`, data);
};

export const updateDoc = async (ref: any, data: any) => {
  const table = typeof ref === 'string' ? ref : (ref.coll || 'logs_ai');
  const id = typeof ref === 'object' ? ref.id : null;
  if (id) {
    return api.put(`/api/${table}/${id}`, data);
  }
  return api.post(`/api/${table}`, data);
};

export const getDoc = async (ref: any) => {
  const table = typeof ref === 'string' ? ref : (ref.coll || 'logs_ai');
  const id = typeof ref === 'object' ? ref.id : null;
  const { data, error } = await api.get(`/api/${table}/${id}`);
  return {
    exists: () => !!data,
    data: () => data,
    id: id,
    error
  };
};

export const getDocs = async (coll: any) => {
  const table = typeof coll === 'string' ? coll : 'logs_ai';
  const { data, error } = await api.get(`/api/${table}`);
  const items = Array.isArray(data) ? data : [];
  const docs = items.map((d: any) => ({
    data: () => d,
    id: d.id
  }));
  return {
    docs,
    empty: docs.length === 0,
    error
  };
};
