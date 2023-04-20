console.log('metronome.js is running');

const startMetronomeBtn = document.getElementById('start-metronome');
const bpmInput = document.getElementById('bpm');
const beatsPerMeasureInput = document.getElementById('beatsPerMeasure');
const beatDurationInput = document.getElementById('beatDuration');
let metronomeInterval;

// WebAudio API setup for metronome
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const gainNode = audioContext.createGain();
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

// Start metronome
function startMetronome(bpm) {
  const interval = 60000 / bpm;
  const beatsPerMeasure = parseInt(beatsPerMeasureInput.value);
  const beatDuration = parseInt(beatDurationInput.value);
  let currentBeat = 0;

  metronomeInterval = setInterval(() => {
    if (currentBeat % beatsPerMeasure === 0) {
      playBeat(880);
    } else {
      playBeat(440);
    }

    currentBeat++;
    if (currentBeat >= beatDuration * beatsPerMeasure) {
      currentBeat = 0;
    }

    // Notify other components of metronome tick
    const event = new CustomEvent('metronomeTick');
    document.dispatchEvent(event);
  }, interval);
}

function playBeat(frequency) {
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.connect(gainNode);

  gainNode.gain.value = 1;
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
  gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
}
