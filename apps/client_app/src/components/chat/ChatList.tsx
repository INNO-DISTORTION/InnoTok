
import React from 'react';
import Image from 'next/image';
import { Chat, ChatType } from '@/types';
import { format, isToday, isYesterday } from 'date-fns';
import { getAvatarUrl } from '@/lib/url-helper';
import { useTranslation } from '@/i18n/context';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  currentUserId: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  currentUserId,
}) => {
  const { t } = useTranslation();

  const getChatName = (chat: Chat) => {
    if (chat.type === ChatType.GROUP) return chat.name || t.chat.groupChat;
    const otherMember = chat.participants?.find(
      (p) => p.profile?.userId !== currentUserId,
    );
    return (
      otherMember?.profile?.displayName ||
      otherMember?.profile?.username ||
      t.chat.unknown
    );
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === ChatType.GROUP) return null;
    const otherMember = chat.participants?.find(
      (p) => p.profile?.userId !== currentUserId,
    );
    return getAvatarUrl(otherMember?.profile?.avatarUrl);
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return t.chat.yesterday;
    return format(date, 'dd.MM.yy');
  };

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return t.chat.noMessagesYet;
    if (chat.lastMessage.sharedPost) return t.chat.lastMessageSharedPost;
    return chat.lastMessage.content || t.chat.lastMessageAttachment;
  };

  return (
    <div className="flex flex-col h-full">
      {chats.map((chat) => {
        const isActive = activeChatId === chat.id;
        const avatarUrl = getChatAvatar(chat);

        return (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
            style={{
              background: isActive
                ? 'var(--bg-elevated)'
                : 'transparent',
              borderLeft: isActive
                ? '3px solid var(--accent)'
                : '3px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-elevated)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <div
              className="relative w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg overflow-hidden"
              style={{
                background: avatarUrl ? 'transparent' : 'var(--accent)',
              }}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                getChatName(chat).charAt(0).toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span
                  className="font-semibold text-sm truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {getChatName(chat)}
                </span>
                <span
                  className="text-[11px] flex-shrink-0 ml-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {formatTime(
                    chat.lastMessage?.createdAt || chat.updatedAt,
                  )}
                </span>
              </div>
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                {getLastMessagePreview(chat)}
              </p>
            </div>
          </div>
        );
      })}

      {chats.length === 0 && (
        <div
          className="flex flex-col items-center justify-center h-full text-center p-6"
          style={{ color: 'var(--text-muted)' }}
        >
          <p className="text-sm">{t.chat.noChatsYet}</p>
        </div>
      )}
    </div>
  );
};
