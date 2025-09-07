/**
 * API Route para verificar token do Cloudflare Turnstile
 * **SEC-01**: Validação de CAPTCHA no servidor para prevenir bypass
 */

export default defineEventHandler(async (event) => {
  // **SEC-02**: Apenas aceita método POST
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    });
  }

  try {
    const body = await readBody(event);
    const { token } = body;

    // **SEC-03**: Valida se token foi fornecido
    if (!token || typeof token !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token is required'
      });
    }

    const config = useRuntimeConfig();
    const secretKey = config.turnstileSecretKey as string;

    // **SEC-04**: Verifica se a chave secreta está configurada
    if (!secretKey) {
      console.error('Turnstile secret key not configured');
      throw createError({
        statusCode: 500,
        statusMessage: 'CAPTCHA service not configured'
      });
    }

    // **SEC-05**: Faz verificação com a API do Cloudflare
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    // **PERF-01**: Adiciona IP do cliente para verificação
    const clientIP = getHeader(event, 'x-forwarded-for') || 
                     getHeader(event, 'x-real-ip') || 
                     event.node.req.socket.remoteAddress || '';
    if (clientIP) {
      formData.append('remoteip', clientIP.toString());
    }

    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    if (!verificationResponse.ok) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Failed to verify CAPTCHA'
      });
    }

    const result = await verificationResponse.json() as {
      success: boolean;
      'error-codes'?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    // **SEC-06**: Log para auditoria (sem dados sensíveis)
    console.log('Turnstile verification:', {
      success: result.success,
      hostname: result.hostname,
      hasErrors: !!result['error-codes']?.length,
      clientIP: clientIP ? 'present' : 'missing'
    });

    // **SEC-07**: Retorna resultado da verificação
    if (result.success) {
      return {
        success: true,
        timestamp: result.challenge_ts,
        hostname: result.hostname
      };
    } else {
      return {
        success: false,
        errors: result['error-codes'] || ['verification-failed']
      };
    }

  } catch (error: any) {
    // **SEC-08**: Log de erro para monitoramento
    console.error('Turnstile verification error:', error);
    
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during CAPTCHA verification'
    });
  }
});
