'use client';

import { useRouter } from 'next/navigation';
import { CreatePostWidget } from '@/components/feed/CreatePostWidget';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function CreatePostPage() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const { t } = useTranslation();

  const handlePostCreated = () => {
    router.push('/feed');
  };

  return (
    <div className="max-w-2xl mx-auto" style={{ color: 'var(--text-primary)' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('createPost.title')}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t('createPost.subtitle')}
          </p>
        </div>

        <CreatePostWidget
          onPostCreated={handlePostCreated}
          userAvatar={profile?.avatarUrl}
          userName={profile?.displayName || user?.email || 'User'}
        />

        <div className="mt-8 p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4">{t('createPost.tipsTitle')}</h2>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li> {t('createPost.tips.photo')}</li>
            <li> {t('createPost.tips.captions')}</li>
            <li> {t('createPost.tips.videoFormats')}</li>
            <li> {t('createPost.tips.imageFormats')}</li>
            <li> {t('createPost.tips.consistency')}</li>
            <li> {t('createPost.tips.engage')}</li>
          </ul>
        </div>
    </div>
  );
}
