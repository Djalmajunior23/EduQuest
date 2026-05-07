
import { api } from '../lib/api';

export const profileService = {
  getProfile: async (userId: string) => {
    try {
      const { data } = await api.get(`/api/users/${userId}`);
      return { data, error: null };
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return { data: null, error };
    }
  },

  createProfile: async (user: any) => {
    try {
      const { data } = await api.post('/api/users', user);
      return { data, error: null };
    } catch (error) {
      console.error('Exception creating profile:', error);
      return { data: null, error };
    }
  },

  getOrCreateProfile: async (user: any) => {
    try {
      let { data, error } = await profileService.getProfile(user.id);
      
      if (error) return { data: null, error };
      
      if (!data) {
        const result = await profileService.createProfile(user);
        data = result.data;
        error = result.error;
      }

      return { data, error };
    } catch (error) {
      console.error('Exception in getOrCreateProfile:', error);
      return { data: null, error };
    }
  }
};
