import { defineStore } from "pinia";
import api from "@/services/api"
import { useLoginStore } from "@/store/LoginStore";

export const useConteudoEditalStore = defineStore("conteudoEditalStore", {
  state: () => ({
    conteudoEdital: [],
    loading: false,
    error: null,
  }),
  getters: {
        getConteudoEdital() {
        return this.conteudoEdital;
        },
        getLoading() {
        return this.loading;
        },
        getError() {
        return this.error;
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
    actions: {
        async getConteudo(id) {
            this.loading = true;
            this.error = null;
            this.conteudoEdital = []
            try {
                const response = await api.get('conteudo_edital/_search', {
                    size:100,
                    query: {
                        match: {
                            id_concurso: id
                        }
                    }
                });
                this.conteudoEdital = response.data.hits.hits.map(hit => hit._source);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async createConteudoEdital(conteudoEditalData, concurso) {
            this.loading = true;
            this.error = null;

           const id_concurso = this.createConcurso(concurso)

           if(!id_concurso) return
            
           const newArray = conteudoEditalData.map(obj => ({ ...obj, ...concurso, id_concurso}));
           const bulkData = newArray.flatMap(doc => [{ index: { _index: 'conteudo_edital' } }, doc]);

           try {
                const response = await api.post(`conteudo_edital/_bulk`, bulkData.map(JSON.stringify).join("\n") + "\n", {
                    headers: { "Content-Type": "application/x-ndjson" }
                  });
                  console.log("Documentos indexados via Bulk:", response.data);
           } catch (error) {
                console.log('error create conteudo edital', error);
           } finally {
                this.loading = false;
           }
        },
        async createConcurso(concurso){
            const loginStore = useLoginStore()
            const cpf = loginStore.readLogin?.cpf
            if(!cpf) return

            try {
                const response = await api.post('edital/_doc', {
                    ...concurso,
                    created_by: cpf,
                    data_include: this.formatDate
                })
                console.log('response', response);
                return response.data._id
            } catch (error) {
                console.log('erroe create concurso');
                return null
            }
        }
  }
})