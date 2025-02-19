<template>
     <h1 class="my-4 text-h5 text-center text-red">Escolha uma coleção para fazer perguntas</h1>
     <div id="cards">
      <div class="card" v-for="item, i in list" :key="i" @click="$router.push(`/chatarcadio/${item.id}`)">
        <div class="card-border"></div>
        <div class="card-content" :class="theme == 'dark' ? '': 'bg-white border'">
          <div class="img">
            <v-icon color="grey" size="80">{{item.icon}}</v-icon>
          </div>
          <div class="wrappercontent">
            <div class="mt-3 text-center w-100">
              <h3 class="d-flex justify-center align-center">
                  {{item.name}}
              </h3>
              <p class="font-weight-thin text-grey">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 mb-15">
      <v-btn>Ver Mais</v-btn>
    </div>
</template>

<script setup>
    import { onMounted, ref, inject } from 'vue';

    const theme = inject('theme')

    const list = ref([
      {name: 'Benefícios IPVA', icon:'mdi-link-variant', color: '#f01468', id: '2222222', text: 'requisitos e mais'},
      {name: 'Alcool Etílico', icon:'mdi-link-variant', color: '#f01468', id:'2222222', text: 'legislação e mais'},
      {name: 'Convênio 115', icon:'mdi-link-variant', color: '#f01468', id: '2222222', text: 'veja as obrigações'},
      {name: 'Desistência de Processo', icon:'mdi-link-variant', color: '#f01468', id: '_SF0FpUB7KKPmq_gVMrf', text: 'processos TARF'},
      {name: 'Benefício ICMS', icon:'mdi-link-variant', color: '#f01468', id: '2222222', text: 'requisitos e mais'},
      {name: 'Credenciamento', icon:'mdi-link-variant', color: '#f01468', id: '2222222', text: 'transportadoras'}
    ])

    onMounted(()=> {
        document.getElementById("cards").onmousemove = e => {
            for(const card of document.getElementsByClassName("card")) {
                const rect = card.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            };
        }
    })

</script>

<style lang="scss" scoped>
#cards{
  width: min(100%, 916px);
  margin-inline: auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: .5rem;
  transition: 1s ease;
  animation: fadeIn 1s ease-in-out forwards;
  opacity: 0;
}

#cards:hover > .card > .card-border {
  opacity: 1;
}
.card{
  background-color: rgba(255, 255, 255, 0.1);
  width: 300px;
  min-height: 160px;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
}
.card::before,
.card > .card-border{
  border-radius: inherit;
  content: '';
  height: 100%;
  left: 0px;
  opacity: 0;
  transition: opacity 500ms;
  position: absolute;
  top: 0px;
  width: 100%;
}
.card::before{
  background: radial-gradient(
    800px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.06),
    transparent 40%
  );
  z-index: 3;
}
.card > .card-border{
  background: radial-gradient(
    400px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.3),
    transparent 40%
  );
  z-index: 1;
}
.card:hover::before
{
  opacity: 1;
}
.card > .card-content{
  background: var(--card-color);
  border-radius: inherit;
  margin: 1px;
  position: relative;
  min-height: calc(100% - 2px);
  width: calc(100% - 2px);
  z-index: 2;
}
.wrappercontent{
  margin: 0 1rem;
  display: flex;
  justify-content: left;
  align-items: baseline;
  gap: .8rem;
  line-height: 1.2;
  min-height: 30%;
}
.card-content .img{
  min-height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>