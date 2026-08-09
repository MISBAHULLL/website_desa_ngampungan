# syntax=docker/dockerfile:1

FROM dunglas/frankenphp:1-php8.3-bookworm AS php-base

ENV PORT=10000

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && install-php-extensions \
        bcmath \
        curl \
        intl \
        mbstring \
        opcache \
        pdo_mysql \
        xml \
        zip

WORKDIR /app

COPY docker/Caddyfile /etc/frankenphp/Caddyfile
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

COPY --from=build --chown=www-data:www-data /app /app
COPY docker/deployment-start.sh /usr/local/bin/deployment-start

RUN chmod +x /usr/local/bin/deployment-start \
    && mkdir -p \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

CMD ["deployment-start"]
