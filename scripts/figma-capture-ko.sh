#!/bin/bash
# Korean locale pages → Figma capture (one browser tab per page)
set -euo pipefail

BASE="http://localhost:3000"
DELAY_MS="4000"
WAIT_SEC=20

captures=(
  "2c58574e-f12c-46b4-9bbe-96c8135d8b62|/ko/|Home"
  "f1734ded-2189-4993-acea-3579f7bc2a2b|/ko/about/|About"
  "0b600162-49ed-4e62-a645-0b14a0644726|/ko/classes/|Classes-index"
  "9100410c-1681-4965-8bc9-6d2d5d18e656|/ko/classes/kindergarten/|Classes-kindergarten"
  "0f79724f-e037-4642-ad27-fc37c627bd3a|/ko/classes/elementary/|Classes-elementary"
  "8c444b22-fd6e-4d0c-9287-eb1be98abce0|/ko/classes/adults/|Classes-adults"
  "5ddabdb5-8345-4960-9905-ac2fa2dc75bd|/ko/events/|Events"
  "d43df82b-0a56-473b-b3a0-a0a7c4099303|/ko/gallery/|Gallery"
  "0b8948e4-f4ce-48bf-bfc5-40f5aed2cca9|/ko/introduction/|Introduction-index"
  "a926e349-961c-4b6c-8638-7f20dd23f648|/ko/introduction/calendar/|Introduction-calendar"
  "5ac45f24-cc3f-4e30-ae94-36e313605a5f|/ko/introduction/directions/|Introduction-directions"
  "15b93e16-6945-424c-9e08-5579c12a898c|/ko/introduction/greeting/|Introduction-greeting"
  "af49f0f4-5752-4a3e-a380-5fe7e7c86eb7|/ko/introduction/summary/|Introduction-summary"
  "5cb14cde-6d74-4ba2-a453-9db74bc39181|/ko/location/|Location"
  "8230982c-4c92-485e-a9cd-b6d510fced8c|/ko/schedule/|Schedule"
  "6429fe6a-ada1-4c48-9794-46f8d412dfc4|/ko/vision/|Vision"
)

n=0
total=${#captures[@]}
for item in "${captures[@]}"; do
  n=$((n + 1))
  IFS='|' read -r id path label <<< "$item"
  enc_endpoint=$(python3 -c "import urllib.parse; print(urllib.parse.quote('https://mcp.figma.com/mcp/capture/${id}/submit', safe=''))")
  url="${BASE}${path}#figmacapture=${id}&figmaendpoint=${enc_endpoint}&figmadelay=${DELAY_MS}"
  echo "[$n/$total] $label → $path"
  open "$url"
  sleep "$WAIT_SEC"
done

echo "All pages opened for capture."
