<template>
    <section>
        <div class="container">
            <v-btn variant="outlined" @click="voltar"> <v-icon>mdi-arrow-left</v-icon>Voltar</v-btn>
            <h1 class="mb-5">Sobre</h1>
            <div>
                <p>A aplicação da Legislação OH-MY-SEARCH é um sistema idealizado e desenvolvido 
                     por João Humeberto Silva Ribeiro Júnior, sendo projetado para ser uma 
                     ferramenta útil a todos os usuários que desejam um acessso rápido e facilitado da legislação.
                </p>
                <br>
                <p>Se deseja contribuir com esta iniciativa, envie suas sugestões, elogios e críticas 
                    para <a href="mailto:humberto.junior28@yahoo.com.br" class="email-link">humberto.junior28@yahoo.com.br</a>.
                    Sua participação é muito importante para aprimorar o sistema de legislação OH-MY-SEARCH.
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

<script>
    export default {
        methods:{
            voltar(){
                this.$router.push('/leges')
            }
        }
    }
</script>

<style lang="scss" scoped>
.container{
    min-height: 59vh;
}
</style>