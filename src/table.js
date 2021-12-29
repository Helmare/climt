const ClimtCell = require('./cell');
const getProp = require('./utils/getprop');

/** @type {ClimtColumnStyle} */
const DEFAULT_STYLE = {
  width: 0,
  maxWidth: 0,
  overflow: 'wrap',
  align: 'left'
};

/**
 * Builds and renders tables to the CLI.
 */
class ClimtTable {
  constructor() {
    /** @type {ClimtColumn[]} */
    this.cols = [];
    /** @type {ClimtFormatter[]} */
    this.formatters = [];
  }

  /**
   * Adds a column to the table.
   * 
   * @param {string} name 
   * @param {string|ClimtBind} bind 
   * @param {ClimtColumnStyle} [style]
   * @return {ClimtTable} returns `this` for chaining.
   */
  column(name, bind, style = {}) {
    const col = {
      name: name,
      bind: bind,
      style: { ...DEFAULT_STYLE, ...style  },
    }

    if (col.style.width <= 0) {
      col._width = col.style.maxWidth <= 0 ? col.name.length + 2 : Math.min(col.style.maxWidth, col.name.length + 2);
    }
    else {
      col._width = col.style.width;
    }

    this.cols.push(col);
    return this;
  }
  /**
   * @return {number} number of columns
   */
  get count() {
    return this.cols.length;
  }

  /**
   * Adds a formatter for use in rendering.
   * 
   * @param {ClimtFormatter} fmtr
   * @return {ClimtTable} returns `this` for chaining.
   */
  format(fmtr) {
    this.formatters.push(fmtr);
    return this;
  }
  /**
   * @param {string} content 
   * @returns {string}
   */
  _format(content, col, row) {
    this.formatters.forEach(fmtr => {
      content = fmtr(content, col, row);
    });
    return content;
  }

  /**
   * Renders the data to the CLI using this table.
   * 
   * @param {object[]} data 
   */
  render(data) {
    // Convert data into an array.
    if (!Array.isArray(data)) data = [data];

    /** @type {ClimtCell[]} */
    const cells = [];
    this.cols.forEach((col, x) => {
      // Add header column.
      cells.push(new ClimtCell(x, -1, col, col.name, x < this.count - 1));

      // Add each row.
      data.forEach((row, y) => {
        // Get data object
        const obj = typeof(col.bind) === 'string' ? getProp(row, col.bind) : col.bind(row);

        // Grab content.
        let content = '';
        if (obj !== undefined && obj !== null) {
          content = obj.toString();
        }

        // Setup width
        if (col.style.width <= 0) {
          const width = Math.max(col._width, content.length + 2);
          col._width = col.style.maxWidth <= 0 ? width : Math.min(col.style.maxWidth, width);
        }

        // Push content cell.
        cells.push(new ClimtCell(x, y, col, content, x < this.count - 1));
      });
    });

    // Evaluate cells after cells have been added.
    cells.forEach(cell => cell._eval());

    // Sort cells to be in an order easy for rendering.
    cells.sort((a, b) => {
      const ai = a.x + a.y * this.count;
      const bi = b.x + b.y * this.count;
      return ai - bi;
    });

    // Expand row heights to be even.
    cells.forEach((cell, i) => {
      const sor = this.count * Math.floor(i / this.count);
      const eor = sor + this.count;
      for (let j = sor; j < eor; j++) {
        if (j != i) {
          cell.expand(cells[j].height);
        }
      }
    });

    // Prerender
    const lines = [];
    const rowy = [];
    cells.forEach(cell => {
      // Setup lines and rowy if needed.
      const y = (rowy[cell.y] | 0);
      while (lines.length < y + cell.height) {
        lines.push('');
      }
      rowy[cell.y + 1] = y + cell.height;

      // Incorporate data
      cell._lines.forEach((line, i) => {
        lines[y + i] += `|${this._format(line, cell.x, cell.y)}`;
      });
    });

    // Add header seperator.
    let sep = '';
    this.cols.forEach(col => {
      sep += `+${''.padStart(col._width, '-')}`;
    });
    lines.splice(cells[0].height, 0, sep);

    // Render
    console.log();
    lines.forEach(line => console.log(line.substring(1)));
    console.log();
  }
}
module.exports = ClimtTable;

/**
 * @typedef {object} ClimtColumn
 * @prop {string|ClimtBind} bind Binds data to each row using an ID string or a funciton.
 * @prop {string} [name] Display name of the column (ID by default).
 * @prop {number} [_width] Width of the column (may be different from `style.width`). *Should not be set by humans.*
 * 
 * @prop {ClimtColumnStyle} [style] Styling for the column.
 */
/**
 * @typedef {object} ClimtColumnStyle
 * @prop {number} [width=0] Width of the column.
 * @prop {number} [maxWidth=0] Max width of the column. Ignored if `style.width` is set. `<= 0` values allow infinite width.
 * @prop {"wrap"|"truncate"} [overflow="wrap"] Determains what to do with overflow.
 * @prop {"left"|"right"|"center"} [align="left"] Text alignment.
 */
/**
 * @callback ClimtBind
 * @param {object} row
 * @return {string} 
 */
/**
 * @callback ClimtFormatter
 * @param {string} content Stringified cell data with empty space.
 * @param {number} col Index of the cell's column.
 * @param {number} row Index of the cell's row (`-1` for header).
 * @return {string} 
 */