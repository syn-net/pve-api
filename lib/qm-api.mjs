
`use strict`;

import {shell} from './utils.mjs';

export function virtualMachineUnlock(id) {
  return false;
}
export function virtualMachineLock(id) {
  console.log(`Locking ${id}...`);
  return false;
}
export function virtualMachineSnapshot(id) {
  return false;
}

const api = {
  virtualMachineUnlock,
  virtualMachineLock,
  virtualMachineSnapshot,
};

export default api;
