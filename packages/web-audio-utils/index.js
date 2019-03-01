import tracks from './tracks';
import sample from 'lodash.sample';
import {max} from '../voice-shape-app/src/lbg';

export const getRandomTrack = () => `https://amiselaytes.com/lomax/audio/${sample(tracks)}.mp3`;

export const getAudioBuffer = (audioCtx, url) => {
  return fetch(url)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer));
};

export const getLiveAudio = (audioCtx, opts = {}) => navigator.mediaDevices.getUserMedia({audio: {
  autoGainControl: opts.autoGainControl || false,
  echoCancellation: opts.echoCancellation || false,
  noiseSuppression: opts.noiseSuppression || false,
}})
.then(stream => audioCtx.createMediaStreamSource(stream));

export const getAudioContext = () => {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  return Ctx ? new Ctx() : null;
};

export const closestPowerOf2 = number => 2 ** Math.floor(Math.log2(number));
export const singalPow2Len = signal => signal.slice(0, closestPowerOf2(signal.length));

const msToNumSamples = (ms, sampleRate) => sampleRate * ms / 1000;
export const signalToFrames = (signal, sampleRate, opts = {}) => {
  const {frameLengthMs = 25, overlapLengthMs = 10} = opts;
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

export const freqToBin = (freq, sampleRate, fftSize) => Math.round(freq / sampleRate * fftSize);
export const binToFreq = (bin, sampleRate, fftSize) => bin * sampleRate / fftSize;

export const getF0 = (fftBins, sampleRate, freqRange) => {
  const fftSize = fftBins.length * 2;
  const binsToAnalyze = freqRange
    ? fftBins.slice(...freqRange.map(freq => freqToBin(freq, sampleRate, fftSize)))
    : fftBins;
  const maxVal = max(binsToAnalyze);
  return binToFreq(fftBins.indexOf(maxVal), sampleRate, fftSize);
};
