import { chooseRandomlyFromArray } from "@/utils/random";

abstract class Tetrimino {
  public char: string;
  public x: number;
  public y: number;
  public degree: number;
  public isActive: boolean;
  constructor(char: string, x: number, y: number, degree: number) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.degree = degree;
    this.isActive = true;
  }
  public changeDegree(reverse?: boolean) {
    this.degree = (reverse ? this.degree - 90 : this.degree + 90) % 360;
    return this;
  }
  public addX(delta: number) {
    this.x += delta;
    return this;
  }
  public addY(delta: number) {
    this.y += delta;
    return this;
  }
  public deactivate() {
    this.isActive = false;
    return this;
  }
  abstract getCells(): { x: number; y: number }[];
}

export class Tetrimino_I extends Tetrimino {
  constructor(x: number, y: number) {
    super("i", x, y, 0);
  }
  public getCells() {
    return (
      {
        0: [
          { x: this.x - 1, y: this.y },
          { x: this.x, y: this.y },
          { x: this.x + 1, y: this.y },
          { x: this.x + 2, y: this.y },
        ],
        90: [
          { x: this.x + 1, y: this.y - 1 },
          { x: this.x + 1, y: this.y },
          { x: this.x + 1, y: this.y + 1 },
          { x: this.x + 1, y: this.y + 2 },
        ],
      }[this.degree % 180] ?? []
    );
  }
  public static getChar() {
    return "i";
  }
}

export class Tetrimino_O extends Tetrimino {
  constructor(x: number, y: number) {
    super("o", x, y, 0);
  }
  public getCells() {
    return [
      { x: this.x, y: this.y },
      { x: this.x + 1, y: this.y },
      { x: this.x, y: this.y + 1 },
      { x: this.x + 1, y: this.y + 1 },
    ];
  }
  public static getChar() {
    return "o";
  }
}

export class Tetrimino_S extends Tetrimino {
  constructor(x: number, y: number) {
    super("s", x, y, 0);
  }
  public getCells() {
    return (
      {
        0: [
          { x: this.x, y: this.y },
          { x: this.x + 1, y: this.y },
          { x: this.x, y: this.y + 1 },
          { x: this.x - 1, y: this.y + 1 },
        ],
        90: [
          { x: this.x - 1, y: this.y },
          { x: this.x - 1, y: this.y + 1 },
          { x: this.x, y: this.y + 1 },
          { x: this.x, y: this.y + 2 },
        ],
      }[this.degree % 180] ?? []
    );
  }
  public static getChar() {
    return "s";
  }
}

export class Tetrimino_Z extends Tetrimino {
  constructor(x: number, y: number) {
    super("z", x, y, 0);
  }
  public getCells() {
    return (
      {
        0: [
          { x: this.x - 1, y: this.y },
          { x: this.x, y: this.y },
          { x: this.x, y: this.y + 1 },
          { x: this.x + 1, y: this.y + 1 },
        ],
        90: [
          { x: this.x, y: this.y },
          { x: this.x, y: this.y + 1 },
          { x: this.x - 1, y: this.y + 1 },
          { x: this.x - 1, y: this.y + 2 },
        ],
      }[this.degree % 180] ?? []
    );
  }
  public static getChar() {
    return "z";
  }
}

export class Tetrimino_J extends Tetrimino {
  constructor(x: number, y: number) {
    super("j", x, y, 0);
  }
  public getCells() {
    return (
      {
        0: [
          { x: this.x - 1, y: this.y },
          { x: this.x - 1, y: this.y + 1 },
          { x: this.x, y: this.y + 1 },
          { x: this.x + 1, y: this.y + 1 },
        ],
        90: [
          { x: this.x, y: this.y },
          { x: this.x, y: this.y + 1 },
          { x: this.x, y: this.y + 2 },
          { x: this.x + 1, y: this.y },
        ],
        180: [
          { x: this.x - 1, y: this.y },
          { x: this.x, y: this.y },
          { x: this.x + 1, y: this.y },
          { x: this.x + 1, y: this.y + 1 },
        ],
        270: [
          { x: this.x, y: this.y },
          { x: this.x, y: this.y + 1 },
          { x: this.x, y: this.y + 2 },
          { x: this.x - 1, y: this.y + 2 },
        ],
      }[this.degree] ?? []
    );
  }
  public static getChar() {
    return "j";
  }
}

export class Tetrimino_L extends Tetrimino {
  constructor(x: number, y: number) {
    super("l", x, y, 0);
  }
  public getCells() {
    return (
      {
        0: [
          { x: this.x + 1, y: this.y },
          { x: this.x + 1, y: this.y + 1 },
          { x: this.x, y: this.y + 1 },
          { x: this.x - 1, y: this.y + 1 },
        ],
        90: [
          { x: this.x, y: this.y },
          { x: this.x, y: this.y + 1 },
          { x: this.x, y: this.y + 2 },
          { x: this.x + 1, y: this.y + 2 },
        ],
        180: [
          { x: this.x - 1, y: this.y },
          { x: this.x, y: this.y },
          { x: this.x + 1, y: this.y },
          { x: this.x - 1, y: this.y + 1 },
        ],
        270: [
          { x: this.x, y: this.y },
          { x: this.x, y: this.y + 1 },
          { x: this.x, y: this.y + 2 },
          { x: this.x - 1, y: this.y },
        ],
      }[this.degree] ?? []
    );
  }
  public static getChar() {
    return "l";
  }
}

export class Tetrimino_T extends Tetrimino {
  constructor(x: number, y: number) {
    super("t", x, y, 0);
  }
  public getCells() {
    return (
      {
        0: [
          { x: this.x, y: this.y },
          { x: this.x - 1, y: this.y + 1 },
          { x: this.x, y: this.y + 1 },
          { x: this.x + 1, y: this.y + 1 },
        ],
        90: [
          { x: this.x, y: this.y },
          { x: this.x, y: this.y + 1 },
          { x: this.x, y: this.y + 2 },
          { x: this.x + 1, y: this.y + 1 },
        ],
        180: [
          { x: this.x + 1, y: this.y },
          { x: this.x, y: this.y },
          { x: this.x + 1, y: this.y },
          { x: this.x, y: this.y + 1 },
        ],
        270: [
          { x: this.x, y: this.y },
          { x: this.x, y: this.y + 1 },
          { x: this.x, y: this.y + 2 },
          { x: this.x - 1, y: this.y + 1 },
        ],
      }[this.degree] ?? []
    );
  }
  public static getChar() {
    return "t";
  }
}

export function createRandomTetrimino(x: number, y: number) {
  const char = chooseRandomlyFromArray(["i", "o", "s", "z", "j", "l", "t"]);
  switch (char) {
    case "i":
      return new Tetrimino_I(x, y);
    case "o":
      return new Tetrimino_O(x, y);
    case "s":
      return new Tetrimino_S(x, y);
    case "z":
      return new Tetrimino_Z(x, y);
    case "j":
      return new Tetrimino_J(x, y);
    case "l":
      return new Tetrimino_L(x, y);
    case "t":
      return new Tetrimino_T(x, y);
    default:
      return new Tetrimino_I(x, y);
  }
}
