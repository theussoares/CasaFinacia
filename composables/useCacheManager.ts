/**
 * Composable para gerenciar cache da aplicação
 * **PERF-01**: Sistema centralizado de cache management
 */
export const useCacheManager = () => {
  // **PERF-02**: Limpar cache específico do usuário
  const clearUserCache = () => {
    if (process.server) return;
    
    try {
      // Cache eterno
      localStorage.removeItem('user-data-eternal');
      localStorage.removeItem('user-auth-eternal');
      localStorage.removeItem('user-cache-timestamp');
      
      // Cache de sessão
      sessionStorage.removeItem('session-cache');
      sessionStorage.removeItem('session-cache-timestamp');
      
      console.log('🧹 Cache do usuário limpo');
    } catch (e) {
      console.warn('⚠️ Erro ao limpar cache do usuário:', e);
    }
  };

  // **PERF-03**: Limpar cache de dados da aplicação
  const clearAppDataCache = () => {
    if (process.server) return;
    
    try {
      // Cache de wedding data
      sessionStorage.removeItem('wedding-data-cache');
      sessionStorage.removeItem('wedding-cache-timestamp');
      
      // Cache de household
      sessionStorage.removeItem('household-users-cache');
      sessionStorage.removeItem('household-cache-timestamp');
      
      console.log('🧹 Cache de dados da app limpo');
    } catch (e) {
      console.warn('⚠️ Erro ao limpar cache da app:', e);
    }
  };

  // **PERF-04**: Limpar todo o cache
  const clearAllCache = () => {
    clearUserCache();
    clearAppDataCache();
    
    // Limpa outros caches que começam com padrões conhecidos
    if (!process.server) {
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('cache-') || key.startsWith('user-') || key.startsWith('app-')) {
            localStorage.removeItem(key);
          }
        });
        
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('cache-') || key.startsWith('user-') || key.startsWith('app-')) {
            sessionStorage.removeItem(key);
          }
        });
        
        console.log('🧹 Todo cache limpo');
      } catch (e) {
        console.warn('⚠️ Erro ao limpar cache completo:', e);
      }
    }
  };

  // **PERF-05**: Verificar se cache do usuário é válido
  const isUserCacheValid = () => {
    if (process.server) return false;
    
    try {
      const userData = localStorage.getItem('user-data-eternal');
      const timestamp = localStorage.getItem('user-cache-timestamp');
      
      if (!userData || !timestamp) return false;
      
      const user = JSON.parse(userData);
      const cacheTime = parseInt(timestamp);
      const now = Date.now();
      
      // Cache válido se:
      // 1. Tem dados completos (incluindo photoURL)
      // 2. Não é muito antigo (menos de 12h)
      return user && 
             user.uid && 
             user.photoURL && 
             (now - cacheTime < 12 * 60 * 60 * 1000);
    } catch {
      return false;
    }
  };

  // **PERF-06**: Debug - mostrar status do cache
  const debugCacheStatus = () => {
    if (process.server) return;
    
    console.group('🔍 Status do Cache');
    console.log('User Cache Valid:', isUserCacheValid());
    console.log('LocalStorage keys:', Object.keys(localStorage).filter(k => k.includes('user') || k.includes('cache')));
    console.log('SessionStorage keys:', Object.keys(sessionStorage).filter(k => k.includes('cache')));
    
    try {
      const userData = localStorage.getItem('user-data-eternal');
      if (userData) {
        const user = JSON.parse(userData);
        console.log('Cached User:', {
          uid: user.uid,
          name: user.name,
          photoURL: user.photoURL ? 'PRESENTE' : 'AUSENTE'
        });
      }
    } catch (e) {
      console.log('Erro ao ler dados do usuário:', e);
    }
    
    console.groupEnd();
  };

  return {
    clearUserCache,
    clearAppDataCache,
    clearAllCache,
    isUserCacheValid,
    debugCacheStatus
  };
};
