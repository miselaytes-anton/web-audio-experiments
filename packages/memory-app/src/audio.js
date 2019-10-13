import SimpleReverb from './SimpleReverb';
import {getRandomArbitrary, getRandomInt} from './utils';

const playNote = function({ctx, reverb}, {freq, attack, decay, sustain, release, mod1Type, mod2Type, oscType, offset = 0}) {
    const start = ctx.currentTime + offset;
    const mod1 = ctx.createOscillator();
    const mod1Gain = ctx.createGain();
    const mod2 = ctx.createOscillator();
    const mod2Gain = ctx.createGain();
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    mod1.frequency.value = freq * 0.5;
    mod1.type = mod1Type;
    mod1Gain.gain.value = freq / 3;
    mod2.frequency.value = freq * 0.25;
    mod2.type = mod2Type;
    osc.frequency.value = freq;
    osc.type = oscType;

    mod1.connect(mod1Gain);
    mod2.connect(mod2Gain);
    mod1Gain.connect(osc.frequency);
    mod2Gain.connect(osc.detune);
    osc.connect(env);
    env.connect(reverb.input);

    env.gain.value = 0;
    env.gain.linearRampToValueAtTime(0.0, start);
    env.gain.linearRampToValueAtTime(1.0, start + attack);
    env.gain.linearRampToValueAtTime(0.8, start + attack + decay);
    env.gain.linearRampToValueAtTime(0.6, start + attack + decay + sustain);
    env.gain.linearRampToValueAtTime(0.0, start + attack + decay + sustain + release);

    mod1.start(start);
    mod2.start(start);
    osc.start(start);
  };

  const getRandomOscType = () => {
    const types = ['sine', 'square', 'sawtooth', 'triangle'];
    return types[getRandomInt(0, 4)];
  };

  const getRandomParams = (i) => {
    const freq = getRandomInt(100, 1000);
    const attack = getRandomArbitrary(0.01, 0.5);
    const decay = getRandomArbitrary(0.01, 0.5);
    const sustain = getRandomArbitrary(0.01, 0.5);
    const release = getRandomArbitrary(0.01, 0.5);
    const mod1Type = getRandomOscType();
    const mod2Type = getRandomOscType();
    const oscType = getRandomOscType();
    return {i, freq, attack, decay, sustain, release, mod1Type, mod2Type, oscType};
  };

  const createContext = () => {
    const ctx = new AudioContext();
    const reverb = new SimpleReverb(ctx, {
      seconds: 1,
      decay: 2,
      reverse: 0
    });
    reverb.connect(ctx.destination);
    return {ctx, reverb};
  };

  export {playNote, getRandomOscType, getRandomParams, createContext};
