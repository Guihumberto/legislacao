<template>
    <v-card>
        <v-card-text v-if="!writeText">
            <v-form @submit.prevent="savePost()" ref="form" class="form">
               <v-text-field
                    label="Título"
                    placeholder="Digite o título do post"
                    variant="outlined"
                    v-model="post.title"
                    density="compact"
                    clearable
                    :rules="[rules.minfield, rules.required]"
               ></v-text-field>
               <v-text-field
                    label="Subtítulo"
                    placeholder="Digite o subtítulo do post"
                    variant="outlined"
                    v-model="post.subtitle"
                    density="compact"
                    clearable
                    :rules="[rules.minfield, rules.required]"
               ></v-text-field>
               <v-btn 
                    @click="showref = !showref"
                    class="text-lowercase" variant="text" color="success" prepend-icon="mdi-plus">Incluir referências
                </v-btn>
               <v-expand-transition>
                   <div v-if="showref">
                        <DialogListDocs @enviarDocRef="saveDocRef" />
                        <v-form @submit.prevent="addRef()" ref="formref">
                            <v-text-field
                                label="Referência"
                                density="compact"
                                variant="outlined"
                                class="mt-5"
                                placeholder="Exemplo: art. 77, do CTE-MA (lei 7.799/2010)"
                                clearable
                                v-model="textref"
                                :rules="[rules.required, rules.minfield]"
                            >
                                <template v-slot:append>
                                    <v-btn type="submit" density="compact" color="success" icon="mdi-plus"></v-btn>
                                </template>
                            </v-text-field>
                        </v-form>
                        <div class="listref" v-if="post.references.length">
                            <div class="d-flex align-center">
                                <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                                <h3>Lista de Referências</h3>
                            </div>
                            <v-list class="pa-0 mt-5">
                                <v-list-item v-for="item, i in post.references" :key="i" class="border-b" link>
                                <template v-slot:prepend>
                                    <v-icon>
                                        mdi-note-text-outline
                                    </v-icon>
                                </template>
                                <template v-slot:append>
                                    <OptionsRef :document="item" @apagarRef="deleteRef" @apagarRefDoc="deleteDocRef" />
                                </template>
                                <div>
                                    {{ item }}
                                </div>
                                </v-list-item>
                            </v-list>
                        </div>
                        <div class="listref mt-5" v-if="post.refdoc.length">
                            <div class="d-flex align-center">
                                <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                                <h3>Lista de Referências (documentos)</h3>
                            </div>
                            <v-list class="pa-0 mt-5">
                                <v-list-item v-for="item, i in post.refdoc" :key="i" class="border-b" link>
                                <template v-slot:prepend>
                                    <v-icon>
                                        mdi-note-text-outline
                                    </v-icon>
                                </template>
                                <template v-slot:append>
                                    <OptionsRef :document="item" @apagarRef="deleteRef" @apagarRefDoc="deleteDocRef"  />
                                </template>
                                <div>
                                    <span 
                                        class="font-weight-bold">{{ item.norma }}</span>
                                        , pág. {{ item.num_page }}, {{ item.tipo }}, {{ item.ano }}
                                </div>
                                </v-list-item>
                            </v-list>
                        </div>
                   </div>
               </v-expand-transition>
               <div class="text-right">
                   <v-btn :disabled="!post.title" type="submit" variant="flat" color="primary" :loading="postStore.readLoad">Salvar e continuar</v-btn>
               </div>  
            </v-form>
        </v-card-text>
        <v-card-text v-else>
            <div class="mb-5">
                <h1 class="text-h4">{{ post.title }}</h1>
                <h2 class="text-h5">{{ post.subtitle }}</h2>
            </div>
            <v-form @submit.prevent="saveText()" ref="form" class="form">
               <PageEditor @updateContent="updateContent" />
               <div>
                    <v-form @submit.prevent="addRef()" ref="formref">
                            <v-text-field
                                label="Referência"
                                density="compact"
                                variant="outlined"
                                class="mt-5"
                                placeholder="Exemplo: art. 77, do CTE-MA (lei 7.799/2010)"
                                clearable
                                v-model="textref"
                                :rules="[rules.required, rules.minfield]"
                            >
                                <template v-slot:append>
                                    <v-btn type="submit" density="compact" color="success" icon="mdi-plus"></v-btn>
                                </template>
                            </v-text-field>
                    </v-form>
                    <div class="listref" v-if="post.references.length">
                        <div class="d-flex align-center">
                            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                            <h3>Lista de Referências</h3>
                        </div>
                        <v-list class="pa-0 mt-5">
                            <v-list-item v-for="item, i in post.references" :key="i" class="border-b" link>
                            <template v-slot:prepend>
                                <v-icon>
                                    mdi-note-text-outline
                                </v-icon>
                            </template>
                            <template v-slot:append>
                                <OptionsRef :document="item"  @apagarRef="deleteRef" @apagarRefDoc="deleteDocRef" />
                            </template>
                            <div>
                                {{ item }}
                            </div>
                            </v-list-item>
                        </v-list>
                    </div>
                    <div class="listref mt-5" v-if="post.refdoc.length">
                        <div class="d-flex align-center">
                            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                            <h3>Lista de Referências (documentos)</h3>
                        </div>
                        <v-list class="pa-0 mt-5">
                            <v-list-item v-for="item, i in post.refdoc" :key="i" class="border-b" link>
                            <template v-slot:prepend>
                                <v-icon>
                                    mdi-note-text-outline
                                </v-icon>
                            </template>
                            <template v-slot:append>
                                <OptionsRef :document="item"  @apagarRef="deleteRef" @apagarRefDoc="deleteDocRef" />
                            </template>
                            <div>
                                <span class="font-weight-bold">{{ item.norma }}</span>, pág. {{ item.num_page }}, {{ item.tipo }}, {{ item.ano }}
                            </div>
                            </v-list-item>
                        </v-list>
                    </div>
               </div>
               <v-form @submit.prevent="addTag()" class="form mt-5" ref="tagform">
                   <v-text-field
                        label="Tags"
                        placeholder="Digite o título do post"
                        variant="outlined"
                        v-model="tag"
                        density="compact"
                        clearable
                        style="max-width: 300px;"
                        :rules="[rules.required]"
                   >
                        <template v-slot:append>
                            <v-btn type="submit" density="compact" color="success" icon="mdi-plus"></v-btn>
                        </template>
                    </v-text-field>
               </v-form>
               <div v-if="post.tags.length">
                    <v-chip-group>
                        <v-chip 
                            closable
                            @click:close="removeTag(chip)"
                            v-for="chip, c in post.tags" 
                            :key="c">{{ chip }}
                        </v-chip>
                    </v-chip-group>
               </div>
               <div class="d-flex justify-end">
                   <v-switch label="Publicar" v-model="post.publish" color="success">Publicar</v-switch> 
               </div>
               <div class="text-right">
                   <v-btn @click="router.push('/myposts')" variant="text" class="mr-2">Cancelar</v-btn>
                   <v-btn color="success" type="submit" :loading="postStore.readLoad">salvar</v-btn>
               </div>
            </v-form>
        </v-card-text>
        
    </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import OptionsRef from './optionsRef.vue';
