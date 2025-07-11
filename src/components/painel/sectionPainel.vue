<template>
    <section class="mb-12">
        <v-row class="ma-0">
            <v-col cols="12" class="pa-0 ma-0">
              <div class="section-title-container">
                  <!-- Título principal -->
                   <div class="bg-primary rounded-lg py-2 pl-2">
                     <div class="d-flex align-center">
                       <div class="title-icon-wrapper me-3">
                           <v-icon 
                           :icon="title.icon || 'mdi-clipboard-text-outline'" 
                           size="24"
                           />
                       </div>
                     
                       <div class="title-content">
                           <h2 class="text-h5 font-weight-bold text-white">
                           {{ title.title }}
                           </h2>
                           <div class="title-accent"></div>
                       </div>
                     </div>
                     <p v-if="title?.subtitle" class="text-body-2 text-grey-lighten-1 mt-2 mb-0 ms-14">
                       {{ title.subtitle }}
                     </p>
                   </div>
                  
              </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="(concurso, i) in concursos"
                :key="`concurso-${i}`"
                class="card-one-container"
            >
                <v-card
                    class="mx-auto h-100"
                    max-width="400"
                    variant="flat"
                    hover
                    @click="linkTo(concurso)"
                >
                    <v-img
                      v-if="concurso.img"
                      :src="concurso.img"
                      height="150"
                      cover
                      class="grey lighten-2"
                    ></v-img>
                    <v-card-title class="text-shadow bg-grey-lighten-4">
                        {{ concurso.titulo }}
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <div>{{ concurso.descricao }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <div class="my-10 text-center">
            <v-btn v-if="concursos.length > 5" variant="outlined" prepend-icon="mdi-plus" @click="$router.push(`/homepainel/showall/${type}`)">ver mais</v-btn>
        </div>
    </section>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import Details from './details.vue';

    const router = useRouter()

    const props = defineProps({
        title:  {
            type: Object,
            required: true
        },
        concursos: {
            type: Array,
            required: true
        },
        type:{
            type: String,
            required: true
        }
    })

    const linkTo = (item) => {
        if(props.type == 'concursos'){
            router.push(`homepainel/concurso/${item.id}?concurso=${item.concurso}&cargo=${item.cargo}`)
        }
        if(props.type == 'disciplinas'){
            router.push(`/homepainel/disciplinas/${item.titulo}`)
        }
        if(props.type == 'normas'){
            router.push(`/avancado/${item.id}`)
        }
    }

</script>

<style scoped>
.section-title-container {
  position: relative;
}

.title-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.3) 100%);
  border-radius: 2px;
}

.title-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.title-icon-wrapper:hover {
  background: rgba(var(--v-theme-primary), 0.15);
  transform: translateY(-2px);
}

.title-content {
  position: relative;
  flex: 1;
}

.title-accent {
  width: 40px;
  height: 2px;
  background: white;
  border-radius: 1px;
  margin-top: 4px;
  opacity: 0.7;
}

/* Animação de entrada */
.section-title-container, .card-one-container {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 600px) {
  .title-line {
    width: 40px;
    height: 2px;
  }
  
  .title-icon-wrapper {
    width: 36px;
    height: 36px;
  }
  
  .text-h5 {
    font-size: 1.3rem !important;
  }
  
  .title-accent {
    width: 30px;
  }
}
</style>