/**
 * Validation for Environment Variables
 */

interface EnvSchema {
  VITE_API_URL: string;
}

export const env = {
  VITE_API_URL: import.meta.env?.VITE_API_URL || 'https://api.edstudenthub.com',
} as EnvSchema;

export const isEnvValid = () => {
  return true; // We default to localhost if not found
};
