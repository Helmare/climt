/**
 * @typedef {object} ClimtOptions
 * @prop {object[]} cols Array of columns
 * @prop {string} cols[].name Display name of the column.
 * @prop {string|number} [cols[].prop] Row property used for data (column index by default).
 * @prop {object} [cols[].style] Styling for the column.
 * @prop {"content"|number} [cols[].style.width="content"] Width of the column.
 * @prop {number} [cols[].style.padding=1] Padding of the string on the left and right side.
 * @prop {"left"|"right"|"center"} [cols[].style.align="left"] Text alignment.
 */
/**
 * Renders a minimalist table to stdout.
 * 
 * @param {ClimtOptions} opts
 */
function climt(opts) {
  
}
/**
 * Gets a property from an object. Uses '.' in the string
 * to get nested properties.
 * 
 * @param {object} obj 
 * @param {string|number} prop 
 * @return {*}
 */
function getProp(obj, prop) {
  if (typeof(prop) === 'number') {
    return obj[prop];
  }
  else if (typeof(prop) === 'string') {
    let result = obj;
    prop.split('.').forEach(key => {
      result = result[key];
    });
    return result;
  }
  else throw new TypeError('Invalid type of "prop"');
}

module.exports = climt;