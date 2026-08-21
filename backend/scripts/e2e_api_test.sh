#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8000}"
PASS="${DEV_TEST_PASSWORD:-TestPass123!}"

read -r LEAVE_START LEAVE_END LEAVE2_START LEAVE2_END OT_DATE OT2_DATE <<EOF
$(python3 - <<'PY'
import datetime
import time

offset = int(time.time()) % 300
base = datetime.date(2027, 1, 1) + datetime.timedelta(days=offset)
leave_start = base
leave_end = base + datetime.timedelta(days=4)
leave2_start = base + datetime.timedelta(days=40)
leave2_end = leave2_start + datetime.timedelta(days=1)
ot_date = base + datetime.timedelta(days=10)
ot2_date = base + datetime.timedelta(days=20)
print(leave_start, leave_end, leave2_start, leave2_end, ot_date, ot2_date)
PY
)
EOF

login() {
  local email="$1"
  curl -sS -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$PASS\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])"
}

me() {
  local token="$1"
  curl -sS "$BASE_URL/users/me" -H "Authorization: Bearer $token"
}

echo "=== HEALTH ==="
curl -sS "$BASE_URL/health/db" | python3 -m json.tool

echo "=== EMPLOYEE LOGIN + /users/me ==="
EMP_TOKEN=$(login "employee@example.com")
me "$EMP_TOKEN" | python3 -m json.tool

echo "=== CREATE LEAVE ==="
LEAVE=$(curl -sS -X POST "$BASE_URL/leaves" \
  -H "Authorization: Bearer $EMP_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"leave_type\":\"annual\",\"start_date\":\"$LEAVE_START\",\"end_date\":\"$LEAVE_END\",\"reason\":\"E2E test izni\"}")
echo "$LEAVE" | python3 -m json.tool
LEAVE_ID=$(echo "$LEAVE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "=== CREATE SECOND LEAVE (for reject) ==="
LEAVE2=$(curl -sS -X POST "$BASE_URL/leaves" \
  -H "Authorization: Bearer $EMP_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"leave_type\":\"sick\",\"start_date\":\"$LEAVE2_START\",\"end_date\":\"$LEAVE2_END\",\"reason\":\"E2E reject test\"}")
LEAVE2_ID=$(echo "$LEAVE2" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "=== EMPLOYEE LEAVES LIST ==="
curl -sS "$BASE_URL/leaves" -H "Authorization: Bearer $EMP_TOKEN" | python3 -m json.tool

echo "=== CREATE OVERTIME ==="
OT=$(curl -sS -X POST "$BASE_URL/overtimes" \
  -H "Authorization: Bearer $EMP_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"$OT_DATE\",\"hours\":3,\"description\":\"E2E fazla mesai\"}")
echo "$OT" | python3 -m json.tool
OT_ID=$(echo "$OT" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "=== CREATE SECOND OVERTIME (for reject) ==="
OT2=$(curl -sS -X POST "$BASE_URL/overtimes" \
  -H "Authorization: Bearer $EMP_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"$OT2_DATE\",\"hours\":2,\"description\":\"E2E reject overtime\"}")
OT2_ID=$(echo "$OT2" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "=== EMPLOYEE OVERTIMES LIST ==="
curl -sS "$BASE_URL/overtimes" -H "Authorization: Bearer $EMP_TOKEN" | python3 -m json.tool

echo "=== EMPLOYEE FORBIDDEN: leaves/management ==="
curl -sS -w "\nHTTP:%{http_code}\n" "$BASE_URL/leaves/management" -H "Authorization: Bearer $EMP_TOKEN"

echo "=== MANAGER LOGIN + /users/me ==="
MGR_TOKEN=$(login "manager@example.com")
me "$MGR_TOKEN" | python3 -m json.tool

echo "=== MANAGER leaves/management ==="
curl -sS "$BASE_URL/leaves/management" -H "Authorization: Bearer $MGR_TOKEN" | python3 -m json.tool

echo "=== MANAGER overtimes/management ==="
curl -sS "$BASE_URL/overtimes/management" -H "Authorization: Bearer $MGR_TOKEN" | python3 -m json.tool

echo "=== MANAGER APPROVE LEAVE $LEAVE_ID ==="
curl -sS -X PATCH "$BASE_URL/leaves/$LEAVE_ID/approve" -H "Authorization: Bearer $MGR_TOKEN" | python3 -m json.tool

echo "=== MANAGER REJECT LEAVE $LEAVE2_ID ==="
curl -sS -X PATCH "$BASE_URL/leaves/$LEAVE2_ID/reject" -H "Authorization: Bearer $MGR_TOKEN" | python3 -m json.tool

echo "=== MANAGER APPROVE OVERTIME $OT_ID ==="
curl -sS -X PATCH "$BASE_URL/overtimes/$OT_ID/approve" -H "Authorization: Bearer $MGR_TOKEN" | python3 -m json.tool

echo "=== MANAGER REJECT OVERTIME $OT2_ID ==="
curl -sS -X PATCH "$BASE_URL/overtimes/$OT2_ID/reject" -H "Authorization: Bearer $MGR_TOKEN" | python3 -m json.tool

echo "=== VERIFY MANAGEMENT LIST AFTER ACTIONS ==="
curl -sS "$BASE_URL/leaves/management?status=approved" -H "Authorization: Bearer $MGR_TOKEN" | python3 -m json.tool
curl -sS "$BASE_URL/leaves/management?status=rejected" -H "Authorization: Bearer $MGR_TOKEN" | python3 -m json.tool

echo "=== HR LOGIN + management access ==="
HR_TOKEN=$(login "hr@example.com")
me "$HR_TOKEN" | python3 -m json.tool
curl -sS -w "\nHTTP:%{http_code}\n" "$BASE_URL/leaves/management?status=pending" -H "Authorization: Bearer $HR_TOKEN" | head -20

echo "=== ALL E2E API TESTS COMPLETED ==="
