<template>
    <div v-if="resultSearch.length" class="sidebarWrapper">
        <v-btn variant="text" v-if="!showBar && resultSearch.length" 
        @click="showBar = true" class="btnHidden ma-1" color="black" icon="mdi-chevron-right"></v-btn>
        <v-expand-x-transition>
            <div class="sidebar" v-if="showBar && resultSearch.length">
                <div class="d-flex justify-space-between align-baseline">
                    <h3>Filtros</h3>
                    <div>
                        <v-btn class="btnocultar" variant="text" color="grey" @click="showBar = !showBar">ocultar</v-btn>
                        <v-icon class="arrowbtn" @click="large_sidebar()">mdi-arrow-left-right</v-icon>
                    </div>
                </div>
                <div class="box">
                    <h4 class="mb-2">Normas</h4>
                    <v-card flat min-height="200">
                        <v-treeview 
                            v-model:activated="active"
                            v-model:opened="open"
                            :items="listNormas"
                            item-title="title"
                            item-value="id"
                            @click="lawOpen()"
                            density="compact"
                            activatable
                            open-on-click
                            class="mx-n5"
                            title="Abrir a lei completa em uma nova página"
                    >
                    </v-treeview>
                    </v-card>
                </div>
                <div class="box">
                    <h4 class="mb-2">Períodos</h4>
                    <v-card flat min-height="200">
                        <v-treeview 
                            v-model:activated="active"
                            v-model:opened="open"
                            :items="listAnos.sort()"
                            item-title="title"
                            item-value="id"
                            @click="lawOpen()"
                            density="compact"
                            activatable
                            open-on-click
                            class="mx-n5"
                            title="Abrir a norma completa em uma nova página"
                        >
                        </v-treeview>
                    </v-card>
                </div>
            </div>
        </v-expand-x-transition>
       
    </div>
</template>
<script>
    import { useGeneralStore } from '@/store/GeneralStore'
    const generalStore = useGeneralStore()

    export default{
        data(){
            return{
                showBar: true,
                active: [],
                open: [],
                reverse: false
            }
        },
        computed:{
            listSearchs(){
                return generalStore.readListStore
            },
            resultSearch(){
                return generalStore.readResultSearch
            },
            listAnos(){
                let list = this.resultSearch.map( x => x._source)

                const classificacao = list.reduce((acumulador, item) => {
                // Verifica se a categoria já existe no acumulador
                    const categoriaExistente = acumulador.find(c => c.title == item.ano);

                    if (categoriaExistente) {
                        const subcategoriaExistente = categoriaExistente.children.find(s => s.id === item.page_to_norma.parent);

                        if (!subcategoriaExistente) {
                            categoriaExistente.children.push({
                                id: item.page_to_norma.parent,
                                title:  item.page_to_norma.title.toLowerCase()
                            });
                        }
                    } else {
                        // Se a categoria não existe, crie uma nova categoria com a subcategoria
                        acumulador.push({
                            title: item.ano.toString(),
                            children: [{
                                id: item.page_to_norma.parent,
                                title:  item.page_to_norma.title.toLowerCase()
                            }],
                        });
                    }

                return acumulador;
                }, []);

                return classificacao.sort(this.order)
            },
            listNormas(){
                let list = this.resultSearch.map( x => x._source)

                const classificacao = list.reduce((acumulador, item) => {
                // Verifica se a categoria já existe no acumulador
                    const categoriaExistente = acumulador.find(c => c.title === this.nomeTipo(item.tipo));

                    if (categoriaExistente) {
                        const subcategoriaExistente = categoriaExistente.children.find(s => s.id === item.page_to_norma.parent);

                        if (!subcategoriaExistente) {
                            categoriaExistente.children.push({
                                id: item.page_to_norma.parent,
                                title:  item.page_to_norma.title.toLowerCase()
                            });
                        }
                    } else {
                        // Se a categoria não existe, crie uma nova categoria com a subcategoria
                        acumulador.push({
                            title: this.nomeTipo(item.tipo),
                            open: 0,
                            children: [{
                                id: item.page_to_norma.parent,
                                title:  item.page_to_norma.title.toLowerCase()
                            }],
                        });
                    }

                return acumulador;
                }, []);

                return classificacao.sort(this.orderTipo)
            }
        },
        methods:{
            lawOpen(){
                console.log("", this.active)
                let link = this.active[0]
                if(link){
                    window.open(`text/${link}?search=search`, '_blank');
                }
            },
            order(a, b){
                    return this.reverse
                        ? a.title -  b.title
                        : b.title -  a.title
            },
            orderTipo(a, b){
                return this.reverse
                    ? a.title -  b.title
                    : b.title -  a.title
            },
            large_sidebar(){
                this.$emit('large')
            },
            nomeTipo(item){
                let nome = generalStore.fonteNome(item)
                return nome.mudar
            },
        }
    }
</script>
<style scoped>
.sidebar{
    padding: .5rem;
}
.sidebar h3{
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
}
.sidebar .box{
    padding: 0.5rem;
    border-top: blue solid;
    border-radius: grey;
    box-shadow: 0 1rem 1.5rem -0.5rem rgb(202, 199, 199);
    margin-bottom: 1rem;
}
.tiponorma{
    text-transform: uppercase;
}
.laws{
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    
}
.item-laws label p {
    text-transform: lowercase;
    font-size: .95rem;
}
.item-laws label p:first-letter {
    text-transform: capitalize;
}
@media (max-width: 1670px) {
    .arrowbtn, .btnocultar{
        display: none;
    }
}
</style>