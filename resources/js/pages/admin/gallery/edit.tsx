import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import {
    index as galleryIndex,
    update as galleryUpdate,
} from '@/actions/App/Http/Controllers/Admin/GalleryController';
import { dashboard } from '@/routes';

type GalleryPhotoProps = {
    photo: {
        id: number;
        title: string;
        category: string;
        album: string;
        caption: string;
        image_path: string;
        image_alt: string | null;
        is_featured: boolean;
        captured_at: string | null;
    };
};

export default function AdminGalleryEdit({ photo }: GalleryPhotoProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: photo.title,
        category: photo.category,
        album: photo.album,
        caption: photo.caption,
        image: null as File | null,
        image_url: '',
        image_alt: photo.image_alt || '',
        is_featured: photo.is_featured,
        captured_at: photo.captured_at ? photo.captured_at.split('T')[0] : '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(galleryUpdate.url(photo.id));
    }

    return (
        <>
            <Head title={`Sunting Foto: ${photo.title}`} />

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
                            Sunting Foto Galeri
                        </h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    <div className="space-y-5 rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-xs">
                        {/* Image Preview */}
                        <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-muted/40 p-4">
                            <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-sidebar-border bg-muted">
                                <img
                                    src={photo.image_path}
                                    alt={photo.image_alt || photo.title}
                                    className="size-full object-cover"
                                />
                            </div>
                            <div className="text-xs text-muted-foreground">
                                <p className="font-bold text-foreground">
                                    Pratinjau Foto Saat Ini
                                </p>
                                <p className="mt-1 line-clamp-1">
                                    {photo.image_path}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="title"
                                className="block text-xs font-bold tracking-wider text-foreground uppercase"
                            >
                                Judul Foto *
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
                                    <option value="Alam & Pertanian">
                                        Alam & Pertanian
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
                                Keterangan Foto (Caption) *
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
                                        setData('image_url', e.target.value)
                                    }
                                    placeholder="https://..."
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
                            <Save className="size-4" />
                            <span>
                                {processing ? 'Menyimpan...' : 'Perbarui Foto'}
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

AdminGalleryEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Kelola Galeri', href: galleryIndex() },
        { title: 'Sunting Foto', href: '#' },
    ],
};
