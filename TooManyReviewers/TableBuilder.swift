//
//  TableBuilder.swift
//  TooManyReviewers
//
//  Created by MeowCat on 2025/2/1.
//

import Foundation

class TableBuilder {
    typealias Pos = Pair<Int, Int>
    
    let numRows: Int
    
    let numCols: Int
    
    var occupied = Set<Pos>()
    
    var boundaries = Set<Pos>()
    
    var grid: [[[Int]]]
    
    static let slotMaxSize = 4
    
    init(numRows: Int, numCols: Int) {
        self.numRows = numRows
        self.numCols = numCols
        grid = [[[Int]]](
            repeating: [[Int]](
                repeating: [], count: numCols
            ), count: numRows)
    }
    
    func build() {
        // Start from 2 connected cells
        let startDirection = Bool.random() ? Pos(0, 1) : Pos(1, 0)
        let startPosition = Pos(
            Int.random(in: 1..<(numRows - 1)),
            Int.random(in: 1..<(numCols - 1)))
        add(position: startPosition, ids: [1])
        add(position: startPosition + startDirection, ids: [1])
        var id = 2
        // Continue to grow attached to occupied cells
        while !boundaries.isEmpty {
            // Handle single left cell.
            // Take / share one element from / with a neighbor
            if boundaries.count == 1,
               let pos = boundaries.first {
                guard let neighbor = Pos.fourDirections.lazy
                    .compactMap({ pos + $0 })
                    .filter({ self.occupied.contains($0) })
                    .first else { break }
                if grid[neighbor.first][neighbor.second].count < 3 {
                    grid[neighbor.first][neighbor.second].append(id)
                    add(position: pos, ids: [id])
                    id += 1
                } else if let id = grid[
                    neighbor.first][neighbor.second].popLast() {
                    add(position: pos, ids: [id])
                }
                continue
            }
            let expectedSlotsCount = max(4, boundaries.count / 2)
            var slots = Set(boundaries.randomChoicesNoReplace(
                atMost: expectedSlotsCount))
            var slotContents = [Pos: [Int]]()
            let valuesCount = switch slots.count {
            case 2: 1
            case 3: Int.random(in: 2...4)
            default: Int.random(in: slots.count...(slots.count * 2))
            }
            for _ in 0..<valuesCount {
                let pickedSlots = slots.randomChoicesNoReplace(atMost: 2)
                guard pickedSlots.count == 2 else { break }
                for slot in pickedSlots {
                    slotContents[slot, default: []].append(id)
                    if slotContents[slot]?.count ?? 0 >= Self.slotMaxSize {
                        slots.remove(slot)
                    }
                }
                id += 1
            }
            for (slot, content) in slotContents {
                add(position: slot, ids: content)
            }
        }
    }
    
    func add(position: Pos, ids: [Int]) {
        boundaries.remove(position)
        occupied.insert(position)
        grid[position.first][position.second] = ids
        for dp in Pos.fourDirections {
            let bpos = position + dp
            if inBound(position: bpos),
                  !occupied.contains(bpos) {
                boundaries.insert(bpos)
            }
        }
    }
    
    func inBound(position: Pos) -> Bool {
        return position.first >= 0
        && position.first < numRows
        && position.second >= 0
        && position.second < numCols
    }
}

extension Collection where Element: Hashable {
    func randomChoicesNoReplace(atMost n: Int) -> [Element] {
        var indices = Set(self)
        var result = [Element]()
        for _ in 0..<n {
            guard let next = indices.randomElement() else {
                break
            }
            indices.remove(next)
            result.append(next)
        }
        return result
    }
}

extension Collection where Index: Hashable {
    func randomIndicesNoReplace(atMost n: Int) -> [Index] {
        return indices.randomChoicesNoReplace(atMost: n)
    }
}

extension TableBuilder.Pos {
    static func +(lhs: Self, rhs: Self) -> Self {
        return .init(
            lhs.first + rhs.first,
            lhs.second + rhs.second)
    }
    
    static let fourDirections = [
        TableBuilder.Pos(-1, 0),
        TableBuilder.Pos(0, 1),
        TableBuilder.Pos(1, 0),
        TableBuilder.Pos(0, -1),
    ]
}

struct Pair<T: Hashable, U: Hashable>: Hashable {
    let first: T
    let second: U
    
    init(_ first: T, _ second: U) {
        self.first = first
        self.second = second
    }
}
