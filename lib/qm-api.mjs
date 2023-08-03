
`use strict`;

import {
  assign,
  shell,
} from './utils.mjs';

export
const DEFAULT_OPTIONS = {
  dryRun: false,
};

export function virtualMachineStatus(id, opts = {}) {
  const cmdStr = `qm status ${id}`;
  const options = assign(DEFAULT_OPTIONS, opts);
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

export function virtualMachineUnlock(id, opts = {}) {
  const cmdStr = `qm unlock ${id}`;
  const options = assign(DEFAULT_OPTIONS, opts);
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

export function virtualMachineLock(id, opts = {}) {
  const cmdStr = `qm set ${id} --lock backup`;
  const options = assign(DEFAULT_OPTIONS, opts);
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
export function virtualMachineSnapshot(id, opts = {}) {
  const cmdStr = `qm snapshot ${id}`;
  const options = assign(DEFAULT_OPTIONS, opts);
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

const api = {
  virtualMachineStatus,
  virtualMachineUnlock,
  virtualMachineLock,
  virtualMachineSnapshot,
};

export default api;
