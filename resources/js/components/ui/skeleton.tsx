import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-2xl bg-slate-200/80 shadow-2xs", className)}
      {...props}
    />
  )
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="size-12 rounded-2xl" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
    </div>
  )
}

function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-slate-100 px-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-5 flex-1 rounded-md" />
      ))}
    </div>
  )
}

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col justify-between rounded-[24px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-2xl" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-5 w-48 rounded-lg" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </div>
      </div>
      <div className="my-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
        <Skeleton className="size-44 rounded-full shrink-0" />
        <div className="w-full space-y-2.5">
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export { Skeleton, CardSkeleton, TableRowSkeleton, ChartSkeleton }

