#!/bin/sh

webpack
cp manifest.json dist/
cp -rf src/assets dist/
cp -rf src/views dist/
cp -rf data dist/
cp -f node_modules/bootstrap/dist/css/bootstrap.min.css dist/
