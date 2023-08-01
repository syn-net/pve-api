#!/usr/bin/env node

// 1. https://nodejs.org/api/http.html
// 2. https://nodejs.org/api/single-executable-applications.html

`use strict`

// import {readFile} from 'node:fs';
import process from 'node:process';
import {fetch} from './lib/utils.mjs';

const args = process.argv;

const DEBUG = process.env['DEBUG'] || false;
const pveAuthKey = process.env['PVE_AUTH_KEY'] || ``;

const RPORT = Math.abs(process.env[`REMOTE_PORT`]) || 8006;
//hostname: `192.168.15.238`,
const RHOST = process.env[`REMOTE_HOSTNAME`] || `scorpio-pve.lan`;
const useTLS = (process.env[`USE_TLS`]) || true;
const proto =
  useTLS && useTLS == true ?
`HTTPS` : `HTTP`;

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
      console.log(`${chunk}`);
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
