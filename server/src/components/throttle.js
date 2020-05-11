AFRAME.registerComponent("throttle", {
  schema: {
    steps: { type: "int", default: 3 },
    length: { type: "float", default: 0.5 },
  },
  init: function () {
    // Bind event handlers
    this._onHit = this.onHit.bind(this)
    this._onGripEnd = this.onGripEnd.bind(this)
    this._onGripStart = this.onGripStart.bind(this)
    this._onHitEnd = this.onHitEnd.bind(this)
    this.currentPosition = new THREE.Vector3()

    this.hitHasEnded = true

    this.addLineEl()

    this.roughVector3 = new THREE.Vector3()
    this.clampedVector3 = new THREE.Vector3()

    this.forwardColor = new THREE.Color("#00ff00")
    this.reverseColor = new THREE.Color("#ff0000")
    console.log(this.el.getAttribute("color"))
    this.startingColor = new THREE.Color(this.el.getAttribute("color"))
    this.currentColor = this.startingColor.clone()
  },

  addLineEl: function () {
    const lineEl = document.createElement("a-entity")
    const { x, y, z } = this.el.getAttribute("position")
    const { length } = this.data
    lineEl.setAttribute(
      "line",
      `start: ${x} ${y} ${z - length / 2}; end: ${x} ${y} ${
        z + length / 2
      }; color: red;`
    )
    lineEl.setAttribute("rotation", this.el.getAttribute("rotation"))
    this.el.sceneEl.appendChild(lineEl)
    this.lineEl = lineEl
    this.mathLine = new THREE.Line3(
      new THREE.Vector3(x, y, z - length / 2),
      new THREE.Vector3(x, y, z + length / 2)
    )
  },

  play: function () {
    const el = this.el
    el.addEventListener("hitstart", this._onHit)
    el.addEventListener("hitend", this._onHitEnd)
  },

  pause: function () {
    const el = this.el
    el.removeEventListener("hitstart", this._onHit)
    el.removeEventListener("hitend", this._onHitEnd)
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

  onHitEnd: function () {
    if (this.grabbing) return
    this.hitHasEnded = true
    if (this.handEl) {
      this.handEl.removeEventListener("buttondown", this._onGripStart)
      this.handEl = undefined
    }
  },

  tick: function () {
    const handEl = this.handEl
    if (!handEl || !this.grabbing) return

    this.updateDelta()
    const position = this.el.getAttribute("position")

    const [newX, newY, newZ] = [
      position.x + this.deltaPosition.x,
      position.y + this.deltaPosition.y,
      position.z + this.deltaPosition.z,
    ]

    this.roughVector3.set(newX, newY, newZ)

    const roughValue = this.mathLine.closestPointToPointParameter(
      this.roughVector3,
      true
    )
    const steps = this.data.steps - 1
    const stepValue = Math.round(roughValue * steps) / steps
    console.log(stepValue)
    this.mathLine.at(roughValue, this.clampedVector3)

    this.el.setAttribute("position", this.clampedVector3)

    if (stepValue !== this.value) {
      this.value = 1 - stepValue
      this.emitChangeEvent()
    }
  },

  emitChangeEvent: function () {
    const value = THREE.Math.mapLinear(this.value, 0, 1, -1, 1)
    const targetColor = value > 0 ? this.forwardColor : this.reverseColor

    // this doesn't work since the currentColor changes so the lerp is just lerping on top of itself
    // maybe need to somehow keep a pure 3rd
    this.currentColor.copy(this.startingColor)
    this.currentColor.lerp(targetColor, Math.abs(value))
    this.el.setAttribute("color", this.currentColor.getStyle())

    this.el.emit(
      "throttlechange",
      { value: THREE.Math.mapLinear(this.value, 0, 1, -1, 1) },
      false
    )
  },

  updateDelta: function () {
    const currentPosition = this.currentPosition
    this.handEl.object3D.updateMatrixWorld()
    currentPosition.setFromMatrixPosition(this.handEl.object3D.matrixWorld)
    if (!this.previousPosition) {
      this.previousPosition = new THREE.Vector3()
      this.previousPosition.copy(currentPosition)
    }
    const previousPosition = this.previousPosition
    const deltaPosition = {
      x: currentPosition.x - previousPosition.x,
      y: currentPosition.y - previousPosition.y,
      z: currentPosition.z - previousPosition.z,
    }
    this.previousPosition.copy(currentPosition)
    this.deltaPosition = deltaPosition
  },
})
