console.log("hello")

import "./index.html"

import "./video/test.mp4"

import "aframe"

import "aframe-aabb-collider-component"

import "./components/wheel"
import "./components/throttle"
import { setupEventListeners, startCall } from "./webRTC"

const videoPaddingX = 100
const videoPaddingY = 100

let videoCanvas = null
let ctx = null
let video = null

function setupVideoCanvas() {
  videoCanvas = document.querySelector("#videoCanvas")
  ctx = videoCanvas.getContext("2d")
  video = document.querySelector("#testVideo")
  ctx.translate(ctx.canvas.width, 0)
  ctx.scale(-1, 1)
  renderCanvas()
  //video.play()

  // video.addEventListener("pause", (event) => {
  //   console.log("video has paused", event)
  //   video.play()
  // })

  document.querySelector("a-scene").addEventListener("enter-vr", function () {
    console.log("entering VR, playing video")
    video.play()
  })
}

function renderCanvas() {
  ctx.fillStyle = "black"
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.save()
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)

  ctx.rotate(90 * (Math.PI / 180))

  ctx.drawImage(
    video,
    videoPaddingX / 2 - ctx.canvas.width / 2,
    videoPaddingY / 2 - ctx.canvas.height / 2,
    ctx.canvas.width - videoPaddingX,
    ctx.canvas.height - videoPaddingY
  )

  ctx.restore()
  window.requestAnimationFrame(renderCanvas)
}

window.addEventListener("DOMContentLoaded", () => {
  setupVideoCanvas()
  setupEventListeners()
  startCall()
})

AFRAME.registerComponent("canvas-updater", {
  dependencies: ["geometry", "material"],

  tick: function () {
    const material = this.el.getObject3D("mesh").material
    if (!material.map) return
    material.map.needsUpdate = true
  },
})
