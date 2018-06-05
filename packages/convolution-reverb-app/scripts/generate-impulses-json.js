const fs = require('fs');
const path = require('path');

const isWav = file => file.indexOf('.wav') !== -1
const impulseDir = path.join(__dirname, '../public/impulses/');
const dirs = fs.readdirSync(impulseDir)
.filter(dir => fs.statSync(`${impulseDir}${dir}`).isDirectory())

const impulseJson = dirs.reduce((json, dir) => {
    json[dir] = fs.readdirSync(`${impulseDir}${dir}`)
    .filter(isWav)
    return json;
}, {});

fs.writeFileSync(path.join(__dirname, '../src/impulses.json'), JSON.stringify(impulseJson, null, '\t'))
