<template>
     <section>
        <div class="containerNews">
            <div v-if="pusblishStore.readLoad" class="load">
                <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                ></v-progress-circular>
            </div>
            <v-list class="border pa-0 mt-2" v-else>
                <v-list-subheader>Quantidade de documentos: {{ pusblishStore.readPublicacoes.length }}</v-list-subheader>
                <transition-group name="fade">
                    <v-list-item
                        v-for="item, i in pusblishStore.readPublicacoes"
                        :key="item.idU"
                        :value="item.idU"
                        :active-class="idDelete == item.idU ? 'text-pink delete' : ''"
                        class="py-3"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>

                        <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">{{ item.name_law }}</v-list-item-subtitle>

                        <v-list-item-subtitle class="text-high-emphasis">{{ item.text }}</v-list-item-subtitle>
                        <small class="mb-4 text-high-emphasis opacity-60">Data da inclusão: {{ useDateNow(item.dateCreate) }}</small>

                        <template v-slot:append="{ isSelected }">
                        <v-list-item-action v-if="idDelete != item.idU">
                            <EditPublish @click="idEdit = { ...item }" :edit="idEdit" />
                            <v-btn 
                                color="red" variant="text" 
                                @click="idDelete = item.idU" icon="mdi-delete"></v-btn>
                        </v-list-item-action>
                        <v-list-item-action v-else class="action">
                            <v-btn variant="text" color="grey" class="mr-2" @click="clear">Cancelar</v-btn>
                            <v-btn variant="tonal" prepend-icon="mdi-delete" @click="deleteReg" :loading="pusblishStore.readLoad" :disabled="pusblishStore.readLoad">Apagar</v-btn>
                        </v-list-item-action>
                        </template>
                    </v-list-item>
                </transition-group>
            </v-list>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useDateNow } from '@/composables/dateFormat';

    import { usePublishStore } from '@/store/publishStore';
    import EditPublish from './editPublish.vue';
    const pusblishStore = usePublishStore() 

    const idDelete = ref(null)
    const idEdit = ref(null)

    onMounted(() => {
        pusblishStore.getPublicacoes()
    })

    const deleteReg = async () => {
        pusblishStore.removePublicacoes(idDelete.value)
        clear()

    }

    const clear = () => {
        idDelete.value = null
        idEdit.value = null
    }


</script>


<style scoped>
section .containerNews{
    width: min(90vw, 1000px);
    margin-inline: auto;
    padding: 2rem 0 2rem
}
.load{
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
}
.delete .action{
    animation: aumentar .5s ease;
}
@keyframes aumentar {
    0%{
        opacity: 0;
        transform: translateX(-300px);
    }
    100%{
        opacity: 1;
        transform: translateX(0);
    }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>