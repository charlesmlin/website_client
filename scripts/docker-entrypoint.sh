#!/bin/sh

envsubst < /usr/share/nginx/html/runtime-env.js.template > /usr/share/nginx/html/runtime-env.js

exec "$@"
