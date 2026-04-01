'use client';

import { useRouter } from 'next/navigation';
import { CreatePostWidget } from '@/components/feed/CreatePostWidget';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n/context';

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
          <h1 className="text-3xl font-bold mb-2">{t.post.createPost}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.post.shareYourMoment}
          </p>
        </div>

        <CreatePostWidget
          onPostCreated={handlePostCreated}
          userAvatar={profile?.avatarUrl}
          userName={profile?.displayName || user?.email || t.common.you}
        />

        <div className="mt-8 p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4">{t.post.tipsTitle}</h2>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t.post.tips.map((tip, i) => (
              <li key={i}> {tip}</li>
            ))}
          </ul>
        </div>
    </div>
  );
}
