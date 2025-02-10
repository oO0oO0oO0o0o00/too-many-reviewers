//
//  ContentView.swift
//  TooManyReviewers
//
//  Created by MeowCat on 2025/1/31.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        TableView().padding()
    }
}

struct TableView: View {
    enum Size: String, CaseIterable, Identifiable {
        case L, M, S
        
        var id: Self { self }
        
        var numRows: Int {
            switch self {
            case .L: 14
            case .M: 9
            case .S: 6
            }
        }
        
        var numCols: Int {
            switch self {
            case .L: 8
            case .M, .S: 5
            }
        }
    }

    @State private var size: Size
    
    @StateObject
    private var viewModel: TableViewModel
    
    init() {
        let size = Size.S
        let viewModel = TableViewModel()
        viewModel.generate(numRows: size.numRows, numCols: size.numCols)
        _viewModel = .init(wrappedValue: viewModel)
        self.size = size
    }
    
    var body: some View {
        VStack {
//            LazyVGrid(columns: [GridItem](repeating: GridItem(.flexible()), count: 12)) {
//                ForEach(0..<128) {
//                    if let i = TableViewModel.icon(index: $0) {
//                        Image(nsImage: i)
//                    } else {
//                        Text("\($0)")
//                    }
//                }
//            }
//            Image("Avatars")
//            HStack {
//                segment(kind: .end(.down)).frame(width: 50, height: 50).background(.red)
//                segment(kind: .end(.left)).frame(width: 50, height: 50).background(.red)
//                segment(kind: .end(.up)).frame(width: 50, height: 50).background(.red)
//                segment(kind: .end(.right)).frame(width: 50, height: 50).background(.red)
//                segment(kind: .turn(.downLeft)).frame(width: 50, height: 50).background(.red)
//                segment(kind: .turn(.downRight)).frame(width: 50, height: 50).background(.red)
//                segment(kind: .turn(.upLeft)).frame(width: 50, height: 50).background(.red)
//                segment(kind: .turn(.upRight)).frame(width: 50, height: 50).background(.red)
//                segment(kind: .linear(.vertical)).frame(width: 50, height: 50).background(.red)
//                segment(kind: .linear(.horizontal)).frame(width: 50, height: 50).background(.red)
//                segment(kind: nil).frame(width: 50, height: 50).background(.red)
//            }
            Grid(horizontalSpacing: 0, verticalSpacing: 0) {
                ForEach(viewModel.rowIndices, id: \.self) { rowIndex in
                    row(rowIndex: rowIndex)
                }
            }
            HStack {
                Picker("Size", selection: $size) {
                        Text("L").tag(Size.L)
                        Text("M").tag(Size.M)
                        Text("S").tag(Size.S)
                }.pickerStyle(.segmented)
                Button {
                    viewModel.generate(numRows: size.numRows, numCols: size.numCols)
                } label: {
                    Text("Restart")
                }
            }
        }
    }
    
    func row(rowIndex: Int) -> some View {
        GridRow {
            ForEach(viewModel.colIndices, id: \.self) { colIndex in
                let items = viewModel.items[rowIndex][colIndex]
                ZStack {
                    if let pathSegment = viewModel.pathMask?[rowIndex][colIndex] {
                        segment(kind: pathSegment).frame(width: 50, height: 50)
                    }
                    if items.isEmpty {
                        EmptyView()
                    } else {
                        CellView(
                            items: items,
                            selected: viewModel.selected == Pair(rowIndex, colIndex)) {
                                withAnimation {
                                    viewModel.handleClick(row: rowIndex, col: colIndex)
                                }
                                withAnimation(.default.delay(0.1)) {
                                    viewModel.pathMask = nil
                                }
                            }.transition(.opacity)
                    }
                }.frame(width: 50, height: 50)
            }
        }
    }
    
