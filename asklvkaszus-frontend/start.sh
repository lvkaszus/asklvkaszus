#!/bin/sh

if [ -d "dist/" ]; then
  echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   Source files already exist!"
  
  node server.cjs
else
  echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   Setting environment variables..."

  export VITE_DOMAIN="${DOMAIN}"
  export VITE_YOUR_NICKNAME="${YOUR_NICKNAME}"

  echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   Environment variables set!"


  echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   Setting YOUR_NICKNAME inside index.html file..."

  sed -i "s/\[\[yourNickname\]\]/${YOUR_NICKNAME:-@me}/g" "index.html"

  echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   YOUR_NICKNAME inside index.html file has been set!"


  echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   Starting building source code files..."

  npm run build

  if [ $? -eq 0 ]; then
    echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   Source files built successfully!"

    node server.cjs
  else
    echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   FAILED TO BUILD SOURCE FILES!"
  fi
fi