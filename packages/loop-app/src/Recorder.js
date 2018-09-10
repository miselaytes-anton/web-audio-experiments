const dataToArrayBuffer = data => {
  const blob = new Blob(data);
  const url = URL.createObjectURL(blob);

  return fetch(url)
  .then(response => response.arrayBuffer());
};

class Recorder {
  constructor(audioContext, sourceStream) {
    this.audioContext = audioContext;
    this.mediaRecorder = new MediaRecorder(sourceStream);
  }

  start() {
    const {mediaRecorder, audioContext} = this;
    const data = [];
    let startTime;

    this.mediaRecorder.onstart = () => {
      startTime = audioContext.currentTime;
    };
    this.mediaRecorder.ondataavailable = e => e.data.size && data.push(e.data);
    this.recordPromise = new Promise((resolve, reject) => {
      this.mediaRecorder.onstop = () => dataToArrayBuffer(data)
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => resolve({buffer, startTime}));
      this.mediaRecorder.onerror = reject;
    });
    mediaRecorder.start();
  }

  stop() {
    this.mediaRecorder.stop();
  }

  isRecording() {
    return this.mediaRecorder.state === 'recording';
  }

  getRecord() {
    return this.recordPromise;
  }
}

module.exports = Recorder;
