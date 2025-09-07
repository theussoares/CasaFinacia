import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { setupFirebase } from '../../utils/firebase';

export default defineEventHandler(async (event) => {
    setupFirebase();
    const { idToken, inviteToken, turnstileToken } = await readBody(event);
    if (!idToken) throw createError({ statusCode: 400, statusMessage: 'Missing idToken' });

    // **SEC-01**: Validação obrigatória do Turnstile CAPTCHA
    if (!turnstileToken) {
        throw createError({ 
            statusCode: 400, 
            statusMessage: 'CAPTCHA verification required' 
        });
    }

    // **SEC-02**: Verifica o token do Turnstile antes de processar autenticação
    const config = useRuntimeConfig();
    const secretKey = config.turnstileSecretKey as string;

    if (!secretKey) {
        console.error('Turnstile secret key not configured');
        throw createError({
            statusCode: 500,
            statusMessage: 'CAPTCHA service not configured'
        });
    }

    // **SEC-03**: Validação do CAPTCHA com Cloudflare
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', turnstileToken);

    // Adiciona IP do cliente
    const clientIP = getHeader(event, 'x-forwarded-for') || 
                     getHeader(event, 'x-real-ip') || 
                     event.node.req.socket.remoteAddress || '';
    if (clientIP) {
        formData.append('remoteip', clientIP.toString());
    }

    try {
        const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

        if (!verificationResponse.ok) {
            throw new Error('Failed to verify CAPTCHA');
        }

        const result = await verificationResponse.json() as {
            success: boolean;
            'error-codes'?: string[];
        };

        // **SEC-04**: Bloqueia se CAPTCHA não foi verificado
        if (!result.success) {
            console.warn('CAPTCHA verification failed:', result['error-codes']);
            throw createError({
                statusCode: 403,
                statusMessage: 'CAPTCHA verification failed'
            });
        }

        console.log('✅ CAPTCHA verified successfully for login attempt');

    } catch (captchaError) {
        console.error('CAPTCHA verification error:', captchaError);
        throw createError({
            statusCode: 403,
            statusMessage: 'CAPTCHA verification failed'
        });
    }

    // **SEC-05**: Procede com autenticação apenas após CAPTCHA validado
    const auth = getAuth();
    const db = getFirestore();
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    const userRef = db.collection('users').doc(uid);
    let userSnap = await userRef.get();
    if (!userSnap.exists) {
        let householdId: string;
        let isConjugue = false;
        if (inviteToken) {
            const householdQuery = await db.collection('households').where('inviteToken', '==', inviteToken).limit(1).get();
            if (!householdQuery.empty) {
                const householdDoc = householdQuery.docs[0];
                householdId = householdDoc.id;
                isConjugue = true; // Marca que este usuário entrou via convite
                await householdDoc.ref.update({ inviteToken: FieldValue.delete() });
            } else { throw createError({ statusCode: 400, statusMessage: 'Invalid invite token' }); }
        } else {
            const newHouseholdRef = await db.collection('households').add({ owner: uid, createdAt: new Date() });
            householdId = newHouseholdRef.id;
        }
        await userRef.set({ email, name, photoURL: picture, householdId, isConjugue });
        userSnap = await userRef.get();
    }

    // **SEC-06**: Definir o token de ID como um cookie HttpOnly seguro.
    setCookie(event, 'auth-token', idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return { uid, ...userSnap.data() };
});