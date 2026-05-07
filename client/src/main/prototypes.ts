import { moveMouse, getMousePos } from "robotjs";
import { Peer } from "peerjs";

function keepMouseAtCenter() {
  // Set the interval so the app remains responsive
  setInterval(() => {
    const mouse = getMousePos(); // Returns {x, y}

    // Only move if it's away from the target
    if (mouse.x !== 500 || mouse.y !== 500) {
      moveMouse(500, 500);
    }
  }, 60); // 100ms is frequent enough to feel "sticky" but light on CPU
}

function castTeacher() {
  var peer = new Peer();
  peer.on("open", (id) => {
    let clientId = id;
  });
}
