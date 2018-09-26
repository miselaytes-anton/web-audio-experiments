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
    mediaRecorder.ondataavailable = e => e.data.size && data.push(e.data);
    this.recordPromise = new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => dataToArrayBuffer(data)
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => resolve(buffer));
      mediaRecorder.onerror = reject;
    });
    mediaRecorder.start();
    return new Promise((resolve) => {
      mediaRecorder.onstart = () => {
        resolve(audioContext.currentTime);
      };
    });
  }

  stop() {
    this.mediaRecorder.stop();
    return this.recordPromise;
  }
}

module.exports = Recorder;
