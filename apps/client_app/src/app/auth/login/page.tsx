'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthSidebar } from '@/components/auth/AuthSidebar';
import { loginSchema, LoginFormData } from '@/lib/auth.schemas';
import { InvalidCredentialsError } from '@/lib/errors';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg('');
    try {
      await login(data.email, data.password);
      router.push('/feed');
    } catch (err: unknown) {
      if (InvalidCredentialsError.assert(err)) {
        setErrorMsg(t.auth.login.errors.invalidCredentials);
      } else {
        setErrorMsg(t.auth.login.errors.generic);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg-primary)]">
      <AuthSidebar title={t.common.appName} subtitle={t.auth.login.sidebarSubtitle} />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {t.auth.login.title}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t.auth.login.subtitle}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-[var(--error)] bg-opacity-10 border border-[var(--error)] rounded-lg">
              <p className="text-[var(--error)] text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t.auth.fields.email}
              type="email"
              placeholder={t.auth.fields.emailPlaceholder}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label={t.auth.fields.password}
              type="password"
              placeholder={t.auth.fields.passwordPlaceholder}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="text-right mb-6">
              <Link
                href="/auth/forgot-password"
                className="text-[var(--link)] hover:text-[var(--accent)] text-sm font-medium transition-colors"
              >
                {t.auth.login.forgotPassword}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              {t.auth.login.submitButton}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[var(--text-secondary)]">
              {t.auth.login.noAccount}{' '}
              <Link
                href="/auth/signup"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold transition-colors"
              >
                {t.auth.login.createAccount}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
