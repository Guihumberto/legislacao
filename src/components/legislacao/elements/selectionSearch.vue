<template>
    <v-menu
        :style="{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }"
        v-model="isVisible"
        :close-on-content-click="false"
        absolute
        >
            <v-btn-toggle
            divided
            variant="flat"
            rounded="xl"
            >
                <v-btn class="bg-success" @click="actionsSearch('search')" prepend-icon="mdi-magnify">
                    <span class="hidden-sm-and-down">por termo</span>
                </v-btn>
                <v-btn class="bg-primary" @click="actionsSearch('leges')" prepend-icon="mdi-magnify">
                    <span class="hidden-sm-and-down">por norma</span>
                </v-btn>
            </v-btn-toggle>
    </v-menu>
 
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter()

  import { useGeneralStore } from '@/store/GeneralStore'
  const generalStore = useGeneralStore()

  const isVisible = ref(false)
  
  const props = defineProps({
    menu: Boolean,
    selectedText: String,
    menuPosition: Object,
    direct: {
      type: Boolean,
      default: false
    }
  })
  
  const actionsSearch = (action) => {
    if(action == 'search') {
      if(props.direct){
        router.push('/leges')
        generalStore.reqChangeFromSelectSearch(true, props.selectedText)
      } else {
        generalStore.reqChangeFromSelectSearch(true, props.selectedText)
      }
    } 
    
    if(action == 'leges') router.push(`/legesporlei?text_search=${props.selectedText}`)

    isVisible.value = false;
  }

  watch(
      () => props.menu, (newVal) => {
        if(props.selectedText.length > 4)
        isVisible.value = newVal;
      }
  )


</script>

<style lang="scss" scoped>

</style>