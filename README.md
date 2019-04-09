# Bergerac Roads

![test](https://cdn.rawgit.com/jongracecox/anybadge/master/examples/awesomeness.svg)

> a Nuxt.js project

## Usage

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:3000
yarn run dev

# build for production
$ yarn run build
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Note

Build command on Netlify is `npm rebuild node-sass && yarn build`.

The first part avoid this error :

``` bash
6:18:45 PM: Module build failed (from ./node_modules/sass-loader/lib/loader.js):
6:18:45 PM: Error: ENOENT: no such file or directory, scandir '/opt/build/repo/node_modules/node-sass/vendor'
```

If needed use this trick to see more deployment logs on Netlify CI : `yarn build; sleep 60; false`

## Thanks

Thanks to [BrowserStack](https://www.browserstack.com) which provide a great online tool to test our app under tons of desktop & mobile browsers !

![BrowserStack Logo](https://www.browserstack.com/images/layout/browserstack-logo-600x315.png)
