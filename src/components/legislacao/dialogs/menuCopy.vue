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
      <v-list>
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

<script>
  export default {
    data: () => ({
      items: [
        { title: 'Copiar Link' }
      ],
    }),
    props:{
      page: String
    },
    methods:{
      copyLink(){
        const text =`https://legislacao.sefaz.ma.gov.br/textpage/${this.page}`
        navigator.clipboard.writeText(text);
        this.$emit('copyLink', text);
      } 
    }
  }
</script>

<style lang="scss" scoped>

</style>
