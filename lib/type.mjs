`use strict`;

export const assign = Object.assign;

export
function isUndefined(obj) {
  const result = (typeof obj === 'undefined');
  return(result);
}

export
function isNull(obj) {
  const result = (obj === null);
  return(result);
}

export
function nullOrUndefined(obj) {
  const result = (isNull(obj) === true || isUndefined(obj) === true);
  return(result);
}

export
function isString(obj) {
  const result = (nullOrUndefined(obj) === false && typeof obj === 'string');

  return(result);
}

/** Convert a value to a String.
*
*   @param {Primitive} value - The value to convert to a String.
*   @returns {String} The resulting String from the given value.
*
*   @note Unlike a call made with the built-in `toString` method, the
*   `String` constructor better handles null and undefined values.
*/
export
function toString(value) {
  const str = String(value);
  str.replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/\//g, '\\u002F');
  return(str);
}

export
function parseBoolean(value, params = {}) {
  // FIXME(jeff): Resolves support of attributes with zero-length strings, such
  // as `hidden` and `disabled`, which are both implied to be truthy values
  const TRUTHY_VALUES = [true, `true`, 1, `1`, `on`, `ON`, `yes`, `YES`];
  let result = false;
  const DEFAULT_OPTIONS = {
    stringify: false,
  };
  const options = assign(DEFAULT_OPTIONS, params);

  if(nullOrUndefined(value) === true) {
    return(result);
  }

  if(isString(value) == true) {
    value = toString(value).trim();
  }

  result = TRUTHY_VALUES.some((el) => {
    return(el == value);
  });


  if(options.stringify == true) {
    result = JSON.stringify(result);
  }

  return(result);
}

const api = {
  assign,
  isUndefined,
  nullOrUndefined,
  isString,
  parseBoolean,
};
export default api;
