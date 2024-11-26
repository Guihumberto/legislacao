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
            <v-btn variant="tonal" color="red" prepend-icon="mdi-file-pdf-box" class="ml-2 mb-2 btn" @click="gerarPdf()">PDF</v-btn>
            <div class="border pa-5 mb-2 bg-white">
                <div class="font-weight-bold d-flex justify-space-between">
                    <p >{{ listPage.tipo }} | {{ listPage.page_to_norma.title }} | {{ listPage.ano }}</p> 
                    <p>Página: {{ listPage.num_page }} </p>
                </div>
                <div class="corpo">
                    <p v-html="listPage.text_page"></p> 
                </div>
            </div>
        </div>
    </section>
</template>

<script>
     import api from "@/services/api"

     import { usePrintMail } from '@/store/PrintMailStore'
     const printStore = usePrintMail()    

    export default {
        data(){
            return{
                id: this.$route.params.id,
                textLaws: {},
                load: false
            }
        },
        computed:{
            listPage(){
                let list = this.textLaws

                list.text_page = list.text_page.replace(/\n+/g, '<br>');
                
                    
                return list
            }
        },
        methods:{
            async getPage(){
                this.load = true
                try {
                    const response = await api.get(`pages_v2/_doc/${this.id}`)
                    this.textLaws = response.data._source
                } catch (error) {
                    console.log("error");
                }finally{
                    this.load = false
                }
            },
            gerarPdf(){
                printStore.downloadPDF(this.listPage)
            },
            voltar(){
                this.$router.push("/leges");
            }
        },
        created(){
            this.getPage()
        }
    }
</script>

<style lang="scss" scoped>
.section {
    min-height: 100vh;
}
.sizeLoad{
    min-height: 60vh;
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
}
</style>