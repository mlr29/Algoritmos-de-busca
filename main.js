import readline from 'readline';
import fs from 'fs';


class Graph {
    locations = null; // Dicionário de localizações
    
    constructor(graphDict) {
        this.graphDict = graphDict;
    }

    get(a, b = null) {
        let aList = this.graphDict[a];
        if (aList) {
            if (b) {
                return aList[b];
            }
            return aList;
        }
        return null;
    }

    nodes() {
        let nodes = new Set();
        for (let node in this.graphDict) {
            nodes.add(node);
            for (let neighbor in this.graphDict[node]) {
                nodes.add(neighbor);
            }
        }
        return nodes;
    }

    totalNodes()
    {
        return Object.keys(this.graphDict).length;
    }
}

class Node {
    constructor(state, parent, action, path_cost) {
        this.state = state;
        this.parent = parent;
        this.action = action;
        this.path_cost = path_cost;
        this.depth = 0;
        if (parent) {
            this.depth = parent.depth + 1;
        }
    }

    __repr__() {
        return `<Node ${this.state}>`;
    }

    __lt__(node) {
        return this.state < node.state;
    }

    expand(problem) {
        return this.child_node(problem, null);
    }

    child_node(problem, action) {
        let next_state = problem.result(this.state, action);
        let new_cost = problem.path_cost(this.path_cost, this.state, action, next_state);
        let next_node = new Node(next_state, this, action, new_cost);
        return next_node;
    }

    solution() {
        let path_back = [];
        let node = this;
        while (node) {
            path_back.push(node);
            node = node.parent;
        }
        return path_back.reverse();
    }

    path() {
        let path_back = this.solution();
        return path_back.map(node => node.state);
    }

    __eq__(node) {
        return this.state === node.state;
    }

    __hash__() {
        return hash(this.state);
    }
}




// Função auxiliar para reconstruir o caminho
function reconstructPath(node) {
    let path = [];
    let current = node;

    while (current !== null) {
        path.unshift(current.state);
        current = current.parent;
    }

    return path;
}


// Configurar o readline para capturar inputs do terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Função para capturar inputs e executar a lógica
function start() {
    rl.question('Digite a cidade inicial: ', (cidadeInicial) => {
        if (!(g.nodes().has(cidadeInicial))) {
            console.log('Cidade inicial inválida. Tente novamente.');
            start();
            return;
        }

        rl.question('Digite a cidade de destino: ', (cidadeDestino) => {
            if (!(g.nodes().has(cidadeDestino))) {
                console.log('Cidade destino inválida. Tente novamente.');
                start();
                return;
            }
            
            console.log(`Calculando rota de ${cidadeInicial} para ${cidadeDestino}...`);
            main(cidadeInicial, cidadeDestino);
            rl.close(); // Finaliza o readline
        });
    });
}

// Função principal para executar as buscas
function main(start, goal) {
    console.log("\nResultados das buscas:\n");

    // Busca em extensão (amplitude)
    let bfsPath = bfs(g, start, goal);
    console.log("1.1 Busca em extensão (amplitude):", bfsPath, "Distância:", calculatePathCost(bfsPath, g),"\n");

    // Busca de custo uniforme
    let ucsPath = uniformCostSearch(g, start, goal);
    console.log("1.2 Busca de custo uniforme:", ucsPath, "Distância:", calculatePathCost(ucsPath, g),"\n");

    // Busca em profundidade
    let dfsPath = dfs(g, start, goal);
    console.log("1.3 Busca em profundidade:", dfsPath, "Distância:", calculatePathCost(dfsPath, g),"\n");

    // Busca em profundidade limitada
    let dlsPath = depthLimitedSearch(g, start, goal, 5); // Limite de profundidade = 5
    console.log("1.4 Busca em profundidade limitada:", dlsPath, "Distância:", calculatePathCost(dlsPath, g),"\n");

    // Busca de aprofundamento iterativo
    let idsPath = iterativeDeepeningSearch(g, start, goal);
    console.log("1.5 Busca de aprofundamento iterativo:", idsPath, "Distância:", calculatePathCost(idsPath, g),"\n");

    // Busca direcional
    let directionalPath = directionalSearch(g, start, goal);
    console.log("1.6 Busca direcional:", directionalPath, "Distância:", calculatePathCost(directionalPath, g),"\n");

    // Busca gulosa
    let greedyPath = greedySearch(g, start, goal, heuristic);
    console.log("2.1 Busca gulosa:", greedyPath, "Distância:", calculatePathCost(greedyPath, g),"\n");

    // Algoritmo A*
    let aStarPath = aStarSearch(g, start, goal, heuristic);
    console.log("2.2 Algoritmo A*:", aStarPath, "Distância:", calculatePathCost(aStarPath, g),"\n");

    let results = `{
        "Busca em extensão (amplitude)": ${calculatePathCost(bfsPath, g)},
        "Busca de custo uniforme": ${calculatePathCost(ucsPath, g)},
        "Busca em profundidade": ${calculatePathCost(dfsPath, g)},
        "Busca em profundidade limitada": ${calculatePathCost(dlsPath, g)},
        "Busca de aprofundamento iterativo": ${calculatePathCost(idsPath, g)},
        "Busca direcional": ${calculatePathCost(directionalPath, g)},
        "Busca gulosa": ${calculatePathCost(greedyPath, g)},
        "Algoritmo A*": ${calculatePathCost(aStarPath, g)}
    }`;

    fs.writeFileSync('results.json', results, 'utf8');
    console.log("Resultados salvos no arquivo 'results.json'.");
}

