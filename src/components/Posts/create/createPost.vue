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
               <v-textarea
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
               <v-switch label="Publicar" v-model="post.publish" color="success">Publicar</v-switch>
               <div class="text-right">
                   <v-btn type="submit" variant="flat" color="primary">Salvar</v-btn>
               </div>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';

const post = ref({
    title: null, 
    subtitle: null, 
    text: null,
    tags: [],
    references: [],
    publish: false
})

const form = ref(null)

const rules = {
    required: value => !!value || "campo obrigatório", 
    minfield: (v) => (v||'').length >= 3 || "Mínimo 4 caracteres",
}

const savePost = async () => {
        const { valid } = await form.value.validate()
        if(valid) {}
}
</script>

<style lang="scss" scoped>
.form{
    display: flex;
    flex-direction: column;
    gap: .5rem;
}
</style>