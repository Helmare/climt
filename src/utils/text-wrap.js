/**
 * @typedef TxwToken
 * @prop {"ws"|"nw"} type
 * @prop {string} value
 */

/**
 * Wraps a text to a specific width in characters.
 * 
 * @param {string} str 
 * @param {number} width
 * @returns {string[]} All lines created.
 */
function wrap(str, width) {
  const tokens = tokenize(str);
  const lines = [];

  while (tokens.length > 0) {
    lines.push(cut(tokens, width));
  }

  return lines;
}

/**
 * Tokenizes a string into a series of whitespace
 * and non-whitespace tokens.
 * 
 * @returns {TxwToken[]}
 */
function tokenize(str) {
  // Setup FSM
  let state = /\s/.test(str.charAt(0)) ? 0 : 1;
  let tokens = [];
  let curr = {
    type: state === 1 ? 'nw' : 'ws',
    value: str.charAt(0)
  };

  // Run FSM
  for (let i = 1; i < str.length; i++) {
    const char = str.charAt(i);
    const isws = /\s/.test(char);
    if (state === 0) {
      if (isws) {
        curr.value += char;
      }
      else {
        tokens.push(curr);
        curr = {
          type: 'nw',
          value: char
        };
        state = 1;
      }
    }
    else if (state === 1) {
      if (isws) {
        tokens.push(curr);
        curr = {
          type: 'ws',
          value: char
        };
        state = 0;
      }
      else {
        curr.value += char;
      }
    }
  }
  tokens.push(curr);

  // Trim the array
  if (tokens[0].type === 'ws') {
    tokens.shift();
  }
  if (tokens[tokens.length - 1].type === 'ws') {
    tokens.pop();
  }

  // Return result.
  return tokens;
}
/**
 * Removes whitespace tokens from the start and end
 * in-place.
 * 
 * @param {TxwToken[]} tokens 
 * @return {TxwToken[]} reference to the array.
 */
function trim(tokens) {
  while (tokens[0].type === 'ws') {
    tokens.shift();
  }
  while (tokens[tokens.length - 1].type === 'ws') {
    tokens.pop();
  }
  return tokens;
}
/**
 * Cuts the token array to the width in-place.
 * 
 * @param {TxwToken[]} tokens 
 * @param {number} width 
 * @return {string}
 */
function cut(tokens, width) {
  // Setup
  let end = -1;
  let length = 0;
  trim(tokens);

  for (let i = 0; i < tokens.length; i++) {
    if (length + tokens[i].value.length <= width) {
      length += tokens[i].value.length;
      end = i;
    }
    else break;
  }

  if (end < 0) {
    const cut = tokens[0].value.substr(0, width);
    tokens[0].value = tokens[0].value.substr(width);
    return cut;
  }
  else {
    let cut = '';
    while (end >= 0) {
      cut += tokens.shift().value;
      end--;
    }
    return cut.trim();
  }
}

module.exports = wrap;