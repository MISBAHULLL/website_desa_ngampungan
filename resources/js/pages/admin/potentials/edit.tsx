import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, Plus, Trash2, MapPin } from 'lucide-react';
import { useState } from 'react';
import {
    index as potentialsIndex,
    update as potentialsUpdate,
} from '@/actions/App/Http/Controllers/Admin/VillagePotentialController';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

const categoryOptions = [
    { value: 'umkm', label: 'UMKM' },
    { value: 'agriculture', label: 'Pertanian' },
    { value: 'tourism', label: 'Wisata' },
    { value: 'culture', label: 'Budaya' },
    { value: 'culinary', label: 'Kuliner' },
    { value: 'services', label: 'Jasa' },
];

type PotentialOffering = {
    id: number;
    name: string;
    description: string;
    image_path?: string | null;
    image_url?: string | null;
};

type PotentialItem = {
    id: number;
    slug: string;
    category: string;
    name: string;
    short_description: string;
    description: string[];
    manager_name: string;
    manager_label: string;
    address: string;
    phone: string;
    phone_label: string | null;
    opening_hours: string | null;
    latitude: number | null;
    longitude: number | null;
    location_label: string | null;
    tags: string[] | null;
    image_path: string | null;
    image_url: string | null;
    offerings?: PotentialOffering[];
};

