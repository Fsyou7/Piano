console.log('script is running');

const video = document.getElementById('video');
const audio = document.getElementById('audio');
const startMetronomeBtn = document.getElementById('start-metronome');
const bpmInput = document.getElementById('bpm');
const startRecordingBtn = document.getElementById('start-recording');
const stopRecordingBtn = document.getElementById('stop-recording');

let metronomeInterval;
let mediaRecorder;
let recordedBlobs;

// WebAudio API setup for metronome
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.type = 'sine';
oscillator.frequency.value = 440;
gainNode.gain.value = 0;

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
oscillator.start();

// Metronome click event
startMetronomeBtn.addEventListener('click', () => {
  const bpm = bpmInput.value;
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
    startMetronomeBtn.textContent = 'Start';
    video.pause();
    audio.pause();
    gainNode.gain.value = 0;
  } else {
    startMetronomeBtn.textContent = 'Stop';
    video.play();
    audio.play();
    startMetronome(bpm);
  }
});

// Start metronome
function startMetronome(bpm) {
  const interval = 60000 / bpm;

  metronomeInterval = setInterval(() => {
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
  }, interval);
}

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
  video.src = URL.createObjectURL(new Blob(recordedBlobs, { type: 'video/webm' }));

  const audioBlobs = recordedBlobs.filter(blob => blob.type === 'audio/webm');
  if (audioBlobs.length > 0) {
    audio.src = URL.createObjectURL(new Blob(audioBlobs, { type: 'audio/webm' }));
  }
});
