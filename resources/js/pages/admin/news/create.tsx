import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    FileText,
    Plus,
    Sparkles,
    Star,
} from 'lucide-react';
import { useState } from 'react';
import {
    index as newsIndex,
    store as newsStore,
} from '@/actions/App/Http/Controllers/Admin/NewsController';
import { AdminImageUploadField } from '@/components/admin-news-image-field';
import { AdminVideoUploadField } from '@/components/admin-news-video-field';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { newsContentTemplates } from '@/lib/news-templates';
import type { NewsTemplate } from '@/lib/news-templates';
import { dashboard } from '@/routes';

type AdminNewsCreateProps = {
    categoryOptions: string[];
    otherCategoryLabel: string;
};

export default function AdminNewsCreate({
    categoryOptions,
    otherCategoryLabel,
}: AdminNewsCreateProps) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(categoryOptions[0] ?? 'Pertanian');
    const [customCategory, setCustomCategory] = useState('');
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
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
        null,
    );

    function applyTemplate(template: NewsTemplate) {
        setSelectedTemplateId(template.id);
        setCategory(template.category);
        setCustomCategory('');
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
        if (contentParagraphs.length <= 1) {
            return;
        }

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
                <Form
                    {...newsStore.form()}
                    transform={(data) => ({
                        ...data,
                        media_type: mediaType,
                        video: videoFile,
                        video_url: videoUrl,
                        remove_image: removeImage,
                    })}
                >
                    {({ errors, processing }) => {
                        const hasErrors = Object.keys(errors).length > 0;
                        const serverError =
                            errors.video ||
                            errors.image ||
                            (hasErrors
                                ? 'Terdapat kesalahan pada isian form. Silakan periksa kembali.'
                                : null);

                        return (
                            <div className="grid gap-6 lg:grid-cols-12">
                                {/* Global Error Banner */}
                                {serverError && (
                                    <div className="lg:col-span-12">
                                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                                            <AlertCircle className="mt-0.5 size-5 shrink-0" />
                                            <div>
                                                <h3 className="text-sm font-bold">
                                                    Gagal Menyimpan Berita
                                                </h3>
                                                <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                                                    <ul className="list-inside list-disc">
                                                        {Object.entries(
                                                            errors,
                                                        ).map(
                                                            ([field, msg]) => (
                                                                <li key={field}>
                                                                    {msg}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                                        Isi Konten Berita
                                                        (Paragraf){' '}
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
                                                    Tulis isi berita dalam
                                                    paragraf terstruktur
                                                    (disarankan sekitar 300 -
                                                    1000 kata).
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
                                                                    Hapus
                                                                    Paragraf
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
                                                                    e.target
                                                                        .value,
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
                                                    setIsFeatured(
                                                        e.target.checked,
                                                    )
                                                }
                                                className="size-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                            Jika dicentang, berita ini akan
                                            dijadikan{' '}
                                            <strong>Berita Utama</strong> di
                                            banner besar halaman depan.
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
                                                    <option
                                                        key={cat}
                                                        value={cat}
                                                    >
                                                        {cat}
                                                    </option>
                                                ))}
                                                <option
                                                    value={otherCategoryLabel}
                                                >
                                                    {otherCategoryLabel}
                                                </option>
                                            </select>
                                            <input
                                                type="hidden"
                                                name="category"
                                                value={
                                                    category ===
                                                    otherCategoryLabel
                                                        ? customCategory
                                                        : category
                                                }
                                            />
                                            {category ===
                                                otherCategoryLabel && (
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
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="Contoh: Pendidikan"
                                                        className="mt-1 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                    />
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Kategori ini otomatis
                                                        masuk filter “Lainnya”
                                                        di website.
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
                                            <div className="mt-1.5 flex gap-2">
                                                <input
                                                    id="published_at_date"
                                                    type="date"
                                                    value={
                                                        publishedAt
                                                            ? publishedAt.split(
                                                                  'T',
                                                              )[0]
                                                            : ''
                                                    }
                                                    onChange={(e) => {
                                                        const date =
                                                            e.target.value;
                                                        const time =
                                                            publishedAt &&
                                                            publishedAt.includes(
                                                                'T',
                                                            )
                                                                ? publishedAt.split(
                                                                      'T',
                                                                  )[1]
                                                                : '00:00';
                                                        setPublishedAt(
                                                            date
                                                                ? `${date}T${time}`
                                                                : '',
                                                        );
                                                    }}
                                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                />
                                                <input
                                                    id="published_at_time"
                                                    type="time"
                                                    value={
                                                        publishedAt &&
                                                        publishedAt.includes(
                                                            'T',
                                                        )
                                                            ? publishedAt.split(
                                                                  'T',
                                                              )[1]
                                                            : ''
                                                    }
                                                    onChange={(e) => {
                                                        const time =
                                                            e.target.value ||
                                                            '00:00';
                                                        const date = publishedAt
                                                            ? publishedAt.split(
                                                                  'T',
                                                              )[0]
                                                            : new Date()
                                                                  .toISOString()
                                                                  .slice(0, 10);
                                                        setPublishedAt(
                                                            `${date}T${time}`,
                                                        );
                                                    }}
                                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                />
                                            </div>
                                            <input
                                                type="hidden"
                                                name="published_at"
                                                value={publishedAt}
                                            />
                                        </div>
                                    </div>

                                    {/* Media Type Toggle */}
                                    <div className="space-y-3 rounded-xl border border-sidebar-border/70 bg-muted/30 p-5">
                                        <h3 className="text-sm font-bold text-foreground">
                                            Tipe Media Utama
                                        </h3>
                                        <div className="flex gap-4">
                                            <label className="flex cursor-pointer items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="media_type"
                                                    value="photo"
                                                    checked={
                                                        mediaType === 'photo'
                                                    }
                                                    onChange={() =>
                                                        setMediaType('photo')
                                                    }
                                                    className="h-4 w-4 border-sidebar-border/70 text-emerald-600 focus:ring-emerald-600"
                                                />
                                                <span className="text-sm">
                                                    Foto
                                                </span>
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="media_type"
                                                    value="video"
                                                    checked={
                                                        mediaType === 'video'
                                                    }
                                                    onChange={() =>
                                                        setMediaType('video')
                                                    }
                                                    className="h-4 w-4 border-sidebar-border/70 text-emerald-600 focus:ring-emerald-600"
                                                />
                                                <span className="text-sm">
                                                    Video
                                                </span>
                                            </label>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Pilih salah satu media utama yang
                                            akan ditampilkan di paling atas
                                            artikel.
                                        </p>
                                    </div>

                                    {mediaType === 'photo' && (
                                        <AdminImageUploadField
                                            imageUrl={imageUrl}
                                            imageAlt={imageAlt}
                                            imageError={errors.image}
                                            imageUrlError={errors.image_url}
                                            imageAltError={errors.image_alt}
                                            onImageUrlChange={setImageUrl}
                                            onImageAltChange={setImageAlt}
                                            onRemoveImage={setRemoveImage}
                                            removeImage={removeImage}
                                        />
                                    )}

                                    {mediaType === 'video' && (
                                        <AdminVideoUploadField
                                            videoUrl={videoUrl}
                                            videoError={errors.video}
                                            videoUrlError={errors.video_url}
                                            onVideoUrlChange={setVideoUrl}
                                            onFileChange={setVideoFile}
                                        />
                                    )}

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
                        );
                    }}
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
