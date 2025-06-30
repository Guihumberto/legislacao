<template>
    <v-btn @click="dialog = true" variant="text" color="primary" icon><v-icon>mdi-relation-many-to-many</v-icon></v-btn>
    <v-dialog v-model="dialog" width="800">
        <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
                <h1 class="text-h5">Relações</h1>
                <v-btn @click="dialog = false" variant="text" icon="mdi-close"></v-btn>
            </v-card-title>
            <v-card-text>
                <!-- <v-btn @click="relacoesStore.processar('pages_v2', 'relacoes_law')">Relacoes</v-btn> -->
                <v-select
                    label="Tipo"
                    density="compact"
                    variant="outlined"
                    v-model="selectedType"
                    :items="types"
                    clearable
                    placeholder="Filtre por tipo de relação"
                ></v-select>
                <div ref="networkContainer" style="height: 500px; border: 1px solid #ccc;"></div>
                <v-list class="border rounded mt-5  overflow-y-auto" style="max-height: 300px;">
                    <v-list-subheader>Normas refereciadas</v-list-subheader>
                    <v-list-item v-for="item, i in textlawList" :key="i" :title="item.lei" :subtitle="`${item.tipo} - ${item.contexto}`">
                        ano: {{ item.ano || 'nao tem' }} - fonte: {{ item.fonte  || 'nao tem' }}
                    </v-list-item>
                </v-list>

                <v-list class="border rounded mt-5  overflow-y-auto" style="max-height: 300px;" v-if="relacoesStore.readRelacoes.length">
                    <v-list-subheader>Normas que a referenciam</v-list-subheader>
                    <v-list-item 
                        v-for="item, i in relacoesStore.readRelacoes" :key="i" :title="item.norma_origem_titulo" :subtitle="`${item.tipo} - ${item.contexto}`">
                        <template v-slot:append>
                            <router-link :to="`/text/${item.norma_origem_id}`" target="_blank">Abrir</router-link>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { computed, ref, nextTick, watch, onMounted } from 'vue'
    import { Network } from 'vis-network/standalone';

    import { usePageStore } from '@/store/PageStore'
    const pageStore = usePageStore()
    
    import { useRelacoesLawStore } from '@/store/relacoesLawStore';
    const relacoesStore = useRelacoesLawStore()

    const dialog = ref(false)

    const regexLei = /\b(?<tipo>Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução|Portaria)\b\s*n[ºoº]?\.?\s*(?<numero>\d{1,5}(?:\.\d{1,5})?(?:\/\d{2,4})?)\s*(?:,?\s*(?:de|do)?\s*(?<dataCompleta>\d{1,2}(?:º)?\s*(?:de|do)?\s*\w{3,10}\.?\s*(?:de|\/)?\s*\d{2,4}))?/gi;
    const regexRevoga = /\b(?<verbo>Revoga|Fic(?:a|am) revogad(?:o|a|os|as))\b\s+(?<estrutura>.*?)(?<tipoNorma>Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução|Portaria)\s*n[ºoº]?\.?\s*(?<numero>\d{1,5}(?:\.\d{1,5})?)\s*(?:,?\s*(?:de|do)?\s*\d{1,2}(?:º)?\s*(?:de|do)?\s*\w{3,10}\.?\s*(?:de|\/)?\s*(?<ano>\d{2,4}))?/gi;

    const leiAtual = 'NORMA ATUAL'  //pageStore.readAllPages?.map(x => x._source)[0].page_to_norma.title
    const networkContainer = ref(null)
    const selectedType = ref('')
    const types = ['menciona', 'revoga']

    const textlaw = computed(() => {
        const resp = pageStore.readAllPages.map(x => x._source.text_page).join('\n')
        const relacoes = extrairRelacoes(resp)
        return relacoes
    })

    const textlawList = computed(() => {
        const list = textlaw.value

        if(selectedType.value) {
            return list.filter(x => x.tipo === selectedType.value)
        }

        return list
    })

    const extrairRelacoes = (conteudo) => {
        const relacoes = []

        const leisMencionadas = [...conteudo.matchAll(regexLei)];
        leisMencionadas.forEach(match => {
            const { tipo, numero, dataCompleta } = match.groups;

            // extrai o ano do dataCompleta ou do final do número
            let ano;
            if (dataCompleta) {
                const anoMatch = dataCompleta.match(/\b(\d{4})\b/);
                ano = anoMatch ? anoMatch[1] : undefined;
            } else {
                const anoCurto = numero.match(/\/(\d{2,4})$/);
                ano = anoCurto ? (anoCurto[1].length === 2 ? '20' + anoCurto[1] : anoCurto[1]) : undefined;
            }

            const numeroLimpo = numero.replace(/\/\d{2,4}$/, ''); // remove /ano do número se presente
            const lei = `${tipo ? tipo + ' ' : ''} ${numeroLimpo}${ano ? ' de ' + ano : ''}`;

            relacoes.push({
                tipo: 'menciona',
                lei: lei.trim(),
                contexto: match[0].replace('\n', ' ').trim(),
                ano: ano,
                fonte: tipo
            });
        });

        const revogacoes = [...conteudo.matchAll(regexRevoga)]
        revogacoes.forEach(match => {
            const { tipoNorma, numero, ano } = match.groups;
            const lei = `${tipoNorma ? tipoNorma + ' ' : ''} ${numero}${ano ? ' de ' + ano : ''}`;

            relacoes.push({
                tipo: 'revoga',
                lei: lei.trim(),
                contexto: match[0].replace('\n', ' ').trim(), 
                ano: ano,
                fonte: tipoNorma
            });
        });

        return relacoes
    }
    
    const networkInstance = ref(null)

    const buildGrafos = () => {
        if (networkInstance.value) {
            networkInstance.value.destroy()
        }
        let leisUnicas = [...new Map(textlawList.value.map(item => [item.lei, item])).values()]

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

        networkInstance.value = new Network(networkContainer.value, data, options)
    }

    watch(dialog, async () => {
        await nextTick()

        if (!networkContainer.value) {
            console.error('Container da rede não está disponível!')
            return
        }

        buildGrafos()

    })

    watch(textlawList, () => {
        buildGrafos()
    })

    onMounted(() => {
        relacoesStore.getRelacoes(pageStore.readAllPages[0]?._source.page_to_norma.title, pageStore.readAllPages[0]?._source.page_to_norma.parent)
    })

</script>

<style scoped>

</style>