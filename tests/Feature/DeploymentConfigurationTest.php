<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

test('health endpoint is available for the platform probe', function () {
    $this->get('/up')->assertOk();
});

test('forwarded https requests are trusted behind the platform proxy', function () {
    Route::get('/_deployment/proxy-check', fn (Request $request): array => [
        'secure' => $request->isSecure(),
    ]);

    $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.10'])
        ->withHeaders(['X-Forwarded-Proto' => 'https'])
        ->getJson('/_deployment/proxy-check')
        ->assertOk()
        ->assertJson(['secure' => true]);
});

test('railway deployment files retain the required production commands', function () {
    $railway = json_decode(
        (string) file_get_contents(base_path('railway.json')),
        true,
        flags: JSON_THROW_ON_ERROR,
    );

    expect($railway)
        ->toHaveKey('build.builder', 'DOCKERFILE')
        ->toHaveKey('build.dockerfilePath', 'Dockerfile')
        ->toHaveKey('deploy.preDeployCommand', 'php artisan migrate --force')
        ->toHaveKey('deploy.healthcheckPath', '/up')
        ->toHaveKey('deploy.restartPolicyType', 'ON_FAILURE')
        ->and(file_get_contents(base_path('docker/deployment-start.sh')))
        ->toContain('php artisan optimize')
        ->not->toContain('php artisan migrate')
        ->and(file_get_contents(base_path('Dockerfile')))
        ->toContain('EXPOSE 10000')
        ->toContain('CMD ["deployment-start"]');
});
