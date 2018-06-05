## CompositeAudioNode

Based on https://github.com/GoogleChromeLabs/web-audio-samples/wiki/CompositeAudioNode

With little adjustments to allow chained connect syntax, e.g `node1.connect(node2).connect(node3)`

## mergeParams

An utility function  which allows to set a parameter value for multiple nodes (of the same kind)

```javascript

const gain1 = audioCtx.createGain();
const gain2 = audioCtx.createGain();
const gain = mergeParams([gain1.gain, gain2.gain])

gain.value = 0.5
console.log(gain1.value, gain2.value) // 0.5 0.5
```
