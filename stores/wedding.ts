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
        // ✅ REFACTORED: Removed explicit `this` typing.
        async initialize() {
            this.loading = true;
            this.error = null;
            try {
                // Run both fetches in parallel for better performance
                await Promise.all([this.fetchSafes(), this.fetchWeddingDate()]);
            } catch (e: any) {
                this.error = "Falha ao inicializar os dados da aplicação.";
            } finally {
                this.loading = false;
            }
        },

        async fetchSafes() {
            try {
                const { data, error } = await useFetch<Safe[]>('/api/safes');
                if (error.value) throw error.value;
                if (data.value) {
                    this.safes = data.value;
                }
            } catch (e) {
                console.error('Failed to fetch safes:', e);
                // Re-throw to be caught by the initialize action
                throw new Error('Could not fetch safes.');
            }
        },

        async fetchWeddingDate() {
            try {
                const { data, error } = await useFetch<{ weddingDate: string | null }>('/api/wedding/date');
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
                // Optimistic update for better UX
                const oldDate = this.weddingDate;
                this.weddingDate = newDate;

                const { error } = await useFetch('/api/wedding/date', {
                    method: 'PUT',
                    body: { weddingDate: newDate },
                });
                if (error.value) {
                    this.weddingDate = oldDate; // Revert on failure
                    throw error.value;
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

                // Adiciona o novo cofre à lista existente na UI para reatividade instantânea
                if (data.value) {
                    this.safes.push(data.value as Safe);
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