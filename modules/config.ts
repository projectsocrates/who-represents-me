// defined in server.tsx

const config =
  typeof window !== 'undefined' ? (window as any).__CONFIG__ : process.env;

export const GOOGLE_API_KEY = config.GOOGLE_API_KEY;

export const FORMATTED_ADDRESS_SEARCH_KEY = 'address';

export const REP_LEVEL_SEARCH_KEY = 'level';
