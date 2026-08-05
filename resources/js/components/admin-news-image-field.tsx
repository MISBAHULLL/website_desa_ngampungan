import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';

type AdminImageUploadFieldProps = {
    title?: string;
    previewFallbackAlt?: string;
    currentImage?: string | null;
    imageUrl: string;
    imageAlt: string;
    imageError?: string;
    imageUrlError?: string;
    imageAltError?: string;
    onImageUrlChange: (value: string) => void;
    onImageAltChange: (value: string) => void;
    onFileChange?: (file: File | null) => void;
};

export function AdminImageUploadField({
    title = 'Foto / Dokumentasi Berita',
    previewFallbackAlt = 'Pratinjau gambar',
    currentImage,
    imageUrl,
    imageAlt,
    imageError,
    imageUrlError,
    imageAltError,
    onImageUrlChange,
    onImageAltChange,
    onFileChange,
}: AdminImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    const visiblePreview = previewUrl || imageUrl || currentImage;

    function clearSelectedFile() {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        setSelectedFile(null);
        setPreviewUrl(null);
        onFileChange?.(null);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    function selectFile(file: File | null) {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const nextPreviewUrl = file ? URL.createObjectURL(file) : null;
        previewUrlRef.current = nextPreviewUrl;
        setSelectedFile(file);
        setPreviewUrl(nextPreviewUrl);
        onFileChange?.(file);
    }

    return (
        <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
            <div className="flex items-center gap-2">
                <ImageIcon className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
            </div>

            {visiblePreview && (
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted">
                    <img
                        src={visiblePreview}
                        alt={imageAlt || previewFallbackAlt}
                        className="size-full object-cover"
                    />
                    {selectedFile && (
                        <button
                            type="button"
                            onClick={clearSelectedFile}
                            className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            aria-label="Batalkan gambar yang dipilih"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
            )}

            <div>
                <label
                    htmlFor="image"
                    className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-4 py-5 text-center transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
                >
                    <Upload className="size-5 text-emerald-700 dark:text-emerald-400" />
                    <span className="mt-2 text-sm font-bold text-foreground">
                        Pilih foto dari perangkat
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                        JPG, PNG, atau WebP · maksimal 3 MB
                    </span>
                    {selectedFile && (
                        <span className="mt-2 max-w-full truncate text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            {selectedFile.name}
                        </span>
                    )}
                </label>
                <input
                    ref={inputRef}
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event) =>
                        selectFile(event.target.files?.[0] ?? null)
                    }
                />
                <InputError message={imageError} className="mt-1" />
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-sidebar-border/70 after:h-px after:flex-1 after:bg-sidebar-border/70">
                atau gunakan URL
            </div>

            <div>
                <label
                    htmlFor="image_url"
                    className="block text-xs font-semibold text-muted-foreground"
                >
                    URL gambar (opsional)
                </label>
                <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={imageUrl}
                    onChange={(event) => onImageUrlChange(event.target.value)}
                    placeholder="https://..."
                    className="mt-1 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
                <InputError message={imageUrlError} className="mt-1" />
            </div>

            <div>
                <label
                    htmlFor="image_alt"
                    className="block text-xs font-semibold text-muted-foreground"
                >
                    Deskripsi foto (Alt Text)
                </label>
                <input
                    id="image_alt"
                    name="image_alt"
                    type="text"
                    value={imageAlt}
                    onChange={(event) => onImageAltChange(event.target.value)}
                    placeholder="Jelaskan isi foto secara singkat"
                    className="mt-1 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
                <InputError message={imageAltError} className="mt-1" />
            </div>
        </div>
    );
}
