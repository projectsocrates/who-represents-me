// defined in server.tsx

const config =
  typeof window !== 'undefined' ? (window as any).__CONFIG__ : process.env;

export const GOOGLE_API_KEY = config.GOOGLE_API_KEY;
