import {flatMap} from 'lodash';
import {Freeverb} from 'cassowary'
import impulses from'./impulses.json';

const audioCtx = new AudioContext();

const impulseBuffers = {};
const getImpulseBuffer = (impulse) => {
    return fetch(impulse)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
};

const loadImpulses = () => {
    const promises = flatMap(impulses, (group, groupName) => 
    group.map(impulse => getImpulseBuffer(`/impulses/${groupName}/${impulse}`)
    .then(buffer => impulseBuffers[impulse] = buffer)
    ))
    return Promise.all(promises);
};

const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.9;
masterGain.connect(audioCtx.destination);

const convolver = audioCtx.createConvolver();
convolver.connect(masterGain);
const applyImpulse = impulse => {
    convolver.buffer = impulseBuffers[impulse];
}

const init  = (impulse) => {
    return loadImpulses()
    .then(() => applyImpulse(impulse))
    .then(() => navigator.mediaDevices.getUserMedia({audio: true}))
    .then(function(stream) {
        const input = audioCtx.createMediaStreamSource(stream);
        const opts = { dampening: 3000, roomSize: 0.7, dryGain: 0.2, wetGain: 0.8 }
        const freeverb = new Freeverb(audioCtx, opts)
        input.connect(freeverb).connect(audioCtx.destination)
        //input.connect(convolver);
    })
    .catch(function(err) {
        console.log('could not init', err);
    });

}

export {init, applyImpulse};