<template>
    <section>
        <div class="container">
            <div v-if="load" class="load">
                <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                    ></v-progress-circular>
            </div>
            <div class="legislacao  my-5" v-else>
                <div class="d-flex justify-end">
                    <small>Total de normas: {{ consultaStore.readTotalLaws }} com {{ consultaStore.readTotalPages }} páginas</small>
                </div>
                <div class="allLaws">
                    <v-expansion-panels v-if="orgLaws.length">
                        <v-expansion-panel
                            v-for="tipo, t in orgLaws.sort(useOrderBy('tipo', true))" :key="t"
                        >
                        <v-expansion-panel-title 
                            expand-icon="mdi-plus" collapse-icon="mdi-minus">
                            {{ generalStore.fonteNome(tipo.tipo).mudar }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-expansion-panels variant="popout">
                                <v-expansion-panel
                                    v-for="ano, a in tipo.subcategorias.sort(useOrderBy('ano', false))" :key="a" >
                                    <v-expansion-panel-title>{{ ano.ano }} ({{ ano.norma.length }}) </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <div class="even-columns">
                                            <div   v-for="law, l in ano.norma.sort(useOrderBy('tilte'))" :key="l">
                                                <a class="openLaw" :href="`text/${law.id}?search=leges`" target="_blank">{{ law.title }}</a>
                                            </div>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
            
                        </v-expansion-panel-text>
            
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-alert variant="tonal" type="warning" v-else>
                        <p>Carregando...</p>
                    </v-alert>
                    <div class="text-right mt-5">
                        <v-btn :disabled="lawStore.readTotalLaws == consultaStore.readTotalLaws" :loading="lawStore.readLoad" @click="lawStore.changeNroLaws()" variant="flat" color="primary">baixar normas anteriores a 2023</v-btn>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    import { ref, computed } from 'vue'
    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()  

    import { useLawStore } from '@/store/LawsStore'
    const lawStore = useLawStore()  

    import { useConsultaStore } from '@/store/ConsultaStore'
    const consultaStore = useConsultaStore()  

    import { useOrderBy } from '@/composables/orderBy'

    const search = ref({
        text: '',
        years: [],
        fonte: []
    })
    const load = ref(false)
    
    const orgLaws = computed(() => {
        let list = lawStore.listAllLaws.map(x => x._source)

        if(search.value.text){
            let search = search.value.text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace('.', '')
            //retirar caracteres especiais
            let exp = new RegExp(search.trim().replace(/[\[\]!'@><|//\\&*()_+=]/g, ""), "i")
            //fazer o filtro
            list =  list.filter(item => exp.test(item.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace('.', '') ) )
        }

        if(search.value.years.length){
            list = list.filter(x => search.value.years.includes(x.ano))
        }

        if(search.value.fonte.length){
            list = list.filter(x => search.value.fonte.includes(x.tipo))
        }

        const classificacao = list.reduce((acumulador, item) => {
        // Verifica se a categoria já existe no acumulador
        const categoriaExistente = acumulador.find(c => c.tipo === item.tipo);

        if (categoriaExistente) {
            // Se a categoria já existe, verifica se a subcategoria já existe
            const subcategoriaExistente = categoriaExistente.subcategorias.find(s => s.ano === item.ano);

            if (subcategoriaExistente) {
                // Se a subcategoria já existe, adicione o valor
                subcategoriaExistente.norma.push({id: item.id, page: item.total_pages, title: item.title, path: item.path, revogado: item.revogado});
            } else {
                // Se a subcategoria não existe, crie uma nova subcategoria
                categoriaExistente.subcategorias.push({
                    ano: item.ano,
                    norma: [{id: item.id, page: item.total_pages, title: item.title, path: item.path, revogado: item.revogado}],
                });
            }
        } else {
            // Se a categoria não existe, crie uma nova categoria com a subcategoria
            acumulador.push({
                tipo: item.tipo,
                subcategorias: [{
                    ano: item.ano,
                    norma: [{id: item.id, page: item.total_pages, title: item.title, path: item.path, revogado: item.revogado}],
                }],
            });
        }

        return acumulador;
        }, []);

        return classificacao
    })
        
</script>

<style lang="scss" scoped>
.container{
    min-height: calc(100vh - 820px);
}
.load{
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.content{
    animation: slideTopSearch 1.5s ease-in;
    margin: 1rem 0;
    padding: 2rem 5rem;
    border: 1px solid grey;
    border-radius: 12px;
    transition: 1s ease;
}
.oneresult{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.even-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.openLaw{
    color: grey;
    text-decoration: none;
    transition: .5s;
}
.openLaw:hover{
    color: black;
    font-weight: 600;
}
.openLaw::before{
    content: "- ";
}
.radios, .autocompletes{
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
}
.linkTO{
    padding: .5rem;
    font-weight: 500;
    color: rgb(160, 195, 107);
    transition: .5s;
}
.linkTO:hover{
    color: rgb(120, 144, 83);
    background: rgb(227, 235, 216);
}
.legislacao, .allLaws{
    animation: slideTopSearch .5s ease-in;
}
@keyframes slideTopSearch {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}
@media (max-width: 500px) {
    .content{
        padding: 1rem;
    }
    .radios{
        flex-direction: column;
        align-items: baseline;
        gap: 0;
    }
    .autocompletes{
        flex-direction: column;
        gap: 0;
    }
    .even-columns {
        display: grid;
        grid-template-columns: 1fr;
    }
    .contador{
        display: none;
    }
}
</style>
