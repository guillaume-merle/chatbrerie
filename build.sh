#!/bin/sh

webpack
cp manifest.json dist/
cp -rf src/assets dist/
cp -rf src/data dist/
cp -rf src/views dist/
cp -f node_modules/bootstrap/dist/css/bootstrap.min.css dist/