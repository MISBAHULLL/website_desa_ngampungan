import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    Check,
    ChevronRight,
    Clock,
    Copy,
    Home,
    Newspaper,
    Share2,
    Tag,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { PublicNewsCard } from '@/components/public-news-card';
import { PublicPageShell } from '@/components/public-page-shell';
import type { NewsArticle } from '@/lib/dummy-public-content';
import {
    findDummyNewsArticle,
    getRelatedDummyNewsArticles,
} from '@/lib/dummy-public-content';
import { getVideoEmbedUrl, isDirectVideoUrl } from '@/lib/video-media';
import { index as newsIndex } from '@/routes/news';

export default function NewsShow({
    slug,
    dbArticle,
    relatedArticles: dbRelatedArticles,
}: {
    slug: string;
    dbArticle?: NewsArticle | null;
    relatedArticles?: NewsArticle[];
}) {
    const article = dbArticle || findDummyNewsArticle(slug);
    const videoEmbedUrl = getVideoEmbedUrl(article?.videoUrl);
    const relatedArticles =
        dbRelatedArticles && dbRelatedArticles.length > 0
            ? dbRelatedArticles
            : article
              ? getRelatedDummyNewsArticles(article)
              : [];

    // State for copy link action feedback
    const [isCopied, setIsCopied] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            const currentUrl = window.location.href;
            navigator.clipboard
                .writeText(currentUrl)
                .then(() => {
                    setIsCopied(true);
                    setShowToast(true);
                    setTimeout(() => setIsCopied(false), 3000);
                    setTimeout(() => setShowToast(false), 3500);
                })
                .catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = currentUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    setIsCopied(true);
                    setShowToast(true);
                    setTimeout(() => setIsCopied(false), 3000);
                    setTimeout(() => setShowToast(false), 3500);
                });
        }
    };

    if (!article) {
        return (
            <PublicPageShell activeSection="news">
                <Head title="Berita Tidak Ditemukan" />
                <section className="px-5 py-24 lg:px-12">
                    <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-village-border bg-white px-6 py-16 text-center shadow-village-soft">
                        <Newspaper
                            aria-hidden="true"
                            className="mx-auto size-12 text-village-muted"
                        />
                        <h1 className="mt-5 text-3xl font-bold">
                            Berita tidak ditemukan
                        </h1>
                        <p className="mt-3 leading-7 text-village-muted">
                            Artikel berita yang Anda cari tidak ditemukan atau
                            telah dipindahkan.
                        </p>
                        <Link
                            href={newsIndex()}
                            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-village-primary px-6 py-3 font-bold text-white transition hover:bg-village-primary-dark"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Kembali ke daftar berita
                        </Link>
                    </div>
                </section>
            </PublicPageShell>
        );
    }

    // Estimate total reading time based on total word count
    const totalWords = article.content.join(' ').split(/\s+/).length;
    const estimatedReadMinutes = Math.max(1, Math.ceil(totalWords / 180));

    return (
        <PublicPageShell activeSection="news">
            <Head title={article.title}>
                <meta name="description" content={article.excerpt} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
                <meta property="og:image" content={article.image} />
            </Head>

            {/* Floating Toast Feedback for Link Copied */}
            {showToast && (
                <div className="fixed right-6 bottom-6 z-50 flex animate-in items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl transition-all duration-300 fade-in slide-in-from-bottom-4">
                    <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500 font-bold text-slate-950">
                        <Check className="size-3.5 stroke-[3]" />
                    </div>
                    <span>Tautan berita berhasil disalin ke clipboard!</span>
                </div>
            )}

            {/* Top Breadcrumb Navigation Bar */}
            <nav
                aria-label="Breadcrumb"
                className="border-b border-village-border/80 bg-village-surface-muted/60 py-3.5 backdrop-blur-sm"
            >
                <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10">
                    <ol className="flex items-center gap-1.5 text-xs font-medium text-village-muted sm:text-sm">
                        <li>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 text-slate-600 transition-colors hover:text-village-primary"
                            >
                                <Home className="size-3.5" />
                                <span>Beranda</span>
                            </Link>
                        </li>
                        <ChevronRight className="size-3.5 shrink-0 text-slate-400" />
                        <li>
                            <Link
                                href={newsIndex()}
                                className="text-slate-600 transition-colors hover:text-village-primary"
                            >
                                Kabar Desa
                            </Link>
                        </li>
                        <ChevronRight className="size-3.5 shrink-0 text-slate-400" />
                        <li className="max-w-[180px] truncate font-semibold text-village-primary-dark sm:max-w-xs">
                            {article.category}
                        </li>
                    </ol>

                    <Link
                        href={newsIndex()}
                        className="inline-flex items-center gap-2 rounded-lg border border-village-border/90 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-village-primary hover:text-village-primary"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span className="hidden sm:inline">
                            Kembali ke
                        </span>{' '}
                        Semua Berita
                    </Link>
                </div>
            </nav>

            <article className="bg-white">
                {/* Article Hero Header */}
                <header className="border-b border-village-border/60 bg-gradient-to-b from-emerald-50/40 via-white to-white py-10 md:py-14">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        {/* Category & Badge */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-village-primary/20 bg-village-primary/10 px-3.5 py-1 text-xs font-bold tracking-wider text-village-primary-dark uppercase">
                                <Tag className="size-3" />
                                {article.category}
                            </span>
                            {article.featured && (
                                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                                    Berita Utama
                                </span>
                            )}
                        </div>

                        {/* Article Title */}
                        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl md:leading-[1.18]">
                            {article.title}
                        </h1>

                        {/* Excerpt Lead Text */}
                        <p className="mt-5 border-l-4 border-village-primary/60 py-0.5 pl-4 text-lg leading-relaxed font-normal text-slate-600 md:text-xl">
                            {article.excerpt}
                        </p>

                        {/* Dynamic Metadata Bar */}
                        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-village-border/80 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-600 sm:text-sm">
                                {/* Dynamic Author Field */}
                                <span className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-full bg-village-primary-light font-bold text-village-primary-dark">
                                        <UserRound className="size-4" />
                                    </div>
                                    <span
                                        className="font-semibold text-slate-800"
                                        title="Penulis / Kontributor Berita"
                                    >
                                        {article.author}
                                    </span>
                                </span>

                                {/* Dynamic Creation/Publication Date */}
                                <span
                                    className="flex items-center gap-1.5"
                                    title="Tanggal Diterbitkan oleh Admin"
                                >
                                    <CalendarDays className="size-4 text-village-primary" />
                                    <time dateTime={article.publishedAt}>
                                        {article.publishedLabel}
                                    </time>
                                </span>

                                {/* Estimated Reading Time */}
                                <span
                                    className="flex items-center gap-1.5"
                                    title="Estimasi Waktu Baca"
                                >
                                    <Clock className="size-4 text-village-primary" />
                                    <span>
                                        {estimatedReadMinutes} menit baca
                                    </span>
                                </span>
                            </div>

                            {/* Share / Copy Link Action Button */}
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition ${
                                    isCopied
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-village-primary hover:text-white'
                                }`}
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="size-3.5" />
                                        <span>Tautan Disalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="size-3.5" />
                                        <span>Bagikan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content & Cover Image Container */}
                <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
                    {/* Media: Video or Featured Image */}
                    {article.video ? (
                        <figure className="overflow-hidden rounded-3xl border border-village-border bg-slate-950 shadow-village-floating">
                            <video
                                src={article.video}
                                controls
                                className="aspect-video w-full object-cover"
                            />
                            {article.alt && (
                                <figcaption className="border-t border-slate-800 bg-slate-900 px-5 py-3 text-center text-xs font-medium text-slate-300">
                                    {article.alt}
                                </figcaption>
                            )}
                        </figure>
                    ) : article.videoUrl ? (
                        <figure className="overflow-hidden rounded-3xl border border-village-border bg-slate-950 shadow-village-floating">
                            {isDirectVideoUrl(article.videoUrl) ? (
                                <video
                                    src={article.videoUrl}
                                    controls
                                    playsInline
                                    className="aspect-video w-full object-cover"
                                />
                            ) : (
                                <iframe
                                    src={videoEmbedUrl ?? undefined}
                                    title={article.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="aspect-video w-full"
                                />
                            )}
                            {article.alt && (
                                <figcaption className="border-t border-slate-800 bg-slate-900 px-5 py-3 text-center text-xs font-medium text-slate-300">
                                    {article.alt}
                                </figcaption>
                            )}
                        </figure>
                    ) : article.image ? (
                        <figure className="overflow-hidden rounded-3xl border border-village-border bg-slate-100 shadow-village-floating">
                            <img
                                src={article.image}
                                alt={article.alt || article.title}
                                className="aspect-[16/9] w-full object-cover transition-transform duration-700 hover:scale-[1.01]"
                            />
                            {article.alt && (
                                <figcaption className="border-t border-slate-200/80 bg-slate-50 px-5 py-3 text-center text-xs font-medium text-slate-500">
                                    {article.alt}
                                </figcaption>
                            )}
                        </figure>
                    ) : null}

                    {/* Article Body Content */}
                    <div className="mx-auto mt-10 space-y-7 text-base leading-relaxed text-slate-800 md:text-lg md:leading-loose">
                        {article.content.map((paragraph, index) => {
                            if (index === 0) {
                                return (
                                    <p
                                        key={index}
                                        className="text-lg leading-relaxed font-medium text-slate-900 md:text-xl"
                                    >
                                        {paragraph}
                                    </p>
                                );
                            }

                            return (
                                <p key={index} className="text-slate-700">
                                    {paragraph}
                                </p>
                            );
                        })}
                    </div>

                    {/* Bottom Salin Tautan Action Bar */}
                    <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-b border-village-border py-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Copy className="size-4 text-village-primary" />
                            <span>
                                Bagikan berita ini kepada warga lainnya:
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition ${
                                isCopied
                                    ? 'bg-emerald-600 text-white'
                                    : 'border border-village-border bg-white text-slate-700 hover:border-village-primary hover:bg-slate-50 hover:text-village-primary'
                            }`}
                        >
                            {isCopied ? (
                                <>
                                    <Check className="size-4" />
                                    <span>Tautan Berita Disalin!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="size-4" />
                                    <span>Salin Tautan Berita</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </article>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
                <section
                    aria-labelledby="related-news-heading"
                    className="border-t border-village-border bg-village-surface-muted py-14 md:py-20"
                >
                    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
                        <div className="flex flex-col justify-between gap-4 border-b border-village-border pb-6 md:flex-row md:items-end">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-village-primary uppercase">
                                    Rekomendasi Bacaan
                                </p>
                                <h2
                                    id="related-news-heading"
                                    className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl"
                                >
                                    Artikel Terkait
                                </h2>
                            </div>
                            <Link
                                href={newsIndex()}
                                className="inline-flex items-center gap-2 text-sm font-bold text-village-primary hover:text-village-primary-dark"
                            >
                                Lihat Semua Berita
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {relatedArticles.map((relatedArticle) => (
                                <PublicNewsCard
                                    key={relatedArticle.slug}
                                    article={relatedArticle}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicPageShell>
    );
}
