<template>
     <v-list
      :items="items"
      lines="three"
      item-props
    >
        <template v-slot:prepend>
            <v-avatar>
                <v-icon>mdi-forum</v-icon>
            </v-avatar>
        </template>
        <template v-slot:subtitle="{ subtitle }">
            <div v-html="subtitle"></div>
        </template>
    </v-list>
    <Pagination />
</template>

<script setup>
import Pagination from './pagination.vue';

     const items = [
        { type: 'subheader', title: 'Todos os Posts' },
        {
          title: 'Brunch this weekend?',
          subtitle: `<span class="text-primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        { type: 'divider', inset: true },
        {
          title: 'Summer BBQ',
          subtitle: `<span class="text-primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
        },
        { type: 'divider', inset: true },
        {
          title: 'Oui oui',
          subtitle: '<span class="text-primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        },
        { type: 'divider', inset: true },
        {
          title: 'Birthday gift',
          subtitle: '<span class="text-primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
        },
        { type: 'divider', inset: true },
        {
          prependAvatar: 'mdi-account',
          title: 'Recipe to try',
          subtitle: '<span class="text-primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        }
      ]
</script>

<style lang="scss" scoped>

</style>