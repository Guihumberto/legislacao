import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"; // Importando como URL

// Definir a URL correta do worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPdf = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            try {
                const pdfData = new Uint8Array(reader.result);
                const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
                
                let extractedPages = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();

                    // Organizar os itens de texto por posição Y (linha) e depois por X (coluna)
                    const sortedItems = content.items.sort((a, b) => {
                        const yDiff = b.transform[5] - a.transform[5]; // Comparando Y (altura)
                        if (Math.abs(yDiff) < 2) { // Se estiverem na mesma linha
                            return a.transform[4] - b.transform[4]; // Ordena pelo X (esquerda-direita)
                        }
                        return yDiff; // Ordena pelo Y (cima-baixo)
                    });

                    let lines = [];
                    let currentLineY = null;
                    let lineText = "";

                    sortedItems.forEach((item, index) => {
                        const itemY = item.transform[5]; // Posição vertical
                        const itemX = item.transform[4]; // Posição horizontal

                        // Se for a primeira palavra da linha, inicia um novo texto
                        if (currentLineY === null) {
                            currentLineY = itemY;
                        }

                        // Se a diferença entre Y for grande, é uma nova linha
                        if (Math.abs(currentLineY - itemY) > 2) {
                            lines.push(lineText.trim()); // Salva a linha anterior
                            lineText = ""; // Reinicia o texto
                            currentLineY = itemY;
                        }

                        // Adiciona espaço entre palavras, respeitando a distância X
                        if (lineText.length > 0) {
                            const prevItem = sortedItems[index - 1];
                            const spaceThreshold = 5; // Distância mínima para considerar espaço
                            if (prevItem && itemX - prevItem.transform[4] > spaceThreshold) {
                                lineText += " ";
                            }
                        }

                        lineText += item.str; // Adiciona a palavra atual
                    });

                    lines.push(lineText.trim()); // Adiciona a última linha processada

                    extractedPages.push({ num_page: i, text: lines.join("\n") });
                }

                resolve(extractedPages);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
    });
};