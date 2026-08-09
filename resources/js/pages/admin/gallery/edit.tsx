import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Play, Save, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import {
    index as galleryIndex,
    update as galleryUpdate,
} from '@/actions/App/Http/Controllers/Admin/GalleryController';
import { dashboard } from '@/routes';

type GalleryPhotoProps = {
    photo: {
        id: number;
        title: string;
        media_type: 'photo' | 'video';
        category: string;
        album: string;
        caption: string;
        image_path: string | null;
        image_alt: string | null;
        video_path: string | null;
        video_url: string | null;
        is_featured: boolean;
        captured_at: string | null;
    };
};

export default function AdminGalleryEdit({ photo }: GalleryPhotoProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT' as const,
        title: photo.title,
        media_type: photo.media_type || 'photo',
        category: photo.category,
        album: photo.album,
        caption: photo.caption,
        image: null as File | null,
        image_url: '',
        image_alt: photo.image_alt || '',
        video: null as File | null,
        video_url: photo.video_url || '',
        is_featured: photo.is_featured,
        captured_at: photo.captured_at ? photo.captured_at.split('T')[0] : '',
        remove_video: false,
    });

    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const videoFileRef = useRef<HTMLInputElement>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(galleryUpdate.url(photo.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                if (videoPreview) {
                    URL.revokeObjectURL(videoPreview);
                }
            },
        });
    }

    function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;

        if (file) {
            const maxSize = 100 * 1024 * 1024;

            if (file.size > maxSize) {
                alert(
                    `Ukuran video terlalu besar! Max 100MB. Video Anda: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
                );
                e.target.value = '';

                return;
            }

            setData((prev) => ({
                ...prev,
                video: file,
                video_url: '',
                remove_video: false,
            }));

            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }

            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        } else {
            setData('video', null);

            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }

            setVideoPreview(null);
        }
    }

    function handleRemoveVideo() {
        setData((prev) => ({
            ...prev,
            video: null,
            video_url: '',
            remove_video: true,
        }));

        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
        }

        setVideoPreview(null);

        if (videoFileRef.current) {
            videoFileRef.current.value = '';
        }
    }

    // The current video source to display (new preview takes priority)
    const currentVideoSrc =
        videoPreview || (!data.remove_video ? photo.video_path : null);
    const hasVideo =
        Boolean(currentVideoSrc) ||
        Boolean(data.video_url && !data.remove_video);

    // Extract just the filename for display
    function getFileName(path: string | null): string {
        if (!path) {
            return '';
        }

        const parts = path.split('/');

        return parts[parts.length - 1] || '';
    }

    // Cleanup preview URL on unmount
    React.useEffect(() => {
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

    return (
        <>
            <Head title={`Sunting: ${photo.title}`} />

            {/* Video Player Modal */}
            {showVideoModal && currentVideoSrc && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowVideoModal(false);
                        }
                    }}
                >
                    <div className="relative w-full max-w-3xl">
                        <button
                            type="button"
                            onClick={() => setShowVideoModal(false)}
                            className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
                        >
                            <X className="size-5" />
                        </button>
                        <video
                            key={currentVideoSrc}
                            src={currentVideoSrc}
                            controls
                            autoPlay
                            className="w-full rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            )}

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
                            Sunting{' '}
                            {data.media_type === 'photo' ? 'Foto' : 'Video'}{' '}
                            Galeri
                        </h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    {/* Global Error Banner */}
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                            <p className="text-sm font-bold text-red-800 dark:text-red-300">
                                ⚠️ Gagal menyimpan perubahan
                            </p>
                            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-red-700 dark:text-red-400">
                                {Object.entries(errors).map(
                                    ([key, message]) => (
                                        <li key={key}>{message}</li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-5 rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        {/* Current Media Preview */}
                        <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-muted/40 p-4">
                            <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-sidebar-border bg-muted">
                                {photo.media_type === 'photo' &&
                                photo.image_path ? (
                                    <img
                                        src={photo.image_path}
                                        alt={photo.image_alt || photo.title}
                                        className="size-full object-cover"
                                    />
                                ) : photo.media_type === 'video' && hasVideo ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            currentVideoSrc &&
                                            setShowVideoModal(true)
                                        }
                                        className="group relative size-full cursor-pointer"
                                    >
                                        {currentVideoSrc ? (
                                            <video
                                                src={currentVideoSrc}
                                                className="size-full object-cover"
                                                muted
                                            />
                                        ) : (
                                            <div className="flex size-full items-center justify-center bg-gray-800" />
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
                                            <Play
                                                className="size-6 text-white drop-shadow"
                                                fill="white"
                                            />
                                        </div>
                                    </button>
                                ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-foreground">
                                    Pratinjau{' '}
                                    {photo.media_type === 'photo'
                                        ? 'Foto'
                                        : 'Video'}{' '}
                                    Saat Ini
                                </p>
                                {photo.media_type === 'photo' ? (
                                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                        {getFileName(photo.image_path) || '-'}
                                    </p>
                                ) : hasVideo ? (
                                    <div className="mt-1 flex items-center gap-2">
                                        <p className="line-clamp-1 text-xs text-muted-foreground">
                                            {videoPreview
                                                ? 'Video baru dipilih'
                                                : getFileName(
                                                      photo.video_path,
                                                  ) || 'URL Video'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleRemoveVideo}
                                            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                                            title="Hapus video"
                                        >
                                            <X className="size-3" />
                                            Hapus
                                        </button>
                                    </div>
                                ) : (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Belum ada video
                                    </p>
                                )}
                            </div>
                            {/* Click to play hint for video */}
                            {photo.media_type === 'video' &&
                                currentVideoSrc && (
                                    <button
                                        type="button"
                                        onClick={() => setShowVideoModal(true)}
                                        className="shrink-0 rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <Play className="size-3.5" />
                                            Putar
                                        </span>
                                    </button>
                                )}
                        </div>

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
                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
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
                                    <option value="Alam &amp; Pertanian">
                                        Alam &amp; Pertanian
                                    </option>
                                </select>
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
                                    className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    required
                                />
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
                                className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                required
                            />
                        </div>

                        {/* Conditional Media Upload based on type */}
                        {data.media_type === 'photo' ? (
                            <>
                                {/* Replace Image */}
                                <div className="grid gap-5 border-t border-sidebar-border/70 pt-2 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="image"
                                            className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                        >
                                            Ganti Foto Baru (Opsional)
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
                                            Atau Ganti URL Foto
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
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Replace Video */}
                                <div className="grid gap-5 border-t border-sidebar-border/70 pt-2 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="video"
                                            className="block text-xs font-bold tracking-wider text-foreground uppercase"
                                        >
                                            Ganti Video Baru (Opsional)
                                        </label>
                                        <input
                                            ref={videoFileRef}
                                            id="video"
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                            className="mt-1.5 w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-emerald-800"
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Format: MP4, WebM, AVI, MOV (max
                                            100MB)
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
                                            Atau Ganti URL Video
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
                                    </div>
                                </div>
                            </>
                        )}

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
                            <Save className="size-4" />
                            <span>
                                {processing
                                    ? 'Menyimpan... Harap tunggu'
                                    : `Perbarui ${data.media_type === 'photo' ? 'Foto' : 'Video'}`}
                            </span>
                        </button>
                        <Link
                            href={galleryIndex()}
                            className="rounded-xl border border-sidebar-border/70 px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
                        >
                            Batal
                        </Link>
                        {processing && (
                            <div className="text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="size-4 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
                                    <span>
                                        Mengupload file... Jangan tutup halaman
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}

AdminGalleryEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Kelola Galeri', href: galleryIndex() },
        { title: 'Sunting', href: '#' },
    ],
};
