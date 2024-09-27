<template>
  <section>
    <div class="container">
      <!-- <h2 class="spaceh2">Sistemas IMportantes</h2> -->
      <div class="even-columns">
        <div v-for="item, i in appsSistem" :key="i" class="appSistem">
          <v-icon class="icon">{{ item.icon}}</v-icon>
          <h6>{{ item.name }}</h6>
        </div>
      </div>
      <div class="even-columns">
        <v-sheet
        class="mx-auto"
        elevation="0"
        color="transparent"
        max-width="100%"
      >
        <v-slide-group
          v-model="model"
          class="pa-4"
          selected-class="bg-success"
          show-arrows
        >
          <v-slide-group-item
            v-for="logo, n in logos"
            :key="n"
            v-slot="{ isSelected, toggle, selectedClass }"
          >
            <v-card
              color="grey-lighten-1"
              :class="['ma-4', selectedClass]"
              max-height="200"
              width="200"
              @click="toggle"
            >
            <v-img :src="logo.img"></v-img>
              <div class="d-flex fill-height align-center justify-center">
                <v-scale-transition>
                  <v-icon
                    v-if="isSelected"
                    color="white"
                    size="48"
                    icon="mdi-close-circle-outline"
                  ></v-icon>
                </v-scale-transition>
              </div>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data(){
      return{
        model: null,
        logos:[
          {id: 1, name: 'Nota Legal', url:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/7768.png'},
          {id: 1, name: 'Simples Nacional', url:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/6223.png'},
          {id: 1, name: 'Canal Verde', url:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/12396.png'},
          {id: 1, name: 'Consulta Gratuita de Protesto', url:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/15115.png'},
          {id: 1, name: 'PROFISCO II', url:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/22736.png'},
          {id: 1, name: 'SEI MA', url:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/23827.png'},
          {id: 1, name: 'PAF-e', url:'', img:'https://sistemas1.sefaz.ma.gov.br/arquivossite/imagens/arquivos/22767.png'},
        ],
        appsSistem:[
          {id: 1, name: 'Restituições', icon: 'mdi-currency-usd', url: ''},
          {id: 2, name: 'DIEF', icon: 'mdi-link-variant', url: ''},
          {id: 3, name: 'Malhas Fiscais', icon: 'mdi-magnify', url: ''},
          {id: 4, name: 'GIA ST', icon: 'mdi-calendar', url: ''},
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
.container{
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.even-columns{
  display: flex;
  justify-content: center;
  align-items: center;

}
.appSistem{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: .5s ease;
  padding: 1rem;
}
.appSistem .icon{
  font-size: 5rem;
  transition: .5s ease;
}
.appSistem:hover{
  background-color: var(--primary-color);
  color: white;
}
@media (max-width:500px) {
  .appSistem .icon{
    font-size: 2rem;
  }
  .even-columns h6{
    font-size: .5rem;
  }
}
</style>
