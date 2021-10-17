const { clearLine } = require('readline');
const wrap = require('./utils/text-wrap');

class ClimtCell {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {import(".").ClimtColumn} col
   * @param {string} content 
   */
  constructor(x, y, col, content) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.content = content;
    this._lines = [];
  }

  /**
   * @returns {number} height of the cell.
   */
  get height() {
    return this._lines.length;
  }

  /**
   * Expands the height of _data to the new height.
   * Cannot shirnk.
   * 
   * @param {number} height new height
   */
  expand(height) {
    if (height > this.height) {
      for (let i = 0; i <= height - this.height; i++) {
        this._lines.push(''.padStart(this.col._width));
      }
    }
  }

  /**
   * Evaluates what the string should be. This might
   * need the column width.
   */
  _eval() {
    if (this.content.length > this.col._width - 2) {
      if (this.col.style.overflow == 'truncate') {
        this._lines = [` ${this.content.substr(0, this.col._width - 5)}... `];
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
   * @param {string} str 
   * @returns {string}
   */
  _align(content) {
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
module.exports = ClimtCell;