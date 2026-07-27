import { cn } from '@/lib/utils';

export type ServiceApplicationStatus =
    | 'submitted'
    | 'in_review'
    | 'needs_revision'
    | 'approved'
    | 'rejected'
    | 'completed';

const statusStyles: Record<ServiceApplicationStatus, string> = {
    submitted:
        'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200',
    in_review:
        'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-200',
    needs_revision:
        'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-200',
    approved:
        'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-800/60 dark:bg-teal-950/40 dark:text-teal-200',
    rejected:
        'border-red-200 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-200',
    completed:
        'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200',
};

export function ServiceApplicationStatusBadge({
    status,
    label,
    className,
}: {
    status: ServiceApplicationStatus;
    label: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-bold',
                statusStyles[status],
                className,
            )}
        >
            {label}
        </span>
    );
}
