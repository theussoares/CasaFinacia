/**
 * Composable para cache de dados otimizado
 * **PERF-01**: Sistema de cache simples e eficiente
 */
export const useDataCache = () => {
  // **PERF-02**: Verificar se dados estão em cache válido
  const getCachedData = <T>(key: string, cacheDuration = 2 * 60 * 1000): T | null => {
    if (process.server) return null;
    
    try {
      const cached = sessionStorage.getItem(`cache-${key}`);
      const timestamp = sessionStorage.getItem(`cache-${key}-timestamp`);
      
      if (cached && timestamp) {
        const now = Date.now();
        const cacheTime = parseInt(timestamp);
        
        if (now - cacheTime < cacheDuration) {
          return JSON.parse(cached);
        }
        
        // Cache expirado, remove
        sessionStorage.removeItem(`cache-${key}`);
        sessionStorage.removeItem(`cache-${key}-timestamp`);
      }
    } catch (e) {
      console.warn('Erro ao ler cache:', e);
    }
    
    return null;
  };

  // **PERF-03**: Salvar dados no cache
  const setCachedData = <T>(key: string, data: T): void => {
    if (process.server) return;
    
    try {
      sessionStorage.setItem(`cache-${key}`, JSON.stringify(data));
      sessionStorage.setItem(`cache-${key}-timestamp`, Date.now().toString());
    } catch (e) {
      console.warn('Erro ao salvar cache:', e);
    }
  };

  // **PERF-04**: Invalidar cache específico
  const invalidateCache = (key: string): void => {
    if (process.server) return;
    
    sessionStorage.removeItem(`cache-${key}`);
    sessionStorage.removeItem(`cache-${key}-timestamp`);
  };

  // **PERF-05**: Limpar todo o cache
  const clearAllCache = (): void => {
    if (process.server) return;
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('cache-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  return {
    getCachedData,
    setCachedData,
    invalidateCache,
    clearAllCache
  };
};

/**
 * Composable específico para dados do usuário com cache agressivo
 * **PERF-08**: Cache específico para dados de sessão críticos
 */
export const useSessionCache = () => {
  const CACHE_KEY = 'user-session-cache';
  const CACHE_TIMESTAMP_KEY = 'user-session-timestamp';
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos para dados de sessão

  const getSessionCache = () => {
    if (process.server) return null;
    
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      const timestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const now = Date.now();
        const cacheTime = parseInt(timestamp);
        
        if (now - cacheTime < CACHE_DURATION) {
          return JSON.parse(cached);
        }
      }
    } catch (e) {
      console.warn('Erro ao ler cache de sessão:', e);
    }
    
    return null;
  };

  const setSessionCache = (data: any) => {
    if (process.server) return;
    
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
      sessionStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      console.warn('Erro ao salvar cache de sessão:', e);
    }
  };

  const clearSessionCache = () => {
    if (process.server) return;
    
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem(CACHE_TIMESTAMP_KEY);
  };

  return {
    getSessionCache,
    setSessionCache,
    clearSessionCache
  };
};
