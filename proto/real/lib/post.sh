#!/usr/bin/env bash
# film post on the silent HyperFrames render: highlight halation (screen blend in RGB), fine temporal grain, soft vignette
#   post.sh IN.mp4 OUT.mp4
set -e
ffmpeg -v error -y -i "$1" -filter_complex \
  "[0:v]format=gbrp,split[a][b];[b]curves=all='0/0 0.75/0 1/1',gblur=sigma=24[g];[a][g]blend=all_mode=screen:all_opacity=0.2,format=yuv420p,noise=c0s=7:c0f=t+u,vignette=angle=PI/5[v]" \
  -map "[v]" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p "$2"
