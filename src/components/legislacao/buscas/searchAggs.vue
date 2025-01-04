<template>
    <div>
        <h2>Resultados Agregados</h2>  
        <div>
            <div v-for="item, i in allSearchResultas" :key="i">
                <div>
                    <div>
                        <h3 class="font-weight-bold">{{ nomeTipo(item.tipo).mudar }}</h3>
                        <div class="d-flex justify-space-between py-2 ml-3" v-for="lei, l in item.subcategorias" :key="l">
                            <h4>{{ lei.title }} - {{ lei.ano }}</h4>
                            <div class="btns">
                                <aggspage :page="lei.page" />
                                <v-btn variant="tonal" color="red" size="small" @click="openLaw(lei)" title="Ver todo o documento">PDF</v-btn>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import aggspage from './pageAggs.vue'

    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore() 


    const props = defineProps({
        searchResults: Array
    })

        
    const allSearchResultas = computed(() => {
        let list = props.searchResults.map(x => x._source)
        
        const classificacao = list.reduce((acumulador, item) => {
            // Verifica se a categoria já existe no acumulador
            const categoriaExistente = acumulador.find(c => c.tipo === item.tipo);

            if (categoriaExistente) {
                // Se a categoria já existe, verifica se a subcategoria já existe
                const subcategoriaExistente = categoriaExistente.subcategorias.find(s => s.parent === item.page_to_norma.parent);

                if (subcategoriaExistente) {
                    // Se a subcategoria já existe, adicione o valor
                    subcategoriaExistente.page.push({page: item.num_page, text: item.text_page});
                } else {
                    // Se a subcategoria não existe, crie uma nova subcategoria
                    categoriaExistente.subcategorias.push({
                        ano: item.ano,
                        parent: item.page_to_norma.parent,
                        title: item.page_to_norma.title,
                        page: [{page: item.num_page, text: item.text_page}],
                    });
                }
            } else {
                // Se a categoria não existe, crie uma nova categoria com a subcategoria
                acumulador.push({
                    tipo: item.tipo,
                    subcategorias: [{
                        ano: item.ano,
                        parent: item.page_to_norma.parent, 
                        title: item.page_to_norma.title,
                        page: [{page: item.num_page, text: item.text_page}],
                    }],
                });
            }

            return acumulador;
            }, []);
            return classificacao
        })
   
        const openLaw = (item) => {
            let link = item.parent
            window.open(`text/${link}?search=search`, '_blank');
        }

        const nomeTipo = (item) => {
            let nome = generalStore.fonteNome(item)
            return nome
        }
       
</script>

<style lang="scss" scoped>
.btns{
    display: flex;
    gap: .5rem;
}
</style>