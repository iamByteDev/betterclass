import { moveMouse, getMousePos, mouseClick } from 'robotjs'
import { Peer } from 'peerjs'
import { activeWindow } from 'get-windows'
import { on } from 'events'

let windowNameLock: string | undefined
function keepMouseAtCenter() {
  // Set the interval so the app remains responsive
  setInterval(() => {
    const mouse = getMousePos() // Returns {x, y}

    // Only move if it's away from the target
    if (mouse.x !== 500 || mouse.y !== 500) {
      moveMouse(500, 500)
    }
  }, 60) // 100ms is frequent enough to feel "sticky" but light on CPU
}

function castTeacher() {
  var peer = new Peer()
  peer.on('open', (id) => {
    let clientId = id
  })
}

async function getCurrentWindow() {
  let windowdatajson = await activeWindow()
  let windowDataTitle = windowdatajson?.title
  if (windowDataTitle != windowNameLock) {
    windowNameLock = windowDataTitle
    //TODO -> push to convex
  }
}

setInterval(getCurrentWindow, 1000)
