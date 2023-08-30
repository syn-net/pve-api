
`use strict`;

import {
  shell,
  assign,
} from './utils.mjs';

export
const DEFAULT_OPTIONS = {
  dryRun: false,
};

export
async function virtualMachineStatus(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);
  const cmdStr = `qm status ${id}`;
  // const cmdStr = `qm guest cmd ${id} fsfreeze-status`;
  return false;
}

export
async function virtualMachineUnlock(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);
  const cmdStr = `qm unlock ${id}`;

  console.log(`Unlocking virtual machine ${id}...`);

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
async function virtualMachineLock(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);
  const cmdStr = `qm set ${id} --lock backup`;

  console.log(`Locking virtual machine ${id}...`);

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
async function virtualMachineSnapshot(id, opts = {}) {
  return false;
}

export
async function virtualMachineFreeze(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);
  const cmdStr = `qm cmd guest ${id} fsfreeze-freeze`;

  console.log(`Freezing virtual machine ${id}...`);

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
async function virtualMachineThaw(id, opts = {}) {
  const options = assign(DEFAULT_OPTIONS, opts);
  const cmdStr = `qm cmd guest ${id} fsfreeze-thaw`;

  console.log(`Thawing virtual machine ${id}...`);

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
  DEFAULT_QM_OPTIONS: DEFAULT_OPTIONS,
  virtualMachineStatus,
  virtualMachineUnlock,
  virtualMachineLock,
  virtualMachineSnapshot,
  virtualMachineFreeze,
  virtualMachineThaw,
};

export default api;
