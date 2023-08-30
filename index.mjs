#!/usr/bin/env node

// 1. https://nodejs.org/api/http.html
// 2. https://nodejs.org/api/single-executable-applications.html

`use strict`;

import assert from 'node:assert';
import {resolve} from 'node:path';
import {argv, env, cwd} from 'node:process';

import * as dotenv from 'dotenv';
dotenv.config({
  path: resolve(cwd(), `.env`),
});

import {
  parseBoolean,
  request,
  secureRequest,
  shell,
} from './lib/utils.mjs';

import {
  containerStatus,
  containerUnlock,
  containerLock,
  containerFreeze,
  containerThaw,
} from './lib/pct-api.mjs';

import {
  virtualMachineStatus,
  virtualMachineUnlock,
  virtualMachineLock,
  virtualMachineFreeze,
  virtualMachineThaw,
} from './lib/qm-api.mjs';

const debugAssert = assert.strict.strictEqual;

const args = argv;
const argc = argv.length - 1;

const DEBUG = parseBoolean(env[`DEBUG`]);
const DRY_RUN = parseBoolean(env[`DRY_RUN`]);
const pveAuthKey = env[`PVE_AUTH_KEY`] || ``;

const RPORT = Math.abs(env[`REMOTE_PORT`]) || 8006;
const RHOST = env[`REMOTE_HOSTNAME`] || `scorpio-pve.lan`;
const useTLS = parseBoolean(env[`USE_TLS`]);
const proto = parseBoolean(useTLS) == true ? `HTTPS` : `HTTP`;

const TYPES_QEMU = `qemu`;
const TYPES_LXC = `lxc`;

const postData = JSON.stringify({
  type: `vm`, // node, storage, ...
});

//https://scorpio-pve.lan:8006/api2/json/nodes/scorpio-pve/lxc/106/config
const fetchOptions = {
  hostname: RHOST,
  port: RPORT,
  path: `/api2/json/cluster/resources?type=vm`,
  method: `GET`,
  headers: {
    'Content-Type': `application/json`,
    //'Content-Length': Buffer.byteLength(postData),
    'Authorization': `PVEAPIToken=${pveAuthKey}`,
  },
};

if(pveAuthKey && pveAuthKey.length > 0) {
  console.debug(`An authorization key was found with the value of... ${pveAuthKey}\n`);
} else {
  console.debug(`No authorization key was found...\n`);
}

console.info(`Beginning ${proto} request to ${fetchOptions.hostname}...\n`);

const fetch = parseBoolean(useTLS) == true ? secureRequest : request;

const main = async function(argc, argv) {
  args.forEach((arg, pos) => {
    if(arg) {
      console.debug(`arg[${pos}: ${arg}`);
    }
  });

  let lxcContainers = [];
  let qemuContainers = [];

  const req = await fetch(fetchOptions, async (res) => {
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
            console.debug(`${container.name}: ${container.type} - ${container.vmid}...${container.status}`);
            if(container.status === `running`) {
              runningContainers.push(container);
            }
          }
        });

        runningContainers.forEach((container, index) => {
          if(container) {
            console.debug(`${container.name}: ${container.type} - ${container.vmid}...${container.status}`);
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


        // shell(`echo "hi"`, {
        //   encoding: `utf8`,
        //   dryRun: DRY_RUN,
        // });

        // assert.isDeepStrictEqual
        // debugAssert(containerLock(104, {
        //   dryRun: DRY_RUN,
        // }), false);
      }

      qemuContainers.forEach(async (container, pos) => {
        if(container.status === "running") {
          await virtualMachineLock(container.vmid);
        }
      });

      qemuContainers.forEach(async (container, pos) => {
        if(container.status === "running") {
          await virtualMachineFreeze(container.vmid);
        }
      });

      qemuContainers.forEach(async (container, pos) => {
        if(container.status === "running") {
          await virtualMachineThaw(container.vmid);
        }
      });

      qemuContainers.forEach(async (container, pos) => {
        if(container.status === "running") {
          await virtualMachineUnlock(container.vmid);
        }
      });

      lxcContainers.forEach(async (container, pos) => {
        if(container.status === "running") {
          await containerLock(container.vmid);
        }
      });

      lxcContainers.forEach(async (container, pos) => {
        if(container.status === "running") {
          await containerFreeze(container.vmid);
        }
      });

      lxcContainers.forEach(async (container, pos) => {
        if(container.status === "running") {
          await containerUnlock(container.vmid);
        }
      });
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
}

await main(argc, argv);
