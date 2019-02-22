#!/usr/bin/env bash

rm -rf build
mkdir build
npx browserify index.js -o build/bundle.js --s freeverb
cp index.html build/
