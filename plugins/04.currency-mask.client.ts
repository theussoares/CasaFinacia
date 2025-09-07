// plugins/03.currency-mask.client.ts
import { currencyMaskDirective } from '~/directives/currencyMask';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('currency-mask', currencyMaskDirective);
});
