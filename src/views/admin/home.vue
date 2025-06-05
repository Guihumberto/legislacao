<template>
  <section>
        <div class="container2">
          <v-container>
              <h1 class="text-h5 my-5">Administração Concursos</h1>
              <v-list>
                <v-list-item :prepend-icon="item.icon" :to="item.link" v-for="item, in links" :title="item.title" :subtitle="item.subtitle"></v-list-item>
              </v-list>
              <p>outra coisa: pegar os erros das revisoes para gerar uma nova revisão ou posts para leitura tipo rede social - possibilidade de publicar</p>
              <v-divider></v-divider>
          </v-container>
        </div>
  </section>
</template>

<script setup>
    const links = [
      {id: 1, title: 'Adicionar edital', subtitle: 'Cadastro de editais', link: '/admin/edital_cadastro', icon: 'mdi-account-plus'},
      {id: 2, title: 'Lista de cargos', subtitle: 'Listar e editar cargos e ementas', link: '/admin/list_cargo_editar', icon: 'mdi-account-tie'},
      {id: 3, title: 'Incluir questões no forum de leis', subtitle: 'Cadastro de questões por norma', link: '/forum/cadastro', icon: 'mdi-forum'},
      {id: 4, title: 'Tratar erros', subtitle: 'Tratamento de erros informados pelos usuários', link: '/forum/tratarerros', icon: 'mdi-alert-circle'  },
      {id: 5, title: 'Vincular leis a disciplinas', subtitle: 'Criar vínculos', link: '/forum/tratarerros', icon: 'mdi-link-variant'  },
    ]
</script>

<style scoped>

</style>