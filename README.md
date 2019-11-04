[![Build Status](https://travis-ci.org/kaelzhang/gaia-cli.svg?branch=master)](https://travis-ci.org/kaelzhang/gaia-cli)
[![Coverage](https://codecov.io/gh/kaelzhang/gaia-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/gaia-cli)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/@gaia/cli?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/@gaia/cli)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/@gaia/cli.svg)](http://badge.fury.io/js/@gaia/cli)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/@gaia/cli.svg)](https://www.npmjs.org/package/@gaia/cli)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/@gaia/cli.svg)](https://david-dm.org/kaelzhang/@gaia/cli)
-->

# gaia-cli

Development and deployment toolkit for gaia

## Install

```sh
$ npm i gaia-cli -D
```

## Usage

#### Show gaia help

```sh
> gaia
```

### gaia.config.js

`gaia` should locate in the repo's root directory should contains, and it defines the configurations used by gaia-cli

`gaia.config.js` contains:

- A `server` field which is the second argument for `new gaia.Server(root, config)`
- A `port` field which defines the port the server will listen to

Field `server` and field `port` are required by command `gaia start`

## Commands

### gaia start

Start the gaia server

```sh
gaia start

gaia start --dev
```

**options**

- **--dev** whether start the server in dev mode. If `true`, gaia cli will populate the env variables from .env file by using [`dotenv`](https://npmjs.org/package/dotenv)

### gaia test -- [test-command]

Start a dev server for the current project and then run the test command.

`gaia test` will handle the server starting and closing, so you need not to start a gaia server in test specs. Just create gaia clients in your test cases.

```sh
gaia test -- nyc ava test/*.js
```

## License

MIT
