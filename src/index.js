const getProp = require('./getprop');
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
 * @prop {number} [style.maxWidth=15] Max width of the column. Ignored if `style.width` is set.
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
      maxWidth: 15,
      overflow: 'wrap',
      align: 'left'
    }, ...col.style };

    // Setup column width
    col._width = col.style.width;

    // Push header cell.
    cells.push(new ClimtCell(x, -1, col, col.name));

    // Add each row
    opts.rows.forEach((row, y) => {
      // Grab content
      const data = getProp(row, col.id);
      const content = col.stringify ? col.stringify(data) : data.toString();

      // Setup width
      if (col.style.width <= 0 && col._width < col.style.maxWidth) {
        col._width = Math.min(col.style.maxWidth, Math.max(col._width, content.length + 2));
      }

      // Push content cell.
      cells.push(new ClimtCell(x, y, col, content));
    });
  });

  return cells.sort((a, b) => {
    const ai = a.x + a.y * opts.cols.length;
    const bi = b.x + b.y * opts.cols.length;
    return ai - bi;
  });
}
module.exports = climt;