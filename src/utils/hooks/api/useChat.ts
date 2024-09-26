import type { Chat } from '@/pages/_components/ChatView/ChatList';

import { type Chat as axiosChat } from '@/generated/typescript-axios';
import { chatApi } from '@/utils/openApi';
import useSWR from 'swr';

export const useChat = ({ userId }: FetcherArgs) => {
  const { data, isLoading, mutate } = useSWR(
    userId !== undefined ? { url: '/chat/[userId]', userId } : null,
    ({ userId }) => fetcher({ userId }),
  );

  return {
    chats: data?.map((c) => transformChat(c)),
    refetchChat: mutate,
    isLoading,
  };
};

type FetcherArgs = {
  userId?: string;
};

const fetcher = async ({ userId }: FetcherArgs) => {
  if (userId === undefined) {
    return undefined;
  }

  const response = await chatApi.getSingleUserChatHistory(userId);
  return response.data;
};

// chatApiのChat型を、ChatListのChat型に変換する
export function transformChat(c: axiosChat): Chat {
  return {
    from: c.from === 'user' ? 'user' : 'bot',
    message: c.message,
    sentAt: new Date(c.timestamp),
  };
}
