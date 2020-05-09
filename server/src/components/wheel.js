AFRAME.registerComponent("wheel", {
  init: function () {
    // Bind event handlers
    this._onHit = this.onHit.bind(this)
    this._onGripEnd = this.onGripEnd.bind(this)
    this._onGripStart = this.onGripStart.bind(this)
    this._onHitEnd = this.onHitEnd.bind(this)
    this.currentPosition = new THREE.Vector3()

    this.hitHasEnded = true

    // create plane at the same rotation as the wheel (and positioned similarly)
    // use it so the maths is 2D later on

    this.mathPlane = new THREE.Plane()

    const { z } = this.el.getAttribute("rotation")
    this.startingAngle = this.currentWheelAngle = z
  },

  play: function () {
    this.el.addEventListener("hitstart", this._onHit)
    this.el.addEventListener("hitend", this._onHitEnd)

    this.addPlane()
  },

  addPlane: function () {
    const planeEl = document.createElement("a-plane")
    console.log(this.el.getAttribute("position"))

    planeEl.setAttribute("position", this.el.getAttribute("position"))
    const { x, y, z } = this.el.getAttribute("rotation")
    planeEl.setAttribute("rotation", `${x - 180} ${y} ${z}`)
    planeEl.setAttribute("width", "0.5")
    planeEl.setAttribute("height", "0.5")
    planeEl.setAttribute("visible", "false")
    planeEl.setAttribute("class", "wheelPlane")

    this.el.sceneEl.appendChild(planeEl)
    this.planeEl = planeEl

    this.planeEl.addEventListener("raycaster-intersected", ({ detail }) => {
      if (this.intersectingHandEl) return
      this.intersectingHandEl = detail.el
      this.getCurrentAngle = () => {
        const { uv } = detail.getIntersection(this.planeEl)
        return (
          (360 + Math.atan2(uv.y - 0.5, uv.x - 0.5) * (180 / Math.PI)) % 360
        )
      }
    })

    this.planeEl.addEventListener(
      "raycaster-intersected-cleared",
      ({ detail }) => {
        if (this.intersectingHandEl === detail.el) {
          delete this.intersectingHandEl
          delete this.getCurrentAngle
        }
      }
    )
  },

  pause: function () {
    this.el.removeEventListener("hitstart", this._onHit)
    this.el.removeEventListener("hitend", this._onHitEnd)
    if (this.handEl) {
      this.handEl.removeEventListener("buttondown", this._onGripStart)
      this.handEl.removeEventListener("buttonup", this._onGripEnd)
    }
  },

  onGripStart: function (evt) {
    if (evt.detail.id !== 1) return
    this.handEl.addEventListener("buttonup", this._onGripEnd)
    this.grabbing = true
    this.pressedButtonId = evt.detail.id
    delete this.previousPosition
    delete this.previousAngle
  },

  onGripEnd: function (evt) {
    if (this.pressedButtonId !== evt.detail.id || !this.handEl) return
    this.grabbing = false
    if (this.hitHasEnded) {
      this.handEl.removeEventListener("buttondown", this._onGripStart)
      this.handEl = undefined
    }
  },

  onHit: function (evt) {
    if (this.handEl) return
    const handEl = evt.detail.intersectedEls[0]
    this.handEl = handEl
    this.handEl.addEventListener("buttondown", this._onGripStart)
    this.hitHasEnded = false
  },

  onHitEnd: function (evt) {
    // known issue where this can be triggered by the other hand, not sure how to solve it
    // doesn't put the app into too weird of a state though, just means you have to leave and re-enter
    // the wheel bbox
    if (this.grabbing) return
    this.hitHasEnded = true
    if (this.handEl) {
      this.handEl.removeEventListener("buttondown", this._onGripStart)
      this.handEl = undefined
    }
  },

  tick: function () {
    const handEl = this.handEl
    console.log(this.currentAngle)
    if (!handEl || !this.grabbing || !this.intersectingHandEl) {
      this.rotateToStart()
      return
    }

    this.updateDelta()
    const { x, y } = this.el.getAttribute("rotation")

    this.currentWheelAngle = this.currentWheelAngle - this.deltaAngle
    this.el.setAttribute("rotation", { x, y, z: this.currentWheelAngle })
  },

  rotateToStart: function () {
    const { x, y } = this.el.getAttribute("rotation")
    let adjust = 0
    if (this.currentWheelAngle > this.startingAngle) adjust = 1
    if (this.currentWheelAngle < this.startingAngle) adjust = -1
    this.currentWheelAngle = Math.round(this.currentWheelAngle - adjust)
    if (adjust !== 0) {
      this.el.setAttribute("rotation", { x, y, z: this.currentWheelAngle })
    }
  },

  updateDelta: function () {
    const currentAngle = this.getCurrentAngle()
    if (!this.previousAngle) {
      this.previousAngle = currentAngle
    }
    this.deltaAngle = currentAngle - this.previousAngle
    this.previousAngle = currentAngle
  },
})
