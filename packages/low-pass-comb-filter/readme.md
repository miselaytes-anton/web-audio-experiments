# LowPassCombFilter

> **Comb filter** is a filter implemented by adding a delayed version of a signal to itself, causing constructive and destructive interference.

```javascript
//create an instance
const LowPassCombFilter = require('Cassowary').LowPassCombFilter
const audioCtx = new AudioContext();
const opts = { dampening: 3000, resonance: 0.7, delayTime: 0.05 }
const lpcf = new LowPassCombFilter(audioCtx, opts)

//connect
someInput.connect(lpcf).connect(audioCtx.destination)

//diconnect
someInput.disconnect()
```

`dampening`, `resonance` and `delayTime` implement [Audio Params API](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam)
