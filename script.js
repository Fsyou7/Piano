console.log('script is running');

const video = document.getElementById('video');
const audio = document.getElementById('audio');
const startMetronomeBtn = document.getElementById('start-metronome');
const bpmInput = document.getElementById('bpm');
let metronomeInterval;

// WebAudio API setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.type = 'sine';
oscillator.frequency.value = 440;
gainNode.gain.value = 0;

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
oscillator.start();

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

function startMetronome(bpm) {
   const interval = 60000 / bpm;

   metronomeInterval = setInterval(() => {
      gainNode.gain.setValueAtTime(1, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
   }, interval);
}
