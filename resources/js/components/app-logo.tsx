export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 py-1">
            <div className="flex aspect-square size-9.5 items-center justify-center rounded-xl bg-emerald-700/10 p-1.5 ring-1 ring-emerald-600/20">
                <img
                    src="/assets/logo_kabupaten_jombang.png"
                    alt="Logo Kabupaten Jombang"
                    className="h-7 w-5.5 object-contain"
                />
            </div>
            <div className="flex flex-col text-left leading-tight">
                <span className="truncate text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Desa Ngampungan
                </span>
                <span className="truncate text-[10px] font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                    Bareng, Kab. Jombang
                </span>
            </div>
        </div>
    );
}
