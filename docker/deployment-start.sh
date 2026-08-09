#!/usr/bin/env sh

set -eu

rm -f \
    /etc/apache2/mods-enabled/mpm_event.conf \
    /etc/apache2/mods-enabled/mpm_event.load \
    /etc/apache2/mods-enabled/mpm_worker.conf \
    /etc/apache2/mods-enabled/mpm_worker.load

a2enmod mpm_prefork >/dev/null
apache2ctl configtest

php artisan optimize

exec apache2-foreground
