uv4l --enable-server --driver raspicam \
--server-option '--use-ssl=yes' --server-option '--ssl-private-key-file=/media/certs/server.key' \
--server-option '--ssl-certificate-file=/media/certs/server.crt' --verbosity=8 -f \
--server-option '--enable-webrtc-video=yes' --server-option '–-enable-webrtc=yes' --auto-video_nr on
