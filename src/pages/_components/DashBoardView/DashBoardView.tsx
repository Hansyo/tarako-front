import type { CreateUserDiary } from '@/generated/typescript-axios';

import { CreateDiaryModal } from './CreateDiaryModal';
import { Diary } from './Diary';
import { TaskTimeline } from '@/components/features/task/TaskTimeline';
import { useUserDiary } from '@/utils/hooks/api/useUserDiary';
import { useAuth } from '@/utils/hooks/useAuth';
import { userDiaryApi } from '@/utils/openApi';
import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';

export const DashBoardView = () => {
  const { user } = useAuth();
  const [shouldShowDiary, setShouldShowDiary] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  const { diary, isLoading } = useUserDiary({ userId: user?.user_id });
  const [todayDiaryDetail, setTodayDiaryDetail] = useState('');
  const [todayDiaryAnalysis, setTodayDiaryAnalysis] = useState('');

  const onCreateDiary = async (input: string) => {
    if (!shouldShowDiary) {
      setModalOpened(false);
      setButtonLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // userDiaryApi.postUserDiaryEntryを使って、日報を作成する
      const input_value: CreateUserDiary = {
        date: new Date().toISOString().split('T')[0],
        message: input,
      };
      if (user !== undefined) {
        const response = await userDiaryApi.postUserDiaryEntry(
          user.user_id,
          input_value,
        );
        // 作成した日報を表示する
        if (response.status === 200) {
          setTodayDiaryDetail(response.data.details);
          setTodayDiaryAnalysis(response.data.ai_analysis);
          setShouldShowDiary(true);
        }
      }
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && diary !== undefined) {
      setShouldShowDiary(true);
      console.log(diary);
      setTodayDiaryDetail(diary.details);
      setTodayDiaryAnalysis(diary.ai_analysis);
    }
  }, [diary, isLoading]);

  return (
    <>
      <div className="mx-auto max-w-screen-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">ダッシュボード</h2>
          {!shouldShowDiary && (
            <Button
              size="lg"
              variant="outline"
              color="pink"
              onClick={() => {
                // void onClickCrateDiaryButton();
                setModalOpened(true);
              }}
              loading={buttonLoading}
            >
              日報を作成する
            </Button>
          )}
        </div>
        {shouldShowDiary && (
          <Diary details={todayDiaryDetail} analysis={todayDiaryAnalysis} />
          // <div className="mrounded-lg">
          // {/* <Diary timeline={timeline} details={details} analysis={analysis} /> */}
          // </div>
        )}
        <div className="mt-8">
          <TaskTimeline />
        </div>
      </div>
      <CreateDiaryModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onCreateDiary={(input) => void onCreateDiary(input)}
      />
    </>
  );
};
