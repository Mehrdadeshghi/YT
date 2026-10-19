#!/usr/bin/env python3
"""One-time YouTube login on your own computer (docs/youtube-upload.md, step 3):
  .venv/bin/python scripts/yt_auth.py ~/Downloads/client_secret_XXXX.json
Opens the Google sign-in (choose the Wiki Roulette channel), then stores YT_CLIENT_ID, YT_CLIENT_SECRET and YT_REFRESH_TOKEN
directly as GitHub secrets of both repos via `gh secret set` (stdin). Nothing secret is printed or written to disk; delete the JSON afterwards."""
import json, subprocess, sys
from google_auth_oauthlib.flow import InstalledAppFlow
SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/yt-analytics.readonly']
REPOS = ['Mehrdadeshghi/YT', 'Mehrdadeshghi/wr-analytics']      # public production repo + private analytics repo
if len(sys.argv) < 2: sys.exit(__doc__)
cfg = json.load(open(sys.argv[1])); app = cfg.get('installed') or cfg.get('web')
if 'installed' not in cfg: sys.exit('This is not a "Desktop app" client. Create an OAuth client of type "Desktop app" (step 2).')
flow = InstalledAppFlow.from_client_config(cfg, SCOPES)
print('Open the link below in your browser, sign in, pick the Wiki Roulette channel and allow access.')
cred = flow.run_local_server(port=0, open_browser=False, prompt='consent', access_type='offline',
                             authorization_prompt_message='\n{url}\n', success_message='Done. You can close this tab and go back to the terminal.')
if not cred.refresh_token: sys.exit('Google returned no refresh token. Remove the app at myaccount.google.com/permissions and run this again.')
for name, value in (('YT_CLIENT_ID', app['client_id']), ('YT_CLIENT_SECRET', app['client_secret']), ('YT_REFRESH_TOKEN', cred.refresh_token)):
    for repo in REPOS:
        subprocess.run(['gh', 'secret', 'set', name, '-R', repo], input=value, text=True, check=True, capture_output=True)
        print(f'✓ {repo}: secret {name} saved')
print('\nAll set. You can delete the client_secret JSON now. Test: Actions → "Upload to YouTube" → episodes 152, privacy "private".')
