import {graph, heuristic, search} from "./searchs.js";
import {generateChart} from "./generateChart.js";

const selectSearchContent = document.getElementById("searchAlgorithms");
const inputContent = document.getElementById("inputContent");
const selectStartCityInput = document.getElementById("selectStartCityInput");
const selectGoalCityInput = document.getElementById("selectGoalCityInput");
const resultPath = document.getElementById("resultPath");
const calculatePathButton = document.getElementById("calculatePathButton");
const resultDistance = document.getElementById("resultDistance");
const resultPercentage = document.getElementById("resultPercentage");
const resultContent = document.querySelector(".result-content");

const searchAlgorithms = {
    bfs: search.searchBFS,
    uniform: search.uniformCostSearch,
    depth: search.dfs,
    "depth-limited": search.depthLimitedSearch,
    "depth-iterative": search.iterativeDeepeningSearch,
    bidirectional: search.bidirectionalSearch,
    greedy: search.greedySearch,
    astar: search.aStarSearch
};

console.log(searchAlgorithms);

for (const city of graph.nodes()) {
    const optionAttributes = {
        value: city,
        textContent: city
    };
    // console.log(optionAttributes);

    const option = document.createElement("option");
    Object.assign(option, optionAttributes);
    selectStartCityInput.appendChild(option);

    const option2 = document.createElement("option");
    Object.assign(option2, optionAttributes);
    selectGoalCityInput.appendChild(option2);
}

// console.log(graph.nodes());
selectSearchContent.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    // Remove any existing input for depth limit if present
    const existingInput = document.getElementById("depthLimit");
    if (existingInput) {
        existingInput.remove();
    }

    // Handle the selected value
    const inputConfigurations = {
        "depth-limited": {
        createInput: true,
        attributes: {
            type: "number",
            id: "depthLimit",
            placeholder: "Limite",
            required: true,
            style: {
            width: "80px",
            marginTop: "10px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            gridColumn: "2",
            min: 1,
            max: 100
            }
        }
        },
        "depth-iterative": {
        createInput: true,
        attributes: {
            type: "number",
            id: "depthLimit",
            placeholder: "Limite",
            required: true,
            style: {
            width: "80px",
            marginTop: "10px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            gridColumn: "2",
            min: 1,
            max: 100,
            }
        }
        }
    };

    if (inputConfigurations[selectedValue]?.createInput) {
        const inputLimit = document.createElement("input");
        const attributes = inputConfigurations[selectedValue].attributes;

        for (const [key, value] of Object.entries(attributes)) {
        if (key === "style") {
            Object.assign(inputLimit.style, value);
        } else {
            inputLimit[key] = value;
        }
        }

        inputContent.appendChild(inputLimit);
    }
    });

calculatePathButton.addEventListener("click", () => {
    const selectedAlgorithm = selectSearchContent.value;
    const startCity = selectStartCityInput.value;
    const goalCity = selectGoalCityInput.value;
    const depthLimitInput = document.getElementById("depthLimit");
    const depthLimit = depthLimitInput ? Number.parseInt(depthLimitInput.value) : null;

    let resultObject
    if (selectedAlgorithm === "depth-limited" || selectedAlgorithm === "depth-iterative") {
        resultObject = searchAlgorithms[selectedAlgorithm](graph, startCity, goalCity, depthLimit);
    } else if (selectedAlgorithm === "greedy" || selectedAlgorithm === "astar") {
        resultObject = searchAlgorithms[selectedAlgorithm](graph, startCity, goalCity, heuristic);
    } else {
        resultObject = searchAlgorithms[selectedAlgorithm](graph, startCity, goalCity);
    }

    resultPath.value = resultObject.path ? resultObject.path.join(" ⇒ ") : "Caminho não encontrado";
    resultDistance.value = resultObject.distance !== undefined ? resultObject.distance : "Distância não encontrada";
    resultPercentage.value = resultObject.percentageVisited !== undefined ? resultObject.percentageVisited : "Porcentagem não encontrada";
    //console.log(heuristic.getValueHeuristic({city1: startCity, city2: goalCity}));

    const bfsDistance = search.searchBFS(graph, startCity, goalCity).distance;
    const ucsDistance = search.uniformCostSearch(graph, startCity, goalCity).distance;
    const dfsDistance = search.dfs(graph, startCity, goalCity).distance;
    const dlsDistance = search.depthLimitedSearch(graph, startCity, goalCity, (depthLimit ? depthLimit : 5)).distance; //limite padrão 5
    const idsDistance = search.iterativeDeepeningSearch(graph, startCity, goalCity).distance;
    const directionalDistance = search.bidirectionalSearch(graph, startCity, goalCity).distance;
    const greedyDistance = search.greedySearch(graph, startCity, goalCity, heuristic).distance;
    const aStarDistance = search.aStarSearch(graph, startCity, goalCity, heuristic).distance;

    const results = {
    "Busca em extensão (amplitude)": bfsDistance,
    "Busca de custo uniforme": ucsDistance,
    "Busca em profundidade": dfsDistance,
    "Busca em profundidade limitada": dlsDistance,
    "Busca de aprofundamento iterativo": idsDistance,
    "Busca bidirecional": directionalDistance,
    "Busca gulosa": greedyDistance,
    "Algoritmo A*": aStarDistance
    };
    
    
    // Remove the existing canvas if it exists
    const existingCanvas = document.getElementById('myChart');
    const figcaption = document.querySelector('figcaption');
    if (existingCanvas) {
        existingCanvas.remove();
        figcaption.style.display = 'none';
    }
    
    // Create a new canvas element
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'myChart';
    newCanvas.className = 'img-chart';
    newCanvas.width = 800;
    newCanvas.height = 600;

    // Append the new canvas to the figure
    const figure = document.querySelector('figure');
    figure.appendChild(newCanvas);

    
    figcaption.style.display = 'block';
    
    generateChart(results);
    //const ctx = document.getElementById('myChart').getContext('2d');
}
);