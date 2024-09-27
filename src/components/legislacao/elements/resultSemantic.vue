<template>
    <div>
        <v-alert variant="tonal" type="warning" class="my-5">
            <h3>ATENÇÃO</h3>
            <p>Base apenas para teste com resultados limitados a pesquisa na <b>medida provisória</b>.</p>
            <p>É possível que erros ocorram.</p>
        </v-alert>
        <v-btn variant="outlined"  v-if="listSearch.length">Limpar</v-btn>
        <div v-for="item, i in listSearch" :key="i" class="my-5 border pa-2">
            <p>{{ item._source.text_page }}</p>
            <p>{{ item._source.ano }}</p>
        </div>
    </div>
    <!-- <div class="text-center mt-5" v-else>
        <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
        ></v-progress-circular>
    </div> -->
</template>

<script>
    export default {
        data(){
            return{

            }
        },
        props:{
            listSearch: Array
        }
    }
</script>

<style lang="scss" scoped>

</style>