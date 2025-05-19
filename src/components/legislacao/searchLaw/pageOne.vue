<template>
    <v-btn 
        variant="text" icon="mdi-information" 
        @click.stop="dialog = !dialog"> 
    </v-btn>
    <v-dialog v-model="dialog" max-width="800">
        <v-card>
            <v-card-title class="bg-primary d-flex align-center justify-space-between">
                {{ law.title }}
                <v-btn icon="mdi-close" density="compact" variant="text" @click="dialog = false"></v-btn>
            </v-card-title>
            <v-card-text>
                <div class="border pa-5">
                    <p v-html="pageOne"></p>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { computed } from 'vue';
    import { onMounted, ref } from 'vue';

    const dialog = ref(false)

    const props = defineProps({
        law: Object
    })

    const pageOne = ref(null)

    const divisores = computed(() => {
        return ['art.', 'livro', 'título', 'titulo', 'capítulo'];
    })

    const arrayTextLawEstrutura = computed(() => {
        return [   'Art.', 'Arts.','§', 'Parágrafo único', 'Paragrafo unico.',
                            'I -', 'I-', 'II -', 'II-', 'III', 'IV -', 'V -', 'VI -', 
                            'VII -', 'VIII -', 'IX', 'X', 'X-', 'X - ',
                            'XX', 'XXX', 'XL', 'L -', 'L-', 'LX', 'LI -',  'LI-', 'LII', 'LIV -', 'LIV-', 'LV', 'LIX',
                            'a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)', 'k)', 'l)', 'm)', 'n)', 'o)',
                            'p)', 'q)', 'r)', 's)', 't)', 'u)', 'v)', 'x)', 'y)', 'w)', 'z)',
                            '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.',  '11.', '12.', '13.', '14.', '15.', '16.', '17.', '18.', '19.', '20.',  '21.', '22.', '23.', '24.', '25.', '26.', '27.', '28.', '29.', '30.',
                            '1-', '2-','3-', '4-', '5-','6-',  '7-', '8-','9-', '10-', 
                            '1 -', '2 -','3 -', '4 -', '5 -','6 -', '7 -', '8 -','9 -', '10 -'  
            ]
    })

    const arrayEstrturaONly = computed(() => {
        return ['LIVRO ', 'TÍTULO ', 'CAPÍTULO ', 'SEÇÃO ', 'SUBSEÇÃO ']
            
    })

    const referencias = computed(() => {
        return arrayEstrturaONly.value.concat(arrayTextLawEstrutura.value)
    })

    onMounted(() => {
        const list = props.law.description_norm
                        .replaceAll('–', '-')
                        .split(/(\r\n|\n|\r)/gm)
                        .filter((i) => i )
                        .filter(i => i != '\n' )
                        .map(item => item.trim())
        
        const divisorIndex = list.findIndex(str => 
            divisores.value.some(divisor => str.toLowerCase().startsWith(divisor.toLowerCase()))
        );

        if (divisorIndex !== -1) {
            const textoincial = list.slice(0, divisorIndex);
            pageOne.value = textoincial.join('<br>')
;
        } else {
                pageOne.value = props.law.description_norm
        }
                
    })

</script>

<style lang="scss" scoped>

</style>