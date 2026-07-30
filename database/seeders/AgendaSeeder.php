<?php

namespace Database\Seeders;

use App\Models\Agenda;
use Illuminate\Database\Seeder;

class AgendaSeeder extends Seeder
{
    public function run(): void
    {
        $agendas = [
            [
                'title' => 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes)',
                'category' => 'Musyawarah',
                'summary' => 'Pertemuan warga dan tokoh masyarakat untuk menyusulus rencana kerja dan alokasi anggaran desa.',
                'details' => [
                    'Membahas prioritas insfrastruktur 2027',
                    'Evaluasi realisasi anggaran tahun berjalan',
                    'Sesi usulan dari masing-masing RT/RW',
                ],
                'event_date' => '2026-08-03',
                'day_label' => 'SENIN',
                'date_label' => '3 AGUSTUS 2026',
                'time_label' => '09:00 WIB - Selesai',
                'location' => 'Balai Desa Ngampungan',
                'organizer' => 'Pemerintah Desa & BPD',
                'contact' => '0812-3456-7890 (Sekretariat Desa)',
                'registration_required' => false,
                'status' => 'upcoming',
                'is_featured' => true,
            ],
            [
                'title' => 'Posyandu Balita dan Lansia Serentak',
                'category' => 'Kesehatan',
                'summary' => 'Pemeriksaan kesehatan, penimbangan balita, serta penyuluhan gizi keluarga secara berkala.',
                'details' => [
                    'Pemeriksaan tumbuh kembang balita',
                    'Cek tensi dan gula darah lansia gratis',
                    'Pemberian Makanan Tambahan (PMT)',
                ],
                'event_date' => '2026-08-10',
                'day_label' => 'SENIN',
                'date_label' => '10 AGUSTUS 2026',
                'time_label' => '08:00 WIB - 12:00 WIB',
                'location' => 'Poskesdes Ngampungan',
                'organizer' => 'Kader Kesehatan Desa',
                'contact' => '0857-1234-5678 (Kader Utama)',
                'registration_required' => false,
                'status' => 'upcoming',
                'is_featured' => false,
            ],
            [
                'title' => 'Pelatihan Digital Marketing UMKM Desa',
                'category' => 'Pemberdayaan',
                'summary' => 'Workshop peningkatan kapasitas pemasaran online bagi para pelaku usaha kecil dan kerajinan lokal.',
                'details' => [
                    'Teknik foto produk menarik menggunakan ponsel',
                    'Pembuatan akun toko di e-commerce',
                    'Strategi promosi lewat media sosial',
                ],
                'event_date' => '2026-08-18',
                'day_label' => 'SELASA',
                'date_label' => '18 AGUSTUS 2026',
                'time_label' => '13:00 WIB - 16:30 WIB',
                'location' => 'Ruang Pertemuan BUMDes',
                'organizer' => 'Tim Penggerak PKK & BUMDes',
                'contact' => '0821-9876-5432 (Kader BUMDes)',
                'registration_required' => true,
                'status' => 'upcoming',
                'is_featured' => false,
            ],
        ];

        foreach ($agendas as $data) {
            Agenda::firstOrCreate(
                ['title' => $data['title']],
                [
                    'slug' => Agenda::generateUniqueSlug($data['title']),
                    'category' => $data['category'],
                    'summary' => $data['summary'],
                    'details' => $data['details'],
                    'event_date' => $data['event_date'],
                    'day_label' => $data['day_label'],
                    'date_label' => $data['date_label'],
                    'time_label' => $data['time_label'],
                    'location' => $data['location'],
                    'organizer' => $data['organizer'],
                    'contact' => $data['contact'],
                    'registration_required' => $data['registration_required'],
                    'status' => $data['status'],
                    'is_featured' => $data['is_featured'],
                ]
            );
        }
    }
}
