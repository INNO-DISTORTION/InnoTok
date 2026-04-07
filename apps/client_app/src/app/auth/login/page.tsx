'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');

  const loginSchema = z.object({
    email: z.string().email(t('login.validation.invalidEmail')),
    password: z.string().min(1, t('login.validation.passwordRequired')),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

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
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/feed');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const message = error.response?.data?.message;
      setErrorMsg(
        Array.isArray(message)
          ? message.join(', ')
          : typeof message === 'string' ? message : t('login.invalidCredentials'),
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg-primary)]">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] items-center justify-center p-8">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">InnoTok</h1>
          <p className="text-2xl opacity-90">{t('login.heroText')}</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {t('login.title')}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t('login.subtitle')}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-[var(--error)] bg-opacity-10 border border-[var(--error)] rounded-lg">
              <p className="text-[var(--error)] text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('login.email')}
              type="email"
              placeholder={t('login.emailPlaceholder')}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label={t('login.password')}
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="text-right mb-6">
              <Link
                href="/auth/forgot-password"
                className="text-[var(--link)] hover:text-[var(--accent)] text-sm font-medium transition-colors"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              {t('login.submit')}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[var(--text-secondary)]">
              {t('login.noAccount')}{' '}
              <Link
                href="/auth/signup"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold transition-colors"
              >
                {t('login.createOne')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
