import { userDiaryApi } from '@/utils/openApi';
import useSWR from 'swr';

export const useUserDiary = ({ userId }: FetcherArgs) => {
  const { data, isLoading, mutate } = useSWR(
    userId !== undefined ? { url: '/userDiary/[userId]', userId } : null,
    ({ userId }) => fetcher({ userId }),
  );
  if (data === undefined) {
    return {
      diary: undefined,
      refetchUserDiary: mutate,
      isLoading,
    };
  }

  return {
    diary: data[0],
    refetchUserDiary: mutate,
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
  // 今日の日付の文字列を取得
  const today = new Date().toISOString().split('T')[0];
  const response = await userDiaryApi.getUserDiaries(userId, today);
  return response.data;
};
