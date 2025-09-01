/**
 * (SEC-01) Sanitiza o input do utilizador para permitir apenas valores numéricos,
 * incluindo a formatação de decimais.
 */
function formatNumber(value: string): string {
    // Substitui a vírgula pelo ponto para consistência decimal
    let formattedValue = value.replace(/,/g, '.');

    // Remove qualquer caracter que não seja um dígito ou um ponto
    formattedValue = formattedValue.replace(/[^0-9.]/g, '');

    // Garante que existe apenas um ponto decimal
    const parts = formattedValue.split('.');
    if (parts.length > 2) {
        formattedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    return formattedValue;
}

/**
 * Diretiva v-numeric-only
 * - Garante que apenas números e um único ponto decimal possam ser inseridos.
 * - Trata da colagem de texto, sanitizando o valor.
 */
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('numeric-only', {
        mounted(el: HTMLInputElement) {
            const handler = () => {
                const formatted = formatNumber(el.value);
                if (el.value !== formatted) {
                    el.value = formatted;
                    // Dispara um evento de 'input' para que o v-model seja atualizado
                    el.dispatchEvent(new Event('input'));
                }
            };
            el.addEventListener('input', handler);
        },
    });
});