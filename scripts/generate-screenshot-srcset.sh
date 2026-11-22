#!/usr/bin/env bash

set -euo pipefail

# Generate a native-ratio screenshot master plus width-based variants.
# Usage:
#   ./scripts/generate-screenshot-srcset.sh [input-image] [output-dir] [asset-name]
# Defaults:
#   input-image: screenshot.png
#   output-dir:  public/screenshots next to this scripts folder
#   asset-name:  input image basename

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

INPUT_IMAGE="${1:-screenshot.png}"
OUTPUT_DIR="${2:-${PROJECT_ROOT}/public/screenshots}"
TARGET_WIDTHS=(288 576 864 1152)

if [[ ! -f "${INPUT_IMAGE}" ]]; then
    echo "Error: input image not found: ${INPUT_IMAGE}" >&2
    exit 1
fi

if command -v magick >/dev/null 2>&1; then
    IM_CMD=(magick)
elif command -v convert >/dev/null 2>&1; then
    IM_CMD=(convert)
else
    echo "Error: ImageMagick is required. Install 'magick' or 'convert'." >&2
    exit 1
fi

mkdir -p "${OUTPUT_DIR}"

INPUT_BASENAME="$(basename "${INPUT_IMAGE}")"
DEFAULT_ASSET_NAME="${INPUT_BASENAME%.*}"
ASSET_NAME="${3:-${DEFAULT_ASSET_NAME}}"

if [[ ! "${ASSET_NAME}" =~ ^[A-Za-z0-9][A-Za-z0-9_-]*$ ]]; then
    echo "Error: asset name must use letters, numbers, underscores, or hyphens." >&2
    exit 1
fi

MASTER_IMAGE="${OUTPUT_DIR}/${ASSET_NAME}.png"

IMAGE_DIMENSIONS="$("${IM_CMD[@]}" "${INPUT_IMAGE}" -format "%w %h" info:)"
IFS=' ' read -r INPUT_WIDTH INPUT_HEIGHT <<< "${IMAGE_DIMENSIONS}"

if [[ -z "${INPUT_WIDTH}" || -z "${INPUT_HEIGHT}" ]]; then
    echo "Error: failed to read image dimensions for ${INPUT_IMAGE}" >&2
    exit 1
fi

echo "Writing native-ratio master ${INPUT_IMAGE} -> ${MASTER_IMAGE}"
"${IM_CMD[@]}" "${INPUT_IMAGE}" \
    -strip \
    "${MASTER_IMAGE}"

for width in "${TARGET_WIDTHS[@]}"; do
    output="${OUTPUT_DIR}/${ASSET_NAME}_${width}w.png"

    if (( width > INPUT_WIDTH )); then
        rm -f "${output}"
        echo "Skipping ${width}w because ${INPUT_IMAGE} is only ${INPUT_WIDTH}px wide"
        continue
    fi

    echo "Generating ${output}"
    "${IM_CMD[@]}" "${MASTER_IMAGE}" \
        -filter Lanczos \
        -resize "${width}x" \
        "${output}"
done

echo "Done. Wrote native-ratio screenshot assets to ${OUTPUT_DIR}"
