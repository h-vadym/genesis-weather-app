#!/usr/bin/env bash

nest build typeorm
node --require ts-node/register node_modules/typeorm/cli.js migration:revert -d dist/libs/typeorm/src/data-source.js
