#!/usr/bin/env node

// 1. https://nodejs.org/api/http.html
// 2. https://nodejs.org/api/single-executable-applications.html

`use strict`

// import {assert} from 'node:util';
// import {readFile} from 'node:fs';
import process from 'node:process';
import {
  parseBoolean,
  fetch
} from './lib/utils.mjs';

import {
  containerUnlock,
  containerLock,
} from './lib/pct-api.mjs';

import {
  virtualMachineUnlock,
  virtualMachineLock,
} from './lib/qm-api.mjs';

const args = process.argv;

const DEBUG = process.env['DEBUG'] || false;
const pveAuthKey = process.env['PVE_AUTH_KEY'] || ``;

const RPORT = Math.abs(process.env[`REMOTE_PORT`]) || 8006;
const RHOST = process.env[`REMOTE_HOSTNAME`] || `scorpio-pve.lan`;
const useTLS = parseBoolean(process.env[`USE_TLS`]) || true;
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

args.forEach((val, index) => {
  if(val) {
    console.debug(`arg[${index}: ${val}`);
  }
});

const req = fetch(fetchOptions, (res) => {
  res.setEncoding('utf8');

  res.on(`data`, (chunk) => {
    if(DEBUG) {
      console.info(`STATUS: ${res.statusCode}`);
      console.info(`HEADERS: ${JSON.stringify(res.headers)}`);
      console.info(`BODY: ${chunk}`);
    } else {
      const jsonOutput = JSON.parse(chunk);
      const containers = jsonOutput[`data`];

      let runningContainers = [];
      containers.forEach((value, index) => {
        if(value) {
          const type = containers[index].type;
          const vmId = containers[index].vmid;
          const name = containers[index].name;
          const status = containers[index].status;
          console.info(`${name} - ${type} - ${vmId}...${status}`);
          if(status != `stopped`) {
            runningContainers.push(containers[index]);
          }
        }
      });

      const totalNumRunningContainers = runningContainers.length;
      console.log(`totalNumRunningContainers: ${totalNumRunningContainers}`);

      let lxcContainers = [];
      let qemuContainers = [];
      runningContainers.forEach((value, index) => {
        if(value) {
          const type = runningContainers[index].type;
          const vmId = runningContainers[index].vmid;
          const name = runningContainers[index].name;
          const status = runningContainers[index].status;
          if(type === TYPES_QEMU) {
            qemuContainers.push(runningContainers[index]);
          } else if(type === TYPES_LXC) {
            lxcContainers.push(runningContainers[index]);
          }
        }
      });
      
      // assert.isDeepStrictEqual
      // assert(containerLock(103), false);
      // assert(virtualMachineLock(100), false);

      const numQemuContainers = qemuContainers.length;
      const numLxcContainers = lxcContainers.length;
      console.log(`numQemuContainers: ${numQemuContainers}`);
      console.log(`numLxcContainers: ${numLxcContainers}`);
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
