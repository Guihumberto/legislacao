<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <v-btn variant="text" class="ml-n4" @click="$router.push(ROUTES.HOME)" color="grey"> <v-icon>mdi-home</v-icon>INÍCIO</v-btn>
            <v-img 
                class="bg-grey-lighten-2"
                cover
                lazy-src="/leges.png" src="/leges.png" alt="imagem de um livro" 
                aspect-ratio="16/9" max-width="1000"  height="300px"
            >
                <template v-slot:placeholder>
                    <v-row
                        align="center"
                        class="fill-height ma-0"
                        justify="center"
                    >
                        <v-progress-circular
                        color="grey-lighten-5"
                        indeterminate
                        ></v-progress-circular>
                    </v-row>
                </template>
            </v-img>
            
            <h1 class="mb-5 text-h4 mt-5">Sobre a Aplicação</h1>
            <div class="content">
                <p>A aplicação com foco na legislação ESTUDO DA LEI é um sistema idealizado e desenvolvido 
                     por <b>João Humberto Silva Ribeiro Júnior</b>, sendo projetado para ser uma 
                     ferramenta útil a todos os estudantes e operadores do direito que desejam um acessso inteligente e facilitado da legislação.
                </p>
                <br>
                <p>Se deseja contribuir com esta iniciativa, envie suas sugestões, elogios e críticas 
                    para <a href="mailto:humberto.junior28@yahoo.com.br" class="email-link">humberto.junior28@yahoo.com.br</a>.
                </p>
            </div>
            <!-- <h1 class="mt-5">Contato</h1>
            <h2>Dúvidas, sugestões, elogios e críticas.</h2>
            <div class="mt-2">
                <v-form>
                    <v-textarea label="Texto" placeholder="digite sua mensagem" variant="outlined" >

                    </v-textarea>
                    <v-btn>Enviar</v-btn>
                </v-form>
            </div> -->
        </div>
    </section>
</template>
<script setup>
    import { useGeralStore } from '@/store/GeralStore';
    import { ROUTES } from '@/constants/routes';

    const geralStore = useGeralStore()

</script>

<style scoped>
.content{
    animation: aparecer 1s ease-in forwards;
    transition: 1s ease;
    margin-bottom: 5rem;
}
</style>