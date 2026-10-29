"""Print a VO's Whisper words with start times: python words.py proto/real/1/assets/vo.words.json"""
import json, sys
W = json.load(open(sys.argv[1]))
print(' '.join(f"{w['w']}@{w['s']:.2f}" for w in W))
print('end', W[-1]['e'])
