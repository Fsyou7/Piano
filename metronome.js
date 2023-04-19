console.log('metronome.js is running');

const startMetronomeBtn = document.getElementById('start-metronome');
const bpmInput = document.getElementById('bpm');
let metronomeInterval;

// WebAudio API setup for metronome
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.type = 'sine';
oscillator.frequency.value = 440;
gainNode.gain.value = 0;

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

// Metronome click event
startMetronomeBtn.addEventListener('click', async () => {
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const bpm = bpmInput.value;
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
    startMetronomeBtn.textContent = 'Start';
    gainNode.gain.value = 0;
  } else {
    startMetronomeBtn.textContent = 'Stop';
    startMetronome(bpm);
  }
});

oscillator.start();

// Start metronome
function startMetronome(bpm) {
  const interval = 60000 / bpm;

  metronomeInterval = setInterval(() => {
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
  }, interval);
}
