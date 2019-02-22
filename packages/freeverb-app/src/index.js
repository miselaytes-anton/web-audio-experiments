import Freeverb from 'freeverb';
import {init} from './ui';
import {getLiveAudio, getAudioContext} from 'web-audio-utils';

const defaults = {dampening: 3000, roomSize: 0.7, dryGain: 0.2, wetGain: 0.8};
const audioCtx = getAudioContext();

const getMasterGain = (audioCtx) => {
  const masterGain = audioCtx.createGain();
  //a safety measure
  masterGain.gain.value = 0.7;
  masterGain.connect(audioCtx.destination);

  return masterGain;
};

const master = getMasterGain(audioCtx);
const freeverb = new Freeverb(audioCtx, defaults);

init(defaults, {
  onUnmuteClick: () => {
    audioCtx.resume.bind(audioCtx);
    getLiveAudio(audioCtx).then(liveIn => {
      liveIn
      .connect(freeverb)
      .connect(master);
    });
  },
  onRoomSizeUpdate: value => freeverb.roomSize.value = value,
  onDampeningUpdate: value => freeverb.dampening.value = value,
  onWetUpdate: value => freeverb.wetGain.value = value,
  onDryUpdate: value => freeverb.dryGain.value = value,
});

