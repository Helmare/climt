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
      if (result && typeof(result) === 'object') {
        result = result[key];
      }
      else {
        result = undefined;
      }
    });
    return result;
  }
  else throw new TypeError('Invalid type of "prop"');
}