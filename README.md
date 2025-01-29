# WebTrit Dialer

WebTrit Dialer is a reference implementation of the client Web app of the [WebTrit system](https://github.com/WebTrit/webtrit_docs). It implements basic call functionality with contacts and history viewing functionality.

WebTrit Dialer is implemented based on the [WebTrit Signaling TypeScript client](https://github.com/WebTrit/webtrit_signaling_ts) and [Vue.js](https://vuejs.org) with [Vuetify](https://vuetifyjs.com).

## Project setup for developing

The project uses [Git LFS extension](https://git-lfs.github.com), which is why to operate with the repository Git LFS extension must be installed in a developer environment.

##### Creat local dotenv config with desired env variables' values
```
cp .env.example .env.local
```

##### Install dependencies
```
npm install
cd ./local_modules/peer-connection
npm install
npm run build
npm link
cd ../../
npm link peer-connection
```

##### Compiles and hot-reloads for development
```
npm run serve
```

##### Compiles and minifies for production
```
npm run build
```

##### Run your unit tests
```
npm run test:unit
```

##### Run your end-to-end tests
```
npm run test:e2e
```

##### Lints and fixes files
```
npm run lint
```

## Docker container

WebTrit Dialer docker image is NGINX Web server with built WebTrit Dialer code.

### Configuration via environment variables

Env variables descriptions:
* `VUE_APP_PUBLIC_PATH` - optional application bundle base URL (without `/` at the end) (examples: `/sub-path`)
* `VUE_APP_GTM` - optional Google Tag Manager container IDs (examples: `GTM-xxxxxx`, `GTM-xxxxxx, GTM-yyyyyy`)
* `VUE_APP_WEBTRIT_APP_NAME` - branding app name
* `VUE_APP_WEBTRIT_APP_SUBNAME` - branding app sub-name
* `VUE_APP_WEBTRIT_COMPANY_NAME` - branding company name
* `VUE_APP_WEBTRIT_COMPANY_URL` - branding company URL
* `VUE_APP_WEBTRIT_COMPANY_LOGO_IMG_SRC` - branding company image source path related to the directory with overwritten and added files (optional)
* `VUE_APP_WEBTRIT_CORE_URL` - WebTrit Core URL
* `VUE_APP_WEBTRIT_NAVIGATION_DRAWER_MINIMIZING` - can the main navigation menu be minimized, default: `true`
* `VUE_APP_UPDATE_INFO_INTERVAL` - retrieve user information interval in milliseconds, default: `60000`
* `VUE_APP_UPDATE_CONTACTS_INTERVAL` - optional interval for retrieving contacts in milliseconds, default: `0` (where `0` is a special value that disables periodic updates)

Env variable of the set color palette. Specified through HEX color. Some colors have a default value.
* `VUE_APP_COLOR_PRIMARY` - default: `#F5841F`
* `VUE_APP_COLOR_SECONDARY` - default: `#F5841F`
* `VUE_APP_COLOR_ACCENT` - default: `#F5841F`
* `VUE_APP_COLOR_SURFACE` - default: `#4C86B7`
* `VUE_APP_COLOR_ERROR`
* `VUE_APP_COLOR_INFO`
* `VUE_APP_COLOR_SUCCESS`
* `VUE_APP_COLOR_WARNING`
* `VUE_APP_COLOR_ANCHOR`

### Configuration via query parameters

* Add to query parameter `mode` to activate additional functionality.
Currently, it supports the following values:
   * `mst` - activate configuration related to _Microsoft Teams_ (such as prevent navigation drawer minimization), ex.: `dailer.webtrit.com?mode=mst`;
* Add to query parameter `tenant` with value of `tenant_id` to choose another **Adaptee** to dialer communicate, ex.: `dailer.webtrit.com?tenant=special_adapter`;


### Run

```bash
docker build --tag webtrit-dialer .

docker run --detach --restart always \
--name webtrit-dialer \
--env VUE_APP_WEBTRIT_COMPANY_NAME="WebTrit" \
--env VUE_APP_WEBTRIT_CORE_URL="https://core.webtrit.com" \
-p 127.0.0.1:4001:80 \
--mount type=bind,source=<directory with overwrited and added files>,target=/usr/share/nginx/html_overwrite \
webtrit-dialer
```

### Image

[WebTrit Dialer docker image](https://github.com/WebTrit/webtrit_dialer/pkgs/container/webtrit_dialer) built automatically by GitHub Actions with next tags:
* `main` - last pushed `main` branch
* `latest` - last pushed tag
* `x.y.z` - corresponding pushed tag
* `x.y` - automatically stripped pushed tag to collect last patch of respective tags
