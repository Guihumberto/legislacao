<template>
    <div>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            location="end"
            >
            <template v-slot:activator="{ props }">
                <v-btn class="btn-hover" title="Configuração da Pesquisa" color="grey" density="compact" variant="text" v-bind="props" icon="mdi-text-search"> </v-btn>
            </template>
        
            <v-card
            max-width="400"
            
            >
            <v-card-title  class="py-0 bg-primary d-flex justify-space-between align-center">
                <div>
                    <v-icon class="mr-2">mdi-text-search</v-icon>Configuração da busca
                </div>
                <v-btn variant="text" icon="mdi-close" @click="menu = false"></v-btn>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row class="pa-0 my-0">
                        <v-col cols="12" class="flex-column align-center" >
                        <!-- Slider -->
                        <v-list-subheader class="d-block text-center">Nível de Assertividade</v-list-subheader>
                            <v-slider
                                v-model="search.assertividade"
                                :max="3"
                                :min="1"
                                :step="1"
                                thumb-label="always"
                                :ticks="[1, 2, 3]"
                                direction="horizontal"
                                class="mt-4"
                                :color="color"
                            >
                            <template v-slot:prepend>
                                <v-btn
                                    :color="color"
                                    icon="mdi-minus"
                                    size="small"
                                    variant="text"
                                    @click="decrement"
                                ></v-btn>
                            </template>
                            <template v-slot:append>
                                <v-btn
                                    :color="color"
                                    icon="mdi-plus"
                                    size="small"
                                    variant="text"
                                    @click="increment"
                                ></v-btn>

                            </template>
                        </v-slider>
                        </v-col> 
                        <v-col cols="12" class="py-0">
                            <v-card class="pa-1 d-flex justify-center align-center" :color="color" variant="outlined" height="110">
                            <div v-if="search.assertividade === 1" class="enter">
                                <p><strong>Nível 1:</strong> A busca exige apenas que qualquer das palavras digitadas esteja presente nos resultados.
                                Os resultados serão mais abrangentes.</p>
                            </div>
                            <div v-else-if="search.assertividade === 2" class="enter">
                                <p><strong>Nível 2:</strong> A busca exige que todos as palavras digitadas estejam presentes nos resultados, 
                                    independente da sequência especificada. Os resultados serão mais restritos.</p>
                            </div>
                            <div v-else-if="search.assertividade === 3" class="enter">
                                <p><strong>Nível 3:</strong> A busca exige que todos as palavras digitadas estejam presentes nos resultados, 
                                    na sequência especificada. Os resultados terão o maior nível de restrição.</p>
                            </div>
                            </v-card>
                        </v-col>
                    </v-row>     
                    <v-row class="pa-0 mx-0">
                        <v-tooltip max-width="500" location="end">
                            <template v-slot:activator="{ props }">
                                <div class="tooltip-wrapper" v-bind="props">
                                    <v-switch 
                                        v-bind="props"
                                        label="Buscar textos com pequenas variações nos termos digitados" 
                                        :color="color" 
                                        v-model="search.enableFuzzy" 
                                        :disabled="search.assertividade === 3"
                                        hide-details 
                                        >
                                    </v-switch>
                                </div>
                            </template>                            
                            <span>Habilitar esse recurso permite localizar resultados mesmo que haja erros de digitação ou pequenas variações nos termos pesquisados.</span>
                        </v-tooltip>
                    </v-row>                           
                </v-container>
            </v-card-text>
            </v-card>
        </v-menu>
    </div>
  </template>
  <script setup>
        import { ref, inject } from 'vue';
        const menu = ref(false) 
        const color = ref("primary")

        const search = inject('search')

        const decrement = () => {
            if (search.value.assertividade > 1) {
                search.value.assertividade--;
            }
        }

        const increment = () =>  {
            if (search.value.assertividade < 3) {
                search.value.assertividade++;
            }
        }

  </script>

  <style>
    .enter{
        transition: 1s ease;
        animation: entry .8s ease-in-out;
    }
    .btn-hover:hover{
        background: rgb(234, 231, 231);
    }
    @keyframes entry {
        0%{
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }
  </style>