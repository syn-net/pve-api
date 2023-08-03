#!/usr/bin/env node

// 1. https://nodejs.org/api/http.html
// 2. https://nodejs.org/api/single-executable-applications.html

`use strict`

import {resolve} from 'node:path';
import {argv, env, cwd} from 'node:process';
import * as dotenv from 'dotenv';
dotenv.config({
  path: resolve(cwd(), `.env`),
});
import assert from 'node:assert';
import {
  parseBoolean,
  fetch,
  shell,
} from './lib/utils.mjs';

import {
  containerStatus,
  containerUnlock,
  containerLock,
} from './lib/pct-api.mjs';

import {
  virtualMachineStatus,
  virtualMachineUnlock,
  virtualMachineLock,
} from './lib/qm-api.mjs';

const debugAssert = assert.strict.strictEqual;

const args = argv;

const DEBUG = parseBoolean(env[`DEBUG`]) || false;
const DRY_RUN = parseBoolean(env[`DRY_RUN`]) || false;
const pveAuthKey = env[`PVE_AUTH_KEY`] || ``;

const RPORT = Math.abs(env[`REMOTE_PORT`]) || 8006;
const RHOST = env[`REMOTE_HOSTNAME`] || `scorpio-pve.lan`;
const useTLS = parseBoolean(env[`USE_TLS`]) || true;
const proto = parseBoolean(useTLS) == true ? `HTTPS` : `HTTP`;

const TYPES_QEMU = `qemu`;
const TYPES_LXC = `lxc`;

const postData = JSON.stringify({
  type: `vm`, // node, storage, ...
});

const fetchOptions = {
  hostname: RHOST,
  port: RPORT,
  //https://scorpio-pve.lan:8006/api2/json/nodes/scorpio-pve/lxc/106/config
  path: `/api2/json/cluster/resources?type=vm`,
  method: `GET`,
  headers: {
    'Content-Type': `application/json`,
    //'Content-Length': Buffer.byteLength(postData),
    'Authorization': `PVEAPIToken=${pveAuthKey}`,
  },
};

if(pveAuthKey && pveAuthKey.length > 0) {
  console.debug(`An authorization key was found with the value of... ${pveAuthKey}`);
} else {
  console.debug(`No authorization key was found...`);
}
console.debug();

console.debug(`Beginning ${proto} request to ${fetchOptions.hostname}...`);
console.debug();

args.forEach((arg, pos) => {
  if(arg) {
    console.debug(`arg[${pos}: ${arg}`);
  }
});

const req = fetch(fetchOptions, (res) => {
  res.setEncoding('utf8');

  res.on(`data`, (body) => {
    if(DEBUG) {
      console.info(`STATUS: ${res.statusCode}`);
      console.info(`HEADERS: ${JSON.stringify(res.headers)}`);
      console.info(`BODY: ${body}`);
    }

    if(body && body.length > 0) {
      const jsonBody = JSON.parse(body);
      const containers = jsonBody[`data`];

      let runningContainers = [];
      containers.forEach((container, index) => {
        if(container) {
          console.info(`${container.name}: ${container.type} - ${container.vmid}...${container.status}`);
          if(container.status === `running`) {
            runningContainers.push(container);
          }
        }
      });

      let lxcContainers = [];
      let qemuContainers = [];
      runningContainers.forEach((container, index) => {
        if(container) {
          console.info(`${container.name}: ${container.type} - ${container.vmid}...${container.status}`);
          if(container.type === TYPES_QEMU) {
            qemuContainers.push(container);
          } else if(container.type === TYPES_LXC) {
            lxcContainers.push(container);
          }
        }
      });

      const totalNumRunningContainers = runningContainers.length;
      const numQemuContainers = qemuContainers.length;
      const numLxcContainers = lxcContainers.length;
      console.log(`totalNumRunningContainers: ${totalNumRunningContainers}`);
      console.log(`numQemuContainers: ${numQemuContainers}`);
      console.log(`numLxcContainers: ${numLxcContainers}`);

      const containerOptions = {
        dryRun: DRY_RUN,
      };

      lxcContainers.forEach((container, index) => {
        if(container && container.vmid && Math.abs(container.vmid) > 99) {
          const id = container.vmid;
          console.debug(`Locking ${id}...`);
          containerLock(id, containerOptions);
        }
      });

      qemuContainers.forEach((container, index) => {
        if(container && container.vmid && Math.abs(container.vmid) > 99) {
          const id = container.vmid;
          console.debug(`Locking ${id}...`);
          virtualMachineLock(id, containerOptions);
        }
      });

      qemuContainers.forEach((container, index) => {
        if(container && container.vmid && Math.abs(container.vmid) > 99) {
          const id = container.vmid;
          console.debug(`Unlocking ${id}...`);
          virtualMachineUnlock(id, containerOptions);
        }
      });

      // shell(`echo "hi"`, {
      //   encoding: `utf8`,
      //   dryRun: DRY_RUN,
      // });
      // assert.isDeepStrictEqual
      debugAssert(containerLock(104, containerOptions), false);
      debugAssert(virtualMachineLock(100, containerOptions), false);
    }
  });

  res.on(`end`, () => {
    console.debug(`EOF`);
  });
});


req.on(`error`, (e) => {
  console.error(`ERROR: ${e}`);
});

//req.write(`OK`);
//req.write(postData);
req.end();
