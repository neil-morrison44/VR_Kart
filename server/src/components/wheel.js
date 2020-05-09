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
    if (!handEl || !this.grabbing) return

    this.updateDelta()
    const position = this.el.getAttribute("position")
    this.el.setAttribute("position", {
      x: position.x + this.deltaPosition.x,
      y: position.y + this.deltaPosition.y,
      z: position.z + this.deltaPosition.z,
    })
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
