#!/bin/sh

env | while IFS='=' read -r key value; do
  if [[ $key == "API_DOMAIN_NAME" || $key == "YOUR_NICKNAME" ]]; then
    echo "VITE_${key}=\"${value}\""
  fi
done > .env

npm run build

if [ $? -eq 0 ]; then
  echo "[Ask @lvkaszus! Front-end]   Source files built successfully!"
  node server.cjs
else
  echo "[Ask @lvkaszus! Front-end]   FAILED TO BUILD SOURCE FILES!"
fi
