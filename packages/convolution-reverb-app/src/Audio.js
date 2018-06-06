import {flatMap} from 'lodash';
import impulses from'./impulses.json';
const getLiveAudio = (audioCtx) => navigator.mediaDevices.getUserMedia({audio: true})
.then(stream => audioCtx.createMediaStreamSource(stream));
const audioCtx = new AudioContext();

const impulseBuffers = {};
const getImpulseBuffer = (impulse) => {
    return fetch(impulse)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
};

const loadImpulses = () => {
    const promises = flatMap(impulses, (group, groupName) =>
    group.map(impulse => getImpulseBuffer(`${process.env.PUBLIC_URL}/impulses/${groupName}/${impulse}`)
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
    .then(() => getLiveAudio(audioCtx))
    .then((liveIn) => {
      liveIn.connect(convolver)
    })
    .catch(function(err) {
        console.log('could not init', err);
    });
}

export {init, applyImpulse};
