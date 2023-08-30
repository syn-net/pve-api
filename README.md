# pve-api

## Usage

```shell
git clone https://github.com/syn-net/pve-api.git \
  "$HOME/Projects/pve-api.git"
cd "$HOME/Projects/pve-api.git"
cp -av ./.env.dist ./.env
npm install
npm run build
# Before running this project, you should review .env
# and setup the bare minimum.
npm run start
```

### environment

- `.env`

|Name|Value|Notes|
|-------------|--------------|-----|
|`PVE_AUTH_KEY`|api@pam!<TOKEN_ID>|https://pve.proxmox.com/pve-docs/api-viewer/index.html|
|`REMOTE_HOSTNAME`|virgo.lan|FQDN of your Proxmox VE host|

