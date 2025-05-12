export {graph, heuristic, search};
class Graph {
    
    addConnection(parent, children, distance = 0){
        if(!this.graphDict) this.graphDict = {};

        if (!this.graphDict[parent]) {
            this.graphDict[parent] = {};
        }

        this.graphDict[parent][children] = distance;
    }

    nodes() {
        const nodes = new Set();
        for (const node in this.graphDict) {
            nodes.add(node);
            for (const neighbor in this.graphDict[node]) {
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

    reconstructPath() {
        const path = [];
        let current;

        path.unshift(this.state);
       
        for(current = this.parent; current !== null; current = current.parent) {
            path.unshift(current.state);
        }
    
        return path;
    }

    calculatePathCost(path, graph) {
        if (!path || path.length < 2) return 0;
        let cost = 0;
        for (let i = 0; i < path.length - 1; i++) {
        cost += graph.graphDict[path[i]][path[i + 1]];
        }
        return cost;    
    }
}


class HeuristicEuclidian  {
    data = {};
    constructor(data){
        this.data = data;
    }
    
    getValueHeuristic(city1, city2) {
        const [x1, y1] = this.data[city1];
        const [x2, y2] = this.data[city2];
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
}

class PriorityQueue {
    constructor(comparator, heuristic) {
        this.heuristic = heuristic;
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

class Search {

    searchBFS(graph, initial, goal){
        const queue = [];
        
        const visited = new Set();

        const startNode = new Node(initial, null, null, 0);
        queue.push(startNode);

        while (queue.length > 0) {
            const node = queue.shift();

            if (node.state === goal) {
                const percentageVisited = (visited.size / graph.totalNodes() * 100).toFixed(2);
                return {path: node.reconstructPath(), distance: node.calculatePathCost(node.reconstructPath(), graph), percentageVisited: percentageVisited};
            }

            if (!visited.has(node.state)) {
                visited.add(node.state);
                
                const neighbors = graph.graphDict[node.state];
                for (const nextState in neighbors) {
                    if (!visited.has(nextState)) {
                        const child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                        queue.push(child);
                    }
                }
            }
        }

        return null;
    }

    uniformCostSearch(graph, start, goal) {
        const frontier = new PriorityQueue((a, b) => a.path_cost < b.path_cost);
        const startNode = new Node(start, null, null, 0);
        frontier.enqueue(startNode);
        const visited = new Set();
        
        while (!frontier.isEmpty()) {
            const node = frontier.dequeue();
    
            if (node.state === goal) {
                const percentageVisited = (visited.size / graph.totalNodes() * 100).toFixed(2);
                return {path: node.reconstructPath(), distance: node.calculatePathCost(node.reconstructPath(), graph), percentageVisited: percentageVisited};
            }
    
            if (!visited.has(node.state)) {
                visited.add(node.state);
    
                const neighbors = graph.graphDict[node.state];
                for (const nextState in neighbors) {
                    if (!visited.has(nextState)) {
                        const child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                        frontier.enqueue(child);
                    }
                }
            }
        }
    
        return null;
    }

    dfs(graph, start, goal) {
        const stack = [];
        const startNode = new Node(start, null, null, 0);
        stack.push(startNode);
        const visited = new Set();
        
        while (stack.length > 0) {
            const node = stack.pop();
    
            if (node.state === goal) {
                const percentageVisited = (visited.size / graph.totalNodes() * 100).toFixed(2);
                return {path: node.reconstructPath(), distance: node.calculatePathCost(node.reconstructPath(), graph), percentageVisited: percentageVisited};
            }
    
            if (!visited.has(node.state)) {
                visited.add(node.state);
    
                const neighbors = graph.graphDict[node.state];
                for (const nextState in neighbors) {
                    if (!visited.has(nextState)) {
                        const child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                       
                        stack.push(child);
                    }
                }
            }
    
        }
    
        return null;
    }

    depthLimitedSearch(graph, start, goal, limit) {
        const visited = new Set();
        function recursiveDLS(node, goal, limit) {
            visited.add(node.state);
            if (node.state === goal) {
                const percentageVisited = (visited.size / graph.totalNodes() * 100).toFixed(2);
                return {path: node.reconstructPath(), distance: node.calculatePathCost(node.reconstructPath(), graph), percentageVisited: percentageVisited};
            }
            if (limit === 0) {
                return null;
            } 
            
            const neighbors = graph.graphDict[node.state];
            for (const nextState in neighbors) {
                const child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                const result = recursiveDLS(child, goal, limit - 1);
                if (result) return result;
            }
            return null;
        
        }
    
        const startNode = new Node(start, null, null, 0);
        return recursiveDLS(startNode, goal, limit, 0);
    }


    iterativeDeepeningSearch(graph, start, goal) {
        let depth = 0;
        const s = new Search();
        while (true) {
            const result = s.depthLimitedSearch(graph, start, goal, depth);
            if (result) {
                return result;
            }
            depth++;
        }
    }

    
    bidirectionalSearch(graph, start, goal) {
        if (start === goal) {
                return {
                    path: [start],
                    distance: 0,
                    percentageVisited: 0.00
                };
            }

        const queueTop = [];
        const queueBottom = []
        const startNodeTop = new Node(start, null, null, 0);
        const startNodeBottom = new Node(goal, null, null, 0);
        const visitedTop = new Map();
        const visitedBottom = new Map();
        let nodeTop;
        let nodeBottom;
        let pathTop;
        let pathBottom;
        let child;
        
        queueTop.push(startNodeTop);
        visitedTop.set(start,startNodeTop)
        queueBottom.push(startNodeBottom);
        visitedBottom.set(goal,startNodeBottom);
        

        while (queueTop.length > 0 && queueBottom.length > 0) {
            nodeTop = queueTop.shift();
        
            let neighbors = graph.graphDict[nodeTop.state];
            for (const nextState in neighbors) {
                if (!visitedTop.has(nextState)) {
                    child = new Node(nextState, nodeTop, nextState, nodeTop.path_cost + neighbors[nextState]);
                    queueTop.push(child);

                    if (visitedBottom.has(nextState)) {
                        const percentageVisited = (visitedTop.size + visitedBottom.size / graph.totalNodes() * 100).toFixed(2);
                        const meetingNodeTop = child;
                        const meetingNodeBottom = visitedBottom.get(nextState);
                        pathTop = meetingNodeTop.reconstructPath();
                        pathBottom = meetingNodeBottom.reconstructPath();
                        
                        pathBottom.pop(); 
                        pathBottom.reverse();
                        
                        
                    const path = pathTop.concat(pathBottom);
                    const n = meetingNodeTop.calculatePathCost(pathTop, graph) + meetingNodeBottom.calculatePathCost(pathBottom, graph);
                    return {path: path, distance: n, percentageVisited: percentageVisited};
                    }
                }
            }
            
            nodeBottom = queueBottom.shift();
            
            neighbors = graph.graphDict[nodeBottom.state];
            for (const nextState in neighbors) {
                if (!visitedBottom.has(nextState)) {
                    child = new Node(nextState, nodeBottom, nextState, nodeBottom.path_cost + neighbors[nextState]);
                    queueBottom.push(child);
                }

                if (visitedTop.has(nextState)) {
                    const percentageVisited = (visitedTop.size + visitedBottom.size / graph.totalNodes() * 100).toFixed(2);
                        
                    const meetingNodeBottom = child;
                    const meetingNodeTop = visitedTop.get(nextState);
                    
                    pathTop = meetingNodeTop.reconstructPath();
                    pathBottom = meetingNodeBottom.reconstructPath();

                    pathBottom.pop();
                    pathBottom.reverse();
                    
                    const path = pathTop.concat(pathBottom);
                    const n = meetingNodeTop.calculatePathCost(pathTop,graph) + meetingNodeTop.calculatePathCost(pathBottom,graph);
                    return {path: path, distance: n, percentageVisited: percentageVisited};
                }
            }        

        }

        return null;
    }

    greedySearch(graph, start, goal, heuristic) {
        const frontier = new PriorityQueue((a, b) => heuristic.getValueHeuristic(a.state, goal) < heuristic.getValueHeuristic(b.state, goal)
            ,heuristic);
        const startNode = new Node(start, null, null, 0);
        frontier.enqueue(startNode);
        const visited = new Set();
        
    
        while (!frontier.isEmpty()) {
            const node = frontier.dequeue();
    
            if (node.state === goal) {
                const percentageVisited = (visited.size / graph.totalNodes() * 100).toFixed(2);
                return {path: node.reconstructPath(), distance: node.calculatePathCost(node.reconstructPath(), graph), percentageVisited: percentageVisited};
            }
    
            if (!visited.has(node.state)) {
                visited.add(node.state);
    
                const neighbors = graph.graphDict[node.state];
                for (const nextState in neighbors) {
                    if (!visited.has(nextState)) {
                        const child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                        frontier.enqueue(child);
                    }
                }
            }
        }
    
        return null;
    }

    aStarSearch(graph, start, goal, heuristic) {
        const frontier = new PriorityQueue((a, b) => (a.path_cost + heuristic.getValueHeuristic(a.state,goal)) < (b.path_cost + heuristic.getValueHeuristic(b.state,goal))
                                            ,heuristic);
        
        const startNode = new Node(start, null, null, 0);
        frontier.enqueue(startNode);
        const visited = new Set();
    
        while (!frontier.isEmpty()) {
            const node = frontier.dequeue();
    
            if (node.state === goal) {
                const percentageVisited = (visited.size / graph.totalNodes() * 100).toFixed(2);
                return {path: node.reconstructPath(), distance: node.calculatePathCost(node.reconstructPath(), graph), percentageVisited: percentageVisited};
            }
    
            if (!visited.has(node.state)) {
                visited.add(node.state);
    
                const neighbors = graph.graphDict[node.state];
                for (const nextState in neighbors) {
                    if (!visited.has(nextState)) {
                        const child = new Node(nextState, node, nextState, node.path_cost + neighbors[nextState]);
                        frontier.enqueue(child);
                    }
                }
            }
        }
    
        return null;
    }
}


const graph = new Graph();

graph.addConnection('Arad', 'Zerind', 75);
graph.addConnection('Arad', 'Sibiu', 140);
graph.addConnection('Arad', 'Timisoara', 118);
graph.addConnection('Zerind', 'Arad', 75);
graph.addConnection('Zerind', 'Oradea', 71);
graph.addConnection('Oradea', 'Zerind', 71);
graph.addConnection('Oradea', 'Sibiu', 151);
graph.addConnection('Sibiu', 'Arad', 140);
graph.addConnection('Sibiu', 'Oradea', 151);
graph.addConnection('Sibiu', 'Fagaras', 99);
graph.addConnection('Sibiu', 'Rimnicu Vilcea', 80);
graph.addConnection('Timisoara', 'Arad', 118);
graph.addConnection('Timisoara', 'Lugoj', 111);
graph.addConnection('Lugoj', 'Timisoara', 111);
graph.addConnection('Lugoj', 'Mehadia', 70);
graph.addConnection('Mehadia', 'Lugoj', 70);
graph.addConnection('Mehadia', 'Drobeta', 75);
graph.addConnection('Drobeta', 'Mehadia', 75);
graph.addConnection('Drobeta', 'Craiova', 120);
graph.addConnection('Craiova', 'Drobeta', 120);
graph.addConnection('Craiova', 'Rimnicu Vilcea', 146);
graph.addConnection('Craiova', 'Pitesti', 138);
graph.addConnection('Rimnicu Vilcea', 'Sibiu', 80);
graph.addConnection('Rimnicu Vilcea', 'Craiova', 146);
graph.addConnection('Rimnicu Vilcea', 'Pitesti', 97);
graph.addConnection('Fagaras', 'Sibiu', 99);
graph.addConnection('Fagaras', 'Bucharest', 211);
graph.addConnection('Pitesti', 'Rimnicu Vilcea', 97);
graph.addConnection('Pitesti', 'Craiova', 138);
graph.addConnection('Pitesti', 'Bucharest', 101);
graph.addConnection('Bucharest', 'Fagaras', 211);
graph.addConnection('Bucharest', 'Pitesti', 101);
graph.addConnection('Bucharest', 'Giurgiu', 90);
graph.addConnection('Giurgiu', 'Bucharest', 90);

const hE = {
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

const heuristic = new HeuristicEuclidian(hE);
const search = new Search();
