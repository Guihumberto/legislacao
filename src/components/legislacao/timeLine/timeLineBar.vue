<template>
  <div class="mt-10">
    <h2 class="text-center text-primary b" id="topo">Alterações legislativas ao longo do tempo</h2>
    <v-timeline side="end" align="start">
      <v-timeline-item
        v-for="(year, i) in listLawsId"
        :key="i"
        dot-color="primary"
        size="small"
      >
        <template v-slot:opposite>
          <div
            class="pt-1 headline font-weight-bold text-primary"
            v-text="year.ano"
          ></div>
        </template>
        <div>
          <div>
            <ul>
              <li v-for="item, l in year.laws" :key="l">
                <a class="openLaw" :href="`../text/${item.id}?search=leges`" target="_blank">{{ item.title }}</a>     
              </li>
            </ul>
          </div>
        </div>
      </v-timeline-item>
    </v-timeline>
    <div class="text-center my-10">
      <v-btn color="primary" variant="outlined" @click="qtdMaisMenos(qtdAno)">{{ qtdAno == 5 ? 'ver mais' : 'ver menos' }}</v-btn>
    </div>
  </div>
</template>
<script setup>
  import { useOrderBy } from '@/composables/orderBy'
  import { useLawStore } from '@/store/LawsStore'
  import { ref, computed } from 'vue'

  const lawStore = useLawStore()

  const resultsSearch = ref([])
  const totalDocs = ref(0)
  const qtdAno = ref(5)

  const props = defineProps({
    listLaw: Object
  })

    
  const listLawsId = computed(() => {
    let list = resultsSearch.value.map(x => x._source)

    const lawsPorAno = list.reduce((lawsPorAno, lawAtual) => {
      const anoExiste = lawsPorAno.find( ano => ano.ano == lawAtual.ano)

      if(anoExiste){
        anoExiste.laws.push(lawAtual)
      } else {
        lawsPorAno.push(
          {
            ano: lawAtual.ano,
            laws: [lawAtual]
          }
        )
      }

      return lawsPorAno
    }, [])

    return lawsPorAno.sort(useOrderBy('ano')).slice(0, qtdAno.value)
  })

  
  const getAllLaws = async() => {
    const resp = await lawStore.getLawsSelected(props.listLaw.idsLawsChanges)
    resultsSearch.value = resp.data;
    totalDocs.value = resp.total;
  }

  const qtdMaisMenos = (item) => {
    if(item == 5){
      qtdAno.value = 1000
    } else {
      qtdAno.value = 5
      const element = document.getElementById('topo')
      element.scrollIntoView({behavior: "smooth"})
    }
  }

  getAllLaws()
  

</script>

<style scoped>
.openLaw{
    color: grey;
    text-decoration: none;
    transition: .5s;
}
.openLaw:hover{
    color: black;
    font-weight: 400;
}
.openLaw::before{
    content: "- ";
}
</style>
