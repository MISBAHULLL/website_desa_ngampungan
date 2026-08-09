import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2.5 py-1">
            <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                NAVIGASI UTAMA
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                                    active
                                        ? 'border border-emerald-600/20 bg-emerald-600/10 font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                                }`}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex items-center gap-3"
                                >
                                    {item.icon && (
                                        <item.icon
                                            className={`size-4.5 shrink-0 transition-colors ${
                                                active
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-slate-400 dark:text-slate-500'
                                            }`}
                                        />
                                    )}
                                    <span className="truncate">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
