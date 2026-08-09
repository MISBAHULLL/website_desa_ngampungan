<?php

namespace App\Actions;

use App\Models\ServiceApplication;
use App\ServiceApplicationStatus;
use App\Support\VillageServiceCatalog;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class CreateServiceApplicationAction
{
    private const DOCUMENT_STORAGE_DISK = 'private';

    public function __construct(
        private VillageServiceCatalog $serviceCatalog,
    ) {}

    /**
     * @param  array{
     *     applicant_name: string,
     *     national_id: string,
     *     phone: string,
     *     address: string,
     *     purpose: string,
     *     documents: array<string, UploadedFile>
     * }  $data
     */
    public function handle(
        string $serviceSlug,
        array $data,
        ?string $ipAddress,
        ?string $userAgent,
    ): ServiceApplication {
        $service = $this->serviceCatalog->find($serviceSlug);

        if ($service === null) {
            throw new RuntimeException('Layanan tidak dikenali.');
        }

        $referenceNumber = $this->generateReferenceNumber();
        $storageDirectory = "service-applications/{$referenceNumber}";

        try {
            return DB::transaction(function () use (
                $data,
                $ipAddress,
                $referenceNumber,
                $service,
                $serviceSlug,
                $storageDirectory,
                $userAgent,
            ): ServiceApplication {
                $serviceApplication = ServiceApplication::create([
                    'reference_number' => $referenceNumber,
                    'service_slug' => $serviceSlug,
                    'service_title' => $service['title'],
                    'applicant_name' => $data['applicant_name'],
                    'national_id' => $data['national_id'],
                    'phone' => $data['phone'],
                    'address' => $data['address'],
                    'purpose' => $data['purpose'],
                    'status' => ServiceApplicationStatus::Submitted,
                    'ip_address' => $ipAddress,
                    'user_agent' => Str::limit((string) $userAgent, 500),
                    'submitted_at' => now(),
                ]);

                foreach ($data['documents'] as $documentKey => $uploadedFile) {
                    $storagePath = $uploadedFile->store(
                        $storageDirectory,
                        self::DOCUMENT_STORAGE_DISK,
                    );

                    if ($storagePath === false) {
                        throw new RuntimeException('Dokumen gagal disimpan.');
                    }

                    $document = $service['documents'][$documentKey];

                    $serviceApplication->documents()->create([
                        'document_key' => $documentKey,
                        'document_label' => $document['label'],
                        'original_name' => Str::limit(
                            $uploadedFile->getClientOriginalName(),
                            255,
                        ),
                        'storage_disk' => self::DOCUMENT_STORAGE_DISK,
                        'storage_path' => $storagePath,
                        'mime_type' => $uploadedFile->getMimeType()
                            ?? 'application/octet-stream',
                        'size' => (int) $uploadedFile->getSize(),
                    ]);
                }

                $serviceApplication->statusHistories()->create([
                    'status' => ServiceApplicationStatus::Submitted,
                    'public_notes' => 'Pengajuan berhasil diterima sistem.',
                    'changed_by' => null,
                ]);

                return $serviceApplication;
            });
        } catch (Throwable $exception) {
            Storage::disk(self::DOCUMENT_STORAGE_DISK)->deleteDirectory($storageDirectory);

            throw $exception;
        }
    }

    private function generateReferenceNumber(): string
    {
        do {
            $referenceNumber = 'NGP-'.now()->format('Ymd').'-'
                .Str::upper(Str::random(8));
        } while (ServiceApplication::query()
            ->where('reference_number', $referenceNumber)
            ->exists());

        return $referenceNumber;
    }
}
