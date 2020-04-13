import socket
import time
import os
# import pigpio

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


def cleanup():
    print("cleanup")
    # pi.set_servo_pulsewidth(ROLL_PIN, 0)
    # pi.set_servo_pulsewidth(PITCH_PIN, 0)
    # pi.set_servo_pulsewidth(YAW_PIN, 0)
    # pi.stop()


while True:
    print('awaiting connection...')
    connection, client_address = s.accept()
    print('client_address %s', client_address)
    try:
        print('established connection with', client_address)

        # pi = pigpio.pi()

        # rollPulsewidth = MID_PW
        # pitchPulsewidth = MID_PW
        # yawPulsewidth = MID_PW

        # pi.set_servo_pulsewidth(ROLL_PIN, rollPulsewidth)
        # pi.set_servo_pulsewidth(PITCH_PIN, pitchPulsewidth)
        # pi.set_servo_pulsewidth(YAW_PIN, yawPulsewidth)

        while True:
            data = connection.recv(16)
            print('received message"%s"', data)

            time.sleep(0.01)

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
