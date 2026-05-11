import { api } from "@/lib/api";

export const userService = {
  async listarUsuarios(params = {}) {
    try {
      const response = await api.get("/usuarios", { params });
      return response.data;
    } catch (error) {
      console.error("Error listing users:", error);
      return { 
        success: false, 
        data: [], 
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } 
      };
    }
  },

  async criarUsuario(data: any) {
    try {
      const response = await api.post("/usuarios", data);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async atualizarUsuario(id: string, data: any) {
    try {
      const response = await api.patch(`/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async excluirUsuario(id: string) {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async importarUsuarios(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post("/usuarios/importar", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error("Error importing users:", error);
      throw error;
    }
  }
};

export async function listarUsuarios(params = {}) {
  return userService.listarUsuarios(params);
}
