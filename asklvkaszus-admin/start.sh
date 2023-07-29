#!/bin/sh

env | while IFS='=' read -r key value; do
  if [[ $key == "YOUR_NICKNAME" ]]; then
    echo "VITE_${key}=\"${value}\""
  fi
done > .env

npm run build

if [ $? -eq 0 ]; then
  echo "[Ask @lvkaszus! Admin]   Source files built successfully!"
  node server.cjs
else
  echo "[Ask @lvkaszus! Admin]   FAILED TO BUILD SOURCE FILES!"
fi
