// stores/wedding.ts (Refactored)
type Safe = {
    id: string;
    name: string;
    goal: number;
    current: number;
};

type WeddingState = {
    safes: Safe[];
    weddingDate: string | null;
    loading: boolean;
    error: string | null;
};

export const useWeddingStore = defineStore('wedding', {
    state: (): WeddingState => ({
        safes: [],
        weddingDate: null,
        loading: false,
        error: null,
    }),

    getters: {
        totalGoal: (state): number => state.safes.reduce((sum, safe) => sum + safe.goal, 0),
        totalSaved: (state): number => state.safes.reduce((sum, safe) => sum + safe.current, 0),

        monthsLeft: (state): number => {
            if (!state.weddingDate) return 0;

            const today = new Date();
            const weddingDate = new Date(state.weddingDate + 'T00:00:00');

            if (weddingDate <= today) return 0;

            let months = (weddingDate.getFullYear() - today.getFullYear()) * 12;
            months -= today.getMonth();
            months += weddingDate.getMonth();

            if (weddingDate.getDate() < today.getDate()) {
                months--;
            }

            return months <= 0 ? 0 : months;
        },

        // ✅ REFACTORED: No longer uses `(this as any)`. It now uses other getters,
        // which Pinia makes available on `this` with correct typing.
        monthlySaving(state): number {
            const remainingAmount = this.totalGoal - this.totalSaved;
            if (remainingAmount <= 0 || this.monthsLeft <= 0) {
                return 0;
            }
            return remainingAmount / this.monthsLeft;
        },
    },

    actions: {
        // **LAYOUT-SHIFT-FIX**: Cache persistente com localStorage
        getCachedData() {
            if (process.server) return null;
            
            try {
                const cached = localStorage.getItem('wedding-data-persistent');
                const timestamp = localStorage.getItem('wedding-cache-timestamp');
                
                if (cached && timestamp) {
                    return {
                        data: JSON.parse(cached),
                        timestamp: parseInt(timestamp)
                    };
                }
            } catch (e) {
                console.warn('Erro ao ler cache persistente:', e);
                this.clearCache();
            }
            
            return null;
        },

        setCachedData() {
            if (process.server) return;
            
            try {
                const dataToCache = {
                    safes: this.safes,
                    weddingDate: this.weddingDate
                };
                localStorage.setItem('wedding-data-persistent', JSON.stringify(dataToCache));
                localStorage.setItem('wedding-cache-timestamp', Date.now().toString());
            } catch (e) {
                console.warn('Erro ao salvar cache persistente:', e);
            }
        },

        clearCache() {
            if (process.server) return;
            
            try {
                localStorage.removeItem('wedding-data-persistent');
                localStorage.removeItem('wedding-cache-timestamp');
            } catch {
                // Silencioso
            }
        },

        // **PERF-01**: Inicialização com exibição instantânea
        async initialize() {
            // **LAYOUT-SHIFT-FIX**: Carrega cache imediatamente
            const cached = this.getCachedData();
            if (cached) {
                console.log('✅ Carregando dados do cache persistente');
                this.safes = cached.data.safes || [];
                this.weddingDate = cached.data.weddingDate || null;
                
                // Verifica se cache não está muito antigo (mais de 1 hora)
                const isOldCache = Date.now() - cached.timestamp > 60 * 60 * 1000;
                if (!isOldCache) {
                    console.log('✅ Cache ainda válido, fazendo refresh em background');
                    this.refreshDataInBackground();
                    return;
                }
            }

            // Se não há cache válido, carrega com loading
            this.loading = true;
            this.error = null;
            try {
                await Promise.all([this.fetchSafes(), this.fetchWeddingDate()]);
                this.setCachedData();
            } catch (e: any) {
                this.error = "Falha ao inicializar os dados da aplicação.";
            } finally {
                this.loading = false;
            }
        },

        // **PERF-02**: Atualização em background sem loading
        async refreshDataInBackground() {
            try {
                console.log('🔄 Atualizando dados em background...');
                const oldSafes = [...this.safes];
                const oldDate = this.weddingDate;
                
                await Promise.all([this.fetchSafes(), this.fetchWeddingDate()]);
                this.setCachedData();
                
                // Só loga se realmente mudou
                const hasChanges = JSON.stringify(oldSafes) !== JSON.stringify(this.safes) || 
                                 oldDate !== this.weddingDate;
                if (hasChanges) {
                    console.log('✅ Dados atualizados em background');
                } else {
                    console.log('ℹ️  Nenhuma mudança nos dados');
                }
            } catch (e) {
                console.error('❌ Erro ao atualizar dados em background:', e);
                // Silencioso - mantém dados do cache
            }
        },

        async fetchSafes() {
            try {
                // **PERF-04**: Usa useLazyFetch para melhor cache
                const { data, error } = await useLazyFetch<Safe[]>('/api/safes', {
                    key: 'user-safes',
                    server: false, // Evita duplicate requests
                });
                if (error.value) throw error.value;
                if (data.value) {
                    this.safes = data.value;
                }
            } catch (e) {
                console.error('Failed to fetch safes:', e);
                throw new Error('Could not fetch safes.');
            }
        },

        async fetchWeddingDate() {
            try {
                // **PERF-05**: Usa useLazyFetch para melhor cache
                const { data, error } = await useLazyFetch<{ weddingDate: string | null }>('/api/wedding/date', {
                    key: 'wedding-date',
                    server: false, // Evita duplicate requests
                });
                if (error.value) throw error.value;
                if (data.value && typeof data.value.weddingDate === 'string') {
                    this.weddingDate = data.value.weddingDate;
                }
            } catch (e) {
                console.error('Failed to fetch wedding date:', e);
                throw new Error('Could not fetch wedding date.');
            }
        },

        async updateWeddingDate(newDate: string) {
            this.loading = true;
            this.error = null;
            try {
                // **PERF-03**: Optimistic update + cache persistente
                const oldDate = this.weddingDate;
                this.weddingDate = newDate;

                const { error } = await useFetch('/api/wedding/date', {
                    method: 'PUT',
                    body: { weddingDate: newDate },
                });
                if (error.value) {
                    this.weddingDate = oldDate; 
                    throw error.value;
                } else {
                    this.setCachedData();
                }
            } catch (e: any) {
                this.error = "Failed to update wedding date.";
            } finally {
                this.loading = false;
            }
        },

        // ✅ REFACTORED: Removed explicit `this` typing.
        async addMoneyToSafe(id: string, amount: number) {
            if (amount <= 0) return;

            const safe = this.safes.find(s => s.id === id);
            if (safe) {
                safe.current += amount;
            }

            const { error } = await useFetch('/api/safes/update', {
                method: 'PUT',
                body: { id, amount },
            });

            if (error.value) {
                if (safe) safe.current -= amount;
                this.error = 'Failed to update savings. Please try again.';
            } else {
                // **PERF-04**: Atualiza cache após mudança
                this.setCachedData();
            }
        },

        // ✅ REFACTORED: Removed explicit `this` typing.
        async distributeFunds(totalAmount: number) {
            if (totalAmount <= 0 || this.safes.length === 0) {
                return;
            }

            this.loading = true;
            const amountPerSafe = totalAmount / this.safes.length;

            const updatePromises = this.safes.map(safe =>
                this.addMoneyToSafe(safe.id, amountPerSafe)
            );

            await Promise.all(updatePromises);
            this.loading = false;
        },

        async createSafe(newSafe: { name: string; goal: number }) {
            this.loading = true;
            try {
                const { data, error } = await useFetch('/api/safes', {
                    method: 'POST',
                    body: newSafe,
                });

                if (error.value) throw error.value;

                // **PERF-05**: Adiciona o novo cofre + cache persistente
                if (data.value) {
                    this.safes.push(data.value as Safe);
                    this.setCachedData();
                }
            } catch (e: any) {
                this.error = e.message;
                // Em um app real, mostrar um toast de erro seria ideal
            } finally {
                this.loading = false;
            }
        },
    },
});