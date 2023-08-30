`use strict`

import util from 'node:util';
import {
  exec as _exec,
} from 'node:child_process';

import {
  assign,
  parseBoolean,
} from './type.mjs';

import process from 'node:process';
import {request as _request} from 'node:http';
import {request as _secureRequest} from 'node:https';

const DEBUG = parseBoolean(process.env['DEBUG']) || false;

console.debug = function(message = ``, ...args) {
  if(DEBUG && (DEBUG == "1" || DEBUG == "true")) {
    console.info(message, ...args);
  }
};

const exec = util.promisify(_exec);

// HTTP request
export const request = _request;

// HTTPS request
export const secureRequest = _secureRequest;

export
const shell = async function(...args) {
  const result = {
    status: 0,
    body: [],
    trace: [],
  };
  let options = {};
  let cmd = [];

  args.forEach((value, index) => {
    if(value) {
      if(value && typeof value == `object`) {
        options = value;
      } else {
        cmd.push(value);
      }
    }
  });

  if(args.length < 1) {
    const errMsg = `Missing function parameter -- command.`;
    result.status = 2;
    result.body.push(errMsg);
    return result;
  }

  const cmdStr = cmd.join(``);

  if(options && parseBoolean(options.dryRun) == true) {
    console.info(`DEBUG: ${cmdStr}`);
    return result;
  } else {
    await exec(cmdStr, (err, stdout, stderr) => {
      if(err) {
        result.status = 1;
        result.body.push(err.message);
        result.trace.push(stdout);
        console.error(`ERROR: ${err.message}`);
        return result;
      }

      if(stderr) {
        result.status = 1;
        result.body.push(stderr);
        console.error(`stderr: ${stderr}`);
      }

      if(stdout) {
        result.body.push(stdout);
        console.info(`stdout: ${stdout}`);
      }

      return result;
    });
  }
}

export {assign} from './type.mjs';
export {parseBoolean} from './type.mjs';

const api = {
  request,
  secureRequest,
  parseBoolean,
  shell,
};

export default api;
