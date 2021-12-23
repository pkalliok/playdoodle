
const sampleRate = 44100.0;

function freq2samples(freq) {
  return sampleRate / time;
}

class NaturalOscillator extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "freq",
        defaultValue: 440.0,
        minValue: 20.0,
        maxValue: 25000.0
      },
      {
        name: "fadeoff",
        defaultValue: 0.01,
        minValue: 0.0,
        maxValue: 1.0
      }
    ];
  }

  constructor() {
    this.x = 0.0;
    this.dx = 0.0;
  }

  process (inputs, outputs, parameters) {
    const sampleCount = inputs[0][0].length;
    for (let sample = 0; sample < sampleCount; ++sample) {
      const target = inputs[0][0][sample];
      const freq = parameters.freq[sample];
      const fadeoff = parameters.fadeoff[sample];
      const slowness = 2 * Math.PI / freq2samples(freq);
      this.dx = (this.dx * (1 - fadeoff)) + ((target - this.x) * slowness);
      this.x += this.dx * slowness;
      outputs[0][0][sample] = this.x;
    }
    return true;
  }
}

registerProcessor("natural-oscillator", NaturalOscillator);

// vim:sw=2:et
