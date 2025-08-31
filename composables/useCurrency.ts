// composables/useCurrency.ts

/**
 * A composable function to provide currency formatting utilities.
 * This leverages the standard browser Intl.NumberFormat API for
 * robust and locale-aware currency formatting.
 */
export const useCurrency = () => {

    /**
     * Formats a numeric value into a Brazilian Real (BRL) currency string.
     * @param value The number to format.
     * @returns A formatted currency string, e.g., "R$ 1.234,56".
     */
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Return the function so it can be destructured and used in components.
    return {
        formatCurrency,
    };
};