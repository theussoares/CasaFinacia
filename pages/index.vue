<template>
  <div>
    <main>
      <section
        class="relative w-full min-h-screen flex items-center bg-rose-50"
      >
        <NuxtImg
          src="/wedding-hero.webp"
          class="absolute inset-0 w-full h-full object-cover"
          alt="Casal planejando seu casamento em uma mesa com um laptop."
          width="1920"
          height="1280"
          format="webp"
          preload
          priority="high"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-pink-50/80 via-pink-50/50 to-transparent"
        />

        <div
          class="relative z-10 container mx-auto grid lg:grid-cols-5 gap-6 lg:gap-12 items-center px-4 sm:px-6 py-8 sm:py-12 lg:py-20"
        >
          <div class="lg:col-span-3 text-center lg:text-left order-2 lg:order-1">
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold font-serif text-pink-800 mb-4 sm:mb-6 leading-tight"
            >
              Seu sonho de casamento, planejado com carinho.
            </h1>
            <p class="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
              Organize cada detalhe financeiro do seu grande dia com facilidade
              e realize o casamento perfeito que você sempre sonhou.
            </p>
            <a
              href="#features"
              class="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 text-sm sm:text-base"
            >
              Descubra Como
            </a>
          </div>
          <div class="lg:col-span-2 flex justify-center order-1 lg:order-2">
            <div
              class="bg-white/60 p-2 sm:p-4 rounded-3xl shadow-2xl backdrop-blur-lg w-full max-w-sm mx-4 sm:mx-0"
            >
              <Login />
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="bg-white py-12 sm:py-16 lg:py-24">
        <div class="container mx-auto px-4 sm:px-6 text-center">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16 text-sm sm:text-base">
            De metas individuais a um painel completo, simplificamos suas
            finanças para que você possa focar no que realmente importa.
          </p>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div
              class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                class="bg-pink-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-5"
              >
                <svg
                  class="w-6 h-6 sm:w-8 sm:h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                  />
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Metas Personalizadas
              </h3>
              <p class="text-gray-600 text-sm sm:text-base">
                Crie um "cofre" para cada sonho: vestido, buffet, fotografia.
                Saiba exatamente para onde seu dinheiro está indo.
              </p>
            </div>
            <div
              class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                class="bg-pink-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-5"
              >
                <svg
                  class="w-6 h-6 sm:w-8 sm:h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  ></path>
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Progresso Visual
              </h3>
              <p class="text-gray-600 text-sm sm:text-base">
                Com barras de progresso e um resumo claro, veja seus objetivos
                se aproximando a cada contribuição.
              </p>
            </div>
            <div
              class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1"
            >
              <div
                class="bg-pink-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-5"
              >
                <svg
                  class="w-6 h-6 sm:w-8 sm:h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Planejamento a Dois
              </h3>
              <p class="text-gray-600 text-sm sm:text-base">
                Convide seu parceiro(a) com um link seguro para planejarem e
                economizarem juntos, de forma transparente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-rose-50 py-12 sm:py-16 lg:py-24">
        <div
          class="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center"
        >
          <div class="order-2 md:order-1">
            <span class="text-pink-600 font-semibold text-sm sm:text-base">VISÃO CLARA</span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mt-2 mb-4 sm:mb-6">
              Acompanhe cada centavo
            </h2>
            <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              Com nosso painel intuitivo, você tem uma visão completa de todas
              as suas metas. Barras de progresso, resumos e cálculos automáticos
              mostram exatamente onde você está e quanto falta para alcançar
              cada objetivo. Chega de planilhas complicadas!
            </p>
            <ul class="space-y-2 sm:space-y-3 text-gray-700">
              <li class="flex items-center gap-2 sm:gap-3">
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm sm:text-base">Resumo financeiro total.</span>
              </li>
              <li class="flex items-center gap-2 sm:gap-3">
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm sm:text-base">Cálculo automático de metas mensais.</span>
              </li>
            </ul>
          </div>
          <div class="order-1 md:order-2">
            <NuxtImg
              src="/feature-dashboard.webp"
              alt="Painel do dashboard mostrando gráficos e barras de progresso"
              width="600"
              height="454"
              format="webp"
              loading="lazy"
              class="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section class="bg-white py-12 sm:py-16 lg:py-24">
        <div class="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
            Tirando suas dúvidas
          </h2>
          <p class="text-gray-600 text-center mb-8 sm:mb-12 text-sm sm:text-base max-w-2xl mx-auto">
            Tudo o que você precisa saber sobre nossos planos e como começar.
          </p>

          <AccordionRoot
            class="w-full bg-white rounded-lg shadow-lg"
            type="single"
            collapsible
          >
            <!-- Pergunta 1: Preço -->
            <AccordionItem value="item-1" class="border-b border-gray-200">
              <AccordionHeader>
                <AccordionTrigger
                  class="w-full p-4 sm:p-6 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 text-sm sm:text-base"
                >
                  <span class="pr-2">💰 Quanto custa o Planejando a Dois?</span>
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 flex-shrink-0"
                    :class="{ 'rotate-180': openAccordion === 'item-1' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent class="p-4 sm:p-6 pt-0 text-gray-600 text-sm sm:text-base">
                <div class="space-y-3">
                  <p class="text-lg font-semibold text-pink-600">Apenas R$ 5,00 por mês!</p>
                  <p>Um valor super acessível para te ajudar a organizar completamente as finanças do seu casamento. Menos do que o preço de um café! ☕</p>
                  <div class="bg-pink-50 border border-pink-200 rounded-lg p-4 mt-4">
                    <p class="text-pink-800 font-medium">🎉 Experimente GRÁTIS por 1 dia!</p>
                    <p class="text-pink-700 text-sm mt-1">Teste todas as funcionalidades sem compromisso.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <!-- Pergunta 2: Teste Grátis -->
            <AccordionItem value="item-2" class="border-b border-gray-200">
              <AccordionHeader>
                <AccordionTrigger
                  class="w-full p-4 sm:p-6 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 text-sm sm:text-base"
                >
                  <span class="pr-2">🆓 Como funciona o teste gratuito?</span>
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 flex-shrink-0"
                    :class="{ 'rotate-180': openAccordion === 'item-2' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent class="p-4 sm:p-6 pt-0 text-gray-600 text-sm sm:text-base">
                <div class="space-y-3">
                  <p>Você tem <strong>24 horas completas</strong> para testar todas as funcionalidades:</p>
                  <ul class="list-disc list-inside space-y-2 ml-4">
                    <li>Criar seus cofres de economia</li>
                    <li>Definir metas financeiras</li>
                    <li>Convidar seu parceiro(a)</li>
                    <li>Usar o painel completo de controle</li>
                    <li>Experimentar todas as ferramentas</li>
                  </ul>
                  <p class="text-sm text-gray-500 mt-3">Após 24 horas, você precisará assinar para continuar usando.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <!-- Pergunta 3: Como Pagar -->
            <AccordionItem value="item-3" class="border-b border-gray-200">
              <AccordionHeader>
                <AccordionTrigger
                  class="w-full p-4 sm:p-6 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 text-sm sm:text-base"
                >
                  <span class="pr-2">💳 Como faço o pagamento?</span>
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 flex-shrink-0"
                    :class="{ 'rotate-180': openAccordion === 'item-3' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent class="p-4 sm:p-6 pt-0 text-gray-600 text-sm sm:text-base">
                <div class="space-y-4">
                  <p>Aceitamos pagamento via <strong>PIX</strong> - rápido, seguro e prático!</p>
                  
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="font-semibold text-blue-800 mb-2">📱 Passo a passo:</h4>
                    <ol class="list-decimal list-inside space-y-2 text-blue-700">
                      <li>Faça o PIX de R$ 5,00</li>
                      <li>Tire uma foto ou screenshot do comprovante</li>
                      <li>Envie o comprovante através do WhatsApp</li>
                      <li>Sua conta será liberada em até 24 horas</li>
                    </ol>
                  </div>

                  <p class="text-sm text-gray-500">
                    <strong>Importante:</strong> O comprovante é essencial para a liberação da sua conta. 
                    Verificamos manualmente para garantir a segurança de todos.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <!-- Pergunta 4: Liberação Manual -->
            <AccordionItem value="item-4" class="border-b border-gray-200">
              <AccordionHeader>
                <AccordionTrigger
                  class="w-full p-4 sm:p-6 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 text-sm sm:text-base"
                >
                  <span class="pr-2">⏰ Quanto tempo demora para liberar minha conta?</span>
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 flex-shrink-0"
                    :class="{ 'rotate-180': openAccordion === 'item-4' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent class="p-4 sm:p-6 pt-0 text-gray-600 text-sm sm:text-base">
                <div class="space-y-3">
                  <p>Após o envio do comprovante, sua conta é liberada <strong>manualmente</strong> em até <strong>24 horas</strong>.</p>
                  
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p class="text-green-800 font-medium">✅ Por que é manual?</p>
                    <p class="text-green-700 text-sm mt-1">
                      Para garantir a segurança e evitar fraudes, verificamos pessoalmente cada comprovante. 
                      Isso nos permite manter a qualidade e confiabilidade do serviço.
                    </p>
                  </div>

                  <p class="text-sm text-gray-500">
                    <strong>Dica:</strong> Envie o comprovante durante horário comercial para liberação mais rápida!
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <!-- Pergunta 5: Segurança -->
            <AccordionItem value="item-5">
              <AccordionHeader>
                <AccordionTrigger
                  class="w-full p-4 sm:p-6 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 text-sm sm:text-base"
                >
                  <span class="pr-2">🔒 Meus dados estão seguros?</span>
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 flex-shrink-0"
                    :class="{ 'rotate-180': openAccordion === 'item-5' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent class="p-4 sm:p-6 pt-0 text-gray-600 text-sm sm:text-base">
                <div class="space-y-3">
                  <p>Sim! Levamos a segurança muito a sério:</p>
                  <ul class="list-disc list-inside space-y-2 ml-4">
                    <li>Seus dados financeiros ficam apenas no seu dispositivo</li>
                    <li>Usamos autenticação via Google (segurança máxima)</li>
                    <li>Comprovantes são verificados e depois excluídos</li>
                    <li>Não armazenamos informações bancárias</li>
                  </ul>
                  <p class="text-sm font-medium text-green-600 mt-3">🛡️ Sua privacidade é nossa prioridade!</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>
        </div>
      </section>
    </main>

    <footer class="bg-stone-100">
      <div class="container mx-auto py-6 px-6 text-center text-gray-600">
        <p>
          &copy; {{ new Date().getFullYear() }} Planejando a Dois. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "radix-vue";
const openAccordion = ref("");
</script>
