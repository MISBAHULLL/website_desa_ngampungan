<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FilterHeroSlideRequest;
use App\Http\Requests\StoreHeroSlideRequest;
use App\Http\Requests\UpdateHeroSlideRequest;
use App\Models\HeroSlide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeroSlideController extends Controller
{
    public function index(FilterHeroSlideRequest $request): Response
    {
        $search = trim((string) $request->validated('search', ''));

        $slides = HeroSlide::query()
            ->select([
                'id',
                'title',
                'subtitle',
                'description',
                'primary_cta_text',
                'secondary_cta_text',
                'background_image',
                'order',
                'is_active',
                'created_at',
            ])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($searchQuery) use ($search): void {
                    $searchQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('subtitle', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('order')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (HeroSlide $slide): array => [
                'id' => $slide->id,
                'title' => $slide->title,
                'subtitle' => $slide->subtitle,
                'description' => $slide->description,
                'primaryCtaText' => $slide->primary_cta_text,
                'secondaryCtaText' => $slide->secondary_cta_text,
                'backgroundImage' => $this->backgroundImageUrl($slide),
                'order' => $slide->order,
                'isActive' => $slide->is_active,
                'createdAt' => $slide->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/hero-slides/index', [
            'slides' => $slides,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $nextOrder = ((int) HeroSlide::max('order')) + 1;

        return Inertia::render('admin/hero-slides/create', [
            'nextOrder' => $nextOrder,
        ]);
    }

    public function store(StoreHeroSlideRequest $request): RedirectResponse
    {
        $data = $request->safe()->only([
            'title',
            'subtitle',
            'description',
            'primary_cta_text',
            'primary_cta_url',
            'secondary_cta_text',
            'secondary_cta_url',
            'order',
            'is_active',
        ]);

        if ($request->hasFile('background_image')) {
            $data['background_image'] = $request->file('background_image')->store('hero-slides', 'public');
        }

        HeroSlide::create($data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Slide hero berhasil ditambahkan.',
        ]);

        return redirect()->route('admin.hero-slides.index');
    }

    public function edit(HeroSlide $heroSlide): Response
    {
        return Inertia::render('admin/hero-slides/create', [
            'nextOrder' => $heroSlide->order,
            'slide' => [
                'id' => $heroSlide->id,
                'title' => $heroSlide->title,
                'subtitle' => $heroSlide->subtitle,
                'description' => $heroSlide->description,
                'primaryCtaText' => $heroSlide->primary_cta_text,
                'primaryCtaUrl' => $heroSlide->primary_cta_url,
                'secondaryCtaText' => $heroSlide->secondary_cta_text,
                'secondaryCtaUrl' => $heroSlide->secondary_cta_url,
                'backgroundImage' => $this->backgroundImageUrl($heroSlide),
                'order' => $heroSlide->order,
                'isActive' => $heroSlide->is_active,
            ],
        ]);
    }

    public function update(UpdateHeroSlideRequest $request, HeroSlide $heroSlide): RedirectResponse
    {
        $validated = $request->validated();
        $data = $request->safe()->only([
            'title',
            'subtitle',
            'description',
            'primary_cta_text',
            'primary_cta_url',
            'secondary_cta_text',
            'secondary_cta_url',
            'order',
            'is_active',
        ]);

        $oldImage = $heroSlide->background_image;
        $shouldDeleteOldImage = false;

        if ($request->hasFile('background_image')) {
            $data['background_image'] = $request->file('background_image')->store('hero-slides', 'public');
            $shouldDeleteOldImage = true;
        } elseif (($validated['remove_background_image'] ?? false) === true) {
            $data['background_image'] = null;
            $shouldDeleteOldImage = true;
        }

        $heroSlide->update($data);

        if ($oldImage && $shouldDeleteOldImage) {
            Storage::disk('public')->delete($oldImage);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Slide hero berhasil diperbarui.',
        ]);

        return redirect()->route('admin.hero-slides.index');
    }

    public function destroy(HeroSlide $heroSlide): RedirectResponse
    {
        if ($heroSlide->background_image) {
            Storage::disk('public')->delete($heroSlide->background_image);
        }

        $heroSlide->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Slide hero berhasil dihapus.',
        ]);

        return back();
    }

    private function backgroundImageUrl(HeroSlide $heroSlide): ?string
    {
        if (! $heroSlide->background_image) {
            return null;
        }

        return Storage::disk('public')->url($heroSlide->background_image);
    }
}
