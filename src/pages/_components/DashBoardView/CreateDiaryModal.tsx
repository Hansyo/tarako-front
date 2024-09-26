import type { ModalProps } from '@mantine/core';

import { useASRInput } from '@/utils/hooks/useASRInput';
import { ActionIcon, Button, Modal, Textarea } from '@mantine/core';
import {
  IconMicrophone,
  IconMoodAngry,
  IconMoodHappy,
} from '@tabler/icons-react';
import { IconEdit, IconStar } from '@tabler/icons-react';
import clsx from 'clsx';
import { useState, type ReactNode } from 'react';

type Props = {
  onCreateDiary: (input: string) => void;
} & ModalProps;

export const CreateDiaryModal = ({ onCreateDiary, ...modalProps }: Props) => {
  const { inputValue, setInputValue, toggleRecording, transcript, recording } =
    useASRInput({ target: 'create-diary' });

  const [hasRecorded, setHasRecorded] = useState(false);

  const onClickRecordButton = () => {
    toggleRecording();
    setHasRecorded(true);
  };

  const onClickCreateDiaryButton = () => {
    onCreateDiary(inputValue);
  };

  return (
    <Modal
      {...modalProps}
      size="xl"
      closeOnClickOutside={false}
      centered
      title={
        <h2 className="text-2xl font-bold text-normal">今日のふりかえり</h2>
      }
      padding="xl"
    >
      <div className="text-normal">
        <div className="space-y-2">
          <p className="text-lg">
            今日の仕事を通して、どんな気づきや感情が湧き上がりましたか？良い点、改善点、そして感じたことを率直に声に出して話してみましょう。
          </p>
          <p className="text-lg">
            声に出すことで、自分の気持ちを整理することができます。また、AIがあなたの声を分析し、あなたの気持ちを分析します。
          </p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
          <TopicCard title="今日のハイライト" icon={<IconStar size={36} />} />
          <TopicCard title="達成できたこと" icon={<IconStar size={36} />} />
          <TopicCard title="改善点・反省" icon={<IconEdit size={36} />} />
          <TopicCard
            title="感じたこと・感情"
            icon={<IconMoodHappy size={36} />}
          />
          <TopicCard
            title="不満・もやもや"
            icon={<IconMoodAngry size={36} />}
          />
        </div>
        <div className="mt-20 space-y-8">
          {transcript && <div className="text-xl">{transcript}</div>}
          {hasRecorded && (
            <Textarea
              size="lg"
              label="今日のふりかえり"
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              autosize
              disabled={recording}
              className="flex-1"
            />
          )}
          <div className="flex items-center justify-end gap-12">
            <ActionIcon
              size="xl"
              color={recording ? 'red' : 'gray'}
              radius="xl"
              variant="filled"
              className={clsx(!inputValue && 'mx-auto w-fit')}
              onClick={onClickRecordButton}
            >
              <IconMicrophone size="1.75rem" />
            </ActionIcon>
            {inputValue && (
              <Button color="pink" size="lg" onClick={onClickCreateDiaryButton}>
                日報を作成
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const TopicCard = ({ title, icon }: { title: string; icon: ReactNode }) => {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-md border border-gray-200 p-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {icon}
    </div>
  );
};
