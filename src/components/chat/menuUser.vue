<template>
    <v-btn-toggle
      v-model="toggle"
      divided
    >
      <v-btn
        :icon="item.icon" v-for="(item, index) in listItems" 
        :title="item.title" @click="copyText(item.id)"
    >
    </v-btn>
    </v-btn-toggle>
</template>

<script setup>
    import { computed, ref } from 'vue';
    
    const props = defineProps({
        msg: Object
    })
    
    const items = ref([
        { id: 1, title: 'Copiar texto', icon: 'mdi-content-copy'},
        { id: 2, title: 'Resposta Satisfatória', icon: 'mdi-thumb-up-outline'},
        { id: 3, title: 'Resposta Insatisfatória', icon: 'mdi-thumb-down-outline' },
        { id: 4, title: 'Ouvir', icon: 'mdi-volume-high'}
    ])

    const listItems = computed(() => {
        return props.msg.user == 'user' 
        ? items.value.slice(0, 1) 
        : items.value.slice(0, 4)
    })

    const copyText = (id) => {
        if(id == 4){
            speak()
            return
        }
        navigator.clipboard.writeText(props.msg.content)
        const selected = items.value.find(x => x.id == id)
        selected.icon = 'mdi-check'
    }

    const isSpeaking = ref(false);
    let speechSynthesisUtterance = null;

    // Função para iniciar a leitura
    const speak = () => {
    if ('speechSynthesis' in window) {
        if (speechSynthesisUtterance) {
        window.speechSynthesis.cancel(); // Para qualquer fala em andamento
        }

        speechSynthesisUtterance = new SpeechSynthesisUtterance(props.msg.content);
        speechSynthesisUtterance.lang = 'pt-BR';
        speechSynthesisUtterance.rate = 1; // Velocidade da fala (1 é normal)
        speechSynthesisUtterance.pitch = 1; // Tom da fala

        speechSynthesisUtterance.onstart = () => {
            isSpeaking.value = true;
        };
        
        speechSynthesisUtterance.onend = () => {
            isSpeaking.value = false;
        };

        window.speechSynthesis.speak(speechSynthesisUtterance);
    } else {
        alert('Seu navegador não suporta a síntese de voz.');
    }
    };

    // Função para pausar a leitura
    const pause = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
    }
    };

    // Função para retomar a leitura
    const resume = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
    }
    };

    // Função para parar a leitura
    const stop = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        isSpeaking.value = false;
    }
    };

</script>

<style scoped>

</style>