function bfs(graph, initial, goal) {
    // Fila para armazenar nós a serem explorados
    let queue = [];

    // Conjunto para rastrear nós visitados
    let visited = new Set();

    // Criar nó inicial
    let startNode = new Node(initial, null, null, 0);
    queue.push(startNode);

    while (queue.length > 0) {
        // Remove e retorna primeiro elemento da fila
        let node = queue.shift();

        // Verifica se chegou ao objetivo
        if (node.state === goal) {
            console.log(`Porcentagem de nós percorridos: ${(visited.size / graph.totalNodes() * 100).toFixed(2)}%`);
            return reconstructPath(node);
        }

        // Se estado não foi visitado
        if (!visited.has(node.state)) {
            // Marca como visitado
            visited.add(node.state);

            // Expande nó atual - adiciona vizinhos à fila
            let neighbors = graph.graphDict[node.state];
            for (let nextState in neighbors) {
                if (!visited.has(nextState)) {
                    let child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                    queue.push(child);
                }
            }
        }
    }

    // Se não encontrou caminho
    return null;
}

// Função para calcular o custo total de um caminho
function calculatePathCost(path, graph) {
    if (!path || path.length < 2) return 0;
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
        cost += graph.graphDict[path[i]][path[i + 1]];
    }
    return cost;    
}


