#!/usr/bin/env sh

set -eu

php artisan migrate --force
php artisan optimize

exec apache2-foreground
