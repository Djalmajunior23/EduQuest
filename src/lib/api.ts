import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("eduquest_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Supabase-style Shim
const shim = (table: string) => {
  let queryParams: any = {};
  let method = 'GET';
  let body: any = null;
  let id: string | null = null;

  const builder = {
    select: (columns: string = '*') => {
      method = 'GET';
      return builder;
    },
    eq: (column: string, value: any) => {
      if (column === 'id') id = value;
      else queryParams[column] = value;
      return builder;
    },
    insert: (data: any) => {
      method = 'POST';
      body = data;
      return builder;
    },
    update: (data: any) => {
      method = 'PUT';
      body = data;
      return builder;
    },
    delete: () => {
      method = 'DELETE';
      return builder;
    },
    maybeSingle: () => builder,
    single: () => builder,
    order: () => builder,
    limit: () => builder,
    in: () => builder,
    contains: () => builder,
    
    // Terminal execution
    then: async (onfulfilled?: any, onrejected?: any) => {
      try {
        let url = `/api/${table}`;
        if (id && (method === 'PUT' || method === 'DELETE' || method === 'GET')) {
           url = `/api/${table}/${id}`;
        }

        const response = await axiosInstance({
          method,
          url,
          params: queryParams,
          data: body
        });
        
        const result = { data: response.data, error: null };
        return onfulfilled ? onfulfilled(result) : result;
      } catch (error: any) {
        const result = { data: null, error: error.response?.data || error.message };
        return onrejected ? onrejected(result) : result;
      }
    }
  };

  return builder;
};

// Extend axios with .from
export const api: any = axiosInstance;
api.from = shim;
// Also export channel/removeChannel for real-time compatibility (stubs)
api.channel = () => ({ on: () => ({ subscribe: () => ({}) }) });
api.removeChannel = () => {};
