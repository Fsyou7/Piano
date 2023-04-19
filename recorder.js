console.log('recorder.js is running');

const video = document.getElementById('video');
const audio = document.getElementById('audio');
const startRecordingBtn = document.getElementById('start-recording');
const stopRecordingBtn = document.getElementById('stop-recording');
const stopPlayingBtn = document.getElementById('stop-playing');

let mediaRecorder;
let recordedBlobs;

// Start recording event
startRecordingBtn.addEventListener('click', async () => {
  startRecordingBtn.disabled = true;
  stopRecordingBtn.disabled = false;

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = stream;
  video.play();

  const options = { mimeType: 'video/webm;codecs=vp9,opus' };
  mediaRecorder = new MediaRecorder(stream, options);

  recordedBlobs = [];
  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  };

  mediaRecorder.start(10); // Collect 10ms of data
  console.log('MediaRecorder started', mediaRecorder);
});

// Stop recording event
stopRecordingBtn.addEventListener('click', () => {
  startRecordingBtn.disabled = false;
  stopRecordingBtn.disabled = true;

  mediaRecorder.stop();
  video.srcObject.getTracks().forEach(track => track.stop());
  
  mediaRecorder.onstop = (event) => {
    const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
    video.src = null;
    video.srcObject = null;
    video.src = URL.createObjectURL(superBuffer);
    video.controls = true;

    const audioBlobs = recordedBlobs.filter(blob => blob.type === 'audio/webm');
    if (audioBlobs.length > 0) {
      audio.src = URL.createObjectURL(new Blob(audioBlobs, { type: 'audio/webm' }));
    }

    video.loop = true;
    video.play();
    stopPlayingBtn.hidden = false;
  };
});

// Stop playing event
stopPlayingBtn.addEventListener('click', () => {
  video.pause();
  video.loop = false;
  stopPlayingBtn.hidden = true;
});