export default function AdminPotentialsEdit({
    potential,
}: {
    potential: PotentialItem;
}) {
    const [name, setName] = useState(potential.name || '');
    const [category, setCategory] = useState(potential.category || 'umkm');
    const [shortDescription, setShortDescription] = useState(
        potential.short_description || '',
    );
    const [description, setDescription] = useState<string[]>(
        Array.isArray(potential.description) && potential.description.length > 0
            ? potential.description
            : [''],
    );
    const [managerLabel, setManagerLabel] = useState(
        potential.manager_label || 'Pemilik usaha',
    );
    const [managerName, setManagerName] = useState(
        potential.manager_name || '',
    );
    const [address, setAddress] = useState(potential.address || '');
    const [phone, setPhone] = useState(potential.phone || '');
    const [phoneLabel, setPhoneLabel] = useState(potential.phone_label || '');
    const [openingHours, setOpeningHours] = useState(
        potential.opening_hours || '',
    );
    const [latitude, setLatitude] = useState<string>(
        potential.latitude?.toString() || '',
    );
    const [longitude, setLongitude] = useState<string>(
        potential.longitude?.toString() || '',
    );
    const [locationLabel, setLocationLabel] = useState(
        potential.location_label || '',
    );
    const [tags, setTags] = useState<string[]>(
        Array.isArray(potential.tags) && potential.tags.length > 0
            ? potential.tags
            : [''],
    );

    // Offerings state
    const [offerings, setOfferings] = useState<
        {
            name: string;
            description: string;
            image_path?: string | null;
            image_url?: string | null;
            image?: File | null;
        }[]
    >(
        potential.offerings && potential.offerings.length > 0
            ? potential.offerings.map((o) => ({
                  name: o.name,
                  description: o.description,
                  image_path: o.image_path,
                  image_url: o.image_url,
                  image: null,
              }))
            : [{ name: '', description: '', image: null }],
    );

    function addParagraph() {
        setDescription([...description, '']);
    }

    function updateParagraph(index: number, value: string) {
        const next = [...description];
        next[index] = value;
        setDescription(next);
    }

    function removeParagraph(index: number) {
        if (description.length <= 1) {
return;
}

        setDescription(description.filter((_, i) => i !== index));
    }

    function addTag() {
        setTags([...tags, '']);
    }

    function updateTag(index: number, value: string) {
        const next = [...tags];
        next[index] = value;
        setTags(next);
    }

    function removeTag(index: number) {
        if (tags.length <= 1) {
return;
}

        setTags(tags.filter((_, i) => i !== index));
    }

    function addOffering() {
        setOfferings([
            ...offerings,
            { name: '', description: '', image: null },
        ]);
    }

    function updateOfferingName(index: number, value: string) {
        const next = [...offerings];
        next[index].name = value;
        setOfferings(next);
    }

    function updateOfferingDesc(index: number, value: string) {
        const next = [...offerings];
        next[index].description = value;
        setOfferings(next);
    }

    function updateOfferingImage(index: number, file: File | null) {
        const next = [...offerings];
        next[index].image = file;
        setOfferings(next);
    }

    function removeOffering(index: number) {
        if (offerings.length <= 1) {
return;
}

        setOfferings(offerings.filter((_, i) => i !== index));
    }

    return (
        <>
            <Head title={`Sunting Potensi: ${potential.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-sidebar-border/70 pb-6 md:flex-row md:items-center">
                    <div>
                        <Link
                            href={potentialsIndex()}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Kelola Potensi</span>
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            Sunting Potensi Desa
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Perbarui data UMKM, wisata, atau potensi warga
                            lainnya.
                        </p>
                    </div>
                </header>

                <Form {...potentialsUpdate.form(potential.id)}>
                    {({ errors, processing }) => (
                        <div className="grid gap-6 lg:grid-cols-12">
                            {/* Main Content Area (Left 8 Cols) */}
                            <div className="space-y-6 lg:col-span-8">
                                <div className="rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <h2 className="mb-4 text-base font-bold text-foreground">
                                        Informasi Utama
                                    </h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-bold text-foreground"
                                            >
                                                Nama Potensi / Usaha{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                maxLength={255}
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="mt-1 min-h-11 w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="short_description"
                                                className="block text-sm font-bold text-foreground"
                                            >
                                                Ringkasan Singkat{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                id="short_description"
                                                name="short_description"
                                                rows={2}
                                                required
                                                maxLength={500}
                                                value={shortDescription}
                                                onChange={(e) =>
                                                    setShortDescription(
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                            />
                                            <InputError
                                                message={
                                                    errors.short_description
                                                }
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Structured Paragraph Content */}
                                <div className="rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div className="flex items-center justify-between border-b border-sidebar-border/70 pb-4">
                                        <div>
                                            <h2 className="text-base font-bold text-foreground">
                                                Deskripsi Lengkap (Paragraf){' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </h2>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addParagraph}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted/80"
                                        >
                                            <Plus className="size-3.5" />
                                            <span>Tambah Paragraf</span>
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        {description.map((paragraph, index) => (
                                            <div
                                                key={index}
                                                className="group relative rounded-xl border border-sidebar-border/60 bg-muted/20 p-3"
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-xs font-bold text-muted-foreground">
                                                        Paragraf #{index + 1}
                                                    </span>
                                                    {description.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeParagraph(
                                                                    index,
                                                                )
                                                            }
                                                            className="text-xs text-red-500 hover:underline"
                                                        >
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                                <textarea
                                                    name={`description[${index}]`}
                                                    rows={3}
                                                    required
                                                    value={paragraph}
                                                    onChange={(e) =>
                                                        updateParagraph(
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-sidebar-border/70 bg-background p-3 text-sm outline-none focus:border-emerald-600"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Offerings */}
                                <div className="rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div className="flex items-center justify-between border-b border-sidebar-border/70 pb-4">
                                        <div>
                                            <h2 className="text-base font-bold text-foreground">
                                                Produk & Layanan (Offerings)
                                            </h2>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Daftar layanan atau produk
                                                unggulan yang ditawarkan.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addOffering}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted/80"
                                        >
                                            <Plus className="size-3.5" />
                                            <span>Tambah Layanan</span>
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        {offerings.map((offering, index) => (
                                            <div
                                                key={index}
                                                className="rounded-xl border border-sidebar-border/60 p-4"
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-xs font-bold text-muted-foreground">
                                                        Layanan #{index + 1}
                                                    </span>
                                                    {offerings.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeOffering(
                                                                    index,
                                                                )
                                                            }
                                                            className="text-xs text-red-500 hover:underline"
                                                        >
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-muted-foreground">
                                                            Nama Layanan/Produk{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <input
                                                            name={`offerings[${index}][name]`}
                                                            type="text"
                                                            required
                                                            value={
                                                                offering.name
                                                            }
                                                            onChange={(e) =>
                                                                updateOfferingName(
                                                                    index,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-muted-foreground">
                                                            Deskripsi Singkat{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            name={`offerings[${index}][description]`}
                                                            rows={2}
                                                            required
                                                            value={
                                                                offering.description
                                                            }
                                                            onChange={(e) =>
                                                                updateOfferingDesc(
                                                                    index,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background p-2 text-sm outline-none focus:border-emerald-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-muted-foreground">
                                                            Foto Produk/Layanan
                                                            (Opsional)
                                                        </label>
                                                        {offering.image_path &&
                                                            !offering.image && (
                                                                <div className="mt-2 mb-2 aspect-video w-32 overflow-hidden rounded-md border border-sidebar-border/70">
                                                                    <img
                                                                        src={
                                                                            offering.image_url ??
                                                                            offering.image_path
                                                                        }
                                                                        alt={
                                                                            offering.name
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                        <input
                                                            type="hidden"
                                                            name={`offerings[${index}][image_path]`}
                                                            value={
                                                                offering.image_path ||
                                                                ''
                                                            }
                                                        />
                                                        <input
                                                            type="file"
                                                            name={`offerings[${index}][image]`}
                                                            accept="image/jpeg,image/png,image/webp"
                                                            onChange={(e) =>
                                                                updateOfferingImage(
                                                                    index,
                                                                    e.target
                                                                        .files?.[0] ||
                                                                        null,
                                                                )
                                                            }
                                                            className="mt-1 w-full text-xs text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                                                        />
                                                        {offering.image_path && (
                                                            <p className="mt-1 text-[10px] text-muted-foreground">
                                                                Biarkan kosong
                                                                jika tidak ingin
                                                                mengubah foto.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError
                                        message={errors.offerings}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Sidebar Settings (Right 4 Cols) */}
                            <div className="space-y-6 lg:col-span-4">
                                {/* Category */}
                                <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div>
                                        <label
                                            htmlFor="category"
                                            className="block text-xs font-bold text-muted-foreground uppercase"
                                        >
                                            Kategori Potensi{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                            className="mt-1.5 min-h-10 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                                        >
                                            {categoryOptions.map((cat) => (
                                                <option
                                                    key={cat.value}
                                                    value={cat.value}
                                                >
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.category}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Management & Contact Info */}
                                <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <h3 className="text-sm font-bold text-foreground">
                                        Kontak & Pengelola
                                    </h3>

                                    <div>
                                        <label
                                            htmlFor="manager_name"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            Nama Pengelola{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="manager_name"
                                            name="manager_name"
                                            type="text"
                                            required
                                            value={managerName}
                                            onChange={(e) =>
                                                setManagerName(e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                        <InputError
                                            message={errors.manager_name}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="manager_label"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            Label Jabatan (Contoh: Pemilik
                                            Usaha){' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="manager_label"
                                            name="manager_label"
                                            type="text"
                                            required
                                            value={managerLabel}
                                            onChange={(e) =>
                                                setManagerLabel(e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                        <InputError
                                            message={errors.manager_label}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            Nomor Telepon/WhatsApp{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="text"
                                            required
                                            placeholder="+628123456789"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                        <InputError
                                            message={errors.phone}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone_label"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            Label Telepon Tampil (Opsional)
                                        </label>
                                        <input
                                            id="phone_label"
                                            name="phone_label"
                                            type="text"
                                            placeholder="0812-3456-789"
                                            value={phoneLabel}
                                            onChange={(e) =>
                                                setPhoneLabel(e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                    </div>
                                </div>

                                {/* Location Info */}
                                <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4 text-emerald-600" />
                                        <h3 className="text-sm font-bold text-foreground">
                                            Lokasi & Jam Operasional
                                        </h3>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="address"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            Alamat Lengkap{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            rows={2}
                                            required
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background p-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                        <InputError
                                            message={errors.address}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="opening_hours"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            Jam Operasional (Opsional)
                                        </label>
                                        <input
                                            id="opening_hours"
                                            name="opening_hours"
                                            type="text"
                                            placeholder="Senin-Sabtu, 08:00 - 16:00"
                                            value={openingHours}
                                            onChange={(e) =>
                                                setOpeningHours(e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label
                                                htmlFor="latitude"
                                                className="block text-xs font-semibold text-muted-foreground"
                                            >
                                                Latitude
                                            </label>
                                            <input
                                                id="latitude"
                                                name="latitude"
                                                type="text"
                                                value={latitude}
                                                onChange={(e) =>
                                                    setLatitude(e.target.value)
                                                }
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="longitude"
                                                className="block text-xs font-semibold text-muted-foreground"
                                            >
                                                Longitude
                                            </label>
                                            <input
                                                id="longitude"
                                                name="longitude"
                                                type="text"
                                                value={longitude}
                                                onChange={(e) =>
                                                    setLongitude(e.target.value)
                                                }
                                                className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="location_label"
                                            className="block text-xs font-semibold text-muted-foreground"
                                        >
                                            Label Titik Peta
                                        </label>
                                        <input
                                            id="location_label"
                                            name="location_label"
                                            type="text"
                                            value={locationLabel}
                                            onChange={(e) =>
                                                setLocationLabel(e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                        />
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-foreground">
                                            Tags (Kata Kunci)
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="text-xs font-bold text-emerald-600 hover:underline"
                                        >
                                            + Tambah Tag
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-1 rounded-md border border-sidebar-border/70 bg-background p-1"
                                            >
                                                <input
                                                    name={`tags[${index}]`}
                                                    type="text"
                                                    value={tag}
                                                    onChange={(e) =>
                                                        updateTag(
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-24 bg-transparent px-1 text-xs outline-none"
                                                    placeholder="tag..."
                                                />
                                                {tags.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(index)
                                                        }
                                                        className="text-muted-foreground hover:text-red-500"
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <h3 className="mb-3 text-sm font-bold text-foreground">
                                        Foto / Gambar Cover
                                    </h3>
                                    {potential.image_url && (
                                        <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg border border-sidebar-border/70">
                                            <img
                                                src={potential.image_url}
                                                alt={potential.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Biarkan kosong jika tidak ingin mengubah
                                        foto.
                                    </p>
                                    <InputError
                                        message={errors.image}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Submit Action Button */}
                                <div className="rounded-xl border border-sidebar-border/70 bg-background p-5">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <FileText className="size-4" />
                                        )}
                                        <span>Simpan Perubahan</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminPotentialsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Potensi Desa', href: potentialsIndex() },
        { title: 'Sunting', href: '' },
    ],
};
