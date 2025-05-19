import { defineStore } from "pinia";
import api from "@/services/api_semantic"

export const usePrintMail = defineStore("printmail", {
    state: () => ({
        email:{
            subject: 'Avaliação SEFAZ MA',
            message: 'Sua avaliação foi realizada com sucesso',
            recipient: ''
        },
        print:{
            subject: 'Assunto',
            message: 'Texto da mensagem',
            recipient: 'juninho.joao@hotmail.com'
        },
        response: ''
    }),
    getters: {
        readEmail(){
            return this.email
        },
        readPrint(){
            return this.print
        },
    },
    actions:{
        formartarAvaliacao(data){
                let table = '<div><h2>Avaliação de Desempenho Individual - ADI</h2><h3>Avaliação do Gestor</h3</div><table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">';

                // Add table headers
                table += '<tr>';
                for (const key in data[0]) {
                    table += `<th>${key.charAt(0).toUpperCase() + key.slice(1)}</th>`;
                }
                table += '</tr>';
                
                // Add table rows
                data.forEach(item => {
                    table += '<tr>';
                    for (const key in item) {
                    table += `<td>${item[key]}</td>`;
                    }
                    table += '</tr>';
                });
                
                table += '</table><br><br><div><p>Secretaria da Fazenda do Estado do Maranhão - SEFAZ MA</p></div>';
                return table;
        },
        async sendEmail(item, msg) {
            this.email.recipient = item
            this.email.message = this.formartarAvaliacao(msg)
            try {
                const res = await api.post('send-email/', this.email, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                this.response = data.status === 'success' ? 'E-mail enviado com sucesso!' : 'Erro ao enviar e-mail: ' + data.message;
                return this.response
            } catch (error) {
                console.log(error);
                this.response = 'Erro ao enviar e-mail: ' + error.message;
                return this.response
            }
        },
        async downloadPDF(item) {
            const print = {
                content: item.text_page
            }
            try {
              const response = await fetch('http://localhost:8000/gera-pdf/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(print)
              });
              
              if (!response.ok) {
                throw new Error('Erro ao gerar PDF');
              }
      
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'generated_pdf.pdf';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            } catch (error) {
              console.error('Erro:', error);
            }
        },
        formatarLoginPorEmail(item){
            let table = '<div><h2>Avaliação de Desempenho Individual - ADI</h2><h3>Avaliação do Gestor</h3</div><table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">';
            table += '<tr>';
            table += `<td>${item}</td>`;
            table += '</tr>';
            table += '</table><br><br><div><p>Secretaria da Fazenda do Estado do Maranhão - SEFAZ MA</p></div>';
            return table;
        },
        async loginPorEmail(item){
            console.log(item);
            this.email.recipient = item.email
            this.email.message = this.formatarLoginPorEmail(item.email)
            try {
                const res = await fetch('http://172.20.3.51:8001/send-email/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.email)
                });
                const data = await res.json();
                this.response = data.status === 'success' ? 'E-mail enviado com sucesso!' : 'Erro ao enviar e-mail: ' + data.message;
                return this.response
            } catch (error) {
                this.response = 'Erro ao enviar e-mail: ' + error.message;
                return this.response
            }
        }
    }
})