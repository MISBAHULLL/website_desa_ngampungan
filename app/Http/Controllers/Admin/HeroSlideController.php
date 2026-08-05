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
                'backgroundImage' => $slide->background_image ? Storage::url($slide->background_image) : null,
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
        $nextOrder = HeroSlide::max('order') + 1;

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

    public function show(HeroSlide $heroSlide): Response
    {
        return Inertia::render('admin/hero-slides/show', [
            'slide' => [
                'id' => $heroSlide->id,
                'title' => $heroSlide->title,
                'subtitle' => $heroSlide->subtitle,
                'description' => $heroSlide->description,
                'primaryCtaText' => $heroSlide->primary_cta_text,
                'primaryCtaUrl' => $heroSlide->primary_cta_url,
                'secondaryCtaText' => $heroSlide->secondary_cta_text,
                'secondaryCtaUrl' => $heroSlide->secondary_cta_url,
                'backgroundImage' => $heroSlide->background_image ? Storage::url($heroSlide->background_image) : null,
                'order' => $heroSlide->order,
                'isActive' => $heroSlide->is_active,
                'createdAt' => $heroSlide->created_at?->toIso8601String(),
                'updatedAt' => $heroSlide->updated_at?->toIso8601String(),
            ],
        ]);
    }

    public function edit(HeroSlide $heroSlide): Response
    {
        return Inertia::render('admin/hero-slides/edit', [
            'slide' => [
                'id' => $heroSlide->id,
                'title' => $heroSlide->title,
                'subtitle' => $heroSlide->subtitle,
                'description' => $heroSlide->description,
                'primaryCtaText' => $heroSlide->primary_cta_text,
                'primaryCtaUrl' => $heroSlide->primary_cta_url,
                'secondaryCtaText' => $heroSlide->secondary_cta_text,
                'secondaryCtaUrl' => $heroSlide->secondary_cta_url,
                'backgroundImage' => $heroSlide->background_image ? Storage::url($heroSlide->background_image) : null,
                'order' => $heroSlide->order,
                'isActive' => $heroSlide->is_active,
            ],
        ]);
    }

    public function update(UpdateHeroSlideRequest $request, HeroSlide $heroSlide): RedirectResponse
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
            // Delete old image if exists
            if ($heroSlide->background_image) {
                Storage::disk('public')->delete($heroSlide->background_image);
            }

            $data['background_image'] = $request->file('background_image')->store('hero-slides', 'public');
        }

        $heroSlide->update($data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Slide hero berhasil diperbarui.',
        ]);

        return redirect()->route('admin.hero-slides.index');
    }

    public function destroy(HeroSlide $heroSlide): RedirectResponse
    {
        // Delete image if exists
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
}
