import { Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import type { NewsArticle } from '@/lib/dummy-public-content';
import { show as newsShow } from '@/routes/news';

export function PublicNewsCard({ article }: { article: NewsArticle }) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-village-border bg-white transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-village-primary/30 hover:shadow-village-floating motion-reduce:transform-none motion-reduce:transition-none">
            <Link
                href={newsShow(article.slug)}
                prefetch
                className="relative block aspect-4/3 overflow-hidden focus-visible:ring-2 focus-visible:ring-village-primary focus-visible:outline-none focus-visible:ring-inset"
            >
                <img
                    src={article.image}
                    alt={article.alt}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                />
                <span className="absolute top-4 left-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-bold text-village-primary-dark shadow-sm backdrop-blur">
                    {article.category}
                </span>
            </Link>

            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs text-village-muted">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    <time dateTime={article.publishedAt}>
                        {article.publishedLabel}
                    </time>
                </div>
                <h2 className="mt-3 text-xl leading-snug font-bold">
                    <Link
                        href={newsShow(article.slug)}
                        prefetch
                        className="transition-colors hover:text-village-primary focus-visible:underline focus-visible:outline-none"
                    >
                        {article.title}
                    </Link>
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-village-muted">
                    {article.excerpt}
                </p>
                <Link
                    href={newsShow(article.slug)}
                    prefetch
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-village-primary transition-colors hover:text-village-primary-dark focus-visible:underline focus-visible:outline-none"
                >
                    Baca selengkapnya
                    <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                    />
                </Link>
            </div>
        </article>
    );
}
