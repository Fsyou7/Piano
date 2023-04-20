console.log('recorder.js is running');

const video = document.getElementById('video');
const audio = document.getElementById('audio');
const startRecordingBtn = document.getElementById('start-recording');
const stopRecordingBtn = document.getElementById('stop-recording');
const stopPlayingBtn = document.getElementById('stop-playing');

let mediaRecorder;
let recordedBlobs;
let playing = false;
let metronomeTicks = 0;

// Start recording event
startRecordingBtn.addEventListener('click', async () => {
  startRecordingBtn.disabled = true;
  stopRecordingBtn.disabled = false;

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = stream;

  const options = { mimeType: 'video/webm;codecs=vp9,opus' };
  mediaRecorder = new MediaRecorder(stream, options);

  recordedBlobs = [];
  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  };

  document.addEventListener('metronomeTick', () => {
    metronomeTicks++;
    if (metronomeTicks === 8) {
      stopRecordingBtn.click();
    }
  });

  // Wait for the next metronome tick
  const nextTick = new Promise(resolve => {
    document.addEventListener('metronomeTick', resolve, { once: true });
  });

  await nextTick;
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
    stopPlayingBtn.hidden = false;
    stopPlayingBtn.textContent = 'Stop Playing';
    playing = true;
  };
});

// Stop playing event
stopPlayingBtn.addEventListener('click', async () => {
  if (playing) {
    video.pause();
    video.loop = false;
    stopPlayingBtn.textContent = 'Start Playing';
  } else {
    // Wait for the next metronome tick
    const nextTick = new Promise(resolve => {
      document.addEventListener('metronomeTick', resolve, { once: true });
    });

    await nextTick;
    video.loop = true;
    video.play();
    stopPlayingBtn.textContent = 'Stop Playing';
  }
  playing = !playing;
});
