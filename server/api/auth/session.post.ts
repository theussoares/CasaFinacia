// Este endpoint apenas atualiza o cookie com um novo token de ID fornecido pelo cliente.
export default defineEventHandler(async (event) => {
    const { idToken } = await readBody(event);
    if (!idToken) {
        throw createError({ statusCode: 400, statusMessage: 'Missing idToken' });
    }

    setCookie(event, 'auth-token', idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return { message: 'Session refreshed' };
});