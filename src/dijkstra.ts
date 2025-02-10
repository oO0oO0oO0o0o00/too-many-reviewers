import { Pair, Pos, Pos$add, Pos$fourDirections } from "./pair";

export class Dijkstra {
    private grid: number[][];
    private rows: number;
    private cols: number;

    constructor(grid: number[][]) {
        this.grid = grid;
        this.rows = grid.length;
        this.cols = grid[0].length;
    }

    private isValid(point: Pos): boolean {
        const [x, y] = [point.first, point.second];
        return x >= 0 && x < this.rows && y >= 0 && y < this.cols && this.grid[x][y] === 0;
    }

    public dijkstra(start: Pos, end: Pos): Pos[] {
        const distances = Array.from({ length: this.rows }, () => Array(this.cols).fill(Infinity));
        const previous: (Pos | null)[][] = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        const priorityQueue: { point: Pos; distance: number }[] = [];

        distances[start.first][start.second] = 0;
        priorityQueue.push({ point: start, distance: 0 });

        while (priorityQueue.length > 0) {
            priorityQueue.sort((a, b) => a.distance - b.distance);
            const current = priorityQueue.shift()!;

            if (current.point.equalsTo(end)) {
                return this.reconstructPath(previous, end);
            }

            for (const direction of Pos$fourDirections) {
                const neighbor: Pos = Pos$add(current.point, direction);

                if (this.isValid(neighbor) || neighbor.equalsTo(end)) {
                    const newDistance = current.distance + 1;

                    if (newDistance < distances[neighbor.first][neighbor.second]) {
                        distances[neighbor.first][neighbor.second] = newDistance;
                        previous[neighbor.first][neighbor.second] = current.point;
                        priorityQueue.push({ point: neighbor, distance: newDistance });
                    }
                }
            }
        }
        return [];
    }

    private reconstructPath(previous: (Pos | null)[][], end: Pos): Pos[] {
        const path: Pos[] = [];
        let current: Pos | null = end;

        while (current) {
            path.push(current);
            current = previous[current.first][current.second];
        }

        return path.reverse();
    }
}

export function testFindShortestPath() {
    const grid = [
        [0, 0, 0, 1, 0],
        [1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0]
    ];

    const dijkstra = new Dijkstra(grid);
    const start = new Pair(0, 0);
    const end = new Pair(4, 4);

    const result = dijkstra.dijkstra(start, end);
    console.log("Path:", result);
}
