python3 ../motors/index.py &
PIDPY=$!

sleep 4

uv4l --enable-server --driver raspicam \
--server-option '--use-ssl=yes' --server-option '--ssl-private-key-file=/media/certs/server.key' \
--server-option '--ssl-certificate-file=/media/certs/server.crt' --verbosity=8 -f \
--server-option '--enable-webrtc-video=yes' --server-option '–-enable-webrtc=yes' --auto-video_nr on \
--server-option '--webrtc-hw-vcodec-maxbitrate=1600' --server-option '--webrtc-hw-vcodec-minbitrate=200' \
--server-option '--webrtc-hw-vcodec-startbitrate=200' --server-option '--webrtc-receive-video=no' \
--server-option '--max-streams=1' --server-option '--max-threads=2' --server-option '--webrtc-datachannel-socket=/tmp/uv4l.socket' &
PIDUV=$!

function stop-server(){
  echo "exiting...";
  kill $PIDUV;
  kill $PIDPY;

  wait $PIDPY;
  wait $PIDUV;
  exit
}

trap stop-server SIGINT

wait
