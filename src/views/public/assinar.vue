<template>
  <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <v-container>
              <v-row>
                <v-col
                  v-for="n in plans"
                  :key="n"
                  cols="12"
                  md="4"
                  @click="selectAction(n.id)"
                >
                <v-item-group>
                  <v-item v-slot="{ isSelected, selectedClass, toggle }" >
                    <v-card
                      :class="['d-flex align-center', selectedClass, {'bg-primary' : n.id == selected}]"
                      height="200"
                      dark
                      @click="toggle"
                    >
                      <v-card-text class="d-flex align-center justify-center flex-column">
                        <v-icon size="2rem" class="mb-2">{{ n.icon }}</v-icon>
                        <h5 class="text-h5 font-weight-bold">{{ n.name }}</h5>
                        <v-chip :append-icon=" n.id == selected ? 'mdi-check' : ''" class="my-2">
                          {{ n.id == selected ? 'Selecionado' : 'Selecionar' }}
                        </v-chip>
                        <h4 class="border rounded-lg pa-2 text-h5" :class="{'bg-white' : n.id == selected}">{{ n.price }}<span v-if="n.id != 'Gratis'" class="text-medium-emphasis">/mês</span></h4>
                      </v-card-text>
                    </v-card>
                  </v-item>
                </v-item-group>
                </v-col>
              </v-row>

              <v-row>
                <v-col class="d-flex justify-center align-center ga-2" cols="12" md="6">
                  <v-card class="w-100"  min-height="350">
                      <v-card-text class="flex-grow-1">
                        <v-list class="bg-transparent" lines="one">
                          <v-list-item
                            v-for="(feature, index) in planSelected.features"
                            :key="index"
                            class="pa-0"
                          >
                            <template v-slot:prepend>
                              <v-icon color="success" icon="mdi-check-circle-outline" class="mr-3"></v-icon>
                            </template>
                            <v-list-item-title class="text-body-2">{{ feature }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                  </v-card>
                </v-col>
                <v-col class="d-flex justify-center align-center ga-2" cols="12" md="6">
                  <v-card class="w-100" min-height="350">
                    <v-card-text>
                     <LoginLeges :flutuante="true" />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row justify="center" v-if="loginStore.readLogin?.cpf">
                <v-col cols="12" sm="8" v-if="false">
                  <v-card class="pa-4" elevation="2">
                    <v-card-title class="text-h5 text-center">
                      Assinar Plano Mensal
                    </v-card-title>
                    <v-card-subtitle class="text-center">
                      R$ 50,00 por mês
                    </v-card-subtitle>
                    
                    <v-card-text>
                      <v-alert
                        v-if="errorMessage"
                        type="error"
                        density="compact"
                        class="mb-4"
                        :text="errorMessage"
                      ></v-alert>
                      <v-alert
                        v-if="successMessage"
                        type="success"
                        density="compact"
                        class="mb-4"
                        :text="successMessage"
                      ></v-alert>

                      <v-form @submit.prevent="handleSubmit">
                        <v-text-field
                          v-model="email"
                          label="Seu melhor e-mail"
                          type="email"
                          variant="outlined"
                          required
                          class="mb-4"
                        ></v-text-field>

                        <label class="v-label text-grey-darken-1 mb-2">Dados do Cartão de Crédito</label>
                        <div id="card-element" class="stripe-card-element"></div>
                        
                        <v-btn
                          :loading="loading"
                          :disabled="loading || !!successMessage"
                          type="submit"
                          color="primary"
                          size="large"
                          block
                          class="mt-6"
                        >
                          Assinar Agora
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>

                 <v-col cols="12" sm="8" v-else>
                  <v-card class="pa-4" elevation="2">
                    <v-card-title class="text-h5 text-center">
                     Seja notificado quando o plano estiver disponível.
                    </v-card-title>
                    <v-card-text class="text-center">
                      Obrigado pelo interesse em nossa ferramenta. Por enquanto estamos em fase de testes e não estamos disponíveis para assinaturas.
                      Continue usando <b>gratuitamente</b> na nossa fase beta.
                      <h4 class="bg-success pa-2 mt-2">Desconto exclusivo para participantes do pré-cadastro.</h4>
                    </v-card-text>
                    
                    <v-card-text>
                      <v-alert
                        v-if="errorMessage"
                        type="error"
                        density="compact"
                        class="mb-4"
                        :text="errorMessage"
                      ></v-alert>
                      <v-alert
                        v-if="successMessage"
                        type="success"
                        density="compact"
                        class="mb-4"
                        :text="successMessage"
                      ></v-alert>

                      <v-form @submit.prevent="handleSubmitEmail" ref="form">
                        <v-text-field
                          v-model="email"
                          label="Seu melhor e-mail"
                          type="email"
                          variant="outlined"
                          required
                          class="mb-4"
                          prepend-inner-icon="mdi-email"
                          clearable
                          :rules="[rules.required, rules.email]"
                        ></v-text-field>
                        
                        <v-btn
                          :loading="loading"
                          :disabled="loading || !!successMessage"
                          type="submit"
                          color="primary"
                          size="large"
                          block
                          class="mt-6"
                        >
                          Cadastrar
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
        </div>
  </section>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { loadStripe } from '@stripe/stripe-js';    
    import isEmail from 'validator/lib/isEmail'

    import { usePrecadastroStore } from '@/store/concursos/PreCadastroStore';
    import { useGeralStore } from '@/store/GeralStore';    
    import { useRouter, useRoute } from 'vue-router';
    import LoginLeges from '@/components/LoginCreate/LoginLeges.vue'
    import { useLoginStore } from '@/store/LoginStore'

    const loginStore = useLoginStore()
    const precadastroStore = usePrecadastroStore()
    const geralStore = useGeralStore()
    const router = useRouter()
    const route = useRoute()

    const routeId = route.query.plan

    const selected = ref(route.query.plan)
    const form = ref(null)

    const rules = {
        required: (value) => !!value || "Campo obrigatório",
        mindn: (v) => (v||'').length == 10 || "8 dígitos",
        email: (v) => isEmail(v || '') || 'E-mail inválido',
    }

    const planSelected = computed(() => {
      return plans.find(plan => plan.id === selected.value)
    })

    const plans = [
      {
        id: 'Gratis',
        name: 'Gratuito',
        price: 'R$0,00',
        description: 'Cadastre e inicie os estudos da lei agora mesmo.',
        icon: 'mdi-rocket-launch-outline',
        features: [
          'importar até 5 Normas',
          'Comentários',
          'Questões limitadas',
          'Resumos limitados',
          'Suporte básico por e-mail',
        ],
      },
      {
        id: 'Pro',
        name: 'Plano Pro',
        price: 'R$49',
        description: 'Use ferramentas robustas de IA para seus estudos.',
        icon: 'mdi-star-circle-outline',
        features: [
          'Importação ilimitada de normas',
          'Suporte prioritário',
          'Geração de questões',
          'Geração de resumos',
          'Geração de esquemas',
          'Colaboração em equipe'
        ],
      },
      {
        id: 'Grupo',
        name: 'Plano Grupo',
        price: "R$199",
        description: 'Convide amigos para comentar a usar a ferramentas de IA Generativa',
        icon: 'mdi-account-multiple',
        features: [
          'Tudo do básico',
          'Tudo do Pro',
          'Valor Diferenciado',
          'Administre seu grupo',
        ],
      }
    ]

    const selectAction = (plan) => {
      selected.value = plan
      router.push({ query: { plan: plan } })
    }

    // --- Estado Reativo (Composition API) ---
    const email = ref('');
    const loading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    // Variáveis para guardar instâncias do Stripe
    let stripe = null;
    let cardElement = null;

    onMounted( async () => {
      if(routeId){
        selected.value = routeId
      }
      // Carrega a instância do Stripe com sua chave publicável
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        errorMessage.value = "Chave publicável do Stripe não foi encontrada.";
        return;
      }
      
      stripe = await loadStripe(stripeKey);
      const elements = stripe.elements();

      // Estilização do elemento do cartão para combinar com o Vuetify
      const style = {
        base: {
          color: "#32325d",
          fontFamily: '"Roboto", sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      };

      // Cria e monta o elemento de cartão no div#card-element
      cardElement = elements.create('card', { style });
      cardElement.mount('#card-element');
    })

    const handleSubmit = async () => {
      if (loading.value || !stripe || !cardElement) {
        return;
      }

      // Reseta estado
      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      // 1. Cria o PaymentMethod diretamente com o Stripe
      // O dado do cartão vai direto para o Stripe, não para o nosso servidor
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: email.value,
        },
      });

      if (error) {
        errorMessage.value = error.message;
        loading.value = false;
        return;
      }
      
      // 2. Envia o paymentMethod.id para o nosso backend
      try {
        const response = await fetch('http://localhost:4242/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            paymentMethodId: paymentMethod.id,
          }),
        });

        const subscriptionResult = await response.json();

        if (!response.ok) {
          throw new Error(subscriptionResult.error.message);
        }
        
        // Sucesso!
        console.log('Resposta do backend:', subscriptionResult);
        successMessage.value = `Assinatura ${subscriptionResult.subscriptionId} criada com sucesso!`;
        cardElement.clear(); // Limpa o formulário do cartão
        
      } catch (backendError) {
        errorMessage.value = backendError.message;
      } finally {
        loading.value = false;
      }
    };

    const handleSubmitEmail = async () => {
      if (loading.value) {
        return;
      }

      // Reseta estado
      errorMessage.value = '';
      successMessage.value = '';

      const { valid } = await form.value.validate()
      if(!valid) return
      loading.value = true;

      try {
        const resp = await precadastroStore.createPrecadastro(email.value)
        console.log('teste', resp);
        successMessage.value = `Cadstro do e-mail ${email.value} realizado com sucesso!`;
        
      } catch (backendError) {
        errorMessage.value = "Ocorreu um erro ao cadastrar o e-mail.";
      } finally {
        loading.value = false;
      }
    }

</script>

<style scoped>
.stripe-card-element {
  border: 1px solid #c2c2c2;
  border-radius: 4px;
  padding: 12px;
  background-color: white;
  height: 48px;
  display: flex;
  align-items: center;
}
.stripe-card-element:focus-within {
  border-color: #3f51b5; /* Cor primária do Vuetify */
}

</style>