import { useRouter, useRoute } from 'vue-router';
import DialogListDocs from './dialogListDocs.vue';
import PageEditor from '../pageEditor.vue';
const router = useRouter()
const route = useRoute()

import { usePostStore } from '@/store/PostStore';
const postStore = usePostStore()

const showref = ref(false)
const writeText = ref(false)
const textref = ref(null)
const tag = ref('teste')


const post = ref({
    title: 'Alcool Etílico', 
    subtitle: 'Benefícios do alcool etílico', 
    imgLink: null,
    text: '',
    tags: [],
    references: [],
    refdoc: [],
    publish: false,
    active: true,
    views: 0,
})

onMounted(async ()=> {
    if(route.params.id){
       const resp = await postStore.getPost(route.params.id)
       writeText.value = true
       post.value = resp
    }
})

const updateContent = (newContent) => {
    post.value.text = newContent
}

const form = ref(null)
const formref = ref(null)
const tagform = ref(null)

const rules = {
    required: value => !!value || "campo obrigatório", 
    minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
}

const addRef = async () => {
        const { valid } = await formref.value.validate()
        if(valid) {
            post.value.references.push(textref.value);
            textref.value = null
        }
}

const deleteRef = (item) => {
    post.value.references = post.value.references.filter( x => x != item)
}

const saveDocRef = (evento) => {
    console.log(evento);
    if(!evento) return
    const list = [ ...evento ]
    list.forEach(x => {
        const objeto = {
            idPage: x.id, 
            idLaw: x.id_law,
            ano: x.ano, 
            num_page: x.num_page, 
            tipo: x.tipo, 
            norma: x.name_law
        }
        post.value.refdoc.push(objeto)
    })
}

const deleteDocRef = (item) => {
    post.value.refdoc = post.value.refdoc.filter( x => x.idPage != item.idPage)
}

const addTag = async () => {
    const { valid } = await tagform.value.validate()
    if(valid){
        const isExist = post.value.tags.find(x => x == tag.value)
        if(isExist) return
        post.value.tags.push(tag.value)
        tag.value = null
    }
}

const removeTag = (c) => {
    post.value.tags = post.value.tags.filter(x => x != c)
}

const savePost = async () => {
    const { valid } = await form.value.validate()
        if(valid) {
            const resp = await postStore.savePost(post.value)
            writeText.value = true
            post.value.id = resp.id
            post.value.dateCreated = resp.dateCreated
            post.value.created_by = resp.created_by
        }
}

const saveText = async () => {
    const { valid } = await form.value.validate()
        if(valid) {
            console.log('salvar', 'voltar', post.value);
            postStore.editPost(post.value)
            router.push('/myposts')
            clear()
        }
}

const clear = () => {
    post.value = {
        title: 'Alcool Etílico 2', 
        subtitle: 'Be222nefícios do alcool etílico', 
        imgLink: null,
        text: '',
        tags: [],
        references: [],
        refdoc: [],
        publish: false,
        active: true,
        views: 0,
    }
}


</script>

<style lang="scss" scoped>
    .form{
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }
</style>