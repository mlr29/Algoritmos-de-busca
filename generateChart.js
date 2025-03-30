import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import fs from 'fs';

// Configuração do gráfico
const width = 800; // Largura do gráfico
const height = 600; // Altura do gráfico
const chartCallback = (ChartJS) => {
    // Opcional: Adicionar plugins ou configurações globais
};

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

// Função para gerar o gráfico
async function generateChart() {
    // Ler os resultados do arquivo JSON
    const results = JSON.parse(fs.readFileSync('results.json', 'utf-8'));

    // Preparar os dados para o gráfico
    const labels = Object.keys(results); // Nomes das estratégias
    const data = Object.values(results); // Distâncias

    // Configuração do gráfico
    const configuration = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Distância (km)',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Comparação de Distâncias por Estratégia',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    };

    // Gerar o gráfico como imagem
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);

    // Salvar o gráfico como arquivo PNG
    fs.writeFileSync('distances_chart.png', image);
    console.log('Gráfico gerado: distances_chart.png');
}

// Executar a função
generateChart();
