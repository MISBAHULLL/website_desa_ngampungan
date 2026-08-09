# syntax=docker/dockerfile:1

FROM php:8.3-apache-bookworm AS php-base

ENV PORT=10000

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        ca-certificates \
        libcurl4-openssl-dev \
        libicu-dev \
        libonig-dev \
        libxml2-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        curl \
        intl \
        mbstring \
        opcache \
        pdo_mysql \
        xml \
        zip \
    && a2enmod expires headers rewrite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf
COPY docker/ports.conf /etc/apache2/ports.conf
COPY docker/php-production.ini /usr/local/etc/php/conf.d/99-production.ini

FROM php-base AS build

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY --from=node:22-bookworm-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=node:22-bookworm-slim /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --prefer-dist

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

RUN composer dump-autoload \
        --classmap-authoritative \
        --no-dev \
        --no-interaction \
    && npm run build \
    && rm -rf node_modules

FROM php-base AS runtime

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    LOG_STACK=stderr

COPY --from=build --chown=www-data:www-data /var/www/html /var/www/html
COPY docker/render-start.sh /usr/local/bin/render-start

RUN chmod +x /usr/local/bin/render-start \
    && mkdir -p \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

CMD ["render-start"]
