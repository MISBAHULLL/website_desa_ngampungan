#!/usr/bin/env sh

set -eu

php artisan optimize

exec apache2-foreground
