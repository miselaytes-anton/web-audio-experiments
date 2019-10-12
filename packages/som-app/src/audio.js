import SimpleReverb from './SimpleReverb';
import {getRandomArbitrary, getRandomInt} from './utils';

const createNote = function(ctx, {freq, filterFreq, attack, decay, sustain, release, mod1Type, mod2Type, oscType}, offset) {
    var start = ctx.currentTime + (offset || 0);
    var mod1 = ctx.createOscillator();
    var mod1Gain = ctx.createGain();
    var mod2 = ctx.createOscillator();
    var mod2Gain = ctx.createGain();
    var osc = ctx.createOscillator();
    var env = ctx.createGain();
    var filter = ctx.createBiquadFilter();
    var verb = new SimpleReverb(ctx, {
      seconds: 1,
      decay: 2,
      reverse: 0
    });

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
    filter.gain.setValueAtTime(25, ctx.currentTime);

    mod1.frequency.value = freq * 0.5;
    mod1.type = mod1Type;
    mod1Gain.gain.value = freq / 3;

    mod2.frequency.value = freq * 0.25;
    mod2.type = mod2Type;

    // oscillator settings
    osc.frequency.value = freq;
    osc.type = oscType;

    // route audio
    mod1.connect(mod1Gain);
    mod2.connect(mod2Gain);
    mod1Gain.connect(osc.frequency);
    mod2Gain.connect(osc.detune);
    osc.connect(env);
    env.connect(filter);
    filter.connect(verb.input);
    verb.connect(ctx.destination);

    // use timed volume control as envelope
    env.gain.value = 0;
    env.gain.linearRampToValueAtTime(0.0, start);
    env.gain.linearRampToValueAtTime(1.0, start + attack);
    env.gain.linearRampToValueAtTime(0.8, start + attack + decay);
    env.gain.linearRampToValueAtTime(0.6, start + attack + decay + sustain);
    env.gain.linearRampToValueAtTime(0.0, start + attack + decay + sustain + release);

    // play note
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
    const offset = 0;
    const filterFreq = freq * getRandomArbitrary(0.5, 2);
    const attack = getRandomArbitrary(0.01, 0.5);
    const decay = getRandomArbitrary(0.01, 0.5);
    const sustain = getRandomArbitrary(0.01, 0.5);
    const release = getRandomArbitrary(0.01, 0.5);
    const mod1Type = getRandomOscType();
    const mod2Type = getRandomOscType();
    const oscType = getRandomOscType();
    return {i, freq, offset, filterFreq, attack, decay, sustain, release, mod1Type, mod2Type, oscType};
  };

  export {createNote, getRandomOscType, getRandomParams};
