<template>
    <div class="text-center">
      <v-menu location="top">
        <template v-slot:activator="{ props }">
          <v-btn density="compact" variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            link
          >
            <template v-slot:prepend>
                <v-icon>
                    {{ item.icon }}
                </v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </template>
  <script>
    export default {
      data: () => ({
        items: [
          { title: 'Editar', icon: 'mdi-pencil'},
          { title: 'Excluir', icon: 'mdi-delete' },
        ],
        locations: [
          'top',
          'bottom',
          'start',
          'end',
          'center',
        ],
        location: 'end',
      }),
    }
  </script>