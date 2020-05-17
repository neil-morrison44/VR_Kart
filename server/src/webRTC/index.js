let throttle = 0
let direction = 0
let motorValues = [0, 0, 0, 0]

const setMotorValues = () => {
  if (direction > 0) {
    motorValues = [
      throttle * (1 - Math.abs(direction)),
      throttle,
      throttle * (1 - Math.abs(direction)),
      throttle,
    ]
  } else {
    motorValues = [
      throttle,
      throttle * (1 - Math.abs(direction)),
      throttle,
      throttle * (1 - Math.abs(direction)),
    ]
  }
}

let motorInterval
const MOTOR_INTERVAL = 1000

const startSendingMotorValues = () => {
  motorInterval = window.setInterval(() => {
    console.log({ motorValues })
  }, MOTOR_INTERVAL)
}

// when throttle = 1 & direction = 0 all motors are 1
// when throttle = -1 & direction = 0 all motors are -1
// when throttle = 1 & direction = -1 left motors are -1 and right are 1 ([1, 0, 1, 0])
// when throttle = -0.5 & direction = -0.5 motors are [-0.5, -0.25, -0.5, -0.25]

const setupEventListeners = () => {
  document
    .querySelector(".throttle")
    .addEventListener("onchange", ({ detail: { value } }) => {
      throttle = value
      setMotorValues()
    })

  document
    .querySelector(".steering-wheel")
    .addEventListener("onchange", ({ detail: { value } }) => {
      direction = value
      setMotorValues()
    })
}

const startCall = () => {
  startSendingMotorValues()
}

export { setupEventListeners, startSendingMotorValues, startCall }
