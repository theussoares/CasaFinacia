/**
 * Plugin para gerenciar cache persistente
 * **LAYOUT-SHIFT-FIX**: Gerencia cache eterno de forma inteligente
 */
export default defineNuxtPlugin(() => {
  // **PERF-01**: Função para limpar todo cache quando necessário
  const clearAllPersistentCache = () => {
    if (process.server) return;
    
    try {
      // Cache de autenticação
      localStorage.removeItem('user-data-eternal');
      localStorage.removeItem('user-auth-eternal');
      localStorage.removeItem('user-cache-timestamp');
      
      // Cache de dados
      localStorage.removeItem('wedding-data-persistent');
      localStorage.removeItem('wedding-cache-timestamp');
      localStorage.removeItem('household-data-cache');
      localStorage.removeItem('household-cache-timestamp');
      
      console.log('✅ Cache persistente limpo');
    } catch (e) {
      console.warn('Erro ao limpar cache:', e);
    }
  };

  // **PERF-02**: Verifica integridade do cache no startup
  const validateCache = () => {
    if (process.server) return;
    
    try {
      // Se não há auth cache mas há data cache, limpa data cache órfão
      const hasAuthCache = localStorage.getItem('user-auth-eternal') === 'true';
      const hasDataCache = localStorage.getItem('wedding-data-persistent');
      
      if (!hasAuthCache && hasDataCache) {
        console.log('⚠️  Cache órfão detectado, limpando...');
        localStorage.removeItem('wedding-data-persistent');
        localStorage.removeItem('wedding-cache-timestamp');
        localStorage.removeItem('household-data-cache');
        localStorage.removeItem('household-cache-timestamp');
      }
    } catch (e) {
      console.warn('Erro ao validar cache:', e);
    }
  };

  // **PERF-03**: Executa validação no startup
  if (process.client) {
    validateCache();
  }

  // **PERF-04**: Disponibiliza funções globalmente
  return {
    provide: {
      clearPersistentCache: clearAllPersistentCache,
      validateCache
    }
  };
});
