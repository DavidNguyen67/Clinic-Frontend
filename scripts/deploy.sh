#!/bin/bash
set -euo pipefail

IMAGE_TAG="${IMAGE_TAG}"
REPO="${DOCKERHUB_REPO}"
NAME="${APP_NAME}"
PORT="${APP_PORT}"
KEEP="${KEEP_IMAGES}"
ENV_FILE="/opt/fe-clinic/.env"

# ── 1. Login DockerHub ────────────────────────────────────────
echo "=== [1/5] Login DockerHub ==="
echo "${DOCKER_PASS_ARG}" | docker login -u "${DOCKER_USER_ARG}" --password-stdin

# ── 2. Pull image mới ────────────────────────────────────────
echo "=== [2/5] Pull image: ${IMAGE_TAG} ==="
docker pull "${IMAGE_TAG}"

# ── 3. Dừng & xóa container cũ ───────────────────────────────
echo "=== [3/5] Dừng container cũ (nếu có) ==="
docker kill  "${NAME}" 2>/dev/null || true
docker stop  "${NAME}" 2>/dev/null || true
docker rm -f "${NAME}" 2>/dev/null || true

echo "--- Chờ port ${PORT} release..."
for i in $(seq 1 15); do
    if ! ss -tlnp | grep -q ":${PORT} "; then
        echo "--- Port ${PORT} free sau ${i}s"
        break
    fi
    if [ "$i" -eq 15 ]; then
        echo "--- Port vẫn bị chiếm sau 15s → force kill..."
        fuser -k "${PORT}/tcp" 2>/dev/null || true
        sleep 1
    fi
    sleep 1
done

# ── 4. Chạy container mới ────────────────────────────────────
echo "=== [4/5] Chạy container mới ==="
docker run -d \
    --name "${NAME}" \
    --restart unless-stopped \
    --env-file "${ENV_FILE}" \
    -p "${PORT}:8080" \
    "${IMAGE_TAG}"

# ── 5. Dọn image cũ (giữ lại KEEP gần nhất) ─────────────────
echo "=== [5/5] Dọn image cũ — giữ lại ${KEEP} gần nhất ==="
docker images "${REPO}" --format '{{.Tag}} {{.ID}}' \
    | grep -v latest \
    | sort -r \
    | tail -n "+$(( KEEP + 1 ))" \
    | awk '{print $2}' \
    | xargs -r docker rmi -f || true

docker logout
echo "✅ Deploy xong — container ${NAME} đang chạy image ${IMAGE_TAG}"