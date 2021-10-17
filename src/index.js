const getProp = require('./getprop');
/**
 * @typedef {object} ClimtOptions
 * @prop {object[]} cols Array of columns.
 * @prop {string} cols[].id ID of the column.
 * @prop {string} [cols[].name] Display name of the column (ID by default).
 * @prop {string|number} [cols[].prop] Row property used for data (Index by default).
 * @prop {ClimtStringify} [cols[].stringify] Stringify callback for a columns data (`data.toString` by default).
 * 
 * @prop {object} [cols[].style] Styling for the column.
 * @prop {"content"|number} [cols[].style.width="content"] Width of the column.
 * @prop {number} [cols[].style.padding=1] Padding of the string on the left and right side.
 * @prop {"left"|"right"|"center"} [cols[].style.align="left"] Text alignment.
 * @prop {ClimtColor} [cols[].style.color] Color callback for each cell.
 * 
 * @prop {array} rows An array of row data.
 */
/**
 * @callback ClimtStringify
 * @param {*} data
 * @return {string} 
 */
/**
 * @callback ClimtColor
 * @param {string} cell Stringified cell data.
 * @param {number} row Index of the cell's row (`-1` for header).
 * @return {string}
 */

/**
 * Renders a minimalist table to stdout.
 * 
 * @param {ClimtOptions} opts
 */
function climt(opts) {
  return opts;
}
module.exports = climt;