// Função heurística (exemplo: distância em linha reta)
function heuristic(city1, city2) {
    // Calcula a distância euclidiana entre duas cidades usando suas coordenadas
    const [x1, y1] = g.locations[city1];
    const [x2, y2] = g.locations[city2];
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


function uniformCostSearch(graph, start, goal) {
    let frontier = new PriorityQueue((a, b) => a.path_cost < b.path_cost);
    let startNode = new Node(start, null, null, 0);
    frontier.enqueue(startNode);
    let explored = new Set();
    
    while (!frontier.isEmpty()) {
        let node = frontier.dequeue();

        if (node.state === goal) {
            console.log(`Porcentagem de nós percorridos: ${(explored.size / graph.totalNodes() * 100).toFixed(2)}%`);
            return reconstructPath(node);
        }

        if (!explored.has(node.state)) {
            explored.add(node.state);

            let neighbors = graph.graphDict[node.state];
            for (let nextState in neighbors) {
                if (!explored.has(nextState)) {
                    let child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                    frontier.enqueue(child);
                }
            }
        }
    }

    return null;
}

function dfs(graph, start, goal) {
    let stack = [];
    let startNode = new Node(start, null, null, 0);
    stack.push(startNode);
    let visited = new Set();
    
    while (stack.length > 0) {
        let node = stack.pop();

        if (node.state === goal) {
            console.log(`Porcentagem de nós percorridos: ${(visited.size / graph.totalNodes() * 100).toFixed(2)}%`);
            return reconstructPath(node);
        }

        if (!visited.has(node.state)) {
            visited.add(node.state);

            let neighbors = graph.graphDict[node.state];
            for (let nextState in neighbors) {
                if (!visited.has(nextState)) {
                    let child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                    stack.push(child);
                }
            }
        }
    }

    return null;
}

function depthLimitedSearch(graph, start, goal, limit) {
    function recursiveDLS(node, goal, limit, visited) {
        visited++;
        if (node.state === goal) {
            
            console.log(`Porcentagem de nós percorridos: ${(visited / graph.totalNodes() * 100).toFixed(2)}%`);
            return reconstructPath(node);
        } else if (limit === 0) {
            return null;
        } else {
            let cutoffOccurred = false;
            let neighbors = graph.graphDict[node.state];
            for (let nextState in neighbors) {
                let child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                let result = recursiveDLS(child, goal, limit - 1, visited);
                if (result) {
                    return result;
                }
            }
            return null;
        }
    }

    let startNode = new Node(start, null, null, 0);
    return recursiveDLS(startNode, goal, limit, 0);
}

function iterativeDeepeningSearch(graph, start, goal) {
    let depth = 0;
    while (true) {
        let result = depthLimitedSearch(graph, start, goal, depth);
        if (result) {
            return result;
        }
        depth++;
    }
}

function directionalSearch(graph, start, goal) {
    let queue = [];
    let startNode = new Node(start, null, null, 0);
    queue.push(startNode);
    let visited = new Set();
  
    while (queue.length > 0) {
        let node = queue.shift();

        if (node.state === goal) {
            console.log(`Porcentagem de nós percorridos: ${(visited.size / graph.totalNodes() * 100).toFixed(2)}%`);
            return reconstructPath(node);
        }

        if (!visited.has(node.state)) {
            visited.add(node.state);

            let neighbors = graph.graphDict[node.state];
            for (let nextState in neighbors) {
                if (!visited.has(nextState)) {
                    let child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                    queue.push(child);
                }
            }
        }
    }

    return null;
}

function greedySearch(graph, start, goal, heuristic) {
    let frontier = new PriorityQueue((a, b) => heuristic(a.state, goal) < heuristic(b.state, goal));
    let startNode = new Node(start, null, null, 0);
    frontier.enqueue(startNode);
    let explored = new Set();
    

    while (!frontier.isEmpty()) {
        let node = frontier.dequeue();

        if (node.state === goal) {
            console.log(`Porcentagem de nós percorridos: ${(explored.size / graph.totalNodes() * 100).toFixed(2)}%`);
            return reconstructPath(node);
        }

        if (!explored.has(node.state)) {
            explored.add(node.state);

            let neighbors = graph.graphDict[node.state];
            for (let nextState in neighbors) {
                if (!explored.has(nextState)) {
                    let child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                    frontier.enqueue(child);
                }
            }
        }
    }

    return null;
}

function aStarSearch(graph, start, goal, heuristic) {
    let frontier = new PriorityQueue((a, b) => (a.path_cost + heuristic(a.state, goal)) < (b.path_cost + heuristic(b.state, goal)));
    let startNode = new Node(start, null, null, 0);
    frontier.enqueue(startNode);
    let explored = new Set();

    while (!frontier.isEmpty()) {
        let node = frontier.dequeue();

        if (node.state === goal) {
            console.log(`Porcentagem de nós percorridos: ${(explored.size / graph.totalNodes() * 100).toFixed(2)}%`);
            return reconstructPath(node);
        }

        if (!explored.has(node.state)) {
            explored.add(node.state);

            let neighbors = graph.graphDict[node.state];
            for (let nextState in neighbors) {
                if (!explored.has(nextState)) {
                    let child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                    frontier.enqueue(child);
                }
            }
        }
    }

    return null;
}

// PriorityQueue helper class
class PriorityQueue {
    constructor(comparator) {
        this.items = [];
        this.comparator = comparator;
    }

    enqueue(item) {
        this.items.push(item);
        this.items.sort(this.comparator);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

// Exemplo de grafo (substituir com o grafo real)
let g = new Graph({
    'Arad': { 'Zerind': 75, 'Sibiu': 140, 'Timisoara': 118 },
    'Zerind': { 'Arad': 75, 'Oradea': 71 },
    'Oradea': { 'Zerind': 71, 'Sibiu': 151 },
    'Sibiu': { 'Arad': 140, 'Oradea': 151, 'Fagaras': 99, 'Rimnicu Vilcea': 80 },
    'Timisoara': { 'Arad': 118, 'Lugoj': 111 },
    'Lugoj': { 'Timisoara': 111, 'Mehadia': 70 },
    'Mehadia': { 'Lugoj': 70, 'Drobeta': 75 },
    'Drobeta': { 'Mehadia': 75, 'Craiova': 120 },
    'Craiova': { 'Drobeta': 120, 'Rimnicu Vilcea': 146, 'Pitesti': 138 },
    'Rimnicu Vilcea': { 'Sibiu': 80, 'Craiova': 146, 'Pitesti': 97 },
    'Fagaras': { 'Sibiu': 99, 'Bucharest': 211 },
    'Pitesti': { 'Rimnicu Vilcea': 97, 'Craiova': 138, 'Bucharest': 101 },
    'Bucharest': { 'Fagaras': 211, 'Pitesti': 101, 'Giurgiu': 90 },
    'Giurgiu': { 'Bucharest': 90 }
});

g.locations = {
    'Arad': [91, 492],
    'Bucharest': [400, 327],
    'Craiova': [253, 288],
    'Drobeta': [165, 299],
    'Eforie': [562, 293],
    'Fagaras': [305, 449],
    'Giurgiu': [375, 270],
    'Hirsova': [534, 350],
    'Iasi': [473, 506],
    'Lugoj': [165, 379],
    'Mehadia': [168, 339],
    'Neamt': [406, 537],
    'Oradea': [131, 571],
    'Pitesti': [320, 368],
    'Rimnicu Vilcea': [233, 410],
    'Sibiu': [207, 457],
    'Timisoara': [94, 410],
    'Urziceni': [456, 350],
    'Vaslui': [509, 444],
    'Zerind': [108, 531]
};

console.log(g.nodes())
// Iniciar o script
start();