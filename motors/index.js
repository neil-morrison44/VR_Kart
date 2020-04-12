const Raspi = require("raspi-io").RaspiIO
const five = require("johnny-five")
const ipc = require("node-ipc")
const board = new five.Board({
  io: new Raspi({
    enableSoftPwm: true,
  }),
})
board.on("ready", function () {
  const motors = [
    new five.Motor({
      pins: {
        pwm: 5,
        dir: 2,
        enable: 21,
      },
      invertPWM: true,
    }),
    new five.Motor({
      pins: {
        pwm: 22,
        dir: 3,
        enable: 0,
      },
      invertPWM: true,
    }),
    new five.Motor({
      pins: {
        pwm: 4,
        dir: 27,
        enable: 26,
      },
      invertPWM: true,
    }),
    new five.Motor({
      pins: {
        pwm: 23,
        dir: 1,
        enable: 6,
      },
      invertPWM: true,
    }),
  ]

  motors.forEach((m) => m.disable())

  // ipc.serve("/tmp/uv4l.socket", function () {
  //   ipc.of.uv4l.on("uv4l", function (data) {
  //     ipc.log("got a message : ".debug, data)
  //     ipc.server.emit(socket, "message", data + " world!")
  //   })
  // })

  ipc.serve("/tmp/uv4l.socket", function () {
    ipc.server.on("uv4l", function (data, socket) {
      ipc.log("got a message : ".debug, data)
      ipc.server.emit(socket, "uv4l", data + " world!")
    })
    ipc.server.on("socket.disconnected", function (socket, destroyedSocketID) {
      ipc.log("client " + destroyedSocketID + " has disconnected!")
    })
  })
  // frontMotors.disable()
  // rearMotors.disable()
  // rearMotors.reverse(255)
  // frontMotors.forward(255)
  // frontMotors.enable()
  // rearMotors.enable()
  // board.wait(5000, function () {
  //   frontMotors.reverse()
  //   rearMotors.forward()
  //   board.wait(5000, function () {
  //     frontMotors.stop()
  //     rearMotors.stop()
  //   })
  // })
})
