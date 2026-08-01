// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Kata Sandi - Desa Ngampungan" />

            {status && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-800">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="nama@contoh.com"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm font-medium focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="mt-4 flex items-center justify-start">
                                <Button
                                    className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-600/35 active:scale-[0.99] disabled:opacity-70"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-white" />
                                    )}
                                    Kirim Tautan Atur Ulang
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-center text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
                    <span>Kembali ke halaman</span>{' '}
                    <TextLink href={login()} className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
                        Masuk Akun
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Lupa Kata Sandi',
    description: 'Masukkan alamat email Anda untuk menerima tautan atur ulang kata sandi',
};

