#!/bin/zsh
set -e

cd "$(dirname "$0")"

export PORT=3002

echo "Starting Κατασκευαστική Τεντών at http://127.0.0.1:${PORT}/"
echo "Keep this Terminal window open while you preview the website in Codex."
echo "Then use the Codex browser URL: http://127.0.0.1:${PORT}/"

npm run dev -- --host 127.0.0.1 --port "${PORT}"
