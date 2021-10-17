const getProp = require('./utils/getprop');
const ClimtCell = require('./cell');

/**
 * @typedef {object} ClimtOptions
 * @prop {ClimtColumn[]} cols Array of columns.
 * @prop {object[]} rows An array of row data.
 * @prop {ClimtFormat} [format] Color callback for each cell.
 */
/**
 * @typedef {object} ClimtColumn
 * @prop {string} id ID of the column. Used for accessing the data for each row.
 * @prop {string} [name] Display name of the column (ID by default).
 * @prop {number} [_width] Width of the column (may be different from `style.width`). *Should not be set by humans.*
 * @prop {ClimtStringify} [stringify] Stringify callback for a columns data (`data.toString` by default).
 * 
 * @prop {object} [style] Styling for the column.
 * @prop {number} [style.width=0] Width of the column.
 * @prop {number} [style.maxWidth=0] Max width of the column. Ignored if `style.width` is set. `<= 0` values allow infinite width.
 * @prop {"wrap"|"truncate"} [style.overflow="wrap"] Determains what to do with overflow.
 * @prop {"left"|"right"|"center"} [style.align="left"] Text alignment.
 */
/**
 * @callback ClimtStringify
 * @param {*} data
 * @return {string} 
 */
/**
 * @callback ClimtFormat
 * @param {string} content Stringified cell data with empty space.
 * @param {number} col Index of the cell's column.
 * @param {number} row Index of the cell's row (`-1` for header).
 * @return {string} 
 */

/**
 * Renders a minimalist table to stdout.
 * 
 * @param {ClimtOptions} opts
 */
function climt(opts) {
  /** @type {ClimtCell[]} */
  const cells = [];
  opts.cols.forEach((col, x) => {
    // Setup basic defaults.
    if (!col.name) col.name = col.id;

    // Apply col.style defaults.
    if (!col.style) col.style = { };
    col.style = { ...{
      width: 0,
      maxWidth: 0,
      overflow: 'wrap',
      align: 'left'
    }, ...col.style };

    // Setup column width
    if (col.style.width <= 0) {
      col._width = col.style.maxWidth <= 0 ? col.name.length + 2 : Math.min(col.style.maxWidth, col.name.length + 2);
    }
    else {
      col._width = col.style.width;
    }

    // Push header cell.
    cells.push(new ClimtCell(x, -1, col, col.name, x < opts.cols.length - 1));

    // Add each row
    opts.rows.forEach((row, y) => {
      // Grab content
      const data = getProp(row, col.id);
      const content = col.stringify ? col.stringify(data) : data.toString();

      // Setup width
      if (col.style.width <= 0) {
        const width = Math.max(col._width, content.length + 2);
        col._width = col.style.maxWidth <= 0 ? width : Math.min(col.style.maxWidth, width);
      }

      // Push content cell.
      cells.push(new ClimtCell(x, y, col, content, x < opts.cols.length - 1));
    });
  });
  // Evaluate cells after cells have been added.
  cells.forEach(cell => cell._eval());

  // Sort cells to be in an order easy for rendering.
  cells.sort((a, b) => {
    const ai = a.x + a.y * opts.cols.length;
    const bi = b.x + b.y * opts.cols.length;
    return ai - bi;
  });

  // Expand row heights to be even.
  cells.forEach((cell, i) => {
    const sor = opts.cols.length * Math.floor(i / opts.cols.length);
    const eor = sor + opts.cols.length;
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
      if (opts.format) {
        line = opts.format(line, cell.x, cell.y);
      }
      lines[y + i] += `|${line}`;
    });
  });

  // Add header seperator.
  let sep = '';
  opts.cols.forEach(col => {
    sep += `+${''.padStart(col._width, '-')}`;
  });
  lines.splice(cells[0].height, 0, sep);

  // Render
  console.log();
  lines.forEach(line => console.log(line.substr(1)));
  console.log();
}
module.exports = climt;