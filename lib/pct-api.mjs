
`use strict`;

export function containerUnlock(id) {
  return false;
}
export function containerLock(id) {
  console.log(`Locking ${id}...`);
  return false;
}
export function containerSnapshot(id) {
  return false;
}

const api = {
  containerUnlock,
  containerLock,
  containerSnapshot,
};

export default api;
