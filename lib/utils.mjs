`use strict`

import process from 'node:process';
import {request} from 'node:http';
import {request as secureRequest} from 'node:https';

const useTLS = (process.env[`USE_TLS`]) || true;
const DEBUG = (process.env['DEBUG']) || false;

console.debug = function(message = ``, ...args) {
  if(DEBUG && (DEBUG == "1" || DEBUG == "true")) {
    console.info(message, ...args);
  }
};

// const fetch = request;
export const fetch = useTLS && useTLS == true
  ? secureRequest : request;

const api = {
  fetch,
};

export default api;
