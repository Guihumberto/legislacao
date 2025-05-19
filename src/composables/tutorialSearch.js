import { ref, onMounted } from 'vue'
import { useShepherd } from 'vue-shepherd'

export function searchInitial(ref1, ref2, ref3) {

    const showTutorial = ref(false);

    const tour = useShepherd({
        useModalOverlay: true
    });
    
    onMounted(() => {
        tour.addStep({
            attachTo: { element: ref1.value, on: 'top' },
            title: 'Comece por aqui!',
            text: 'Digite uma frase ou palavras chaves e clique em pesquisar.',
            buttons: [
                {
                  classes: "shepherd-button-secondary",
                  text: 'Pular',
                  action: tour.complete
                },
                {
                  text: 'Próximo',
                  action: tour.next
                }
              ]
        });

        tour.addStep({
            attachTo: { element: ref2.value, on: 'top' },
            title: 'Filtros',
            text: 'É possível fazer filtros por perídos ou fontes da norma.',
            buttons: [
                {
                  classes: "shepherd-button-secondary",
                  text: 'Anterior',
                  action: tour.back
                },
                {
                  text: 'Próximo',
                  action: tour.next
                }
              ]
        });

        tour.addStep({
            attachTo: { element: ref3.value, on: 'top' },
            title: 'Filtros',
            title: 'Configuração da busca',
            text: 'Aqui você pode configurar a assertividade da busca.',
            buttons: [
                {
                  classes: "shepherd-button-secondary",
                  text: 'Anterior',
                  action: tour.back
                },
                {
                  text: 'Próximo',
                  action: tour.next
                }
              ]
        });

        tour.addStep({
          title: 'Completo',
          text: 'Agora você pode realizar sua busca!',
          buttons: [
            {
              text: 'Finalizar',
              action: tour.complete
            }
          ]
        });

        if (!localStorage.getItem('tutorial_done')) {

            setTimeout(() => {
                tour.start();

            }, 2000)

            showTutorial.value = true;
            localStorage.setItem('tutorial_done', 'true');
 
        } 

    });
}