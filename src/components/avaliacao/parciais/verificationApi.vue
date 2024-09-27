<template>
    <div>
        <v-alert class="d-flex justify-center align-center mt-3" variant="text">
            <p v-if="statusAPI == 'active'">
                <span class="loading text-success">
                    <v-icon class="mr-1" color="success">mdi-led-on</v-icon>Conexão com a API está Ativa
                </span>
            </p>
            <p v-else-if="statusAPI == 'inactive'">
                <span class="loading text-error">
                        API está inativa.<v-icon class="dot" color="error">mdi-power-plug-off-outline</v-icon>
                    </span>
                </p>
            <p v-else>
                <span class="loading">
                    Verificando conexão com o banco de dados<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
                </span>
            </p>
        </v-alert>
        
    </div>
</template>

<script>
    import api from "@/services/api"
    
    export default {
        data(){
            return{
                statusAPI: null
            }
        },
        methods: {
            async checkApiStatus() {
                try {
                    const response = await api.get('servidores/_search');
                    if (response.status === 200) {
                            this.statusAPI = 'active';
                    } else {
                            this.statusAPI = 'inactive';
                    }
                } catch (error) {
                    this.statusAPI = 'inactive';
                }
            }
        },
        created() {
            this.checkApiStatus()
        },
    }
</script>

<style lang="scss" scoped>
.loading {
    font-size: 1.2em;
    font-weight: 300;
    color: #333;
}

.dot {
    opacity: 0;
    animation: blink 1.5s infinite step-start;
}

.dot:nth-child(1) {
    animation-delay: 0s;
}

.dot:nth-child(2) {
    animation-delay: 0.5s;
}

.dot:nth-child(3) {
    animation-delay: 1s;
}

@keyframes blink {
    0%, 100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}
</style>