# Bergerac Roads

[![GitHub license](https://img.shields.io/github/license/shuunen/bergerac-roads.svg?color=informational)](https://github.com/Shuunen/bergerac-roads/blob/master/LICENSE)

[![Build Status](https://travis-ci.org/Shuunen/bergerac-roads.svg?branch=master)](https://travis-ci.org/Shuunen/bergerac-roads)
[![David](https://img.shields.io/david/shuunen/bergerac-roads.svg)](https://david-dm.org/shuunen/bergerac-roads)
[![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/Shuunen/bergerac-roads.svg)](https://lgtm.com/projects/g/Shuunen/bergerac-roads)
[![Scrutinizer Score](https://scrutinizer-ci.com/g/Shuunen/bergerac-roads/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Shuunen/bergerac-roads)

> Promoting the great wines of Bergerac since 2018 !

## Usage

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production
npm run build
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Reminders

### Upgrade

Specifying "webpack": "4.33.0" to resolve missing peer deps is breaking the build : styles files not found and vue pages too.

Updating core-js to v3 break the build.

### Netlify

Build command on Netlify is `npm rebuild node-sass && npm run build`.

The first part avoid this error :

``` bash
6:18:45 PM: Module build failed (from ./node_modules/sass-loader/lib/loader.js):
6:18:45 PM: Error: ENOENT: no such file or directory, scandir '/opt/build/repo/node_modules/node-sass/vendor'
```

If needed use this trick to see more deployment logs on Netlify CI : `npm run build; sleep 60; false`

## Thanks

- [Shields.io](https://shields.io) : nice badges on top of this readme
- [Netlify](https://www.netlify.com) : awesome company that offers hosting for OSS
- [Travis-ci.org](https://travis-ci.org) : for providing free continuous deployments
- [BrowserStack](https://www.browserstack.com) : great online tool to test our app under tons of desktop & mobile browsers

![BrowserStack Logo](https://www.browserstack.com/images/layout/browserstack-logo-600x315.png)
