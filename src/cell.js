class ClimtCell {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {import(".").ClimtColumn} col
   * @param {string} [content] 
   */
  constructor(x, y, col, content) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.content = content;
  }

  /**
   * Evaluates what the string should be. This might
   * need the column width.
   */
  eval() {
    return this.content;
  }
}
module.exports = ClimtCell;