<template>
    <v-btn @click="dialog = true">Relações</v-btn>
    <v-dialog v-model="dialog" width="800">
        <v-card title="Relações">
            <div ref="networkContainer" style="height: 500px; border: 1px solid #ccc;"></div>
            <v-list class="overflow-y-auto" style="max-height: 300px;">
                <v-list-item v-for="item, i in textlaw" :key="i">{{ item }}</v-list-item>
            </v-list>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { computed, onMounted, ref, nextTick, watch } from 'vue'
    import { Network } from 'vis-network/standalone';

    import { usePageStore } from '@/store/PageStore'
    const pageStore = usePageStore()

    const dialog = ref(false)

    const regexLei = /\b(?<tipo>Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução|Portaria)\b ?n[ºoº]?\.? ?(?<numero>\d{1,5}(?:\.\d{1,5})?)(?:, de .*? (?<ano>\d{4}))?/gi;
    const regexArtigoLei = /art\.? ?\d+[ºo]?[^.]*?\b(Lei(?: Complementar)? ?n[ºoº]?\.? ?\d{1,5}(?:\.\d{1,5})?)(?:, de .*? (\d{4}))?/gi;
    const regexRevoga =  /\b(?<verbo>Revoga|Fic(?:a|am) revogad(?:o|a|os|as))\b\s+(?<estrutura>.*?)(?<tipoNorma>Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução)? ?n[ºoº]?\.?\s?(?<numero>\d{1,5}(?:\.\d{1,5})?)(?:, de .*? (?<ano>\d{4}))?/gi;
    const regexAlteracao = /\bFic(?:a|am) alterad(?:o|a|os|as)\b[^.]*?\b((?:caput|§\d+º?|incisos? [^ ]+|inciso [^ ]+)(?:,? ?(?:o|e)? ?(?:caput|§\d+º?|incisos? [^ ]+|inciso [^ ]+))*)[^.]*?\b(?:art\.? ?\d+[A-Za-z]?)[^.]*?\b(?:Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução)? ?n[ºoº]?\.? ?\d{1,5}(?:\.\d{1,5})?(?:\/\d{2,4})?/gi;

    const leiAtual = 'NORMA ATUAL'  //pageStore.readAllPages?.map(x => x._source)[0].page_to_norma.title
    const networkContainer = ref(null)

    const textlaw = computed(() => {
        const resp = pageStore.readAllPages.map(x => x._source.text_page).join('\n')
        const relacoes = extrairRelacoes(resp)
        return relacoes
    })

    const extrairRelacoes = (conteudo) => {
        const relacoes = []

        const leisMencionadas = conteudo.match(regexLei) || []
        leisMencionadas.forEach(lei => {
            relacoes.push({ tipo: 'menciona', lei: lei?.trim(), contexto: lei.replace('\n', ' ' ).trim() })
        })

        const revogacoes = [...conteudo.matchAll(regexRevoga)]
        revogacoes.forEach(match => {
            relacoes.push({ tipo: 'revoga', lei: match[1]?.trim(), contexto: match[0].replace('\n', ' ' ).trim() })
        })

        const artigosDeLeis = [...conteudo.matchAll(regexArtigoLei)]
        artigosDeLeis.forEach(match => {
            relacoes.push({ tipo: 'menciona_artigo', lei: match[1]?.trim(), contexto: match[0].replace('\n', ' ' ).trim() })
        })

        const alteracao = [...conteudo.matchAll(regexAlteracao)]
        alteracao.forEach(match => {
            relacoes.push({ tipo: 'alteracao', lei: match[1]?.trim(), contexto: match[0].replace('\n', ' ' ).trim() })
        })

        return relacoes
    }
    

    const buildGrafos = () => {
        const leisUnicas = [...new Map(textlaw.value.map(item => [item.lei, item])).values()]

        const nodes = [
            { id: leiAtual, label: leiAtual, color: '#ff9900' }, // nó central
            ...leisUnicas.map(item => ({
            id: item.lei,
            label: item.lei
            }))
        ]

        const edges = leisUnicas.map(item => ({
            from: leiAtual,
            to: item.lei,
            label: item.tipo,
            arrows: 'to'
        }))

        const data = { nodes, edges }

        const options = {
            nodes: {
            shape: 'box',
            font: { size: 14 }
            },
            edges: {
            font: { align: 'middle' },
            color: '#848484',
            },
            layout: {
            improvedLayout: true
            },
            physics: {
            enabled: true
            }
        }

        new Network(networkContainer.value, data, options)
    }

    onMounted( async () => {
        await nextTick() // Garante que o DOM foi renderizado
    
        if (!networkContainer.value) {
            console.error('Container da rede não está disponível!')
            return
        }
        buildGrafos()
    })

    watch(dialog, () => {
        if (!networkContainer.value) {
            console.error('Container da rede não está disponível!')
            return
        }
        setTimeout(() => {
            buildGrafos()
        }, 2000)
    })


</script>

<style scoped>

</style>