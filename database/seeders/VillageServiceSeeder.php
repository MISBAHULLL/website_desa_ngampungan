<?php

namespace Database\Seeders;

use App\Models\VillageService;
use App\Models\VillageServiceDocumentRequirement;
use App\Models\VillageServiceRequirement;
use Illuminate\Database\Seeder;

class VillageServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = $this->serviceData();

        foreach ($services as $index => $serviceData) {
            $service = VillageService::updateOrCreate(
                ['slug' => $serviceData['slug']],
                [
                    'title' => $serviceData['title'],
                    'short_description' => $serviceData['short_description'],
                    'category' => $serviceData['category'],
                    'audience' => $serviceData['audience'],
                    'channel' => $serviceData['channel'],
                    'estimated_duration' => $serviceData['estimated_duration'],
                    'fee' => $serviceData['fee'],
                    'service_contact' => $serviceData['service_contact'],
                    'service_hours' => $serviceData['service_hours'],
                    'notes' => $serviceData['notes'],
                    'is_active' => true,
                    'sort_order' => $index,
                ],
            );

            $service->requirements()->delete();

            foreach ($serviceData['requirements'] as $reqIndex => $requirement) {
                VillageServiceRequirement::create([
                    'village_service_id' => $service->id,
                    'description' => $requirement,
                    'sort_order' => $reqIndex,
                ]);
            }

            $service->documentRequirements()->delete();

            foreach ($serviceData['documents'] as $docIndex => $document) {
                VillageServiceDocumentRequirement::create([
                    'village_service_id' => $service->id,
                    'key' => $document['key'],
                    'label' => $document['label'],
                    'description' => $document['description'] ?? null,
                    'is_required' => $document['required'],
                    'accepted_formats' => $document['accepted_formats'] ?? '.pdf,.jpg,.jpeg,.png',
                    'sort_order' => $docIndex,
                ]);
            }
        }
    }

    /**
     * @return list<array{
     *     slug: string,
     *     title: string,
     *     short_description: string,
     *     category: string,
     *     audience: string,
     *     channel: string,
     *     estimated_duration: string,
     *     fee: string,
     *     service_contact: string,
     *     service_hours: string,
     *     notes: list<string>,
     *     requirements: list<string>,
     *     documents: list<array{key: string, label: string, description: string, required: bool, accepted_formats?: string}>,
     * }>
     */
    private function serviceData(): array
    {
        return [
            [
                'slug' => 'surat-keterangan-usaha',
                'title' => 'Surat Keterangan Usaha',
                'short_description' => 'Informasi penerbitan surat keterangan untuk usaha yang dijalankan warga desa.',
                'category' => 'administration',
                'audience' => 'Warga pemilik usaha',
                'channel' => 'Datang ke kantor desa',
                'estimated_duration' => '1 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kaur Pelayanan Desa',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => [
                    'Petugas dapat meminta klarifikasi lokasi dan jenis usaha.',
                    'Persyaratan final menunggu verifikasi Pemerintah Desa Ngampungan.',
                ],
                'requirements' => [
                    'Pemohon merupakan warga Desa Ngampungan.',
                    'Usaha berada atau dijalankan di wilayah desa.',
                    'Data usaha yang disampaikan dapat diverifikasi oleh petugas.',
                ],
                'documents' => [
                    ['key' => 'identity-card', 'label' => 'KTP pemohon', 'description' => 'Salinan atau foto KTP pemohon yang masih terbaca.', 'required' => true],
                    ['key' => 'family-card', 'label' => 'Kartu Keluarga', 'description' => 'Salinan atau foto Kartu Keluarga terbaru.', 'required' => true],
                    ['key' => 'neighbourhood-letter', 'label' => 'Surat pengantar RT/RW', 'description' => 'Surat pengantar lingkungan sesuai domisili pemohon.', 'required' => true],
                    ['key' => 'business-evidence', 'label' => 'Bukti kegiatan usaha', 'description' => 'Foto tempat usaha atau dokumen pendukung usaha bila tersedia.', 'required' => false],
                ],
            ],
            [
                'slug' => 'surat-keterangan-domisili',
                'title' => 'Surat Keterangan Domisili',
                'short_description' => 'Informasi surat yang menerangkan tempat tinggal atau domisili pemohon.',
                'category' => 'administration',
                'audience' => 'Penduduk desa',
                'channel' => 'Datang ke kantor desa',
                'estimated_duration' => '1 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kaur Pelayanan Desa',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => ['Petugas dapat melakukan konfirmasi domisili kepada lingkungan setempat.'],
                'requirements' => [
                    'Pemohon tinggal di wilayah Desa Ngampungan.',
                    'Alamat yang diajukan sesuai dengan kondisi tempat tinggal.',
                ],
                'documents' => [
                    ['key' => 'identity-card', 'label' => 'KTP pemohon', 'description' => 'Salinan atau foto KTP pemohon yang masih terbaca.', 'required' => true],
                    ['key' => 'family-card', 'label' => 'Kartu Keluarga', 'description' => 'Salinan atau foto Kartu Keluarga terbaru.', 'required' => true],
                    ['key' => 'neighbourhood-letter', 'label' => 'Surat pengantar RT/RW', 'description' => 'Surat pengantar lingkungan sesuai domisili pemohon.', 'required' => true],
                ],
            ],
            [
                'slug' => 'surat-pengantar-skck',
                'title' => 'Surat Pengantar SKCK',
                'short_description' => 'Informasi surat pengantar desa sebagai bagian dari pengurusan SKCK.',
                'category' => 'administration',
                'audience' => 'Penduduk desa',
                'channel' => 'Datang ke kantor desa',
                'estimated_duration' => '1 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kaur Pelayanan Desa',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => ['Surat desa merupakan dokumen pengantar; penerbitan SKCK tetap dilakukan oleh kepolisian.'],
                'requirements' => [
                    'Pemohon merupakan penduduk Desa Ngampungan.',
                    'Tujuan pembuatan SKCK dijelaskan secara singkat.',
                ],
                'documents' => [
                    ['key' => 'identity-card', 'label' => 'KTP pemohon', 'description' => 'Salinan atau foto KTP pemohon yang masih terbaca.', 'required' => true],
                    ['key' => 'family-card', 'label' => 'Kartu Keluarga', 'description' => 'Salinan atau foto Kartu Keluarga terbaru.', 'required' => true],
                    ['key' => 'neighbourhood-letter', 'label' => 'Surat pengantar RT/RW', 'description' => 'Surat pengantar lingkungan sesuai domisili pemohon.', 'required' => true],
                ],
            ],
            [
                'slug' => 'surat-keterangan-tidak-mampu',
                'title' => 'Surat Keterangan Tidak Mampu',
                'short_description' => 'Informasi surat keterangan untuk kebutuhan layanan sosial, pendidikan, atau kesehatan.',
                'category' => 'administration',
                'audience' => 'Warga yang memenuhi kriteria',
                'channel' => 'Verifikasi kantor desa',
                'estimated_duration' => '1–2 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kasi Kesejahteraan',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => ['Penerbitan mengikuti hasil verifikasi data sosial pemohon.'],
                'requirements' => [
                    'Pemohon atau anggota keluarga tercatat sebagai warga desa.',
                    'Keperluan layanan sosial, pendidikan, atau kesehatan dijelaskan dengan benar.',
                    'Data kondisi keluarga bersedia diverifikasi.',
                ],
                'documents' => [
                    ['key' => 'identity-card', 'label' => 'KTP pemohon', 'description' => 'Salinan atau foto KTP pemohon yang masih terbaca.', 'required' => true],
                    ['key' => 'family-card', 'label' => 'Kartu Keluarga', 'description' => 'Salinan atau foto Kartu Keluarga terbaru.', 'required' => true],
                    ['key' => 'neighbourhood-letter', 'label' => 'Surat pengantar RT/RW', 'description' => 'Surat pengantar lingkungan sesuai domisili pemohon.', 'required' => true],
                    ['key' => 'supporting-letter', 'label' => 'Dokumen pendukung keperluan', 'description' => 'Surat dari sekolah, fasilitas kesehatan, atau instansi tujuan bila tersedia.', 'required' => false],
                ],
            ],
            [
                'slug' => 'surat-keterangan-belum-menikah',
                'title' => 'Surat Keterangan Belum Menikah',
                'short_description' => 'Informasi penerbitan surat keterangan status pejaka/perawan atau belum pernah menikah.',
                'category' => 'administration',
                'audience' => 'Penduduk desa yang belum menikah',
                'channel' => 'Datang ke kantor desa',
                'estimated_duration' => '1 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kaur Pelayanan Desa',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => ['Surat ini dapat digunakan sebagai syarat pernikahan, pekerjaan, atau beasiswa.'],
                'requirements' => [
                    'Pemohon terdaftar sebagai penduduk Desa Ngampungan.',
                    'Pemohon belum pernah menikah secara hukum maupun agama.',
                    'Surat pernyataan status belum menikah ditandatangani pemohon dan saksi.',
                ],
                'documents' => [
                    ['key' => 'identity-card', 'label' => 'KTP pemohon', 'description' => 'Salinan atau foto KTP pemohon yang masih terbaca.', 'required' => true],
                    ['key' => 'family-card', 'label' => 'Kartu Keluarga', 'description' => 'Salinan atau foto Kartu Keluarga terbaru.', 'required' => true],
                    ['key' => 'neighbourhood-letter', 'label' => 'Surat pengantar RT/RW', 'description' => 'Surat pengantar lingkungan sesuai domisili pemohon.', 'required' => true],
                    ['key' => 'single-statement-letter', 'label' => 'Surat Pernyataan Belum Menikah', 'description' => 'Surat pernyataan belum pernah menikah bermaterai.', 'required' => true],
                ],
            ],
            [
                'slug' => 'pengantar-ktp-dan-kartu-keluarga',
                'title' => 'Pengantar KTP-el dan Kartu Keluarga',
                'short_description' => 'Informasi pengantar untuk penerbitan atau perubahan dokumen kependudukan.',
                'category' => 'population',
                'audience' => 'Penduduk desa',
                'channel' => 'Datang ke kantor desa',
                'estimated_duration' => '1 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kasi Pemerintahan',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => ['Dokumen kependudukan diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil.'],
                'requirements' => [
                    'Pemohon atau anggota keluarga terdaftar sebagai penduduk desa.',
                    'Jenis layanan dipilih: penerbitan baru, perubahan, atau penggantian.',
                ],
                'documents' => [
                    ['key' => 'family-card', 'label' => 'Kartu Keluarga', 'description' => 'Salinan atau foto Kartu Keluarga terbaru.', 'required' => true],
                    ['key' => 'identity-card', 'label' => 'KTP lama', 'description' => 'KTP lama bila mengajukan perubahan atau penggantian.', 'required' => false],
                    ['key' => 'population-support', 'label' => 'Dokumen pendukung perubahan data', 'description' => 'Akta kelahiran, buku nikah, ijazah, atau dokumen relevan lainnya.', 'required' => false],
                ],
            ],
            [
                'slug' => 'surat-pindah-dan-datang',
                'title' => 'Surat Pindah dan Datang Penduduk',
                'short_description' => 'Informasi administrasi perpindahan penduduk keluar atau masuk desa.',
                'category' => 'population',
                'audience' => 'Penduduk pindah atau pendatang',
                'channel' => 'Verifikasi kantor desa',
                'estimated_duration' => '1–2 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kasi Pemerintahan',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => ['Verifikasi tambahan dapat diperlukan untuk pemohon yang datang dari luar daerah.'],
                'requirements' => [
                    'Pemohon menjelaskan alamat asal dan alamat tujuan.',
                    'Seluruh anggota keluarga yang ikut pindah dicantumkan.',
                ],
                'documents' => [
                    ['key' => 'identity-card', 'label' => 'KTP pemohon', 'description' => 'Salinan atau foto KTP pemohon yang masih terbaca.', 'required' => true],
                    ['key' => 'family-card', 'label' => 'Kartu Keluarga', 'description' => 'Salinan atau foto Kartu Keluarga terbaru.', 'required' => true],
                    ['key' => 'moving-support', 'label' => 'Dokumen pendukung perpindahan', 'description' => 'Surat pindah dari daerah asal atau bukti alamat tujuan sesuai kebutuhan.', 'required' => true],
                ],
            ],
            [
                'slug' => 'pengantar-akta-kelahiran',
                'title' => 'Pengantar Akta Kelahiran',
                'short_description' => 'Informasi dokumen pengantar pencatatan kelahiran anggota keluarga.',
                'category' => 'population',
                'audience' => 'Orang tua atau wali',
                'channel' => 'Datang ke kantor desa',
                'estimated_duration' => '1 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kasi Pemerintahan',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => ['Akta kelahiran diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil.'],
                'requirements' => [
                    'Pelapor merupakan orang tua, wali, atau anggota keluarga yang berwenang.',
                    'Data kelahiran sesuai dengan surat keterangan tenaga kesehatan.',
                ],
                'documents' => [
                    ['key' => 'family-card', 'label' => 'Kartu Keluarga', 'description' => 'Salinan atau foto Kartu Keluarga terbaru.', 'required' => true],
                    ['key' => 'parents-identity', 'label' => 'KTP kedua orang tua', 'description' => 'Salinan atau foto KTP ayah dan ibu.', 'required' => true],
                    ['key' => 'birth-letter', 'label' => 'Surat keterangan kelahiran', 'description' => 'Surat dari bidan, rumah sakit, atau penolong kelahiran.', 'required' => true],
                    ['key' => 'marriage-book', 'label' => 'Buku nikah atau akta perkawinan', 'description' => 'Dokumen perkawinan orang tua bila tersedia.', 'required' => false],
                ],
            ],
            [
                'slug' => 'surat-keterangan-kematian',
                'title' => 'Surat Keterangan Kematian',
                'short_description' => 'Informasi penerbitan surat keterangan desa atas peristiwa kematian warga.',
                'category' => 'population',
                'audience' => 'Ahli waris atau keluarga almarhum/ah',
                'channel' => 'Datang ke kantor desa',
                'estimated_duration' => '1 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kasi Pemerintahan',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => ['Surat Keterangan Kematian Desa digunakan sebagai dasar pembuatan Akta Kematian di Disdukcapil.'],
                'requirements' => [
                    'Almarhum/ah merupakan penduduk Desa Ngampungan.',
                    'Pelapor merupakan pelapor atau ahli waris yang sah.',
                    'Data waktu, lokasi, dan penyebab kematian disampaikan secara jelas.',
                ],
                'documents' => [
                    ['key' => 'family-card', 'label' => 'Kartu Keluarga', 'description' => 'Salinan atau foto Kartu Keluarga terbaru.', 'required' => true],
                    ['key' => 'deceased-identity', 'label' => 'KTP Asli Almarhum/ah', 'description' => 'KTP asli almarhum/ah yang akan diserahkan/diverifikasi.', 'required' => true],
                    ['key' => 'medical-death-letter', 'label' => 'Surat Keterangan Kematian dari Faskes', 'description' => 'Surat dari rumah sakit, puskesmas, atau dokter bilamana ada.', 'required' => false],
                    ['key' => 'neighbourhood-letter', 'label' => 'Surat pengantar RT/RW', 'description' => 'Surat pengantar lingkungan sesuai domisili pemohon.', 'required' => true],
                ],
            ],
            [
                'slug' => 'pelaporan-hasil-panen',
                'title' => 'Pelaporan Hasil Panen',
                'short_description' => 'Informasi pelaporan data hasil panen dari petani desa untuk pendataan.',
                'category' => 'agriculture',
                'audience' => 'Petani desa',
                'channel' => 'Datang ke kantor desa',
                'estimated_duration' => '1 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kasi Kesejahteraan',
                'service_hours' => 'Senin–Kamis 08.00–15.00',
                'notes' => ['Data panen digunakan untuk perencanaan dan pendataan desa.'],
                'requirements' => [
                    'Pemohon merupakan petani yang terdaftar di Desa Ngampungan.',
                    'Data panen disampaikan dengan akurat.',
                ],
                'documents' => [
                    ['key' => 'identity-card', 'label' => 'KTP pemohon', 'description' => 'Salinan atau foto KTP pemohon yang masih terbaca.', 'required' => true],
                    ['key' => 'harvest-recap', 'label' => 'Rekap hasil panen', 'description' => 'Dokumen rekapitulasi hasil panen.', 'required' => true],
                ],
            ],
            [
                'slug' => 'rekomendasi-kebutuhan-kelompok-tani',
                'title' => 'Rekomendasi Kebutuhan Kelompok Tani',
                'short_description' => 'Informasi pengajuan rekomendasi sarana produksi dan kebutuhan kelompok tani.',
                'category' => 'agriculture',
                'audience' => 'Kelompok tani terdaftar',
                'channel' => 'Koordinasi pemerintah desa',
                'estimated_duration' => '2–3 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kasi Kesejahteraan',
                'service_hours' => 'Senin–Kamis 08.00–15.00',
                'notes' => ['Rekomendasi tidak otomatis menjamin bantuan atau pengadaan sarana.'],
                'requirements' => [
                    'Kelompok tani terdaftar atau diketahui Pemerintah Desa Ngampungan.',
                    'Kebutuhan dan penerima manfaat dijelaskan secara terukur.',
                ],
                'documents' => [
                    ['key' => 'group-proposal', 'label' => 'Proposal kebutuhan kelompok', 'description' => 'Dokumen kebutuhan, tujuan, jumlah, dan rencana pemanfaatan.', 'required' => true],
                    ['key' => 'member-list', 'label' => 'Daftar anggota kelompok', 'description' => 'Daftar anggota dan pengurus kelompok tani.', 'required' => true],
                ],
            ],
            [
                'slug' => 'pengaduan-infrastruktur-desa',
                'title' => 'Pengaduan Infrastruktur Desa',
                'short_description' => 'Kanal informasi untuk melaporkan jalan, drainase, penerangan, dan fasilitas umum.',
                'category' => 'reports',
                'audience' => 'Seluruh warga',
                'channel' => 'Form kontak atau kantor desa',
                'estimated_duration' => 'Tanggapan awal 1 hari kerja',
                'fee' => 'Gratis',
                'service_contact' => 'Kaur Perencanaan',
                'service_hours' => 'Senin–Kamis 08.00–15.00, Jumat 08.00–11.30',
                'notes' => ['Tanggapan awal bukan janji bahwa perbaikan langsung dapat dilaksanakan.'],
                'requirements' => [
                    'Lokasi masalah dijelaskan secara spesifik.',
                    'Jenis kerusakan dan dampaknya terhadap warga dijelaskan.',
                ],
                'documents' => [
                    ['key' => 'identity-card', 'label' => 'KTP pemohon', 'description' => 'Salinan atau foto KTP pemohon yang masih terbaca.', 'required' => false],
                    ['key' => 'infrastructure-evidence', 'label' => 'Foto kondisi dan lokasi', 'description' => 'Foto kerusakan atau fasilitas yang dilaporkan beserta penanda lokasi.', 'required' => true, 'accepted_formats' => '.jpg,.jpeg,.png'],
                ],
            ],
            [
                'slug' => 'informasi-kondisi-darurat',
                'title' => 'Informasi Kondisi Darurat',
                'short_description' => 'Petunjuk awal untuk melaporkan gangguan keamanan, bencana, atau kondisi mendesak.',
                'category' => 'reports',
                'audience' => 'Seluruh warga',
                'channel' => 'Telepon petugas terkait',
                'estimated_duration' => 'Menyesuaikan tingkat urgensi',
                'fee' => 'Gratis',
                'service_contact' => 'Petugas piket desa',
                'service_hours' => 'Kanal darurat menyesuaikan kesiapsiagaan petugas',
                'notes' => [
                    'Untuk ancaman keselamatan segera, hubungi layanan darurat atau aparat terkait.',
                    'Form simulasi ini bukan kanal penanganan darurat aktif.',
                ],
                'requirements' => [
                    'Jenis kejadian, lokasi, dan waktu kejadian dijelaskan.',
                    'Nomor telepon pelapor dapat dihubungi.',
                ],
                'documents' => [
                    ['key' => 'emergency-evidence', 'label' => 'Foto kondisi bila aman', 'description' => 'Dokumentasi hanya diambil bila tidak membahayakan pelapor.', 'required' => false, 'accepted_formats' => '.jpg,.jpeg,.png'],
                ],
            ],
        ];
    }
}
