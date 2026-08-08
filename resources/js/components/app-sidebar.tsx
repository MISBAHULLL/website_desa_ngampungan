import { Link } from '@inertiajs/react';
import {
    CalendarDays,
    Camera,
    ClipboardList,
    FileText,
    Globe,
    ImagePlay,
    Landmark,
    LayoutGrid,
    LayoutList,
    Megaphone,
    MessagesSquare,
    Network,
    Newspaper,
    Store,
    WalletCards,
    UserCog,
    Users,
} from 'lucide-react';
import { index as agendasIndex } from '@/actions/App/Http/Controllers/Admin/AgendaController';
import { index as announcementsIndex } from '@/actions/App/Http/Controllers/Admin/AnnouncementController';
import { index as apbdesIndex } from '@/actions/App/Http/Controllers/Admin/ApbdesController';
import { index as contactMessagesIndex } from '@/actions/App/Http/Controllers/Admin/ContactMessageController';
import { index as galleryIndex } from '@/actions/App/Http/Controllers/Admin/GalleryController';
import { index as heroSlidesIndex } from '@/actions/App/Http/Controllers/Admin/HeroSlideController';
import { index as newsIndex } from '@/actions/App/Http/Controllers/Admin/NewsController';
import { index as orgStructureIndex } from '@/actions/App/Http/Controllers/Admin/OrganizationStructureController';
import { index as potentialsIndex } from '@/actions/App/Http/Controllers/Admin/VillagePotentialController';
import { index as serviceApplicationsIndex } from '@/actions/App/Http/Controllers/Admin/ServiceApplicationController';
import { index as villageInstitutionsIndex } from '@/actions/App/Http/Controllers/Admin/VillageInstitutionController';
import { index as villageServicesIndex } from '@/actions/App/Http/Controllers/Admin/VillageServiceController';
import { index as villageLeadersIndex } from '@/actions/App/Http/Controllers/Admin/VillageLeaderController';
import { index as villageOfficialsIndex } from '@/actions/App/Http/Controllers/Admin/VillageOfficialController';
import { index as villageProfileIndex } from '@/actions/App/Http/Controllers/Admin/VillageProfileController';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Profil Desa',
        href: villageProfileIndex(),
        icon: FileText,
    },
    {
        title: 'Hero Slides',
        href: heroSlidesIndex(),
        icon: ImagePlay,
    },
    {
        title: 'Kepala Desa',
        href: villageLeadersIndex(),
        icon: UserCog,
    },
    {
        title: 'Kelola Berita',
        href: newsIndex(),
        icon: Newspaper,
    },
    {
        title: 'Kelola Pengumuman',
        href: announcementsIndex(),
        icon: Megaphone,
    },
    {
        title: 'Kelola Galeri',
        href: galleryIndex(),
        icon: Camera,
    },
    {
        title: 'Kelola Agenda',
        href: agendasIndex(),
        icon: CalendarDays,
    },
    {
        title: 'Potensi Desa',
        href: potentialsIndex(),
        icon: Store,
    },
    {
        title: 'Perangkat Desa',
        href: villageOfficialsIndex(),
        icon: Users,
    },
    {
        title: 'Lembaga Desa',
        href: villageInstitutionsIndex(),
        icon: Landmark,
    },
    {
        title: 'Struktur Organisasi',
        href: orgStructureIndex(),
        icon: Network,
    },
    {
        title: 'Kelola APBDes',
        href: apbdesIndex(),
        icon: WalletCards,
    },
    {
        title: 'Pesan Masuk',
        href: contactMessagesIndex(),
        icon: MessagesSquare,
    },
    {
        title: 'Manajemen Layanan',
        href: villageServicesIndex(),
        icon: LayoutList,
    },
    {
        title: 'Pengajuan Layanan',
        href: serviceApplicationsIndex(),
        icon: ClipboardList,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Lihat Portal Utama',
        href: home(),
        icon: Globe,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-slate-200/80 dark:border-slate-800"
        >
            <SidebarHeader className="border-b border-slate-100 px-3 py-3 dark:border-slate-800/80">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="rounded-2xl transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-100 pt-2 dark:border-slate-800/80">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
