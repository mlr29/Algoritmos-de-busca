export function generateChart(results) {
        const labels = Object.keys(results); // Nomes das estratégias
        const data = Object.values(results); // Distâncias
        
        
        const ctx = document.getElementById('myChart').getContext('2d');

        new Chart(ctx, {
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
        });
}

