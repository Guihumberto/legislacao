<template>
     <div class="wrapper">
        <section class="conteudo" ref="topUp" :class="rightWidth > 900 ? 'conteudo1' : 'conteudo2'">
            <div>
                <div class="mt-2 d-flex ga-2 align-center pa-2">
                    <v-icon>mdi-post-outline</v-icon>
                        <h1 class="text-h5">Blog da Lei</h1>
                </div>
                <p v-if="!listArtsSelected.length && !artOneSelect">Selecione o Dispositivo para criar mapas mentais por IA</p>
                <div v-else class="text-center">
                    Artigo<span v-if="listArtsSelected.length > 1">s</span> selecionado<span v-if="listArtsSelected.length > 1">s</span>: 
                    <v-chip v-if="artOneSelect" color="primary">{{ artOneSelect }} </v-chip> 
                    <v-chip v-if="listArtsSelected.length" v-for="item, i in listArtsSelected" :key="i" class="ml-2">{{ item }}</v-chip>
                    <v-form @submit.prevent="submitForm" ref="form" v-if="blogLawStore.masterUser">
                        <v-textarea
                            label="Gerar"
                            v-model="mapFormString"
                            :rules="[(v) => !!v || 'Campo obrigatório']"
                            variant="outlined"
                            class="mt-2"
                        >
                        </v-textarea>
                        <div class="my-5 d-flex ga-2 justify-center">
                            <v-btn :loading="load" :disabled="load" type="submit" variant="flat" color="primary">Gerar Post</v-btn>
                        </div>
                    </v-form>
                    <div class="mt-5">
                      <v-btn :loading="load" :disabled="load" @click="generetePostIa" variant="flat" color="error" prepend-icon="mdi-robot">Gerar Post IA</v-btn>
                    </div>
                </div>
                <div class="mt-5">
                    <Posts :posts="posts" />
                </div>

            </div>
        </section>
    </div>
</template>

<script setup>
    import { inject, onMounted, ref, watch, computed } from 'vue';

    import { useBlogLawStore } from '@/store/forum/blogLawStore'
    import { useForumStore } from '@/store/ForumStore';
    import { useRoute } from "vue-router";
   
    import Posts from '../blogLaw/post.vue';

    const blogLawStore = useBlogLawStore()
    const forumStore = useForumStore()
    const route = useRoute()
 
    const rightWidth = inject('rightWidth')
    
    const posts = computed(() => {
      let list = blogLawStore.sortedPosts
       
      if(listArtsSelected.value.length){
        list = list.filter(item => {
          return item.art === artOneSelect.value || item.arts.some(art => listArtsSelected.value.includes(art))
        })
      }

      console.log('list', list);

      return list.sort((a, b) => (a.art < b.art) ? -1 : 1)
    })


    const getPostLaw = async(id) => {
        blogLawStore.fetchPosts(id)
    }

    const artOneSelect = ref(route.query.art)

    const listArtsSelected = computed(() => {
        const queryArts = route.query.arts
        if (queryArts) {
            // Se arts for um array (múltiplos valores)
            if (Array.isArray(queryArts)) {
               return queryArts.map(art => parseInt(art))
            } 
            // Se arts for uma string (um único valor)
            else {
                return [parseInt(queryArts)]
            } 
        } else {
           return []
        }
    })

    watch(
        () => route.query.arts,
        () => {
            // getMindMapArt()
            artOneSelect.value = null
        }
    )

    watch(
        () => route.query.art,
        () => {
            artOneSelect.value = route.query.art
            // getMindMapArt()
        }
    )
    
    const mapFormString = ref('')
    const form = ref(null)
    const load = ref(false)

    const submitForm = async () => {
        const { valid } = await form.value.validate()
        if (!valid) return
        
        load.value = true

        let objeto = { id: null, art: null, arts: []}

        try {
            objeto = JSON.parse(mapFormString.value)
        } catch (err) {
            console.error('Erro ao fazer parse de mapFormString.value:', err)
            alert('Erro: o conteúdo do campo deve estar em formato JSON válido.')
            return
        }

        objeto.id_law = forumStore.readGroupForum._source.idLaw
        objeto.art = artOneSelect.value || listArtsSelected.value[0]
        objeto.arts = listArtsSelected.value
        objeto.name_law = forumStore.readGroupForum._source.title

        await blogLawStore.createPost(objeto)
        // getPostLaw()
        const { art, arts, ...outrosParams } = route.query
        // router.push({
        //     path: route.path, 
        //     query: {
        //         ...outrosParams,      
        //         art: objeto.art,   
        //         arts: [...objeto.arts]          
        //     }
        // })
        load.value = false
        mapFormString.value = ''
    } 

    const generetePostIa = async () => {
        load.value = true

        const objeto = {
          id_law: forumStore.readGroupForum._source.idLaw,
          art: artOneSelect.value || listArtsSelected.value[0],
          arts: listArtsSelected.value,
          name_law: forumStore.readGroupForum._source.title,
        }

        await blogLawStore.generetePostIa(objeto)
        // getMindMapArt()
        const { art, arts, ...outrosParams } = route.query
        // router.push({
        //     path: route.path, 
        //     query: {
        //         ...outrosParams,      
        //         art: objeto.art,   
        //         arts: [...objeto.arts]          
        //     }
        // })
        load.value = false
    }  

    onMounted(async() => {
        await getPostLaw(forumStore.readGroupForum._source.idLaw)
    })

</script>

<style scoped>
    .wrapper {
        display: flex;
        justify-content: center; /* Isso centraliza o 'conteudo' se ele não ocupar 100% da largura do 'wrapper' */
        min-height: 50vh;
        font-family: Arial, sans-serif;
        padding-bottom: 2rem;
        /* Se você quer que o conteúdo ocupe toda a altura do wrapper, adicione: */
        align-items: stretch;
    }

    .conteudo {
        margin-top: 1rem;
        padding: 0 20px;
        background-color: #fffdfd;
        flex-grow: 1; /* Permite que o 'conteudo' se expanda */
        /* 'box-sizing: border-box;' é bom para evitar problemas com padding e largura */
        box-sizing: border-box;
    }

    /* Se a ideia é que 'conteudo1' e 'conteudo2' limitem a largura máxima, mantenha assim: */
    .conteudo1 {
        max-width: 900px; /* Altere de 'width' para 'max-width' para que ele cresça até 900px */
    }

    .conteudo2 {
        max-width: 900px;
    }
</style>