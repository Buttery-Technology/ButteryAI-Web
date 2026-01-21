export type ApiVersion = 'server' | 'firebase';

export const getApiVersion = (): ApiVersion => {
  // Runtime override from localStorage
  const override = localStorage.getItem('apiVersion');
  if (override === 'firebase' || override === 'server') {
    return override;
  }
  // Fall back to build-time env var
  return import.meta.env.VITE_USE_FIREBASE === 'true' ? 'firebase' : 'server';
};