    func segment(kind: TableViewModel.PathSegmentKind) -> some View {
        var path = Path()
        switch kind {
        case .end(let direction):
            let cornerSize = 5
            let (xs, xe, ys, ye) = switch direction {
            case .down: (25, 25, 50 - cornerSize, 50)
            case .up: (25, 25, cornerSize, 0)
            case .left: (0, cornerSize, 25, 25)
            case .right: (50 - cornerSize, 50, 25, 25)
            }
            path.move(to: CGPoint(x: xs, y: ys))
            path.addLine(to: CGPoint(x: xe, y: ye))
        case .turn(let direction):
            let cornerSize = 5
            let (xs, xm, ym, ys) = switch direction {
            case .downLeft: (0, 25 - cornerSize, 25 + cornerSize, 50)
            case .downRight: (50, 25 + cornerSize, 25 + cornerSize, 50)
            case .upLeft: (0, 25 - cornerSize, 25 - cornerSize, 0)
            case .upRight: (50, 25 + cornerSize, 25 - cornerSize, 0)
            }
            path.move(to: CGPoint(x: xs, y: 25))
            path.addLine(to: CGPoint(x: xm, y: 25))
            path.addArc(
                tangent1End: CGPoint(x: 25, y: 25),
                tangent2End: CGPoint(x: 25, y: ym),
                radius: CGFloat(cornerSize))
            path.addLine(to: CGPoint(x: 25, y: ys))
        case .linear(let direction):
            let (xs, xe, ys, ye) = switch direction {
            case .horizontal: (0, 50, 25, 25)
            case .vertical: (25, 25, 0, 50)
            }
            path.move(to: CGPoint(x: xs, y: ys))
            path.addLine(to: CGPoint(x: xe, y: ye))
        }
        return path.stroke(.black, lineWidth: 2)
    }
}

struct CellView: View {
    enum RoomSize {
        case full, half, quarter
    }
    private let items: [TableViewModel.Item]
    
    private let selected: Bool
    
    private let onClick: () -> Void
    
    @State
    private var hovered = false
    
    init(
        items: [TableViewModel.Item],
        selected: Bool,
        onClick: @escaping () -> Void
    ) {
        self.items = items
        self.selected = selected
        self.onClick = onClick
    }
    
    var size: CGFloat {
        hovered ? 45 : 40
    }
    
    var body: some View {
        HStack(spacing: 0) {
            switch items.count {
            case 1:
                room(item: items[0], size: .full)
            case 2, 3:
                room(item: items[0], size: .half)
                Divider()
                if items.count == 2 {
                    room(item: items[1], size: .half)
                } else {
                    vstack(up: items[1], down: items[2])
                }
            default:
                vstack(up: items[0], down: items[1])
                Divider()
                vstack(up: items[2], down: items[3])
            }
        }
        .clipShape(Circle())
        .frame(width: size, height: size)
        .onTapGesture(perform: onClick)
        .padding(2)
        .overlay(Circle().stroke(
            selected ? .black : .gray.opacity(0.4),
            lineWidth: 1))
        .onHover(perform: { value in
            withAnimation(.linear(duration: 0.1)) {
                self.hovered = value
            }
        })
    }
    
    func vstack(up: TableViewModel.Item, down: TableViewModel.Item) -> some View {
        VStack(spacing: 0) {
            room(item: up, size: .quarter)
            Divider()
            room(item: down, size: .quarter)
        }
    }
    
    func room(item: TableViewModel.Item, size: RoomSize) -> some View {
        ZStack {
            switch item {
            case .textual(let text):
                let color = color(of: text)
                Rectangle()
                    .foregroundStyle(color)
                Text(text)
                    .foregroundColor(.white)
                    .font(.system(size: 8))
                    .fixedSize(horizontal: false, vertical: true)
            case .image(let image):
                let image = image.map { Image(nsImage: $0) } ?? Image(systemName: "heart.fill")
                image.resizable().scaledToFill()
            }
            
        }
    }
    
    func color(of text: String) -> Color {
        let id: Int = text.utf8.reduce(0) {
            ($0 * 11 + Int($1)) % 7
        }
        return [
            Color.blue, .green, .yellow,
            .purple, .orange, .teal, .cyan
        ][id]
    }
}

#Preview {
    ContentView()
}
