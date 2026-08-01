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
                <span className="truncate text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Desa Ngampungan
                </span>
                <span className="truncate text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Bareng, Kab. Jombang
                </span>
            </div>
        </div>
    );
}

