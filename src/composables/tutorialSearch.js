import { ref, onMounted } from 'vue'
import { useShepherd } from 'vue-shepherd'

export function useMeuScript(ref1, ref2, ref3) {

    const showTutorial = ref(false);

    const tour = useShepherd({
        useModalOverlay: true
    });
    
    onMounted(() => {
        tour.addStep({
            attachTo: { element: ref1.value, on: 'top' },
            text: 'Comece por aqui! Digite uma frase ou palavras chaves e clique em pesquisar.',
            buttons: [
                {
                  text: 'Próximo',
                  action: tour.next
                }
              ]
        });

        tour.addStep({
            attachTo: { element: ref2.value, on: 'top' },
            text: 'É possível fazer filtros por perídoo ou fonte da norma.',
            buttons: [
                {
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
            text: 'Aqui você pode configurar a assertividade da busca.',
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
            // localStorage.setItem('tutorial_done', 'true');
 
        } 

    });
}