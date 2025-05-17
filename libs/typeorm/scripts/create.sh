#!/usr/bin/env bash

node --require ts-node/register node_modules/typeorm/cli.js migration:create libs/typeorm/src/migrations/$1
