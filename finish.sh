#!/bin/bash
# ./finish.sh 001  -> loudness-normalised score, muxed master, and a <30 MB upload copy
set -e; cd "$(dirname "$0")"; D="out/ep$1"
node ${SCORE:-score_cine.mjs} "$D"
ffmpeg -y -loglevel error -i "$D/score.wav" -af loudnorm=I=-14:TP=-1:LRA=11 -ar 48000 "$D/score_norm.wav"
ffmpeg -y -loglevel error -i "$D/silent.mp4" -i "$D/score_norm.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$D/master.mp4"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$D/silent.mp4")
VB=$(python3 -c "print(min(5500, int(27*8192/$DUR - 200)))")k   # keep the upload copy under ~27 MB
ffmpeg -y -loglevel error -i "$D/silent.mp4" -c:v libx264 -preset slow -b:v $VB -pass 1 -passlogfile "$D/x264" -an -f null /dev/null
ffmpeg -y -loglevel error -i "$D/silent.mp4" -i "$D/score_norm.wav" -map 0:v -map 1:a -c:v libx264 -preset slow -b:v $VB -pass 2 -passlogfile "$D/x264" \
  -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$D/wiki_roulette_$1.mp4"
ls -la "$D/wiki_roulette_$1.mp4" | awk '{print $5}'
