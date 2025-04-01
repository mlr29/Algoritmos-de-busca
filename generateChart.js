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
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)', // Vermelho
                        'rgba(54, 162, 235, 0.8)', // Azul
                        'rgba(255, 206, 86, 0.8)', // Amarelo
                        'rgba(75, 192, 192, 0.8)', // Verde
                        'rgba(153, 102, 255, 0.8)', // Roxo
                        'rgba(255, 159, 64, 0.8)', // Laranja
                        'rgba(199, 199, 199, 0.8)', // Cinza claro
                        'rgba(0, 0, 0, 0.8)',       // Preto
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(199, 199, 199, 1)',
                        'rgba(0, 0, 0, 1)',
                    ],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Comparação de Distâncias por Estratégia',
                    color: '#ffffff',
                },
                legend: {
                    labels: {
                        color: '#ffffff',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff',
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff',
                    },
                },
            },
            layout: {
                padding: 20,
            },
        },
        plugins: [
            {
                id: 'background-color',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.fillStyle = 'rgb(80, 78, 78)'; // Cor de fundo cinza
                    ctx.fillRect(0, 0, chart.width, chart.height);
                    ctx.restore();
                },
            },
        ],
    };

    // Gerar o gráfico como imagem
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);

    // Salvar o gráfico como arquivo PNG
    fs.writeFileSync('distances_chart.png', image);
    console.log('Gráfico gerado: distances_chart.png');
}

// Executar a função
generateChart();
