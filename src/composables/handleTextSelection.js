import { ref } from "vue"

export const useHandleTextSelection = (event) => {
    const menu = ref(false)
    const selectedText = ref(null)
    const menuPosition = ref({ top: 0, left: 0 });

    const selectionGet = () => {
        const selection = window.getSelection();
        
        if(selection && selection.toString().trim()){
            selectedText.value = selection.toString().trim()
            const range = selection.getRangeAt(0).getBoundingClientRect();
            menuPosition.value = {
                top: range.top + window.scrollY - 50, 
                left: range.left + window.scrollX,
            }
            menu.value = true;
            return
        } else {
            menu.value = false;
            selectedText.value = ""
            return
        }            
    }

    return { selectionGet, selectedText, menu, menuPosition }
}