import { LitElement, ReactiveController, ReactiveElement } from 'lit';

type Direction = 'up'|'right'|'down'|'left';

interface Position {
  x: number;
  y: number;
}

interface Board {
  rows: number;
  columns: number;
}

export interface Piece {
  type: 'puck'|'block';
  position: Position;
  color?: string;
}

export interface Move {
  piece: Piece;
  src: Position;
  target: Position;
  distance: number;
}

// @ts-expect-error
export class GameController<T extends LitElement> implements ReactiveController {
  private _host: LitElement;

  moves: Move[] = [];
  board: Board = {
    rows: 8,
    columns: 8,
  };
  pieces: Piece[] = [];

  get lastMove(): Move {
    if (!this.moves.length) {
      return null;
    }

    return this.moves[this.moves.length - 1];
  }

  constructor(host: T) {
    this._host = host;

    for (let idx = 0; idx < 15; idx++) {
      const position = getRandomFreePosition(this.board, this.pieces)
      this.pieces.push({ position, type: 'block' });
    }

    const colors = ['yellow', 'pink']
    for (let idx = 0; idx < 2; idx++) {
      const position = getRandomFreePosition(this.board, this.pieces)
      this.pieces.push({ position, type: 'puck', color: colors[idx] });
    }
  }

  move(piece: Piece, direction: Direction) {
    const target = getEdgePosition(piece.position, direction, this.board);
    const newPosition = getEndPosition(piece.position, target, this.pieces);

    if (isSamePosition(piece.position, newPosition)) {
      // notify somehow? revert ui stuff?
      return;
    }

    this.moves = [...this.moves, {
      piece,
      src: piece.position,
      target: newPosition,
      distance: getDistance(piece.position, newPosition),
    }];

    this._updatePiecePosition(piece, newPosition);

    this._host.requestUpdate();
  }

  revert() {
    if (!this.moves.length) {
      return;
    }

    const lastMove = this.moves[this.moves.length - 1];
    this.moves = this.moves.slice(0, this.moves.length - 2);

    this._updatePiecePosition(lastMove.piece, lastMove.src);

    this._host.requestUpdate();
  }

  private _updatePiecePosition(piece: Piece, position: Position) {
    if (isSamePosition(piece.position, position)) {
      return;
    }

    this.pieces = this.pieces
      .map(target => piece === target ? { ...piece, position } : target);
  }
}

function getEndPosition(source: Position, target: Position, pieces: Piece[]): Position {
  const collisions = getCollisions(source, target, pieces);
  // if we have no collisions, we can move all the way to the target
  if (!collisions.length) {
    return target;
  }

  const collision = collisions[0];
  const direction = getSinglePlaneDirection(source, collision.position);

  // always stop 1 ahead of the collision piece,
  // depending on the direction.
  switch (direction) {
    case 'up': return {
      y: collision.position.y + 1,
      x: collision.position.x,
    };
    case 'right': return {
      y: collision.position.y,
      x: collision.position.x - 1,
    };
    case 'down': return {
      y: collision.position.y - 1,
      x: collision.position.x,
    };
    case 'left': return {
      y: collision.position.y,
      x: collision.position.x + 1,
    }
    default: throw new Error('invalid direction');
  }
}

function getEdgePosition(source: Position, direction: Direction, board: Board): Position {
  switch (direction) {
    case 'up': return {
      x: source.x,
      y: 0,
    };
    case 'right': return {
      x: board.columns - 1,
      y: source.y,
    };
    case 'down': return {
      x: source.x,
      y: board.rows - 1,
    };
    case 'left': return {
      x: 0,
      y: source.y,
    };
    // should not happen
    default: throw new Error('invalid direction');
  }
}

function getCollisions(source: Position, target: Position, pieces: Piece[]): Piece[] {
  const dir = getSinglePlaneDirection(source, target);

  return pieces
    // filter out the source piece, if it was included.
    .filter(piece => !isSamePosition(source, piece.position))
    // we can only move in one plane at a time, so there can never be a diagonal collision.
    .filter(piece => !isDiagonalPosition(source, piece.position))
    .filter(piece => getSinglePlaneDirection(source, piece.position) === dir)
    .sort((a, b) => {
      switch (dir) {
        case 'up': return a.position.y < b.position.y ? 1 : -1;
        case 'down': return a.position.y > b.position.y ? 1 : -1;
        case 'right': return a.position.x > b.position.x ? 1 : -1;
        case 'left': return a.position.x < b.position.x ? 1 : -1;
        // should not happen
        default: throw new Error('invalid direction');
      }
    });
}

function isSamePosition(source: Position, target: Position): boolean {
  return source.x === target.x && source.y === target.y;
}

function isDiagonalPosition(source: Position, target: Position): boolean {
  if (isSamePosition(source, target)) {
    return false;
  }

  return source.x !== target.x && source.y !== target.y;
}

function isPositionFree(position: Position, pieces: Piece[]) {
  return pieces.every(piece => !isSamePosition(piece.position, position));
}

function getSinglePlaneDirection(source: Position, target: Position): Direction {
  // this function should not be called when that is the case.
  if (isSamePosition(source, target)) {
    throw new Error('cannot compare identical positions');
  }

  // we only move in either horizontal OR vertical direction, not both.
  if (isDiagonalPosition(source, target)) {
    throw new Error('can only move in a single plane, not diagonally');
  }

  // vertical
  if (source.x === target.x) {
    return source.y > target.y ? 'up' : 'down';
  }

  // horizontal
  if (source.y === target.y) {
    return source.x > target.x ? 'left' : 'right';
  }
}

function getRandomFreePosition(board: Board, pieces: Piece[]): Position {
  const maxIdx = (board.columns * board.rows) - 1;
  const startIdx = Math.floor(Math.random() * maxIdx);
  let idx = (startIdx + 1) % maxIdx;

  while (idx !== startIdx) {
    const position = {
      x: idx % board.columns,
      y: Math.floor(idx / board.rows),
    };

    if (isPositionFree(position, pieces)) {
      return position;
    }

    idx = (idx + 1) % maxIdx;
  }

  // unable to find a free position.
  return null;
}

function getDistance(src: Position, target: Position) {
  return Math.max(Math.abs(src.x - target.x), Math.abs(src.y - target.y));
}
