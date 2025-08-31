// middleware/auth.ts
// This middleware now protects pages, assuming a session is established by a cookie.
export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return;

    const token = useCookie('auth-token');

    // If trying to access a protected page without a token, redirect to login.
    if (!token.value && to.path !== '/') {
        return navigateTo('/');
    }

    // If on the login page with a token, redirect to home.
    if (token.value && to.path === '/') {
        return navigateTo('/home');
    }
});