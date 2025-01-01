<template>
    <section>
        <div class="sizeLoad" v-if="load">
            <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
            ></v-progress-circular>
        </div>
        <div class="container" v-else>
            <v-btn variant="tonal" @click="voltar" class="mb-2 btn">Voltar</v-btn>
            <v-btn variant="tonal" @click="$router.push(`/avancado/${id}`)" class="mb-2 ml-2 btn" color="primary">MODO AVANÇADO</v-btn>
            <div class="border pa-5 mb-2 bg-white pagina" v-for="item, i in listPage" :key="i">
                <div class="font-weight-bold d-flex justify-space-between header">
                    <p>{{ item.page_to_norma.title }} | {{ item.ano }}</p> 
                    <p>Página: {{ item.num_page }}/{{ listPage.length }} </p>
                </div>
                <div class="corpo">
                    <p v-html="item.text_page"></p> 
                </div>
            </div>
        </div>
    </section>
</template>

<script>
     import api from "@/services/api"

    export default {
        data(){
            return{
                id: this.$route.params.id,
                textLaws: [],
                load: false,
                route_query: this.$route.query.search 
            }
        },
        computed:{
            listPage(){
                let list = this.textLaws.map(x => x._source)
                let list1 = []

                list.forEach(x => {
                    x.text_page = x.text_page.replace(/\n+/g, '<br>');
                    list1.push(x)
                })
                    
                return list1.sort((a, b) => a.num_page - b.num_page)
            }
        },
        methods:{
            async getAll(){
                this.load = true
                try {
                    const response = await api.post("pages_v2/_search", {
                        from: 0,
                        size: 5000,
                        "query": {
                            "bool": {
                                "must": [
                                    {
                                    "match": {
                                        "page_to_norma.parent": this.id
                                    }
                                    }
                                ]
                            }
                        }
                    })
                    this.textLaws = response.data.hits.hits
                } catch (error) {
                    console.log("error");
                }finally{
                    this.load = false
                }
            },
            voltar(){
                if(this.route_query == 'search') this.$router.push("/leges");
                if(this.route_query == 'leges') this.$router.push("/legesporlei");
                if(this.route_query == 'favs') this.$router.push("/favorites");
                if(!this.route_query) this.$router.push("/leges");
            }
        },
        created(){
            this.getAll()
        }
    }
</script>

<style lang="scss" scoped>
section {
    min-height: calc(100vh - 466px);
}
.sizeLoad{
    height: 55vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.corpo{
    margin: 2rem;
    font-size: 15px;
    line-height: 2.1em
}
@media print {
    .btn {
        display: none;
    }
    .pagina {
        width: 190mm;
        height: 285mm;
        margin: 0;
    }
    // .pagina .header{
    //     height: 10mm;
    //     margin-bottom: 2rem;
    // }

    .content {
        box-shadow: none;
        margin: 0;
    }
}

</style>