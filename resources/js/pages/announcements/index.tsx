import { Head, usePage } from '@inertiajs/react';
import { Archive, BellRing } from 'lucide-react';
import { useState } from 'react';
import { PublicAnnouncementCard } from '@/components/public-announcement-card';
import { PublicPageShell } from '@/components/public-page-shell';
import {
    activeDummyAnnouncements,
    archivedDummyAnnouncements,
} from '@/lib/dummy-public-content';

type AnnouncementTab = 'active' | 'archived';

type AnnouncementIndexProps = {
    dbAnnouncements?: Array<{
        id: number;
        title: string;
        slug: string;
        summary: string;
        content?: string[] | null;
        priority: 'normal' | 'important' | 'emergency';
        status: 'active' | 'archived';
        pinned: boolean;
        startsAt: string;
        endsAt?: string | null;
        periodLabel: string;
    }>;
};

export default function AnnouncementIndex({
    dbAnnouncements,
}: AnnouncementIndexProps) {
    const [activeTab, setActiveTab] = useState<AnnouncementTab>('active');

    const activeList = dbAnnouncements && dbAnnouncements.length > 0
        ? dbAnnouncements.filter((a) => a.status === 'active')
        : activeDummyAnnouncements;

    const archivedList = dbAnnouncements && dbAnnouncements.length > 0
        ? dbAnnouncements.filter((a) => a.status === 'archived')
        : archivedDummyAnnouncements;

    const visibleAnnouncements = activeTab === 'active' ? activeList : archivedList;

    return (
        <PublicPageShell activeSection="announcements">
            <Head title="Pengumuman Desa" />

            <section className="border-b border-village-border bg-white">
                <div className="mx-auto max-w-[1280px] px-5 py-14 md:py-20 lg:px-12">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold tracking-[0.2em] text-village-primary uppercase">
                            Informasi Resmi
                        </p>
                        <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight text-village-ink md:text-6xl">
                            Pengumuman Desa
                        </h1>
                        <p className="mt-5 text-lg leading-8 text-village-muted">
                            Informasi pelayanan, kegiatan, dan pemberitahuan
                            penting dari Pemerintah Desa Ngampungan.
                        </p>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="announcement-list-heading"
                className="py-12 md:py-16"
            >
                <div className="mx-auto max-w-[1000px] px-5">
                    <div
                        className="inline-flex rounded-2xl border border-village-border bg-white p-1.5 shadow-sm"
                        role="tablist"
                        aria-label="Status pengumuman"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'active'}
                            onClick={() => setActiveTab('active')}
                            className={
                                activeTab === 'active'
                                    ? 'inline-flex min-h-11 items-center gap-2 rounded-xl bg-village-primary px-4 py-2.5 text-sm font-bold text-white'
                                    : 'inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:text-village-primary'
                            }
                        >
                            <BellRing aria-hidden="true" className="size-4" />
                            Aktif ({activeList.length})
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'archived'}
                            onClick={() => setActiveTab('archived')}
                            className={
                                activeTab === 'archived'
                                    ? 'inline-flex min-h-11 items-center gap-2 rounded-xl bg-village-primary px-4 py-2.5 text-sm font-bold text-white'
                                    : 'inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-village-muted transition hover:text-village-primary'
                            }
                        >
                            <Archive aria-hidden="true" className="size-4" />
                            Arsip ({archivedList.length})
                        </button>
                    </div>

                    <div className="mt-9 flex items-end justify-between gap-5">
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-village-primary uppercase">
                                Informasi Desa Ngampungan
                            </p>
                            <h2
                                id="announcement-list-heading"
                                className="mt-2 text-2xl font-bold md:text-3xl"
                            >
                                {activeTab === 'active'
                                    ? 'Pengumuman Aktif'
                                    : 'Arsip Pengumuman'}
                            </h2>
                        </div>
                        <p
                            aria-live="polite"
                            className="text-sm font-medium text-village-muted"
                        >
                            {visibleAnnouncements.length} pengumuman
                        </p>
                    </div>

                    <div role="tabpanel" className="mt-7 grid gap-5">
                        {visibleAnnouncements.map((announcement) => (
                            <PublicAnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </PublicPageShell>
    );
}
