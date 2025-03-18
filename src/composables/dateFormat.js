export function useDateNow(timestamp, type = false, hour = false) {

    const data = new Date(timestamp); // Cria um objeto Date com o timestamp

    const dia = String(data.getDate()).padStart(2, '0'); // Obtém o dia e garante que tenha 2 dígitos
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Obtém o mês (0-11) e adiciona 1
    const ano = data.getFullYear(); // Obtém o ano
    const horas = String(data.getHours()).padStart(2, '0'); // Obtém as horas
    const minutos = String(data.getMinutes()).padStart(2, '0'); // Obtém os minutos

    if (hour)  return `${horas}:${minutos}`; // Retorna a data formatada

    if (type)  return `${dia}/${mes}/${ano}`; // Retorna a data formatada
    
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`; // Retorna a data formatada

}