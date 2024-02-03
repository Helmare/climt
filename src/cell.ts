import { ClimtColumn } from './column.js';
import { wrap } from './utils.js';

export class ClimtCell {
  x: number;
  y: number;
  col: ClimtColumn;
  content: string
  _lines:string[] = [];

  constructor(x: number, y: number, col: ClimtColumn, content: string) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.content = content;
  }

  /**
   * @returns height of the cell.
   */
  get height(): number {
    return this._lines.length;
  }

  /**
   * Expands the height of _data to the new height.
   * Cannot shirnk.
   * 
   * @param height new height
   */
  expand(height: number) {
    while (this.height < height) {
      this._lines.push(''.padStart(this.col._width));
    }
  }

  /**
   * Evaluates what the string should be. This might
   * need the column width.
   */
  _eval() {
    if (this.content.length > this.col._width - 2) {
      if (this.col.style.overflow == 'truncate') {
        this._lines = [` ${this.content.substring(0, this.col._width - 5)}... `];
      }
      else {
        this._lines = wrap(this.content, this.col._width - 2);
        this._lines.forEach((line, i) => {
          this._lines[i] = `${this._align(line)}`;
        });
      }
    }
    else {
      this._lines = [`${this._align(this.content)}`];
    }
  }
  /**
   * Evaluates a single line.
   * @param str 
   * @returns
   */
  _align(content: string): string {
    const str = content.trim();
    if (this.col.style.align == 'center') {
      const leftover = this.col._width - str.length;
      return `${''.padStart(Math.floor(leftover / 2))}${str}${''.padStart(Math.ceil(leftover / 2))}`
    }
    else if (this.col.style.align == 'right') {
      return `${str} `.padStart(this.col._width);
    }
    else {
      return ` ${str}`.padEnd(this.col._width);
    }
  }
}