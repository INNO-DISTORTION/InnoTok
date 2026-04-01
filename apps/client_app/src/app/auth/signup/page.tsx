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
import { signupSchema, SignupFormData } from '@/lib/auth.schemas';
import { SignupError } from '@/lib/errors';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');
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
      if (SignupError.assert(err)) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(t.auth.signup.errors.generic);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg-primary)]">
      <AuthSidebar title={t.common.appName} subtitle={t.auth.signup.sidebarSubtitle} />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {t.auth.signup.title}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t.auth.signup.subtitle}
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
              label={t.auth.fields.username}
              placeholder={t.auth.fields.usernamePlaceholder}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label={t.auth.fields.displayName}
              placeholder={t.auth.fields.displayNamePlaceholder}
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            <Input
              label={t.auth.fields.birthday}
              type="date"
              error={errors.birthday?.message}
              {...register('birthday')}
            />

            <Input
              label={t.auth.fields.bio}
              placeholder={t.auth.fields.bioPlaceholder}
              error={errors.bio?.message}
              {...register('bio')}
            />

            <Input
              label={t.auth.fields.password}
              type="password"
              placeholder={t.auth.fields.passwordPlaceholder}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label={t.auth.fields.confirmPassword}
              type="password"
              placeholder={t.auth.fields.passwordPlaceholder}
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
              {t.auth.signup.submitButton}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[var(--text-secondary)]">
              {t.auth.signup.alreadyHaveAccount}{' '}
              <Link
                href="/auth/login"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold transition-colors"
              >
                {t.auth.signup.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
