<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateVillageProfileRequest;
use App\Models\VillageProfile;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VillageProfileController extends Controller
{
    public function index(): Response
    {
        $profile = VillageProfile::firstOrNew();

        return Inertia::render('admin/village-profile/index', [
            'profile' => [
                'id' => $profile->id,
                'totalPopulation' => $profile->total_population ?? 0,
                'totalFamilies' => $profile->total_families ?? 0,
                'totalHamlets' => $profile->total_hamlets ?? 0,
                'totalAreaHectares' => $profile->total_area_hectares ?? 0,
                'boundaryNorth' => $profile->boundary_north,
                'boundaryEast' => $profile->boundary_east,
                'boundarySouth' => $profile->boundary_south,
                'boundaryWest' => $profile->boundary_west,
                'hamlets' => $this->formatHamlets($profile->hamlets ?? []),
                'landUse' => $this->formatLandUse($profile->land_use ?? []),
                'demographics' => $profile->demographics ?? [],
                'mapLatitude' => $profile->map_latitude,
                'mapLongitude' => $profile->map_longitude,
                'mapZoom' => $profile->map_zoom,
                'mapGoogleUrl' => $profile->map_google_url,
                'mapHdFileUrl' => $profile->map_hd_file_url,
                'updatedAt' => $profile->updated_at?->toIso8601String(),
            ],
        ]);
    }

    public function edit(): Response
    {
        $profile = VillageProfile::firstOrNew();

        return Inertia::render('admin/village-profile/edit', [
            'profile' => [
                'id' => $profile->id,
                'totalPopulation' => $profile->total_population ?? 0,
                'totalFamilies' => $profile->total_families ?? 0,
                'totalHamlets' => $profile->total_hamlets ?? 0,
                'totalAreaHectares' => $profile->total_area_hectares ?? 0,
                'boundaryNorth' => $profile->boundary_north,
                'boundaryEast' => $profile->boundary_east,
                'boundarySouth' => $profile->boundary_south,
                'boundaryWest' => $profile->boundary_west,
                'hamlets' => $this->formatHamlets($profile->hamlets ?? []),
                'landUse' => $this->formatLandUse($profile->land_use ?? []),
                'demographics' => $profile->demographics ?? [],
                'mapLatitude' => $profile->map_latitude,
                'mapLongitude' => $profile->map_longitude,
                'mapZoom' => $profile->map_zoom,
                'mapGoogleUrl' => $profile->map_google_url,
                'mapHdFileUrl' => $profile->map_hd_file_url,
            ],
        ]);
    }

    public function update(UpdateVillageProfileRequest $request): RedirectResponse
    {
        $profile = VillageProfile::firstOrNew();

        $data = $request->safe()->only([
            'total_population',
            'total_families',
            'total_hamlets',
            'total_area_hectares',
            'boundary_north',
            'boundary_east',
            'boundary_south',
            'boundary_west',
            'hamlets',
            'land_use',
            'demographics',
            'map_latitude',
            'map_longitude',
            'map_zoom',
            'map_google_url',
            'map_hd_file_url',
        ]);

        if ($profile->exists) {
            $profile->update($data);
        } else {
            $profile->fill($data);
            $profile->save();
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data profil desa berhasil diperbarui.',
        ]);

        return redirect()->route('admin.village-profile.index');
    }

    /** @return array<int, array{name: string, rw_count: int, rt_count: int, kk_count: int, description: string}> */
    private function formatHamlets(mixed $hamlets): array
    {
        if (! is_array($hamlets)) {
            return [];
        }

        $formattedHamlets = [];

        foreach ($hamlets as $hamlet) {
            if (! is_array($hamlet)) {
                continue;
            }

            $formattedHamlets[] = [
                'name' => (string) ($hamlet['name'] ?? ''),
                'rw_count' => (int) ($hamlet['rw_count'] ?? $hamlet['rw'] ?? 0),
                'rt_count' => (int) ($hamlet['rt_count'] ?? $hamlet['rt'] ?? 0),
                'kk_count' => (int) ($hamlet['kk_count'] ?? $hamlet['households'] ?? 0),
                'description' => (string) ($hamlet['description'] ?? $hamlet['note'] ?? ''),
            ];
        }

        return $formattedHamlets;
    }

    /** @return array<int, array{category: string, area_hectares: float, percentage: float}> */
    private function formatLandUse(mixed $landUse): array
    {
        if (! is_array($landUse)) {
            return [];
        }

        $formattedLandUse = [];

        foreach ($landUse as $item) {
            if (! is_array($item)) {
                continue;
            }

            $formattedLandUse[] = [
                'category' => (string) ($item['category'] ?? $item['label'] ?? $item['key'] ?? ''),
                'area_hectares' => (float) ($item['area_hectares'] ?? $item['hectares'] ?? 0),
                'percentage' => (float) ($item['percentage'] ?? 0),
            ];
        }

        return $formattedLandUse;
    }
}
