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

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');

  const signupSchema = z.object({
    email: z.string().email(t('signup.validation.invalidEmail')),
    password: z.string().min(8, t('signup.validation.passwordMin')),
    confirmPassword: z.string().min(8),
    username: z
      .string()
      .min(3, t('signup.validation.usernameMin'))
      .max(30, t('signup.validation.usernameMax')),
    displayName: z.string().min(2, t('signup.validation.displayNameRequired')),
    birthday: z.string().min(1, t('signup.validation.birthdayRequired')),
    bio: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('signup.validation.passwordsMismatch'),
    path: ['confirmPassword'],
  });

  type SignupFormData = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setErrorMsg('');
    try {
      await signup({
        email: data.email,
        password: data.password,
        username: data.username,
        displayName: data.displayName,
        birthday: data.birthday,
        bio: data.bio,
      });
      router.push('/feed');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const message = error.response?.data?.message;
      setErrorMsg(
        Array.isArray(message)
          ? message.join(', ')
          : typeof message === 'string' ? message : t('signup.failedCreate'),
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg-primary)]">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] items-center justify-center p-8">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">InnoTok</h1>
          <p className="text-2xl opacity-90">{t('signup.heroText')}</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {t('signup.title')}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t('signup.subtitle')}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-[var(--error)] bg-opacity-10 border border-[var(--error)] rounded-lg">
              <p className="text-[var(--error)] text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('signup.email')}
              type="email"
              placeholder={t('signup.emailPlaceholder')}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label={t('signup.username')}
              placeholder={t('signup.usernamePlaceholder')}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label={t('signup.displayName')}
              placeholder={t('signup.displayNamePlaceholder')}
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            <Input
              label={t('signup.birthday')}
              type="date"
              error={errors.birthday?.message}
              {...register('birthday')}
            />

            <Input
              label={t('signup.bioOptional')}
              placeholder={t('signup.bioPlaceholder')}
              error={errors.bio?.message}
              {...register('bio')}
            />

            <Input
              label={t('signup.password')}
              type="password"
              placeholder={t('signup.passwordPlaceholder')}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label={t('signup.confirmPassword')}
              type="password"
              placeholder={t('signup.passwordPlaceholder')}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              {t('signup.submit')}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[var(--text-secondary)]">
              {t('signup.alreadyHaveAccount')}{' '}
              <Link
                href="/auth/login"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold transition-colors"
              >
                {t('signup.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
