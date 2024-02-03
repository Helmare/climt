/**
 * Gets a property from an object. Uses '.' in the string
 * to get nested properties.
 * 
 * @param obj 
 * @param prop 
 * @return
 */
export function getProp(obj: any, prop: string|number): any {
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

export interface TxwToken {
  type: 'ws'|'nw',
  value: string
}
/**
 * Wraps a text to a specific width in characters.
 * 
 * @param str 
 * @param width
 * @returns All lines created.
 */
export function wrap(str: string, width: number): string[] {
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
 * @param str
 */
export function tokenize(str: string): TxwToken[] {
  // Setup FSM
  let state = /\s/.test(str.charAt(0)) ? 0 : 1;
  let tokens: TxwToken[] = [];
  let curr: TxwToken = {
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
 * @param tokens 
 * @return reference to the array.
 */
export function trim(tokens: TxwToken[]): TxwToken[] {
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
 * @param tokens 
 * @param width 
 * @return {string}
 */
export function cut(tokens: TxwToken[], width: number): string {
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
    const cut = tokens[0].value.substring(0, width);
    tokens[0].value = tokens[0].value.substring(width);
    return cut;
  }
  else {
    let cut = '';
    while (end >= 0) {
      cut += tokens.shift()!.value;
      end--;
    }
    return cut.trim();
  }
}