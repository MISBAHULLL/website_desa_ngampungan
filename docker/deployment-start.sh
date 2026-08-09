#!/usr/bin/env sh

set -eu

php artisan config:clear
php artisan db:seed --class=AdminUserSeeder --force
php artisan optimize

export SERVER_NAME=":${PORT:-10000}"

exec frankenphp run --config /etc/frankenphp/Caddyfile
