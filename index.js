let frameCounter = 0;

function frame() {
  console.log(frameCounter);

}

function loop() {
  requestAnimationFrame(loop);
  frameCounter++;
  frame();
}

function init() {

}

init();
loop();
