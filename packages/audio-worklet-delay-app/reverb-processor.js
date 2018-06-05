class ReverbProcessor extends AudioWorkletProcessor {

    // Custom AudioParams can be defined with this static getter.
    static get parameterDescriptors() {
      return [
          { name: 'decay', defaultValue: 0.5 }
        ];
    }
  
    constructor() {
        // The super constructor call is required.
        super();
        this.delayInSamples = 22050
        this.delaySamples = [new Array(22050).fill(0), new Array(22050).fill(0)]
        this.pointers = [0,0]
    }
  
    process(inputs, outputs, parameters) {
      let input = inputs[0];
      let output = outputs[0];
      let decay = parameters.decay;

      for (let channel = 0; channel< input.length; ++channel){
        let inputChannel = input[channel];
        let outputChannel = output[channel];
        let delaySamples = this.delaySamples[channel]
        for (let i = 0; i < inputChannel.length; ++i){
            let previousSample = delaySamples[this.pointers[channel] % this.delayInSamples]
            delaySamples[this.pointers[channel]] = inputChannel[i] + previousSample * decay[i]
            this.pointers[channel]++
            if (this.pointers[channel] > this.delayInSamples){
                this.pointers[channel] = 0;
            }
            outputChannel[i] = inputChannel[i] + previousSample
          }
      }
     
  
      return true;
    }
  }
  
  registerProcessor('reverb-processor', ReverbProcessor);