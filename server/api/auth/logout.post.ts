// SEC-03: Logout must be handled on the server to clear the HttpOnly cookie.
export default defineEventHandler(async (event) => {
    setCookie(event, 'auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: -1, // Expire the cookie immediately
    });

    return { success: true, message: 'Logged out' };
});