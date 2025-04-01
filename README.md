# Algoritmos de Busca

Trabalho desenvovido na disciplina de Inteligência Artificial com o intuito de implementar algoritmos de busca no problema do Mapa da Romênia.

## Requisitos

Tenha o [NodeJS](https://nodejs.org/en/download/) em conjunto com o gerenciador NPM instalado, acesse a pasta `algoritmos-de-busca` e inicie o projeto com:

`npm init`

e confirme as informações de configuração, depois instale os pacotes:

    npm install readline
    npm install fs
    npm install chartjs-node-canvas

Em seguida adicione a propriedade `"type": "module"` em `package.json`:

    
    "name": "algoritmos-de-busca",  
    "version": "1.0.0",
    "description": "Trabalho desenvovido na disciplina de Inteligência Artificial com o intuito de implementar algoritmos de busca no problema do Mapa da Romênia.",
    "main": "main.js",
    "type": "module",
    "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
    

## Execução 

Inicie o script com:

`node main.js`

E em seguida insira os nomes das cidades.

## Outputs

Como resultado teremos o caminho gerado por cada tipo de busca e algumas métricas de desempenho relacionadas.

Para gerar o gráfico comparativo das distâncias de cada algoritmo de busca execute o arquivo `generateChart.js`:

`node ./generateChart.js`

A imagem gerada `distances_chart.png` contém o gráfico com as distâncias dos caminhos de cada busca para as cidades especificadas.  
