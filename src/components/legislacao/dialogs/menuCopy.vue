<template>
  <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          color="grey"
          v-bind="props"
          variant="text"
          icon="mdi-content-copy"
          title="compartilhar"
        >
        </v-btn>
      </template>
      <v-list class="my-0 py-0">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="index"
          @click="copyLink()"
        >
          <v-list-item-title>{{ item.title }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
</template>

<script setup>

    const  items = [
        { title: 'Copiar Link' }
      ]
    const props = defineProps({
      page: String
    })

    const emits = defineEmits(['copyLink'])
    
    const copyLink = () => {
      const text =`https://legislacao.estudodalei.com.br/textpage/${props.page}`
      navigator.clipboard.writeText(text);
      emits('copyLink', text);
    } 
    
</script>

<style lang="scss" scoped>

</style>
