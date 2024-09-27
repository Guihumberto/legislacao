<template>
    <div style="min-width: 500px;">
        <p>Enviar e-mail com as suas avaliações realizadas.</p>
        <div class="d-flex mt-5">
            <v-text-field 
            :disabled="editEmail"
            prepend-inner-icon="mdi-email" density="compact" v-model="gestor.email">
            </v-text-field>
            <v-btn variant="text" class="mt-1 ml-2" @click="editEmail = !editEmail">{{editEmail ? 'Editar' : 'Salvar'}}</v-btn>
            <v-btn :loading="load" :disabled="!editEmail" prepend-icon="mdi-email" variant="flat" color="primary" @click="sendEmailGestor()">Enviar</v-btn>
        </div>
        <v-expand-transition>
            <div v-if="msg">
                <div class="d-flex align-center justify-center border" :class="color">Mensagem enviada com sucesso!
                     <v-icon title="fechar" @click="msg = null" class="ml-2">mdi-close-circle</v-icon></div>
            </div>
        </v-expand-transition>
    </div>
</template>

<script>
import { useAvaliacaoStore } from '@/store/AvaliacaoStore'
const avaliacaoStore = useAvaliacaoStore() 

import { usePrintMail } from '@/store/PrintMailStore'
const mailStore = usePrintMail() 

    export default {
        data(){
            return{
                editEmail: true,
                msg: null,
                load: false,
                color: ''
            }
        },
        props:{
            plan: Array
        },
        computed:{
            gestor(){
                return avaliacaoStore.readLogin
            }
        },
        methods:{
            async sendEmailGestor(){
                if(this.editEmail) {
                    try {
                        this.msg = null
                        this.load = true
                        const response = await mailStore.sendEmail(this.gestor.email, this.plan)
                        console.log('envio mail', response);
                        this.msg = "Mensagem enviada com sucesso!"
                        this.color = 'text-green'
                    } catch (error) {
                        this.msg = "Não foi possível enviar a mensagem!"
                        this.color = 'text-red'
                    } finally {
                        this.load = false
                    }

                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>