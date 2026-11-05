# CI helper: runs a command with a time limit, up to 3 tries, so one hung mirror doesn't stall a whole job. Output stays on, to show what hung.
retry() { for i in 1 2 3; do timeout 300 "$@" && return 0; echo "::warning::try $i failed: $*"; sleep 20; done; return 1; }
