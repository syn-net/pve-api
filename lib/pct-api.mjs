
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

export
async function containerStatus(id, opts = {}) {
  const cmdStr = `pct status ${id}`;
  // const cmdStr = `lxc-info -s ${id}|grep -i -e 'frozen'`;
  return false;
}

export
async function containerUnlock(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);
  const cmdStr = `pct unlock ${id}`;

  console.log(`Unlocking ${id}...`);

  const result = await shell(cmdStr, options);

  if(result && result.status === 1) {
    console.error(`ERROR: ${result.body}`);
  }

  if(result && result.status == 0 && (result.body && result.body.length > 0)) {
    console.log(`success!\n\n${result.body}`);
    return true;
  }

  return false;
}

export
async function containerLock(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);
  const cmdStr = `pct set ${id} --lock backup`;

  console.log(`Locking ${id}...`);

  const result = await shell(cmdStr, options);

  if(result && result.status === 1) {
    console.error(`ERROR: ${result.body}`);
  }

  if(result && result.status == 0 && (result.body && result.body.length > 0)) {
    console.log(`success!\n\n${result.body}`);
    return true;
  }

  return false;
}
export
async function containerSnapshot(id, opts = {}) {
  return false;
}

export
async function containerFreeze(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);
  const cmdStr = `lxc-freeze ${id}`;

  console.log(`Freezing LXC container ${id}...`);

  const result = await shell(cmdStr, options);

  if(result && result.status === 1) {
    console.error(`ERROR: ${result.body}`);
  }

  if(result && result.status == 0 && (result.body && result.body.length > 0)) {
    console.log(`success!\n\n${result.body}`);
    return true;
  }

  return false;
}

export
async function containerThaw(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);
  const cmdStr = `lxc-unfreeze ${id}`;

  console.log(`Thawing LXC container ${id}...`);

  const result = await shell(cmdStr, options);

  if(result && result.status === 1) {
    console.error(`ERROR: ${result.body}`);
  }

  if(result && result.status == 0 && (result.body && result.body.length > 0)) {
    console.log(`success!\n\n${result.body}`);
    return true;
  }

  return false;
}

const api = {
  DEFAULT_PCT_OPTIONS: DEFAULT_OPTIONS,
  containerStatus,
  containerUnlock,
  containerLock,
  containerSnapshot,
  containerFreeze,
  containerThaw,
};

export default api;
