import playPauseButton from "./nuts-and-bolts/play-pause.js";
import SimpleSynth from "./nuts-and-bolts/simple-synth.js";
import bpmInput from "./nuts-and-bolts/bpm-input.js";

let audioContext = new AudioContext();
const synth = new SimpleSynth(audioContext);
let bpm = 90;

bpmInput(bpm, newBpm => {
  bpm = newBpm;
  resetState();
});

let loopStart;
let lastBeat;
let lastNote;

function resetState() {
  loopStart = audioContext.currentTime;
  lastBeat = null;
  lastNote = null;
}

function frame() {
  const timeSinceLoopStart = audioContext.currentTime - loopStart;
  const notesPerBeat = 4;
  const beatLength = getBeatLength(bpm);
  const noteLength = getNoteLength(beatLength, notesPerBeat);

  const currentBeat = Math.floor(timeSinceLoopStart / beatLength);

  const currentNote = Math.floor(timeSinceLoopStart / noteLength);

  const currentNoteInBeat = currentNote % notesPerBeat;

  if (currentNote === lastNote) {
    // Not a new note yet
    return;
  }

  // Update which note we've played
  lastNote = currentNote;

  if (currentBeat === lastBeat) {
    // Not a new beat yet
    return;
  }

  // Update which beat we've played
  lastBeat = currentBeat;

  // Play note on the beat
  synth.play(69, audioContext.currentTime, 0.25);

  console.log(timeSinceLoopStart, beatLength, noteLength);
}

function loop() {
  if (audioContext.state !== "running") {
    // Stop the loop
    return;
  }
  requestAnimationFrame(loop);

  frame();
}

async function init() {
  await audioContext.resume();
  resetState();
}

function getBeatLength(bpm) {
  const beatsPerSecond = bpm / 60;
  return 1/beatsPerSecond;
}

function getNoteLength(beatLength, notesPerBeat) {
  return beatLength / notesPerBeat;
}

playPauseButton(
  () => {
    init().then(() => loop()).catch(console.error);
  },
  () => audioContext.suspend(),
);
