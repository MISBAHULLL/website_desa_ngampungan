import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    FileText,
    Image as ImageIcon,
    Plus,
    Sparkles,
    Star,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
    index as newsIndex,
    store as newsStore,
} from '@/actions/App/Http/Controllers/Admin/NewsController';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { newsContentTemplates } from '@/lib/news-templates';
import type { NewsTemplate } from '@/lib/news-templates';
import { dashboard } from '@/routes';

const categories = [
    'Pertanian',
    'Kesehatan',
    'UMKM & Budaya',
    'Pembangunan',
    'Pemerintahan',
    'Pelayanan',
];

export default function AdminNewsCreate() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Pertanian');
    const [excerpt, setExcerpt] = useState('');
    const [contentParagraphs, setContentParagraphs] = useState<string[]>([
        '',
        '',
    ]);
    const [author, setAuthor] = useState('Admin Desa');
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [publishedAt, setPublishedAt] = useState(
        new Date().toISOString().slice(0, 16),
    );
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
        null,
    );

    function applyTemplate(template: NewsTemplate) {
        setSelectedTemplateId(template.id);
        setCategory(template.category);
        setExcerpt(template.excerptPlaceholder);
        setContentParagraphs([...template.content]);
    }

    function addParagraph() {
        setContentParagraphs([...contentParagraphs, '']);
    }

    function updateParagraph(index: number, value: string) {
        const next = [...contentParagraphs];
        next[index] = value;
        setContentParagraphs(next);
    }

    function removeParagraph(index: number) {
        if (contentParagraphs.length <= 1) return;
        const next = contentParagraphs.filter((_, i) => i !== index);
        setContentParagraphs(next);
    }

    return (
        <>
            <Head title="Tambah Berita Baru" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-center">
                    <div>
                        <Link
                            href={newsIndex()}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Kelola Berita</span>
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Tambah Berita Baru
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Tulis berita atau rilis informasi publik terbaru
                            untuk warga Desa Ngampungan.
                        </p>
                    </div>
                </header>

                {/* TEMPLATE SELECTOR CARD */}
                <section
                    aria-label="Pilih template konten konsisten"
                    className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-2xs dark:border-emerald-900/60 dark:bg-emerald-950/20"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="size-5 text-emerald-700 dark:text-emerald-400" />
                        <h2 className="text-base font-bold text-foreground">
                            Gunakan Template Konten Konsisten (Opsional)
                        </h2>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Pilih template untuk mengisi struktur paragraf berita
                        secara otomatis agar format publikasi selalu rapi dan
                        konsisten.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {newsContentTemplates.map((template) => {
                            const isSelected =
                                selectedTemplateId === template.id;
                            return (
                                <button
                                    key={template.id}
                                    type="button"
                                    onClick={() => applyTemplate(template)}
                                    className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                                        isSelected
                                            ? 'border-emerald-600 bg-background shadow-xs ring-2 ring-emerald-600/30'
                                            : 'border-sidebar-border/70 bg-background hover:border-emerald-400'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl">
                                                {template.icon}
                                            </span>
                                            {isSelected && (
                                                <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                                                    <Check className="size-3" />
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mt-2 text-sm font-bold text-foreground">
                                            {template.label}
                                        </h3>
                                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                            {template.description}
                                        </p>
                                    </div>
                                    <span className="mt-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                        Klik untuk gunakan →
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* FORM CREATE NEWS */}
                <Form {...newsStore.form()}>
                    {({ errors, processing }) => (
                        <div className="grid gap-6 lg:grid-cols-12">
                            {/* Main Content Area (Left 8 Cols) */}
                            <div className="space-y-6 lg:col-span-8">
                                {/* Title Input */}
                                <div className="rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="title"
                                            className="block text-sm font-bold text-foreground"
                                        >
                                            Judul Berita{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <span
                                            className={`text-xs font-semibold ${title.length >= 240 ? 'text-amber-600' : 'text-muted-foreground'}`}
                                        >
                                            {title.length} / 255 karakter
                                        </span>
                                    </div>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        required
                                        maxLength={255}
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        placeholder="Contoh: Panen Raya Padi Organik Kelompok Tani Maju Makmur"
                                        className="mt-2 min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-base font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                    <InputError
                                        message={errors.title}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Excerpt Input */}
                                <div className="rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label
                                                htmlFor="excerpt"
                                                className="block text-sm font-bold text-foreground"
                                            >
                                                Ringkasan Singkat (Excerpt){' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Ringkasan 1-2 kalimat yang
                                                tampil pada card depan di
                                                halaman publik.
                                            </p>
                                        </div>
                                        <span
                                            className={`shrink-0 text-xs font-semibold ${excerpt.length >= 280 ? 'text-amber-600' : 'text-muted-foreground'}`}
                                        >
                                            {excerpt.length} / 300 karakter
                                        </span>
                                    </div>
                                    <textarea
                                        id="excerpt"
                                        name="excerpt"
                                        rows={3}
                                        required
                                        maxLength={300}
                                        value={excerpt}
                                        onChange={(e) =>
                                            setExcerpt(e.target.value)
                                        }
                                        placeholder="Tuliskan ringkasan singkat berita..."
                                        className="mt-2 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    />
                                    <InputError
                                        message={errors.excerpt}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Structured Paragraph Content */}
                                <div className="rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div className="flex items-center justify-between border-b border-sidebar-border/70 pb-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-base font-bold text-foreground">
                                                    Isi Konten Berita (Paragraf){' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </h2>
                                                <span
                                                    className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                                                        contentParagraphs
                                                            .join(' ')
                                                            .trim()
                                                            .split(/\s+/)
                                                            .filter(Boolean)
                                                            .length > 1000
                                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                    }`}
                                                    title="Rekomendasi maksimal 1000 kata untuk keterbacaan publik"
                                                >
                                                    {
                                                        contentParagraphs
                                                            .join(' ')
                                                            .trim()
                                                            .split(/\s+/)
                                                            .filter(Boolean)
                                                            .length
                                                    }{' '}
                                                    / 1000 kata
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Tulis isi berita dalam paragraf
                                                terstruktur (disarankan sekitar
                                                300 - 1000 kata).
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addParagraph}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-muted/40 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                                        >
                                            <Plus className="size-3.5" />
                                            <span>Tambah Paragraf</span>
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        {contentParagraphs.map(
                                            (paragraph, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative rounded-xl border border-sidebar-border/60 bg-muted/20 p-3"
                                                >
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-xs font-bold text-muted-foreground">
                                                            Paragraf #
                                                            {index + 1}
                                                        </span>
                                                        {contentParagraphs.length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeParagraph(
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-xs text-red-500 hover:underline"
                                                            >
                                                                Hapus Paragraf
                                                            </button>
                                                        )}
                                                    </div>
                                                    <textarea
                                                        name={`content[${index}]`}
                                                        rows={3}
                                                        required
                                                        value={paragraph}
                                                        onChange={(e) =>
                                                            updateParagraph(
                                                                index,
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={`Tulis isi paragraf ke-${index + 1}...`}
                                                        className="w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    <InputError
                                        message={errors.content}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Sidebar Settings (Right 4 Cols) */}
                            <div className="space-y-6 lg:col-span-4">
                                {/* Featured Status Toggle */}
                                <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-2xs dark:border-amber-800/60 dark:bg-amber-950/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Star className="size-5 fill-amber-500 text-amber-500" />
                                            <span className="font-bold text-foreground">
                                                Berita Utama (Headline)
                                            </span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="is_featured"
                                            value="1"
                                            checked={isFeatured}
                                            onChange={(e) =>
                                                setIsFeatured(e.target.checked)
                                            }
                                            className="size-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                        Jika dicentang, berita ini akan
                                        dijadikan <strong>Berita Utama</strong>{' '}
                                        di banner besar halaman depan.
                                    </p>
                                </div>

                                {/* Category & Metadata */}
                                <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div>
                                        <label
                                            htmlFor="category"
                                            className="block text-xs font-bold text-muted-foreground uppercase"
                                        >
                                            Kategori Berita
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                            className="mt-1.5 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.category}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="author"
                                            className="block text-xs font-bold text-muted-foreground uppercase"
                                        >
                                            Penulis / Sumber
                                        </label>
                                        <input
                                            id="author"
                                            name="author"
                                            type="text"
                                            value={author}
                                            onChange={(e) =>
                                                setAuthor(e.target.value)
                                            }
                                            placeholder="Admin Desa"
                                            className="mt-1.5 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="published_at"
                                            className="block text-xs font-bold text-muted-foreground uppercase"
                                        >
                                            Tanggal & Waktu Terbit
                                        </label>
                                        <input
                                            id="published_at"
                                            name="published_at"
                                            type="datetime-local"
                                            value={publishedAt}
                                            onChange={(e) =>
                                                setPublishedAt(e.target.value)
                                            }
                                            className="mt-1.5 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                    </div>
                                </div>

                                {/* Image URL / Upload */}
                                <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="size-4 text-emerald-600" />
                                        <h3 className="text-sm font-bold text-foreground">
                                            Foto / Dokumentasi Berita
                                        </h3>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="image_url"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            URL Gambar (Unsplash/Hosting)
                                        </label>
                                        <input
                                            id="image_url"
                                            name="image_url"
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) =>
                                                setImageUrl(e.target.value)
                                            }
                                            placeholder="https://..."
                                            className="mt-1 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs outline-none focus:border-emerald-600"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="image_alt"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            Deskripsi Foto (Alt Text)
                                        </label>
                                        <input
                                            id="image_alt"
                                            name="image_alt"
                                            type="text"
                                            value={imageAlt}
                                            onChange={(e) =>
                                                setImageAlt(e.target.value)
                                            }
                                            placeholder="Deskripsi foto untuk aksesibilitas..."
                                            className="mt-1 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs outline-none focus:border-emerald-600"
                                        />
                                    </div>
                                </div>

                                {/* Publish Action Card */}
                                <div className="rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <FileText className="size-4" />
                                        )}
                                        <span>Terbitkan Berita</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminNewsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Kelola Berita',
            href: newsIndex(),
        },
        {
            title: 'Tambah Berita',
            href: newsIndex(),
        },
    ],
};
