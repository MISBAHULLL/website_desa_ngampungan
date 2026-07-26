import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Newspaper, UserRound } from 'lucide-react';
import { PublicNewsCard } from '@/components/public-news-card';
import { PublicPageShell } from '@/components/public-page-shell';
import {
    findDummyNewsArticle,
    getRelatedDummyNewsArticles,
} from '@/lib/dummy-public-content';
import { index as newsIndex } from '@/routes/news';

export default function NewsShow({ slug }: { slug: string }) {
    const article = findDummyNewsArticle(slug);

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
                            Slug dummy ini tidak tersedia. Pada fase backend,
                            kondisi ini akan ditangani sebagai HTTP 404.
                        </p>
                        <Link
                            href={newsIndex()}
                            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-village-primary px-5 py-3 font-bold text-white transition hover:bg-village-primary-dark"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Kembali ke daftar berita
                        </Link>
                    </div>
                </section>
            </PublicPageShell>
        );
    }

    const relatedArticles = getRelatedDummyNewsArticles(article);

    return (
        <PublicPageShell activeSection="news">
            <Head title={article.title}>
                <meta name="description" content={article.excerpt} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
                <meta property="og:image" content={article.image} />
            </Head>

            <article>
                <header className="border-b border-village-border bg-white">
                    <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
                        <Link
                            href={newsIndex()}
                            className="inline-flex items-center gap-2 text-sm font-bold text-village-primary hover:text-village-primary-dark"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Semua Berita
                        </Link>
                        <p className="mt-8 text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            {article.category}
                        </p>
                        <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight text-village-ink md:text-6xl">
                            {article.title}
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-village-muted md:text-xl">
                            {article.excerpt}
                        </p>
                        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-village-border pt-6 text-sm text-village-muted">
                            <span className="flex items-center gap-2">
                                <UserRound
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                {article.author}
                            </span>
                            <span className="flex items-center gap-2">
                                <CalendarDays
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                <time dateTime={article.publishedAt}>
                                    {article.publishedLabel}
                                </time>
                            </span>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
                    <figure className="overflow-hidden rounded-3xl border border-village-border bg-white shadow-village-soft">
                        <img
                            src={article.image}
                            alt={article.alt}
                            className="aspect-video w-full object-cover"
                        />
                    </figure>

                    <div className="mx-auto mt-10 max-w-3xl space-y-6 text-base leading-8 text-village-ink/85 md:text-lg md:leading-9">
                        {article.content.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </article>

            {relatedArticles.length > 0 && (
                <section
                    aria-labelledby="related-news-heading"
                    className="border-t border-village-border bg-village-surface-muted py-14 md:py-20"
                >
                    <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
                        <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                            Kategori {article.category}
                        </p>
                        <h2
                            id="related-news-heading"
                            className="mt-3 text-3xl font-bold tracking-tight"
                        >
                            Artikel Terkait
                        </h2>
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
