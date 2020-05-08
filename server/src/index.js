console.log("hello")

import "./index.html"

import "./video/test.mp4"

import "aframe"

import "aframe-aabb-collider-component"

import "./components/wheel"

const videoPaddingX = 100
const videoPaddingY = 400

let videoCanvas = null
let ctx = null
let video = null

function setupVideoCanvas() {
  videoCanvas = document.querySelector("#videoCanvas")
  ctx = videoCanvas.getContext("2d")
  video = document.querySelector("#testVideo")
  renderCanvas()
  //video.play()

  video.addEventListener("pause", (event) => {
    console.log("video has paused", event)
    video.play()
  })

  document.querySelector("a-scene").addEventListener("enter-vr", function () {
    console.log("entering VR, playing video")
    video.play()
  })
}

function renderCanvas() {
  ctx.fillStyle = "black"
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.drawImage(
    video,
    videoPaddingX / 2,
    videoPaddingY / 2,
    ctx.canvas.width - videoPaddingX,
    ctx.canvas.height - videoPaddingY
  )
  window.requestAnimationFrame(renderCanvas)
}

window.addEventListener("DOMContentLoaded", setupVideoCanvas)

AFRAME.registerComponent("canvas-updater", {
  dependencies: ["geometry", "material"],

  tick: function () {
    const el = this.el
    const material = el.getObject3D("mesh").material
    if (!material.map) return
    material.map.needsUpdate = true
  },
})
