#!/bin/sh

echo "[Ask @lvkaszus! - Frontend: Pre-Builder]   Setting environment variables..."

VITE_DOMAIN="${DOMAIN:-http://domain.tld}"
VITE_YOUR_NICKNAME="${YOUR_NICKNAME:-@yourNickname}"

echo "[Ask @lvkaszus! - Frontend: Pre-Builder]   Environment variables set!"
echo "[Ask @lvkaszus! - Frontend: Pre-Builder]   Setting YOUR_NICKNAME inside index.html file..."

sed -i "s/\[\[yourNickname\]\]/${YOUR_NICKNAME:-@me}/g" "index.html"

echo "[Ask @lvkaszus! - Frontend: Pre-Builder]   YOUR_NICKNAME inside index.html file has been set!"
echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   Starting building source code files..."

VITE_DOMAIN="$VITE_DOMAIN" VITE_YOUR_NICKNAME="$VITE_YOUR_NICKNAME" npx vite build
