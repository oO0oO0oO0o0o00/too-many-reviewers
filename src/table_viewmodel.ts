import { immerable } from "immer"
import { NameGenerator } from "./name_generator";
import { Pair, Pos, Pos$add, Pos$fourDirections } from "./pair";
import { SimpleCache } from "./simple_cache";
import { TableBuilder } from "./table_builder";
import { Optional, U } from "./utils";
import { Dijkstra } from "./dijkstra";
import { OSet } from "./oset";
import { Updater } from "use-immer";

export type PathSegmentKindLinear = "horizontal" | "vertical";

export type PathSegmentKindEnd = "up" | "down" | "left" | "right";

export type PathSegmentKindTurn = "upLeft" | "upRight" | "downLeft" | "downRight";

export type PathSegmentKind = PathSegmentKindLinear | PathSegmentKindEnd | PathSegmentKindTurn;

export type TableViewModelItem = string | [number, number];

let iconSheet: Optional<ImageData>

export function updateIconSheet(imageData: ImageData) {
  iconSheet = imageData;
}

const iconSheetRowCapacity = 12;

const iconSheetCount = 128;

export class TableViewModel {
  [immerable] = true;

  public pathMask: Optional<Optional<PathSegmentKind>[][]>;

  public rowIndices: number[];

  public colIndices: number[];

  public selected: Optional<Pos>;

  constructor(
    public items: TableViewModelItem[][][],
  ) {
    this.rowIndices = [...items.keys()];
    this.colIndices = items.length == 0 ? [] : [...items[0].keys()];
  }

  static generate(
    numRows: number, numCols: number, isMeow: boolean
  ): TableViewModel {
    // let x = [...Array(numRows).keys()].map((i) =>
    //   [...Array(numCols).keys()].map((j) => {
    //     let m = (i % 4) + 1;
    //     let k = (i * numCols + j) * m;
    //     return [...Array(m).keys()].map((i) => [
    //       Math.trunc((k + i) / iconSheetRowCapacity),
    //       (k + i) % iconSheetRowCapacity,
    //     ]);
    //   }));
    // return new TableViewModel(x as any);
    let builder = new TableBuilder(numRows, numCols);
    builder.build();
    let covered = new OSet();
    const randomName = isMeow ? NameGenerator.randomKit : NameGenerator.randomAbbr;
    let fn = new SimpleCache<number, TableViewModelItem>((_) => {
      while (true) {
        const next = Math.random() < 0.5 ?
          randomName() : this.randomIcon();
        if (covered.add(next)) { return next; }
      }
    });
    return new TableViewModel(builder.grid.map((row) => {
      return row.map((ids) => {
        return ids.map((id) => fn.get(id));
      });
    }));
  }

  static randomIcon(): [number, number] {
    let index = U.randomInt(iconSheetCount);
    return [
      Math.trunc(index / iconSheetRowCapacity),
      index % iconSheetRowCapacity,
    ];
  }

  handleClick(row: number, col: number, setState: Updater<TableViewModel>) {
    let current = new Pair(row, col)
    let selected = this.selected;
    if (selected && !current.equalsTo(selected)) {
      let removes = new OSet(this.items[row][col]).intersection(
        this.items[selected.first][selected.second]);
      if (removes.size > 0) {
        let path = new OSet(this.path(selected, current));
        if (path.size > 0) {
          for (let pos of [selected, current]) {
            this.items[pos.first][pos.second] = this.items[pos.first][pos.second]
              .filter((v) => !removes.has(v));
          }
          this.pathMask = this.rowIndices.map((row) => {
            return this.colIndices.map((col) => {
              let pos = new Pair(row, col);
              let neighbors: number = Pos$fourDirections.reduce(
                (p: number, c) => (p << 1) | (path.has(Pos$add(pos, c)) ? 1 : 0),
                0);
              if (!path.has(pos)) { return undefined; }
              switch (neighbors) {
                case 0b1000: return 'up';
                case 0b0100: return 'right';
                case 0b0010: return 'down';
                case 0b0001: return 'left';
                case 0b1100: return 'upRight';
                case 0b1010: return 'vertical';
                case 0b1001: return 'upLeft';
                case 0b0110: return 'downRight';
                case 0b0101: return 'horizontal';
                case 0b0011: return 'downLeft';
                default: return undefined;
              }
            });
          });
        }
      }
      this.selected = undefined;
    } else { this.selected = current; }
    setTimeout(() => setState(
      (state) => state.pathMask = undefined
    ), 200);
  }

  public path(fromPos: Pos, toPos: Pos): Pos[] {
    let dx = Math.abs(fromPos.first - toPos.first);
    let dy = Math.abs(fromPos.second - toPos.second);
    if (dx == 0 && dy == 1 || dx == 1 && dy == 0) {
      return [fromPos, toPos];
    }
    let d = new Dijkstra(this.items.map(
      (row) => row.map((e) => Number(e.length != 0))));
    return d.dijkstra(fromPos, toPos);
  }
}
