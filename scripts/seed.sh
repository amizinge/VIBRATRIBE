#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm --workspace apps/api run prisma:seed
