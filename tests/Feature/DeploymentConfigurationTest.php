<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

test('health endpoint is available for the platform probe', function () {
    $this->get('/up')->assertOk();
});

test('forwarded https requests are trusted behind the render proxy', function () {
    Route::get('/_deployment/proxy-check', fn (Request $request): array => [
        'secure' => $request->isSecure(),
    ]);

    $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.10'])
        ->withHeaders(['X-Forwarded-Proto' => 'https'])
        ->getJson('/_deployment/proxy-check')
        ->assertOk()
        ->assertJson(['secure' => true]);
});

test('render deployment files retain the required production commands', function () {
    expect(file_get_contents(base_path('docker/render-start.sh')))
        ->toContain('php artisan migrate --force')
        ->toContain('php artisan optimize')
        ->and(file_get_contents(base_path('render.yaml')))
        ->toContain('healthCheckPath: /up')
        ->toContain('runtime: docker')
        ->and(file_get_contents(base_path('Dockerfile')))
        ->toContain('EXPOSE 10000')
        ->toContain('CMD ["render-start"]');
});
