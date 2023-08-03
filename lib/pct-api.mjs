
`use strict`;

import {
  assign,
  parseBoolean,
  shell,
} from './utils.mjs';

export
const DEFAULT_OPTIONS = {
  dryRun: false,
};

export function containerStatus(id) {
  const cmdStr = `pct status ${id}`;
  return false;
}

export function containerUnlock(id) {
  const cmdStr = `pct unlock ${id}`;
  return false;
}

export function containerLock(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);

  const cmdStr = `pct set ${id} --lock backup`;

  console.log(`Locking ${id}...`);

  const result = shell(cmdStr, options);

  if(result && result.status === 1) {
    console.error(`ERROR: ${result.body}`);
  }

  if(result && result.status == 0 && (result.body && result.body.length > 0)) {
    console.log(`success!\n\n${result.body}`);
    return true;
  }

  return false;
}
export function containerSnapshot(id) {
  return false;
}

const api = {
  DEFAULT_OPTIONS,
  containerStatus,
  containerUnlock,
  containerLock,
  containerSnapshot,
};

export default api;
