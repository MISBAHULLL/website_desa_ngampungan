import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Camera, Upload } from 'lucide-react';
import {
    index as galleryIndex,
    store as galleryStore,
} from '@/actions/App/Http/Controllers/Admin/GalleryController';
import { dashboard } from '@/routes';

export default function AdminGalleryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        media_type: 'photo' as 'photo' | 'video',
        category: 'Kegiatan Desa',
        album: '',
        caption: '',
        image: null as File | null,
        image_url: '',
        image_alt: '',
        video: null as File | null,
        video_url: '',
        is_featured: false,
        captured_at: new Date().toISOString().split('T')[0],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(galleryStore.url());
    }

    return (
        <>
            <Head title="Unggah Foto Galeri Baru" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-end">
                    <div>
                        <Link
                            href={galleryIndex()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Kelola Galeri</span>
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Unggah{' '}
                            {data.media_type === 'photo' ? 'Foto' : 'Video'}{' '}
                            Galeri Baru
                        </h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    <div className="space-y-5 rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        {/* Media Type Selector */}
                        <div>
                            <label className="mb-3 block text-xs font-bold tracking-wider text-foreground uppercase">
                                Tipe Media *
                            </label>
                            <div className="flex gap-4">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        name="media_type"
                                        value="photo"
                                        checked={data.media_type === 'photo'}
                                        onChange={() =>
                                            setData('media_type', 'photo')
                                        }
                                        className="size-4 text-emerald-700 focus:ring-emerald-600"
                                    />
                                    <Camera className="size-4" />
                                    <span className="text-sm font-semibold">
                                        Foto
                                    </span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        name="media_type"
                                        value="video"
                                        checked={data.media_type === 'video'}
                                        onChange={() =>
                                            setData('media_type', 'video')
                                        }
                                        className="size-4 text-emerald-700 focus:ring-emerald-600"
                                    />
                                    <svg
                                        className="size-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="text-sm font-semibold">
                                        Video
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="title"
                                className="block text-xs font-bold tracking-wider text-foreground uppercase"
                            >
                                Judul{' '}
                                {data.media_type === 'photo' ? 'Foto' : 'Video'}{' '}
                                *
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder={
                                    data.media_type === 'photo'
                                        ? 'Contoh: Panen Raya Padi Organik...'
                                        : 'Contoh: Dokumentasi Musyawarah Desa...'
                                }
                                className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Kategori *
                                </label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                >
                                    <option value="Kegiatan Desa">
                                        Kegiatan Desa
                                    </option>
                                    <option value="Pembangunan">
                                        Pembangunan
                                    </option>
                                    <option value="UMKM">UMKM</option>
                                    <option value="Alam & Pertanian">
                                        Alam & Pertanian
                                    </option>
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="album"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Nama Album *
                                </label>
                                <input
                                    id="album"
                                    type="text"
                                    value={data.album}
                                    onChange={(e) =>
                                        setData('album', e.target.value)
                                    }
                                    placeholder="Contoh: Musyawarah Desa 2026..."
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
                                {errors.album && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.album}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="caption"
                                className="block text-xs font-bold tracking-wider text-foreground uppercase"
                            >
                                Keterangan{' '}
                                {data.media_type === 'photo' ? 'Foto' : 'Video'}{' '}
                                (Caption) *
                            </label>
                            <textarea
                                id="caption"
                                rows={3}
                                value={data.caption}
                                onChange={(e) =>
                                    setData('caption', e.target.value)
                                }
                                placeholder={
                                    data.media_type === 'photo'
                                        ? 'Jelaskan ringkas mengenai foto atau momen kegiatan yang tertangkap...'
                                        : 'Jelaskan ringkas mengenai isi video atau momen kegiatan...'
                                }
                                className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                required
                            />
                            {errors.caption && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.caption}
                                </p>
                            )}
                        </div>

                        {/* Conditional Media Upload based on type */}
                        {data.media_type === 'photo' ? (
                            <>
                                {/* Image Upload or URL */}
                                <div className="grid gap-5 border-t border-sidebar-border/70 pt-2 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="image"
                                            className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                        >
                                            Unggah Berkas Gambar (Max 4MB)
                                        </label>
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData(
                                                    'image',
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            className="mt-1.5 w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-emerald-800"
                                        />
                                        {errors.image && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="image_url"
                                            className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                        >
                                            Atau Gunakan URL Gambar (Opsional)
                                        </label>
                                        <input
                                            id="image_url"
                                            type="url"
                                            value={data.image_url}
                                            onChange={(e) =>
                                                setData(
                                                    'image_url',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://..."
                                            className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        {errors.image_url && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.image_url}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Video Upload or URL */}
                                <div className="grid gap-5 border-t border-sidebar-border/70 pt-2 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="video"
                                            className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                        >
                                            Unggah Berkas Video (Max 100MB)
                                        </label>
                                        <input
                                            id="video"
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) =>
                                                setData(
                                                    'video',
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            className="mt-1.5 w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-emerald-800"
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Format: MP4, WebM, AVI, MOV
                                        </p>
                                        {errors.video && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.video}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="video_url"
                                            className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                        >
                                            Atau URL Video (YouTube/Vimeo)
                                        </label>
                                        <input
                                            id="video_url"
                                            type="url"
                                            value={data.video_url}
                                            onChange={(e) =>
                                                setData(
                                                    'video_url',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Gunakan link YouTube atau Vimeo
                                        </p>
                                        {errors.video_url && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.video_url}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="image_alt"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Alt Text Gambar (Aksesibilitas)
                                </label>
                                <input
                                    id="image_alt"
                                    type="text"
                                    value={data.image_alt}
                                    onChange={(e) =>
                                        setData('image_alt', e.target.value)
                                    }
                                    placeholder="Deskripsi singkat gambar untuk pembaca layar..."
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="captured_at"
                                    className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                >
                                    Tanggal Foto Diambil
                                </label>
                                <input
                                    id="captured_at"
                                    type="date"
                                    value={data.captured_at}
                                    onChange={(e) =>
                                        setData('captured_at', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                id="is_featured"
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) =>
                                    setData('is_featured', e.target.checked)
                                }
                                className="size-4 rounded border-sidebar-border text-emerald-700 focus:ring-emerald-600"
                            />
                            <label
                                htmlFor="is_featured"
                                className="text-xs font-bold text-foreground"
                            >
                                Jadikan Sorotan Utama Galeri
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                        >
                            <Upload className="size-4" />
                            <span>
                                {processing
                                    ? 'Menyimpan...'
                                    : `Simpan & Unggah ${data.media_type === 'photo' ? 'Foto' : 'Video'}`}
                            </span>
                        </button>
                        <Link
                            href={galleryIndex()}
                            className="rounded-xl border border-sidebar-border/70 px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminGalleryCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Kelola Galeri', href: galleryIndex() },
        { title: 'Unggah Foto Baru', href: '#' },
    ],
};
