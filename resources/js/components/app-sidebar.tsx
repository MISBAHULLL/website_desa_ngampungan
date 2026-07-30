import { Link } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    Camera,
    ClipboardList,
    FolderGit2,
    LayoutGrid,
    Megaphone,
    MessagesSquare,
    Newspaper,
} from 'lucide-react';
import { index as agendasIndex } from '@/actions/App/Http/Controllers/Admin/AgendaController';
import { index as announcementsIndex } from '@/actions/App/Http/Controllers/Admin/AnnouncementController';
import { index as contactMessagesIndex } from '@/actions/App/Http/Controllers/Admin/ContactMessageController';
import { index as galleryIndex } from '@/actions/App/Http/Controllers/Admin/GalleryController';
import { index as newsIndex } from '@/actions/App/Http/Controllers/Admin/NewsController';
import { index as serviceApplicationsIndex } from '@/actions/App/Http/Controllers/Admin/ServiceApplicationController';
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
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
        title: 'Pesan Masuk',
        href: contactMessagesIndex(),
        icon: MessagesSquare,
    },
    {
        title: 'Pengajuan Layanan',
        href: serviceApplicationsIndex(),
        icon: ClipboardList,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
