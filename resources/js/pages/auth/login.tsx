import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk Akun - Desa Ngampungan" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-bold text-slate-800"
                                >
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nama@contoh.com"
                                    className="auth-input h-12 rounded-2xl border-slate-200 bg-slate-50/60 px-4.5 text-base font-medium transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:h-13"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2.5">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-bold text-slate-800"
                                    >
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline sm:text-sm"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="auth-input h-12 rounded-2xl border-slate-200 bg-slate-50/60 px-4.5 text-base font-medium transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:h-13"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="size-5 rounded-md border-slate-300 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-medium text-slate-600 select-none"
                                >
                                    Ingat saya di perangkat ini
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-13 w-full rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-base font-extrabold text-white shadow-xl shadow-emerald-600/30 transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-600/40 active:scale-[0.99] disabled:opacity-70 sm:h-14"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && (
                                    <Spinner className="mr-2.5 size-5 border-2 border-white/30 border-t-white" />
                                )}
                                Masuk Sekarang
                            </Button>
                        </div>

                        <p className="border-t border-slate-100 pt-4 text-center text-sm font-medium text-slate-600">
                            Akses khusus administrator Desa Ngampungan.
                        </p>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-800">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke Akun Anda',
    description:
        'Masukkan email dan kata sandi Anda untuk mengakses portal digital Desa Ngampungan',
};
