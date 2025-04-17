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
            const regexLei = /\b(?<tipo>Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução|Portaria)\b\s*n[ºoº]?\.?\s*(?<numero>\d{1,5}(?:\.\d{1,5})?(?:\/\d{2,4})?)\s*(?:,?\s*de\s+(?<dataCompleta>.+?\s+\d{4}))?/gi;
            const regexArtigoLei = /art\.? ?\d+[ºo]?[^.]*?\b(Lei(?: Complementar)? ?n[ºoº]?\.? ?\d{1,5}(?:\.\d{1,5})?)(?:, de .*? (\d{4}))?/gi;
            const regexRevoga = /\b(?<verbo>Revoga|Fic(?:a|am) revogad(?:o|a|os|as))\b\s+(?<estrutura>.*?)(?<tipoNorma>Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução|Portaria)\s*n[ºoº]?\.?\s*(?<numero>\d{1,5}(?:\.\d{1,5})?)\s*(?:, de .*? (?<ano>\d{4}))?/gi;
            const regexAlteracao = /\bFic(?:a|am) alterad(?:o|a|os|as)\b[^.]*?\b(?<estrutura>(?:caput|§\d+º?|incisos? [^ ]+|inciso [^ ]+)(?:,? ?(?:o|e)? ?(?:caput|§\d+º?|incisos? [^ ]+|inciso [^ ]+))*)[^.]*?\b(?:art\.? ?\d+[A-Za-z]?)[^.]*?\b(?<tipoNorma>Lei(?: Complementar)?|Medida Provisória|Decreto|Resolução)? ?n[ºoº]?\.?\s?(?<numero>\d{1,5}(?:\.\d{1,5})?(?:\/\d{2,4})?)(?:, de (?<dataCompleta>.*? \d{4}))?/gi;

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

                const lei = `${numeroLimpo}${ano ? '/' + ano : ''}`;

                relacoes.push({
                    tipo: 'menciona',
                    lei_mencionada: lei.trim(),
                    contexto: match[0].replace('\n', ' ').trim()
                });
            });

            const revogacoes = [...conteudo.matchAll(regexRevoga)]
            revogacoes.forEach(match => {
                const { tipoNorma, numero, ano } = match.groups;
                const lei = `${tipoNorma ? tipoNorma + ' ' : ''}nº ${numero}${ano ? ', de ' + ano : ''}`;
    
                relacoes.push({
                    tipo: 'revoga',
                    lei_mencionada: lei.trim(),
                    contexto: match[0].replace('\n', ' ').trim()
                });
            });
    
            const artigosDeLeis = [...conteudo.matchAll(regexArtigoLei)]
            artigosDeLeis.forEach(match => {
                relacoes.push({ tipo: 'menciona_artigo', lei_mencionada: match[1]?.trim(), contexto: match[0].replace('\n', ' ' ).trim() })
            })
    
            const alteracao = [...conteudo.matchAll(regexAlteracao)]
            alteracao.forEach(match => {
                const { tipoNorma, numero, dataCompleta } = match.groups;
    
                const lei = `${tipoNorma ? tipoNorma + ' ' : ''}nº ${numero}${dataCompleta ? ', de ' + dataCompleta : ''}`;
    
                relacoes.push({
                    tipo: 'alteracao',
                    lei_mencionada: lei.trim(),
                    contexto: match[0].replace('\n', ' ').trim()
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
        }
    }
})