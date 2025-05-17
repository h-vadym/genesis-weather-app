#!/usr/bin/env bash

rm -fr dist/libs/typeorm
nest build typeorm
node --require ts-node/register node_modules/typeorm/cli.js migration:generate -p -d dist/libs/typeorm/src/data-source.js libs/typeorm/src/migrations/$1
