<template>
    <v-card>
        <v-card-text>
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
                class="text-lowercase" variant="text" color="success" prepend-icon="mdi-plus">Incluir referências</v-btn>
               <v-expand-transition>
                   <div v-if="showref">
                    <v-btn prepend-icon="mdi-link" variant="outlined" class="text-lowercase" >incluir a partir dos meus documentos</v-btn>
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
                    <div class="listref" v-if="listRef.length">
                        <div class="d-flex align-center">
                            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                            <h3>Lista de Referências</h3>
                        </div>
                        <v-list class="pa-0 mt-5">
                            <v-list-item v-for="item, i in listRef" :key="i" class="border-b" link>
                            <template v-slot:prepend>
                                <v-icon>
                                    mdi-note-text-outline
                                </v-icon>
                            </template>
                            <template v-slot:append>
                                <v-switch label="Publicar" class="mr-2" hide-details color="success"></v-switch>
                                <OptionsRef />
                            </template>
                            <div>
                                <span class="font-weight-bold">Title</span> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime quod doloremque consecte
                            </div>
                            </v-list-item>
                        </v-list>
                    </div>
                   </div>
               </v-expand-transition>
               <div class="text-right">
                   <v-btn :disabled="!post.title" type="submit" variant="flat" color="primary">Salvar e continuar</v-btn>
               </div>
               <!-- <v-textarea
                    label="Texto"
                    placeholder="Escreva o texto"
                    variant="outlined"
                    v-model="post.text"
                    density="compact"
                    clearable
                    :rules="[rules.minfield, rules.required]"
               ></v-textarea>
               <v-text-field
                    label="Referências"
                    placeholder="Digite o título do post"
                    variant="outlined"
                    v-model="post.references"
                    density="compact"
                    clearable
                    :rules="[rules.minfield, rules.required]"
               ></v-text-field>
               <v-text-field
                    label="Tags"
                    placeholder="Digite o título do post"
                    variant="outlined"
                    v-model="post.references"
                    density="compact"
                    clearable
                    :rules="[rules.minfield, rules.required]"
               ></v-text-field>
               <v-switch label="Publicar" v-model="post.publish" color="success">Publicar</v-switch> -->   
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';
import OptionsRef from './optionsRef.vue';

const showref = ref(false)
const textref = ref(null)


const post = ref({
    title: null, 
    subtitle: null, 
    imgLink: null,
    text: null,
    tags: [],
    references: [],
    publish: false,
})

const form = ref(null)
const formref = ref(false)

const rules = {
    required: value => !!value || "campo obrigatório", 
    minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
}

const listRef = ref([1])

const savePost = async () => {
    const { valid } = await form.value.validate()
        if(valid) {
            console.log('salvar', post.value);
        }
}

const addRef = async () => {
        const { valid } = await formref.value.validate()
        if(valid) {
            listRef.value.push(textref.value);
            textref.value = null
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