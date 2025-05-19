export const useRelevancia = (item) => {
    if(item > 5){ 
        return {color: "blue", icon: "mdi-chevron-double-up", title:"Muito relevante"};
    } else if(item > 1){
        return {color: "blue", icon: "mdi-chevron-up", title:"Relevante"};
    } else if(item == 1){
        return {color: "grey", icon: "mdi-square", title:"Moderado"};
    } else if(item < 1){
        return {color: "red", icon: "mdi-chevron-down", title:"Pouco relevante"};
    } else {
        return {color: "grey", icon: "mdi-square", title:"moderado"}
    }
}