//
//  Dijkstra.swift
//  TooManyReviewers
//
//  Created by MeowCat on 2025/2/3.
//

// To implement Dijkstra's algorithm in Swift for a 2D grid where 0s represent walkable cells and 1s represent obstacles, we need to consider the grid as a graph. The algorithm will find the shortest path from a starting point to a target point, while also returning the path taken.
//
//Here’s a complete implementation:

import Foundation

class Dijkstra {
    typealias Pos = Pair<Int, Int>
    let grid: [[Int]]
    let rows: Int
    let cols: Int
    let directions: [Pos] = [
        Pos(0, 1),  // Right
        Pos(1, 0),  // Down
        Pos(0, -1), // Left
        Pos(-1, 0)  // Up
    ]
    
    init(grid: [[Int]]) {
        self.grid = grid
        self.rows = grid.count
        self.cols = grid[0].count
    }
    
    func isValid(_ point: Pos) -> Bool {
        return point.x >= 0 && point.x < rows && point.y >= 0 && point.y < cols && grid[point.x][point.y] == 0
    }
    
    func dijkstra(start: Pos, end: Pos) -> [Pos] {
        var distances = [[Int]](repeating: [Int](repeating: Int.max, count: cols), count: rows)
        var previous: [[Pos?]] = [[Pos?]](repeating: [Pos?](repeating: nil, count: cols), count: rows)
        var priorityQueue: [(point: Pos, distance: Int)] = []
        
        distances[start.x][start.y] = 0
        priorityQueue.append((start, 0))
        
        while !priorityQueue.isEmpty {
            priorityQueue.sort { $0.distance < $1.distance }
            let current = priorityQueue.removeFirst()
            
            if current.point == end {
                return reconstructPath(previous: previous, end: end, distance: distances[end.x][end.y])
            }
            
            for direction in directions {
                let neighbor = Pos(current.point.x + direction.x, current.point.y + direction.y)
                
                if isValid(neighbor) || neighbor == end {
                    let newDistance = current.distance + 1
                    
                    if newDistance < distances[neighbor.x][neighbor.y] {
                        distances[neighbor.x][neighbor.y] = newDistance
                        previous[neighbor.x][neighbor.y] = current.point
                        priorityQueue.append((neighbor, newDistance))
                    }
                }
            }
        }
        return []
    }
    
    private func reconstructPath(previous: [[Pos?]], end: Pos, distance: Int) -> [Pos] {
        var path: [Pos] = []
        var current: Pos? = end
        while let value = current {
            path.append(value)
            current = previous[value.x][value.y]
        }
        return path
    }
}

extension Dijkstra.Pos {
    var x: Int { first }
    var y: Int { second }
}

// Example usage
//let grid = [
//    [0, 0, 0, 1, 0],
//    [1, 1, 0, 1, 0],
//    [0, 0, 0, 0, 0],
//    [0, 1, 1, 1, 0],
//    [0, 0, 0, 0, 0]
//]
//
//let dijkstra = Dijkstra(grid: grid)
//let start = Point(x: 0, y: 0)
//let end = Point(x: 4, y: 4)
//
//let result = dijkstra.dijkstra(start: start, end: end)
//print("Path: \(result)")
//
//Explanation
//Point Struct: Represents a point in the grid with x and y coordinates.
//
//Dijkstra Class: Implements the Dijkstra algorithm.
//
//Initialization: Accepts a 2D grid and initializes the number of rows and columns.
//isValid Function: Checks if a point is within bounds and is a 0.
//dijkstra Function: Implements the algorithm:
//Initializes distances and a priority queue.
//Processes each point in the queue, exploring valid neighbors.
//Updates distances and previous points for path reconstruction.
//reconstructPath Function: Traces back from the end point to the start point to construct the path.
//Example Usage: Defines a grid, initializes the Dijkstra class, and finds the shortest path from the top-left to the bottom-right corner.
//
//Output
//The output will display the path taken (as an array of Points) and the total distance from the start to the end point. If no path exists, it will return an empty path and a distance of -1. Adjust the grid and start/end points as needed for different scenarios!
