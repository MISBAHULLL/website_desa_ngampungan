const directVideoExtensions = /\.(mp4|webm|mov|avi)(?:$|[?#])/i;

export function isDirectVideoUrl(value?: string | null): boolean {
    return Boolean(value && directVideoExtensions.test(value));
}

function parseUrl(value: string): URL | null {
    try {
        return new URL(value);
    } catch {
        return null;
    }
}

export function getYouTubeVideoId(value?: string | null): string | null {
    if (!value) {
        return null;
    }

    const url = parseUrl(value);

    if (!url) {
        return null;
    }

    const hostname = url.hostname.replace(/^www\./, '');

    if (hostname === 'youtu.be') {
        return url.pathname.split('/').filter(Boolean)[0] ?? null;
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
        if (url.pathname === '/watch') {
            return url.searchParams.get('v');
        }

        const [prefix, id] = url.pathname.split('/').filter(Boolean);

        if (['embed', 'shorts', 'live'].includes(prefix)) {
            return id ?? null;
        }
    }

    return null;
}

export function getVideoThumbnailUrl(value?: string | null): string | null {
    const youtubeId = getYouTubeVideoId(value);

    return youtubeId
        ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
        : null;
}

export function getVideoEmbedUrl(value?: string | null): string | null {
    if (!value) {
        return null;
    }

    const youtubeId = getYouTubeVideoId(value);

    if (youtubeId) {
        return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
    }

    const url = parseUrl(value);

    if (url?.hostname.replace(/^www\./, '') === 'vimeo.com') {
        const videoId = url.pathname.split('/').filter(Boolean)[0];

        if (videoId) {
            return `https://player.vimeo.com/video/${videoId}`;
        }
    }

    return value;
}
