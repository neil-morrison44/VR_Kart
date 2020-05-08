AFRAME.registerComponent("wheel", {
  init: function () {
    this.GRABBED_STATE = "grabbed"
    // Bind event handlers
    this._onHit = this.onHit.bind(this)
    this._onGripOpen = this.onGripOpen.bind(this)
    this._onGripClose = this.onGripClose.bind(this)
    this._onHitEnd = this.onHitEnd.bind(this)
    this.currentPosition = new THREE.Vector3()
  },

  play: function () {
    const el = this.el
    el.addEventListener("hitstart", this._onHit)
    el.addEventListener("buttondown", this._onGripClose)
    el.addEventListener("buttonup", this._onGripOpen)
  },

  pause: function () {
    const el = this.el
    el.removeEventListener("hitstart", this.onHit)
    el.removeEventListener("buttondown", this.onGripClose)
    el.removeEventListener("buttonup", this.onGripOpen)
  },

  onGripClose: function (evt) {
    if (!this.hitEl) return
    if (evt.detail.id !== 1) return
    if (this.hitEl.is(this.GRABBED_STATE)) return

    this.hitEl.addState(this.GRABBED_STATE)
    this.grabbing = true
    this.pressedButtonId = evt.detail.id
    delete this.previousPosition
  },

  onGripOpen: function (evt) {
    var hitEl = this.hitEl
    if (this.pressedButtonId !== evt.detail.id) return

    this.grabbing = false
    if (!hitEl) return

    hitEl.removeState(this.GRABBED_STATE)
    hitEl.emit("grabend")
  },

  onHit: function (evt) {
    const hitEl = evt.detail.intersectedEls[0]
    this.hitEl = hitEl
    this.hitEl.addEventListener("hitend", this._onHitEnd)
  },

  onHitEnd: function () {
    if (this.grabbing) return
    this.hitEl.removeEventListener("hitend", this._onHitEnd)
    this.hitEl.removeState(this.GRABBED_STATE)
    this.hitEl = undefined
  },

  tick: function () {
    const hitEl = this.hitEl
    let position
    if (!hitEl || !this.grabbing) return

    this.updateDelta()
    position = hitEl.getAttribute("position")
    hitEl.setAttribute("position", {
      x: position.x + this.deltaPosition.x,
      y: position.y + this.deltaPosition.y,
      z: position.z + this.deltaPosition.z,
    })

    console.log(this.el.object3D.matrixWorld, this.hitEl.object3D.matrixWorld)
    console.log(
      this.el.object3D.matrixWorld.angleTo(this.hitEl.object3D.matrixWorld)
    )
  },

  updateDelta: function () {
    const currentPosition = this.currentPosition
    this.el.object3D.updateMatrixWorld()
    currentPosition.setFromMatrixPosition(this.el.object3D.matrixWorld)
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
