// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    // Lógica de verificação de usuário (exemplo com Pinia)
    // Você precisará implementar a lógica real no seu store de autenticação.
    const isAuthenticated = false // Substitua por: useAuthStore().isAuthenticated
})