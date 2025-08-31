<template>
  <div>
    <main>
      <section 
        class="relative w-full bg-cover bg-center min-h-screen flex items-center" 
        style="background-image: url('/wedding-hero.png');"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-pink-50/80 via-pink-50/50 to-transparent" />
        
        <div class="relative z-10 container mx-auto grid lg:grid-cols-5 gap-12 items-center px-6 py-20">
          <div class="lg:col-span-3 text-center lg:text-left">
            <h1 class="text-5xl lg:text-7xl font-bold font-serif text-pink-800 mb-6 leading-tight">
              Seu sonho de casamento, planejado com carinho.
            </h1>
            <p class="text-lg lg:text-xl text-gray-700 mb-8 max-w-xl">
              Organize cada detalhe financeiro do seu grande dia com facilidade e realize o casamento perfeito que você sempre sonhou.
            </p>
            <a href="#features" class="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
              Descubra Como
            </a>
          </div>
          <div class="lg:col-span-2 flex justify-center">
            <div class="bg-white/60 p-4 rounded-3xl shadow-2xl backdrop-blur-lg w-full max-w-sm">
              <Login />
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="bg-white py-24">
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Tudo que você precisa em um só lugar</h2>
          <p class="text-gray-600 max-w-2xl mx-auto mb-16">De metas individuais a um painel completo, simplificamos suas finanças para que você possa focar no que realmente importa.</p>
          <div class="grid md:grid-cols-3 gap-10">
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div class="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Metas Personalizadas</h3>
              <p class="text-gray-600">Crie um "cofre" para cada sonho: vestido, buffet, fotografia. Saiba exatamente para onde seu dinheiro está indo.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div class="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Progresso Visual</h3>
              <p class="text-gray-600">Com barras de progresso e um resumo claro, veja seus objetivos se aproximando a cada contribuição.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div class="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Planejamento a Dois</h3>
              <p class="text-gray-600">Convide seu parceiro(a) com um link seguro para planejarem e economizarem juntos, de forma transparente.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-rose-50 py-24">
        <div class="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span class="text-pink-600 font-semibold">VISÃO CLARA</span>
            <h2 class="text-3xl font-bold text-gray-800 mt-2 mb-4">Acompanhe cada centavo</h2>
            <p class="text-gray-600 mb-6">Com nosso painel intuitivo, você tem uma visão completa de todas as suas metas. Barras de progresso, resumos e cálculos automáticos mostram exatamente onde você está e quanto falta para alcançar cada objetivo. Chega de planilhas complicadas!</p>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                <span>Resumo financeiro total.</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                <span>Cálculo automático de metas mensais.</span>
              </li>
            </ul>
          </div>
          <div>
            <img src="../public/feature-dashboard.png" alt="Painel do dashboard mostrando gráficos e barras de progresso" width="600" height="400" format="webp" class="rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>
      
      <section class="bg-white py-24">
        <div class="container mx-auto px-6 max-w-3xl">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-4">Tirando suas dúvidas</h2>
          <p class="text-gray-600 text-center mb-12">Respostas para as perguntas mais comuns sobre o CasaFinacia.</p>
          
          <AccordionRoot class="w-full bg-white rounded-lg shadow-lg" type="single" collapsible>
            <AccordionItem value="item-1" class="border-b border-gray-200">
              <AccordionHeader>
                <AccordionTrigger class="w-full p-6 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50">
                  <span>O CasaFinacia é gratuito?</span>
                  <svg class="w-5 h-5 transition-transform duration-300" :class="{'rotate-180': openAccordion === 'item-1'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent class="p-6 pt-0 text-gray-600">
                Sim! Nossa missão é ajudar casais a começarem a vida juntos com o pé direito. O CasaFinacia é 100% gratuito.
              </AccordionContent>
            </AccordionItem>
            </AccordionRoot>
        </div>
      </section>
    </main>

    <footer class="bg-stone-100">
        <div class="container mx-auto py-6 px-6 text-center text-gray-600">
            <p>&copy; {{ new Date().getFullYear() }} CasaFinacia. Todos os direitos reservados.</p>
        </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { AccordionRoot, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent } from 'radix-vue';
const openAccordion = ref('');
</script>