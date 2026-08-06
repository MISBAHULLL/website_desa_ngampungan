<?php

namespace App\Support;

use App\Models\VillageService;

final class VillageServiceCatalog
{
    /**
     * @return array{title: string, documents: array<string, array{label: string, required: bool}>}|null
     */
    public function find(string $slug): ?array
    {
        $service = VillageService::query()
            ->where('slug', $slug)
            ->with('documentRequirements')
            ->first();

        if (! $service) {
            return null;
        }

        $normalizedDocuments = [];

        foreach ($service->documentRequirements as $document) {
            $normalizedDocuments[$document->key] = [
                'label' => $document->label,
                'required' => $document->is_required,
            ];
        }

        return [
            'title' => $service->title,
            'documents' => $normalizedDocuments,
        ];
    }

    public function exists(string $slug): bool
    {
        return VillageService::query()
            ->where('slug', $slug)
            ->exists();
    }

    /**
     * @return array<string, array{label: string, required: bool}>
     */
    public function documents(string $slug): array
    {
        return $this->find($slug)['documents'] ?? [];
    }
}
