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
<script>
  import api from "@/services/api"

  export default {
    data: () => ({
      years: [
        {
          color: 'primary',
          year: '1960',
          laws: []
        },
        {
          color: 'primary',
          year: '1970',
          laws: []
        },
        {
          color: 'primary',
          year: '1980',
          laws: []
        },
        {
          color: 'primary',
          year: '1990',
          laws: []
        },
        {
          color: 'primary',
          year: '2000',
          laws: []
        },
      ],
      resultsSearch: [],
      totalDocs: 0,
      reverse: false,
      qtdAno: 5
    }),
    props:{
      listLaw: Object
    },
    computed:{
      listLawsId(){
        let list = this.resultsSearch.map(x => x._source)

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

        return lawsPorAno.sort(this.orderAno).slice(0, this.qtdAno)
      }
    },
    methods:{
      async getAllLaws(){
        const listLaw = this.listLaw.idsLawsChanges
        const response = await api.post("laws_v3/_search", {
            from: 0,
            size: 5000,
            query: {
                "bool": {
                    "must": [
                        {
                            "terms": {
                                "id": listLaw
                            }
                        },
                    ]
                }
            }
        })
        console.log(response);
        this.resultsSearch = response.data.hits.hits;
        this.totalDocs = response.data.hits.total.value;
      },
      orderAno(a, b){
          return this.reverse
              ? a.ano -  b.ano
              : b.ano -  a.ano
      },
      qtdMaisMenos(item){
        if(item == 5){
          this.qtdAno = 1000
        } else {
          this.qtdAno = 5
          const element = document.getElementById('topo')
          element.scrollIntoView({behavior: "smooth"})

        }
      }
    },
    created(){
      this.getAllLaws()
    }
  }
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
