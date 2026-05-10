#!/bin/sh

if [ -d "dist/" ]; then
  echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   Source files already exist!"
  
  node server.cjs
else
  npm run build

  if [ $? -eq 0 ]; then
    echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   Source files built successfully!"

    node server.cjs
  else
    echo "[Ask @lvkaszus! - Frontend: Pre-Loader]   FAILED TO BUILD SOURCE FILES!"
  fi
fi