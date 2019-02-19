import tracks from './tracks';
import sample from 'lodash.sample';

export const getRandomTrack = () => `https://amiselaytes.com/lomax/audio/${sample(tracks)}.mp3`;

export const getAudioBuffer = (audioCtx, url) => {
  return fetch(url)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer));
};

export const getLiveAudio = (audioCtx, opts = {}) => navigator.mediaDevices.getUserMedia({audio: {
  autoGainControl: false,
  echoCancellation: false,
  noiseSuppression: false,
  ...opts
}})
.then(stream => audioCtx.createMediaStreamSource(stream));

export const getAudioContext = () => {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  return Ctx ? new Ctx() : null;
};

export const closestPowerOf2 = number => 2 ** Math.floor(Math.log2(number));

const msToNumSamples = (ms, sampleRate) => sampleRate * ms / 1000;

export const signalToFrames = (signal, sampleRate, {frameLengthMs = 25, overlapLengthMs = 10}) => {
  const frameLengthSamples = closestPowerOf2(msToNumSamples(frameLengthMs, sampleRate));
  const overlapLengthSamples = overlapLengthMs ? closestPowerOf2(msToNumSamples(overlapLengthMs, sampleRate)) : 0;
  let frames = [];
  for (let i = 0; i <= signal.length - frameLengthSamples; i += (frameLengthSamples - overlapLengthSamples)) {
    frames.push(signal.slice(i, i + frameLengthSamples));
  }
  return frames;
};

const sum = arr => arr.reduce((sum, curr) => sum + curr, 0);
const avg = arr => sum(arr) / arr.length;
const getRms = signal => avg(signal.map(v => v ** 2)) ** 1 / 2;
const toDb = v => 20 * Math.log10(v);
export const removeSilence = (signal, sampleRate, opts = {}) => {
  const {threshold = -100, minSilenceDuration = 500} = opts;
  // split into 25 ms frames
  const frameLengthMs = 25;
  const frames = signalToFrames(signal, sampleRate, {frameLengthMs, overlapLengthMs: 0});
  const rmsPerFrame = frames.map(getRms).map(toDb);
  // combine consequent silence chunks into silence groups
  const silenceGroups = rmsPerFrame.reduce((groups, rms, index) => {
    const activeGroup = groups[groups.length - 1];
    if (rms <= threshold) {
      // extending active silence group
      activeGroup.push(index);
    } else if (activeGroup.length) {
      //previous group ended
      groups.push([]);
    }
    return groups;
  }, [[]]);

  const longGroups = silenceGroups.filter(group => group.length * frameLengthMs > minSilenceDuration);
  // filter away parts of the signal which are part of one of the silence groups
  const numSamplesInFrame = Math.floor(signal.length / frames.length);
  return signal.filter((v, i) => {
    const frameIndex = Math.floor(i / numSamplesInFrame);
    return !longGroups.some(group => group.includes(frameIndex));
  });
};

export const signalToBuffer = (audioContext, signal) => {
  const newBuffer = audioContext.createBuffer(1, signal.length, audioContext.sampleRate);
  const nowBuffering = newBuffer.getChannelData(0);
  for (let i = 0; i < newBuffer.length; i++) {
    nowBuffering[i] = signal[i];
  }
  return newBuffer;
};

export const removeSilenceFromBuffer = (audioBuffer, audioContext, opts = {}) => {
  const signalWithoutSilence = removeSilence(audioBuffer.getChannelData(0), audioBuffer.sampleRate, opts);
  return signalToBuffer(audioContext, signalWithoutSilence);
};
