`use strict`

import {parseBoolean} from './type.mjs';
import process from 'node:process';
import {request} from 'node:http';
import {request as secureRequest} from 'node:https';

const useTLS = parseBoolean(process.env[`USE_TLS`]) || true;
const DEBUG = parseBoolean(process.env['DEBUG']) || false;

console.debug = function(message = ``, ...args) {
  if(DEBUG && (DEBUG == "1" || DEBUG == "true")) {
    console.info(message, ...args);
  }
};

// const fetch = request;
export const fetch = parseBoolean(useTLS) == true ? secureRequest : request;

export {parseBoolean} from './type.mjs';

const api = {
  fetch,
  parseBoolean,
};

export default api;
