<?php

return [
    'services' => [
        'surat-keterangan-usaha' => [
            'title' => 'Surat Keterangan Usaha',
            'documents' => [
                'identity-card' => ['label' => 'KTP pemohon', 'required' => true],
                'family-card' => ['label' => 'Kartu Keluarga', 'required' => true],
                'neighbourhood-letter' => ['label' => 'Surat pengantar RT/RW', 'required' => true],
                'business-evidence' => ['label' => 'Bukti kegiatan usaha', 'required' => false],
            ],
        ],
        'surat-keterangan-domisili' => [
            'title' => 'Surat Keterangan Domisili',
            'documents' => [
                'identity-card' => ['label' => 'KTP pemohon', 'required' => true],
                'family-card' => ['label' => 'Kartu Keluarga', 'required' => true],
                'neighbourhood-letter' => ['label' => 'Surat pengantar RT/RW', 'required' => true],
            ],
        ],
        'surat-pengantar-skck' => [
            'title' => 'Surat Pengantar SKCK',
            'documents' => [
                'identity-card' => ['label' => 'KTP pemohon', 'required' => true],
                'family-card' => ['label' => 'Kartu Keluarga', 'required' => true],
                'neighbourhood-letter' => ['label' => 'Surat pengantar RT/RW', 'required' => true],
            ],
        ],
        'surat-keterangan-tidak-mampu' => [
            'title' => 'Surat Keterangan Tidak Mampu',
            'documents' => [
                'identity-card' => ['label' => 'KTP pemohon', 'required' => true],
                'family-card' => ['label' => 'Kartu Keluarga', 'required' => true],
                'neighbourhood-letter' => ['label' => 'Surat pengantar RT/RW', 'required' => true],
                'supporting-letter' => ['label' => 'Dokumen pendukung keperluan', 'required' => false],
            ],
        ],
        'pengantar-ktp-dan-kartu-keluarga' => [
            'title' => 'Pengantar KTP-el dan Kartu Keluarga',
            'documents' => [
                'family-card' => ['label' => 'Kartu Keluarga', 'required' => true],
                'identity-card' => ['label' => 'KTP lama', 'required' => false],
                'population-support' => ['label' => 'Dokumen pendukung perubahan data', 'required' => false],
            ],
        ],
        'surat-pindah-dan-datang' => [
            'title' => 'Surat Pindah dan Datang Penduduk',
            'documents' => [
                'identity-card' => ['label' => 'KTP pemohon', 'required' => true],
                'family-card' => ['label' => 'Kartu Keluarga', 'required' => true],
                'moving-support' => ['label' => 'Dokumen pendukung perpindahan', 'required' => true],
            ],
        ],
        'pengantar-akta-kelahiran' => [
            'title' => 'Pengantar Akta Kelahiran',
            'documents' => [
                'family-card' => ['label' => 'Kartu Keluarga', 'required' => true],
                'parents-identity' => ['label' => 'KTP kedua orang tua', 'required' => true],
                'birth-letter' => ['label' => 'Surat keterangan kelahiran', 'required' => true],
                'marriage-book' => ['label' => 'Buku nikah atau akta perkawinan', 'required' => false],
            ],
        ],
        'pelaporan-hasil-panen' => [
            'title' => 'Pelaporan Hasil Panen',
            'documents' => [
                'identity-card' => ['label' => 'KTP pemohon', 'required' => true],
                'harvest-recap' => ['label' => 'Rekap hasil panen', 'required' => true],
            ],
        ],
        'rekomendasi-kebutuhan-kelompok-tani' => [
            'title' => 'Rekomendasi Kebutuhan Kelompok Tani',
            'documents' => [
                'group-proposal' => ['label' => 'Proposal kebutuhan kelompok', 'required' => true],
                'member-list' => ['label' => 'Daftar anggota kelompok', 'required' => true],
            ],
        ],
        'pengaduan-infrastruktur-desa' => [
            'title' => 'Pengaduan Infrastruktur Desa',
            'documents' => [
                'identity-card' => ['label' => 'KTP pemohon', 'required' => false],
                'infrastructure-evidence' => ['label' => 'Foto kondisi dan lokasi', 'required' => true],
            ],
        ],
        'informasi-kondisi-darurat' => [
            'title' => 'Informasi Kondisi Darurat',
            'documents' => [
                'emergency-evidence' => ['label' => 'Foto kondisi bila aman', 'required' => false],
            ],
        ],
    ],
];
