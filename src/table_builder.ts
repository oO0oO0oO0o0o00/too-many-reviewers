import { OArraySet } from "./array_set";
import { OSet } from "./oset";
import { Pair, Pos, Pos$fourDirections } from "./pair";

export class TableBuilder {
  private occupied: OSet<Pos> = new OSet();
  private boundaries: OArraySet<Pos> = new OArraySet();
  private _grid: number[][][] = [];
  static slotMaxSize = 4;

  constructor(public numRows: number, public numCols: number) {
    this._grid = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => []));
  }

  public get grid(): number[][][] { return this._grid; }

  build() {
    const startDirection: Pos = Math.random() < 0.5 ? new Pair(0, 1) : new Pair(1, 0);
    const startPosition: Pos = new Pair(
      Math.floor(Math.random() * (this.numRows - 2)) + 1,
      Math.floor(Math.random() * (this.numCols - 2)) + 1
    );
    this.add(startPosition, [1]);
    this.add(new Pair(startPosition.first + startDirection.first, startPosition.second + startDirection.second), [1]);
    let id = 2;
    let limit = 999;

    while (this.boundaries.size > 0) {
      if (limit < 0) {
        throw `??? ${this.boundaries.size}, ${this.occupied.size}`;
      }
      limit -= 1;
      if (this.boundaries.size === 1) {
        const pos = this.boundaries.get(0)!;
        const neighbor = Pos$fourDirections
          .map(dir => new Pair(pos.first + dir.first, pos.second + dir.second))
          .find(neighbor => this.occupied.has(neighbor)) ?? Pos$fourDirections[0];
        this._grid[neighbor.first][neighbor.second].push(id);
        this.add(pos, [id]);
        id++;
        continue;
      }

      const expectedSlotsCount = Math.max(4, Math.floor(this.boundaries.size / 2));
      const slots = new OArraySet(
        this.boundaries.randomChoicesNoReplace(expectedSlotsCount));
      const slotContents: Map<Pos, number[]> = new Map();
      const valuesCount = this.getValuesCount(slots.size);

      for (let i = 0; i < valuesCount; i++) {
        const pickedSlots = slots.randomChoicesNoReplace(2);
        if (pickedSlots.length !== 2) break;
        for (const slot of pickedSlots) {
          const content = slotContents.get(slot) || [];
          content.push(id);
          slotContents.set(slot, content);
          if (content.length >= TableBuilder.slotMaxSize) {
            slots.delete(slot);
          }
        }
        id++;
      }

      for (const [slot, content] of slotContents.entries()) {
        this.add(slot, content);
      }
    }
  }

  private add(position: Pos, ids: number[]) {
    this.boundaries.delete(position);
    this.occupied.add(position);
    this._grid[position.first][position.second] = ids;
    for (const dp of Pos$fourDirections) {
      const bpos = new Pair(position.first + dp.first, position.second + dp.second);
      if (this.inBound(bpos) && !this.occupied.has(bpos)) {
        this.boundaries.add(bpos);
      }
    }
  }

  private inBound(position: Pos): boolean {
    return position.first >= 0 && position.first < this.numRows && position.second >= 0 && position.second < this.numCols;
  }

  private getValuesCount(slotsCount: number): number {
    switch (slotsCount) {
      case 2: return 1;
      case 3: return Math.floor(Math.random() * 3) + 2;
      default: return Math.floor(Math.random() * (slotsCount + 1)) + slotsCount;
    }
  }
}
