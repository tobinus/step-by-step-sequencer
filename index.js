import playPauseButton from "./nuts-and-bolts/play-pause.js";

let audioContext = new AudioContext();

let loopStart;

function frame() {
  const timeSinceLoopStart = audioContext.currentTime - loopStart;

  console.log(timeSinceLoopStart);

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

playPauseButton(
  () => {
    init().then(() => loop()).catch(console.error);
  },
  () => audioContext.suspend(),
);
