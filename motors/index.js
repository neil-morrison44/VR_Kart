const Raspi = require("raspi-io").RaspiIO
const five = require("johnny-five")
const board = new five.Board({
  io: new Raspi({
    enableSoftPwm: true,
  }),
})
board.on("ready", function () {
  var frontMotors = new five.Motors([
    // motor 1
    {
      pins: {
        pwm: 5,
        dir: 2,
        enable: 21,
      },
      invertPWM: true,
    },
    // motor 2
    {
      pins: {
        pwm: 22,
        dir: 3,
        enable: 0,
      },
      invertPWM: true,
    },
  ])
  var rearMotors = new five.Motors([
    // motor 3
    {
      pins: {
        pwm: 4,
        dir: 27,
        enable: 26,
      },
      invertPWM: true,
    },
    // motor 4
    {
      pins: {
        pwm: 23,
        dir: 1,
        enable: 6,
      },
      invertPWM: true,
    },
  ])
  frontMotors.disable()
  rearMotors.disable()
  rearMotors.reverse(255)
  frontMotors.forward(255)
  frontMotors.enable()
  rearMotors.enable()
  board.wait(5000, function () {
    frontMotors.reverse()
    rearMotors.forward()
    board.wait(5000, function () {
      frontMotors.stop()
      rearMotors.stop()
    })
  })
})
