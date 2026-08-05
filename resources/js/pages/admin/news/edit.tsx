import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import {
    index as newsIndex,
    update as newsUpdate,
} from '@/actions/App/Http/Controllers/Admin/NewsController';
import { AdminImageUploadField } from '@/components/admin-news-image-field';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

type NewsItem = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string[];
    category: string;
    author: string;
    image_path: string | null;
    image_alt: string | null;
    is_featured: boolean;
    published_at: string;
};

type AdminNewsEditProps = {
    newsItem: NewsItem;
    categoryOptions: string[];
    otherCategoryLabel: string;
};

export default function AdminNewsEdit({
    newsItem,
    categoryOptions,
    otherCategoryLabel,
}: AdminNewsEditProps) {
    const [title, setTitle] = useState(newsItem.title || '');
    const isStandardCategory = categoryOptions.includes(newsItem.category);
    const [category, setCategory] = useState(
        isStandardCategory ? newsItem.category : otherCategoryLabel,
    );
    const [customCategory, setCustomCategory] = useState(
        isStandardCategory ? '' : newsItem.category,
    );
    const [excerpt, setExcerpt] = useState(newsItem.excerpt || '');
    const [contentParagraphs, setContentParagraphs] = useState<string[]>(
        Array.isArray(newsItem.content) && newsItem.content.length > 0
            ? newsItem.content
            : [''],
    );
    const [author, setAuthor] = useState(newsItem.author || 'Admin Desa');
    const [imageUrl, setImageUrl] = useState(
        newsItem.image_path?.startsWith('http') ? newsItem.image_path : '',
    );
    const [imageAlt, setImageAlt] = useState(newsItem.image_alt || '');
    const [isFeatured, setIsFeatured] = useState(newsItem.is_featured || false);
    const [publishedAt, setPublishedAt] = useState(
        newsItem.published_at
            ? new Date(newsItem.published_at).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
    );

    function addParagraph() {
        setContentParagraphs([...contentParagraphs, '']);
    }

    function updateParagraph(index: number, value: string) {
        const next = [...contentParagraphs];
        next[index] = value;
        setContentParagraphs(next);
    }

    function removeParagraph(index: number) {
        if (contentParagraphs.length <= 1) {
            return;
        }

        const next = contentParagraphs.filter((_, i) => i !== index);
        setContentParagraphs(next);
    }

    return (
        <>
            <Head title={`Sunting: ${newsItem.title}`} />

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
                            Sunting Berita
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Perbarui informasi berita atau status berita utama
                            untuk publikasi desa.
                        </p>
                    </div>
                </header>

                <Form {...newsUpdate.form(newsItem.id)}>
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
                                        <label
                                            htmlFor="excerpt"
                                            className="block text-sm font-bold text-foreground"
                                        >
                                            Ringkasan Singkat (Excerpt){' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <span
                                            className={`text-xs font-semibold ${excerpt.length >= 280 ? 'text-amber-600' : 'text-muted-foreground'}`}
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
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                            className="mt-1.5 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                                        >
                                            {categoryOptions.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                            <option value={otherCategoryLabel}>
                                                {otherCategoryLabel}
                                            </option>
                                        </select>
                                        <input
                                            type="hidden"
                                            name="category"
                                            value={
                                                category === otherCategoryLabel
                                                    ? customCategory
                                                    : category
                                            }
                                        />
                                        {category === otherCategoryLabel && (
                                            <div className="mt-3">
                                                <label
                                                    htmlFor="custom_category"
                                                    className="block text-xs font-semibold text-muted-foreground"
                                                >
                                                    Nama kategori lainnya
                                                </label>
                                                <input
                                                    id="custom_category"
                                                    type="text"
                                                    required
                                                    maxLength={100}
                                                    value={customCategory}
                                                    onChange={(event) =>
                                                        setCustomCategory(
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="mt-1 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                />
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Kategori ini otomatis masuk
                                                    filter “Lainnya” di website.
                                                </p>
                                            </div>
                                        )}
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

                                <AdminImageUploadField
                                    currentImage={newsItem.image_path}
                                    imageUrl={imageUrl}
                                    imageAlt={imageAlt}
                                    imageError={errors.image}
                                    imageUrlError={errors.image_url}
                                    imageAltError={errors.image_alt}
                                    onImageUrlChange={setImageUrl}
                                    onImageAltChange={setImageAlt}
                                />

                                {/* Submit Action Button */}
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
                                        <span>Simpan Perubahan</span>
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

AdminNewsEdit.layout = {
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
            title: 'Sunting Berita',
            href: newsIndex(),
        },
    ],
};
