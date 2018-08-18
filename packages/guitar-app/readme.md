# Guitar App

A demo app to compare:
 - using plain Web Audio API with Redux
 - using [virtual audio graph](https://www.npmjs.com/package/virtual-audio-graph) with Redux


[Demo](https://amiselaytes.com/guitar/)

## Motivation

When one receives an updated state from Redux we need to update our audio graph, but it gets quite complex really quickly.

I was looking for a lib to solve it, and **virtual audio graph** seems to be doing it well.

See `src/index.js`
