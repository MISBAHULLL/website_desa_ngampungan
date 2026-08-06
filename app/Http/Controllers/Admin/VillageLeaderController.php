<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVillageLeaderRequest;
use App\Http\Requests\UpdateVillageLeaderRequest;
use App\Http\Requests\UpdateVillageLeaderWelcomeRequest;
use App\Models\VillageLeader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VillageLeaderController extends Controller
{
    public function index(): Response
    {
        $activeLeader = VillageLeader::query()
            ->active()
            ->latest('started_at')
            ->first();

        $leaders = VillageLeader::query()
            ->select([
                'id',
                'name',
                'position',
                'photo',
                'started_at',
                'ended_at',
                'is_active',
                'created_at',
            ])
            ->latest()
            ->paginate(10)
            ->through(fn (VillageLeader $leader): array => [
                'id' => $leader->id,
                'name' => $leader->name,
                'position' => $leader->position,
                'photo' => $leader->photo ? Storage::disk('public')->url($leader->photo) : null,
                'startedAt' => $leader->started_at->format('d M Y'),
                'endedAt' => $leader->ended_at?->format('d M Y'),
                'isActive' => $leader->is_active,
                'createdAt' => $leader->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/village-leaders/index', [
            'leaders' => $leaders,
            'activeLeader' => $activeLeader ? $this->activeLeaderData($activeLeader) : null,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/village-leaders/create');
    }

    public function store(StoreVillageLeaderRequest $request): RedirectResponse
    {
        $data = $request->safe()->only([
            'name',
            'position',
            'welcome_title',
            'welcome_message',
            'vision',
            'mission',
            'started_at',
            'ended_at',
            'is_active',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('village-leaders', 'public');
        }

        // If this leader is active, set others to inactive
        if ($request->boolean('is_active')) {
            VillageLeader::query()->update(['is_active' => false]);
        }

        VillageLeader::create($data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data kepala desa berhasil ditambahkan.',
        ]);

        return redirect()->route('admin.village-leaders.index');
    }

    public function show(VillageLeader $villageLeader): Response
    {
        return Inertia::render('admin/village-leaders/show', [
            'leader' => [
                'id' => $villageLeader->id,
                'name' => $villageLeader->name,
                'position' => $villageLeader->position,
                'photo' => $villageLeader->photo ? Storage::disk('public')->url($villageLeader->photo) : null,
                'welcomeTitle' => $villageLeader->welcome_title,
                'welcomeMessage' => $villageLeader->welcome_message,
                'vision' => $villageLeader->vision,
                'mission' => $villageLeader->mission,
                'startedAt' => $villageLeader->started_at->toIso8601String(),
                'endedAt' => $villageLeader->ended_at?->toIso8601String(),
                'isActive' => $villageLeader->is_active,
                'createdAt' => $villageLeader->created_at?->toIso8601String(),
                'updatedAt' => $villageLeader->updated_at?->toIso8601String(),
            ],
        ]);
    }

    public function edit(VillageLeader $villageLeader): Response
    {
        return Inertia::render('admin/village-leaders/edit', [
            'leader' => [
                'id' => $villageLeader->id,
                'name' => $villageLeader->name,
                'position' => $villageLeader->position,
                'photo' => $villageLeader->photo ? Storage::disk('public')->url($villageLeader->photo) : null,
                'welcomeTitle' => $villageLeader->welcome_title,
                'welcomeMessage' => $villageLeader->welcome_message,
                'vision' => $villageLeader->vision,
                'mission' => $villageLeader->mission,
                'startedAt' => $villageLeader->started_at->toIso8601String(),
                'endedAt' => $villageLeader->ended_at?->toIso8601String(),
                'isActive' => $villageLeader->is_active,
            ],
        ]);
    }

    public function update(UpdateVillageLeaderRequest $request, VillageLeader $villageLeader): RedirectResponse
    {
        $data = $request->safe()->only([
            'name',
            'position',
            'started_at',
            'ended_at',
            'is_active',
        ]);

        $previousPhoto = $villageLeader->photo;

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('village-leaders', 'public');
        } elseif ($request->boolean('remove_photo')) {
            $data['photo'] = null;
        }

        // If this leader is active, set others to inactive
        if ($request->boolean('is_active')) {
            VillageLeader::query()
                ->where('id', '!=', $villageLeader->id)
                ->update(['is_active' => false]);
        }

        $villageLeader->update($data);

        if ($previousPhoto && array_key_exists('photo', $data) && $previousPhoto !== $data['photo']) {
            Storage::disk('public')->delete($previousPhoto);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Profil kepala desa berhasil diperbarui.',
        ]);

        return redirect()->route('admin.village-leaders.index');
    }

    public function updateWelcome(
        UpdateVillageLeaderWelcomeRequest $request,
        VillageLeader $villageLeader,
    ): RedirectResponse {
        $villageLeader->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sambutan kepala desa berhasil diperbarui.',
        ]);

        return redirect()->route('admin.village-leaders.index');
    }

    public function destroy(VillageLeader $villageLeader): RedirectResponse
    {
        // Delete photo if exists
        if ($villageLeader->photo) {
            Storage::disk('public')->delete($villageLeader->photo);
        }

        $villageLeader->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data kepala desa berhasil dihapus.',
        ]);

        return back();
    }

    /**
     * @return array<string, bool|int|string|null>
     */
    private function activeLeaderData(VillageLeader $leader): array
    {
        return [
            'id' => $leader->id,
            'name' => $leader->name,
            'position' => $leader->position,
            'photo' => $leader->photo ? Storage::disk('public')->url($leader->photo) : null,
            'welcomeTitle' => $leader->welcome_title,
            'welcomeMessage' => $leader->welcome_message,
            'vision' => $leader->vision,
            'mission' => $leader->mission,
            'startedAt' => $leader->started_at->format('Y-m-d'),
            'endedAt' => $leader->ended_at?->format('Y-m-d'),
            'isActive' => $leader->is_active,
        ];
    }
}
