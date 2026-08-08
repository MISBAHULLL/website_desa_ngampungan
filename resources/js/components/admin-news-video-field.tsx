import { Film, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { NewsMediaThumbnail } from '@/components/news-media-thumbnail';
import { getVideoEmbedUrl, isDirectVideoUrl } from '@/lib/video-media';

type AdminVideoUploadFieldProps = {
    title?: string;
    currentVideo?: string | null;
    videoUrl: string;
    videoError?: string;
    videoUrlError?: string;
    onVideoUrlChange: (value: string) => void;
    onFileChange?: (file: File | null) => void;
    onRemoveVideo?: (remove: boolean) => void;
    removeVideo?: boolean;
};

export function AdminVideoUploadField({
    title = 'Video Lampiran (Opsional)',
    currentVideo,
    videoUrl,
    videoError,
    videoUrlError,
    onVideoUrlChange,
    onFileChange,
    onRemoveVideo,
    removeVideo = false,
}: AdminVideoUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const [showVideoModal, setShowVideoModal] = useState(false);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    const visiblePreview = previewUrl || (!removeVideo ? currentVideo : null);
    const hasVideo =
        Boolean(visiblePreview) || Boolean(videoUrl && !removeVideo);
    const embedUrl = getVideoEmbedUrl(videoUrl);

    function clearSelectedFile() {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        setSelectedFile(null);
        setPreviewUrl(null);
        setLocalError(null);
        onFileChange?.(null);
        onVideoUrlChange('');
        onRemoveVideo?.(true);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    function selectFile(file: File | null) {
        setLocalError(null);

        if (file && file.size > 100 * 1024 * 1024) {
            setLocalError(
                'Ukuran file video melebihi batas maksimal (100 MB).',
            );

            if (inputRef.current) {
                inputRef.current.value = '';
            }

            return;
        }

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const nextPreviewUrl = file ? URL.createObjectURL(file) : null;
        previewUrlRef.current = nextPreviewUrl;
        setSelectedFile(file);
        setPreviewUrl(nextPreviewUrl);
        onFileChange?.(file);
        onVideoUrlChange('');
        onRemoveVideo?.(false);
    }

    return (
        <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
            <div className="flex items-center gap-2">
                <Film className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
            </div>

            <p className="text-xs text-muted-foreground">
                Tambahkan video untuk menggantikan gambar utama di halaman
                berita.
            </p>

            {hasVideo && (
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-slate-900 p-4 text-white shadow-sm">
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div
                            className="group relative cursor-pointer"
                            onClick={() => setShowVideoModal(true)}
                        >
                            <NewsMediaThumbnail
                                video={visiblePreview}
                                videoUrl={videoUrl}
                                alt="Video berita"
                                className="h-32 w-56 rounded-lg ring-1 ring-white/10 transition group-hover:ring-emerald-400"
                                imageClassName="opacity-75 transition group-hover:opacity-100"
                                showVideoLabel={false}
                            />
                        </div>
                        <div className="text-center">
                            <span className="text-xs font-semibold text-emerald-400">
                                Video saat ini
                            </span>
                            <p className="mt-1 max-w-xs truncate text-[11px] text-slate-400">
                                {selectedFile?.name ||
                                    videoUrl ||
                                    (currentVideo
                                        ? currentVideo.split('/').pop()
                                        : 'Video Terlampir')}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            clearSelectedFile();
                        }}
                        className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-red-500/20 text-red-400 transition hover:bg-red-500 hover:text-white"
                        title="Hapus Video"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            )}

            {!hasVideo && (
                <div>
                    <label
                        htmlFor="video"
                        className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-4 py-5 text-center transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
                    >
                        <Upload className="size-5 text-emerald-700 dark:text-emerald-400" />
                        <span className="mt-2 text-sm font-bold text-foreground">
                            Pilih video dari perangkat
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground">
                            MP4, WebM, AVI, MOV · maksimal 100 MB
                        </span>
                    </label>
                    <input
                        ref={inputRef}
                        id="video"
                        name="video"
                        type="file"
                        accept="video/mp4,video/webm,video/x-msvideo,video/quicktime"
                        className="sr-only"
                        onChange={(event) =>
                            selectFile(event.target.files?.[0] ?? null)
                        }
                    />
                    <InputError
                        message={localError || videoError}
                        className="mt-2"
                    />
                </div>
            )}

            <div className="flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-sidebar-border/70 after:h-px after:flex-1 after:bg-sidebar-border/70">
                atau gunakan URL (YouTube/Eksternal)
            </div>

            <div>
                <label
                    htmlFor="video_url"
                    className="block text-xs font-semibold text-muted-foreground"
                >
                    URL Video
                </label>
                <input
                    id="video_url"
                    name="video_url"
                    type="url"
                    value={videoUrl}
                    onChange={(event) => {
                        onVideoUrlChange(event.target.value);

                        if (event.target.value) {
                            onRemoveVideo?.(false);
                        }
                    }}
                    placeholder="https://youtube.com/watch?v=..."
                    className="mt-1 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
                <InputError message={videoUrlError} className="mt-1" />
            </div>

            {/* Video Player Modal */}
            {showVideoModal && visiblePreview && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowVideoModal(false);
                        }
                    }}
                >
                    <div className="relative w-full max-w-3xl">
                        <button
                            type="button"
                            onClick={() => setShowVideoModal(false)}
                            className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
                        >
                            <X className="size-5" />
                        </button>
                        <video
                            key={visiblePreview}
                            src={visiblePreview}
                            controls
                            autoPlay
                            className="w-full rounded-xl bg-black shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {showVideoModal && videoUrl && !visiblePreview && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowVideoModal(false);
                        }
                    }}
                >
                    <div className="relative w-full max-w-3xl">
                        <button
                            type="button"
                            onClick={() => setShowVideoModal(false)}
                            className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
                        >
                            <X className="size-5" />
                        </button>
                        <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-black shadow-2xl">
                            {isDirectVideoUrl(videoUrl) ? (
                                <video
                                    src={videoUrl}
                                    controls
                                    autoPlay
                                    className="size-full"
                                />
                            ) : (
                                <iframe
                                    src={embedUrl ?? undefined}
                                    title="Pratinjau video berita"
                                    className="size-full"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
