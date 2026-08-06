import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    index as heroSlideIndex,
    store as heroSlideStore,
    update as heroSlideUpdate,
} from '@/actions/App/Http/Controllers/Admin/HeroSlideController';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type Props = {
    nextOrder: number;
    slide?: {
        id: number;
        title: string;
        subtitle?: string | null;
        description: string;
        primaryCtaText?: string | null;
        primaryCtaUrl?: string | null;
        secondaryCtaText?: string | null;
        secondaryCtaUrl?: string | null;
        backgroundImage?: string | null;
        order: number;
        isActive: boolean;
    };
};

export default function AdminHeroSlideCreate({ nextOrder, slide }: Props) {
    const { data, setData, post, processing, progress, errors } = useForm({
        _method: slide ? 'put' : 'post',
        title: slide?.title ?? '',
        subtitle: slide?.subtitle ?? '',
        description: slide?.description ?? '',
        primary_cta_text: slide?.primaryCtaText ?? '',
        primary_cta_url: slide?.primaryCtaUrl ?? '',
        secondary_cta_text: slide?.secondaryCtaText ?? '',
        secondary_cta_url: slide?.secondaryCtaUrl ?? '',
        background_image: null as File | null,
        remove_background_image: false,
        order: slide?.order ?? nextOrder,
        is_active: slide?.isActive ?? true,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const displayedImage =
        imagePreview ??
        (data.remove_background_image ? null : slide?.backgroundImage);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setData('background_image', file);
        setData('remove_background_image', false);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    }

    function removeImage() {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setData('background_image', null);
        setData('remove_background_image', Boolean(slide?.backgroundImage));
        setImagePreview(null);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(slide ? heroSlideUpdate.url(slide.id) : heroSlideStore.url(), {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title={slide ? 'Edit Hero Slide' : 'Tambah Hero Slide'} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="border-b border-sidebar-border/70 pb-6">
                    <Link
                        href={heroSlideIndex()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400"
                    >
                        <ArrowLeft className="size-3.5" />
                        Kembali ke Hero Slides
                    </Link>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                        {slide ? 'Edit Hero Slide' : 'Tambah Hero Slide'}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {slide
                            ? 'Perbarui konten, gambar latar, urutan, dan tombol CTA yang tampil pada halaman depan.'
                            : 'Siapkan judul, deskripsi, gambar latar, dan tombol yang akan tampil pada hero halaman depan.'}
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
                >
                    <div className="space-y-6">
                        <section className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs md:p-6">
                            <h2 className="text-lg font-bold text-foreground">
                                Konten utama
                            </h2>
                            <div className="mt-5 space-y-4">
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Judul <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        maxLength={255}
                                        value={data.title}
                                        onChange={(event) =>
                                            setData('title', event.target.value)
                                        }
                                        className="mt-1.5 min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        required
                                    />
                                    <InputError
                                        message={errors.title}
                                        className="mt-1.5"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="subtitle"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Subjudul
                                    </label>
                                    <input
                                        id="subtitle"
                                        maxLength={255}
                                        value={data.subtitle}
                                        onChange={(event) =>
                                            setData(
                                                'subtitle',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-1.5 min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                    <InputError
                                        message={errors.subtitle}
                                        className="mt-1.5"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Deskripsi{' '}
                                        <span aria-hidden="true">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={5}
                                        maxLength={1000}
                                        value={data.description}
                                        onChange={(event) =>
                                            setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        className="mt-1.5 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                        required
                                    />
                                    <InputError
                                        message={errors.description}
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs md:p-6">
                            <h2 className="text-lg font-bold text-foreground">
                                Tombol hero
                            </h2>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                Isi teks dan tujuan secara berpasangan. Tujuan
                                dapat berupa <code>/layanan</code>,{' '}
                                <code>#kontak</code>, atau URL HTTPS.
                            </p>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="primary_cta_text"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Teks tombol utama
                                    </label>
                                    <input
                                        id="primary_cta_text"
                                        maxLength={100}
                                        value={data.primary_cta_text}
                                        onChange={(event) =>
                                            setData(
                                                'primary_cta_text',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Lihat layanan"
                                        className="mt-1.5 min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                    <InputError
                                        message={errors.primary_cta_text}
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="primary_cta_url"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Tujuan tombol utama
                                    </label>
                                    <input
                                        id="primary_cta_url"
                                        maxLength={500}
                                        value={data.primary_cta_url}
                                        onChange={(event) =>
                                            setData(
                                                'primary_cta_url',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="/layanan"
                                        className="mt-1.5 min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                    <InputError
                                        message={errors.primary_cta_url}
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="secondary_cta_text"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Teks tombol kedua
                                    </label>
                                    <input
                                        id="secondary_cta_text"
                                        maxLength={100}
                                        value={data.secondary_cta_text}
                                        onChange={(event) =>
                                            setData(
                                                'secondary_cta_text',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Profil desa"
                                        className="mt-1.5 min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                    <InputError
                                        message={errors.secondary_cta_text}
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="secondary_cta_url"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Tujuan tombol kedua
                                    </label>
                                    <input
                                        id="secondary_cta_url"
                                        maxLength={500}
                                        value={data.secondary_cta_url}
                                        onChange={(event) =>
                                            setData(
                                                'secondary_cta_url',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="/profil-desa"
                                        className="mt-1.5 min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                    <InputError
                                        message={errors.secondary_cta_url}
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                            <h2 className="text-base font-bold text-foreground">
                                Gambar latar
                            </h2>
                            <div className="mt-4 overflow-hidden rounded-xl border border-dashed border-sidebar-border bg-muted/30">
                                {displayedImage ? (
                                    <div className="relative aspect-video">
                                        <img
                                            src={displayedImage}
                                            alt="Pratinjau gambar hero"
                                            className="size-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 inline-flex size-9 items-center justify-center rounded-lg bg-black/70 text-white transition hover:bg-black"
                                            aria-label="Hapus gambar pilihan"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 p-5 text-center text-muted-foreground transition hover:bg-muted/60">
                                        <ImagePlus className="size-7" />
                                        <span className="text-sm font-semibold">
                                            Pilih gambar
                                        </span>
                                        <span className="text-xs">
                                            JPG, PNG, atau WebP · maks. 3 MB
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className="sr-only"
                                        />
                                    </label>
                                )}
                            </div>
                            <InputError
                                message={errors.background_image}
                                className="mt-1.5"
                            />
                            {progress && (
                                <div className="mt-3" aria-live="polite">
                                    <div className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                        <span>Mengunggah gambar</span>
                                        <span>{progress.percentage}%</span>
                                    </div>
                                    <progress
                                        value={progress.percentage}
                                        max={100}
                                        className="h-1.5 w-full accent-emerald-700"
                                    />
                                </div>
                            )}
                        </section>

                        <section className="rounded-xl border border-sidebar-border/70 bg-background p-5 shadow-xs">
                            <div>
                                <label
                                    htmlFor="order"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Urutan slide
                                </label>
                                <input
                                    id="order"
                                    type="number"
                                    min={0}
                                    value={data.order}
                                    onChange={(event) =>
                                        setData(
                                            'order',
                                            Number(event.target.value),
                                        )
                                    }
                                    className="mt-1.5 min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                                <InputError
                                    message={errors.order}
                                    className="mt-1.5"
                                />
                            </div>

                            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-sidebar-border/70 p-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(event) =>
                                        setData(
                                            'is_active',
                                            event.target.checked,
                                        )
                                    }
                                    className="mt-0.5 size-4 accent-emerald-700"
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-foreground">
                                        Tampilkan slide
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                                        Slide aktif dapat muncul pada halaman
                                        depan.
                                    </span>
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <Save className="size-4" />
                                )}
                                {slide
                                    ? 'Simpan Perubahan'
                                    : 'Simpan Hero Slide'}
                            </button>
                        </section>
                    </aside>
                </form>
            </div>
        </>
    );
}

AdminHeroSlideCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Hero Slides', href: heroSlideIndex() },
        { title: 'Form Slide', href: '#' },
    ],
};
