//
//  TableViewModel.swift
//  TooManyReviewers
//
//  Created by MeowCat on 2025/2/1.
//

import SwiftUI

class TableViewModel: ObservableObject {
    typealias Pos = Pair<Int, Int>
    
    enum PathSegmentKind {
        enum LinearDirection {
            case horizontal, vertical
        }
        
        enum EndDirection {
            case up, down, left, right
        }
        
        enum TurnDirection {
            case upLeft, upRight, downLeft, downRight
        }
        
        case linear(_: LinearDirection)
        case end(_: EndDirection)
        case turn(_: TurnDirection)
    }
    
    @Published
    var items: [[[Item]]] = []
    
    @Published
    var pathMask: [[PathSegmentKind?]]?
    
    var rowIndices: [Int] { Array(0..<items.count) }
    
    var colIndices: [Int] { items.isEmpty ? [] : Array(0..<items[0].count) }
    
    @Published
    var selected: Pos?
    
    private func reset(items: [[[Item]]]) {
        self.items = items
        pathMask = nil
        selected = nil
    }
    
    func placeholders(
        numRows: Int, numCols: Int
    ) {
        reset(items: (1...numRows).map { i in
            (1...numCols).map { j in
                [.textual("\(i)\(j)")]
            }
        })
    }
    
    func generate(numRows: Int, numCols: Int) {
        let builder = TableBuilder(
            numRows: numRows, numCols: numCols)
        builder.build()
        let fn = SimpleCache { (id: Int) -> TableViewModel.Item in
            return Bool.random() ?
                .textual(NameGenerator.randomAbbr)
            : .image(Self.icon(index: Int.random(in: 0..<Self.iconSheetCount)))
        }
        reset(items: builder.grid.map { row in
            row.map { ids in ids.map { fn[$0] } }
        })
    }
    
    static let iconSheet = NSImage(named: "Avatars")?
        .cgImage(forProposedRect: nil, context: nil, hints: nil)
    
    static let iconSheetRowCapacity = 12
    
    static let iconSheetCount = 128
    
    static let iconSize = 128
    
    static func icon(index: Int) -> NSImage? {
        let (y, x) = index.quotientAndRemainder(dividingBy: iconSheetRowCapacity)
        guard let image = iconSheet?.cropping(to: CGRect(
            x: x * iconSize,
            y: y * iconSize,
            width: iconSize,
            height: iconSize)) else { return nil }
        return NSImage(cgImage: image, size: NSSize(width: iconSize, height: iconSize))
    }
    
    func handleClick(row: Int, col: Int) {
        let current = Pair(row, col)
        if let selected, selected != current {
            let removes = Set(items[row][col]).intersection(items[selected.first][selected.second])
            if !removes.isEmpty {
                let path = Set(path(from: selected, to: current))
                if !path.isEmpty {
                    for pos in [selected, current] {
                        items[pos.first][pos.second] = items[pos.first][pos.second]
                            .filter { !removes.contains($0) }
                    }
                    pathMask = rowIndices.map { row in
                        colIndices.map { col in
                            let pos = Pos(row, col)
                            let neighbors: Int = Pos.fourDirections.reduce(0) {
                                ($0 << 1) | (path.contains(pos + $1) ? 1 : 0)
                            }
                            if !path.contains(Pos(row, col)) { return nil }
                            return switch neighbors {
                            case 0b1000: .end(.up)
                            case 0b0100: .end(.right)
                            case 0b0010: .end(.down)
                            case 0b0001: .end(.left)
                            case 0b1100: .turn(.upRight)
                            case 0b1010: .linear(.vertical)
                            case 0b1001: .turn(.upLeft)
                            case 0b0110: .turn(.downRight)
                            case 0b0101: .linear(.horizontal)
                            case 0b0011: .turn(.downLeft)
                            default: nil
                            }
                        }
                    }
                }
            }
            self.selected = nil
        } else { selected = current }
    }
    
    func path(from fromPos: Pos, to toPos: Pos) -> [Pos] {
        let dx = abs(fromPos.first - toPos.first)
        let dy = abs(fromPos.second - toPos.second)
        if dx == 0 && dy == 1 || dx == 1 && dy == 0 {
            return [fromPos, toPos]
        }
        let d = Dijkstra(grid: items.map { row in
            row.map { $0.isEmpty ? 0 : 1 }
        })
        return d.dijkstra(start: fromPos, end: toPos)
    }
}

extension TableViewModel {
    enum Item {
        case textual(_: String)
        case image(_: NSImage?)
        
        var textualDescription: String {
            switch self {
            case .textual(let text): text
            case .image(_): "(image)"
            }
        }
    }
}

extension TableViewModel.Item: Equatable, Hashable { }
