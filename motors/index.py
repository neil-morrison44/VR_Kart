import socket
import time
import os
import json
from gpiozero import Motor, OutputDevice

socket_path = '/tmp/uv4l.socket'

try:
    os.unlink(socket_path)
except OSError:
    if os.path.exists(socket_path):
        raise

s = socket.socket(socket.AF_UNIX, socket.SOCK_SEQPACKET)

print('socket_path: %s', socket_path)
s.bind(socket_path)
s.listen(1)


def setupMotors():
    motor1 = Motor(24, 27)
    motor1_enable = OutputDevice(5, initial_value=1)
    motor2 = Motor(6, 22)
    motor2_enable = OutputDevice(17, initial_value=1)
    motor3 = Motor(23, 16)
    motor3_enable = OutputDevice(12, initial_value=1)
    motor4 = Motor(13, 18)
    motor4_enable = OutputDevice(25, initial_value=1)
    return [motor1, motor2, motor3, motor4]


motors = setupMotors()


def cleanup():
    print("cleanup")
    for motor in motors:
        motor.stop()


while True:
    print('awaiting connection...')
    connection, client_address = s.accept()
    print('client_address %s', client_address)
    try:
        print('established connection with', client_address)
        while True:
            data = connection.recv(16)
            print('received message"%s"', data)

            time.sleep(0.01)

            values = json.loads(data)

            for i in range(len(values)):
                motors[i].value = values[i]

            if data:
                print('echo data to client')
                connection.sendall(data)
            else:
                print('no more data from', client_address)
                break

    finally:
        # Clean up the connection
        cleanup()
        connection.close()
