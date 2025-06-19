import playPauseButton from "./nuts-and-bolts/play-pause.js";

let audioContext = new AudioContext();

let loopStart;

function frame() {
  const timeSinceLoopStart = audioContext.currentTime - loopStart;
  const bpm = 90;
  const notesPerBeat = 4;
  const beatLength = getBeatLength(bpm);
  const noteLength = getNoteLength(beatLength, notesPerBeat);

  const currentBeat = Math.floor(timeSinceLoopStart / beatLength);

  const currentNote = Math.floor(timeSinceLoopStart / noteLength);

  const currentNoteInBeat = currentNote % notesPerBeat;

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
  loopStart = audioContext.currentTime;
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
