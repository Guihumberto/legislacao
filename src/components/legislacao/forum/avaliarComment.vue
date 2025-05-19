<template>
    <v-btn-group
        variant="outlined"
        divided
        density="compact"
        class="mt-5"
    >
        <v-tooltip text="Pontos" location="top">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" :color=" comment.pontos >= 0 ? 'success' : 'error'" variant="tonal" :loading="load">
                    {{ comment.pontos }}
                </v-btn>
            </template>
        </v-tooltip>
        <v-tooltip text="Avaliar como bom" location="top">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" @click="votar('bom')" variant="tonal" :color="getVotoUsuario() == 'bom' ? 'success':''" :disabled="load">
                    <v-icon icon="mdi-chevron-up" ></v-icon>
                </v-btn>
            </template>
        </v-tooltip>

        <v-tooltip text="Avaliar como ruim" location="top">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" @click="votar('ruim')" variant="tonal" :color="getVotoUsuario() === 'ruim' ? 'error': ''" :disabled="load">
                    <v-icon icon="mdi-chevron-down" ></v-icon>
                </v-btn>
            </template>
        </v-tooltip>
    </v-btn-group>
</template>

<script setup>
    import { ref } from 'vue'

    import { useCommentStore } from '@/store/CommentStore'
    const commentStore = useCommentStore()
    
    import { useLoginStore } from '@/store/LoginStore'
    const loginStore = useLoginStore()

    const load = ref(false)
    const props = defineProps({
        comment: {
            type: Object,
            required: true
        }
    })

    const getVotoUsuario = () => {
        const id = props.comment.id + loginStore.readLogin.cpf
        const votoAtual = commentStore.readListVotos.find( x => x.id == id ) 
        return votoAtual?.type || null
    }


    const votar = async (tipo) => {
        load.value = true
        const id = props.comment.id + loginStore.readLogin.cpf
        const votoAtual = commentStore.readListVotos.find( x => x.id == id ) 
   
        if (!votoAtual) {
            console.log('voto novo');
            props.comment.pontos += tipo === 'bom' ? 1 : -1
            await commentStore.saveVotoComment(props.comment, tipo)
        } else if (votoAtual.type === tipo) {
            console.log('voto dois');
            props.comment.pontos += tipo === 'bom' ? -1 : 1
            await commentStore.deleteVotoComment(id, props.comment)
        } else {
            console.log('mudança de voto');
            votoAtual.type = tipo
            props.comment.pontos += tipo === 'bom' ? 2 : -2
            await commentStore.saveVotoComment(props.comment, tipo)
        }
        load.value = false
    }
    
</script>

<style scoped>
.ativo {
  background-color: #4caf50;
  color: white;
}

</style>