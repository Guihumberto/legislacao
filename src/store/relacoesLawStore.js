import { defineStore } from "pinia";

import api from "@/services/api"
import { useLoginStore } from "@/store/LoginStore";

export const useRelacoesLawStore = defineStore("relacoesLawStore", {
    state: () => ({
        relacoes: [],
        load: false
    }),
    getters: {
        readRelacoes(){
            return this.relacoes
        },
        readLoad(){
            return this.load
        },
        formatDate(){
            const now = new Date();
            
            const day = String(now.getDate()).padStart(2, '0');  // Garante 2 dígitos para o dia
            const month = String(now.getMonth() + 1).padStart(2, '0');  // Meses começam em 0, então somamos 1
            const year = now.getFullYear();
            
            const hours = String(now.getHours()).padStart(2, '0');  // Garante 2 dígitos para a hora
            const minutes = String(now.getMinutes()).padStart(2, '0');  // Garante 2 dígitos para os minutos
            
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        },
    },
    actions:{
        async buscarTodasAsPaginas(index) {
            const result = await api.post(`${index}/_search`, {
                query: {
                  match_all: {}
                }
              }, {
                params: {
                  scroll: '2m',
                  size: 100
                }
              })
           
            return await this.coletarTodosOsResultados(result.data)
        },
        async coletarTodosOsResultados(initialResult) {
            let allHits = initialResult.hits.hits
            let scrollId = initialResult._scroll_id
          
            while (true) {
                const scrollResponse = await api.post('/_search/scroll', {
                    scroll: '2m',
                    scroll_id: scrollId
                })

                const hits = scrollResponse.data.hits.hits

                if (hits.length === 0) break

                allHits = allHits.concat(hits)
                scrollId = scrollResponse.data._scroll_id     
            }
          
            return allHits
        },
        extrairMencoes(conteudo) {
            const regexLei = /\b(?<tipo>Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução|Portaria)\b\s*n[ºoº]?\.?\s*(?<numero>\d{1,5}(?:\.\d{1,5})?(?:\/\d{2,4})?)\s*(?:,?\s*(?:de|do)?\s*(?<dataCompleta>\d{1,2}(?:º)?\s*(?:de|do)?\s*\w{3,10}\.?\s*(?:de|\/)?\s*\d{2,4}))?/gi;
            const regexRevoga = /\b(?<verbo>Revoga|Fic(?:a|am) revogad(?:o|a|os|as))\b\s+(?<estrutura>.*?)(?<tipoNorma>Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução|Portaria)\s*n[ºoº]?\.?\s*(?<numero>\d{1,5}(?:\.\d{1,5})?)\s*(?:,?\s*(?:de|do)?\s*\d{1,2}(?:º)?\s*(?:de|do)?\s*\w{3,10}\.?\s*(?:de|\/)?\s*(?<ano>\d{2,4}))?/gi;

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
                    fonte: tipo || ''
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
                    fonte: tipoNorma || ''
                });
            });
         
            return relacoes
            
        },
        async processar(indexOrigem, indexRelacoes) {
            const documentos = await this.buscarTodasAsPaginas(indexOrigem)
        
            for (const doc of documentos) {
              const texto = doc._source.text_page
              const relacoes = this.extrairMencoes(texto)

              for (const r of relacoes) {
                await api.post(`${indexRelacoes}/_doc`, {
                  norma_origem_id: doc._source.page_to_norma.parent,
                  norma_origem_titulo: doc._source.page_to_norma.title || '',
                  ...r,
                  timestamp: this.formatDate
                })
                console.log('salvo');
              }

              console.log('Relacionamentos extraídos com sucesso.')
            }
        },
        extrairNumeroEAno(texto) {
            const regex = /(lei|medida\s+provis[oó]ria|decreto|resolu[cç][aã]o|portaria)\s*(n[º°o]?)?\s*(\d{1,5}(?:\.\d{3})*)?,?.*?de\s+(?:\d{1,2}\s+de\s+\w+\s+de\s+)?(\d{4})/i;
            const match = texto?.match(regex);
            
            if (match) {
                const fonte = match[1];
                const numero = match[3];
                const ano = match[4];
                return {nome: `${fonte} ${numero} DE ${ano}`, ano: ano, numero, fonte};
            }
            
            return null;
        },
        async getRelacoes(texto, id){      
            const matches = this.extrairNumeroEAno(texto);
            this.relacoes = []
            if (!matches) return

            console.log(matches);
   
            this.load = true
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin.cpf
            if(!cpf) return
             
            try {
                const resp = await api.post('relacoes_law/_search', {
                    size:20,
                    "query": {
                        "bool": {
                        "must": [
                            {
                                "match": {
                                    "lei": matches.numero
                                }
                            },
                            {
                                "match": {
                                    "fonte": matches.fonte
                                }
                            }
                        ],
                        "must_not": [
                            {
                                "term": {
                                    "norma_origem_id": id
                                }
                            }
                        ]
                        }
                    }
                })
                this.relacoes = resp.data.hits.hits.map(x => x._source)                
            } catch (error) {
                console.log('error get relacoes');
            } finally {
                this.load = false
            }
        }
    }
})