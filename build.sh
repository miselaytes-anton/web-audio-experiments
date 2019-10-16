#!/usr/bin/env bash
set -e

# Build index page
rm -rf input
mkdir input
cp ./packages/*-app/*.png input
echo '# Web Audio Experiments' > input/index.md
cat ./packages/*-app/README.md  >> input/index.md
rm -rf build
npx markdown-styles --output build
rm -rf input

# build apps
npx lerna run build --scope *-app
cp -r ./packages/loop-app/build ./build/loop
cp -r ./packages/tape-app/build ./build/tape
cp -r ./packages/visualizer-app/build ./build/visual
cp -r ./packages/voice-shape-app/build ./build/voice
cp -r ./packages/freeverb-app/build ./build/freeverb
cp -r ./packages/memory-app/build ./build/memory
