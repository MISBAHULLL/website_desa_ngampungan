<?php

namespace App\Support;

final class VillageServiceCatalog
{
    /**
     * @return array{title: string, documents: array<string, array{label: string, required: bool}>}|null
     */
    public function find(string $slug): ?array
    {
        $service = config("village_services.services.{$slug}");

        if (! is_array($service)) {
            return null;
        }

        $title = $service['title'] ?? null;
        $documents = $service['documents'] ?? null;

        if (! is_string($title) || ! is_array($documents)) {
            return null;
        }

        $normalizedDocuments = [];

        foreach ($documents as $documentKey => $document) {
            if (
                ! is_string($documentKey)
                || ! is_array($document)
                || ! is_string($document['label'] ?? null)
                || ! is_bool($document['required'] ?? null)
            ) {
                return null;
            }

            $normalizedDocuments[$documentKey] = [
                'label' => $document['label'],
                'required' => $document['required'],
            ];
        }

        return [
            'title' => $title,
            'documents' => $normalizedDocuments,
        ];
    }

    public function exists(string $slug): bool
    {
        return $this->find($slug) !== null;
    }

    /**
     * @return array<string, array{label: string, required: bool}>
     */
    public function documents(string $slug): array
    {
        return $this->find($slug)['documents'] ?? [];
    }
}
