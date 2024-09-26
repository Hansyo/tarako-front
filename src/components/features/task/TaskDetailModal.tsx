import type { ModalProps } from '@mantine/core';

import { useTask } from '@/utils/hooks/api/useTask';
import { Modal } from '@mantine/core';

type Props = {
  taskId: string;
} & ModalProps;

export const TaskDetailModal = ({ taskId, ...modalProps }: Props) => {
  const { task, isLoading } = useTask({ taskId });

  if (task === undefined || isLoading) {
    return null;
  }

  const progressPercentage = task.progresses?.reduce((prev, current) => {
    if (prev?.percentage == undefined || current?.percentage == undefined) {
      return prev;
    }

    return prev?.percentage > current?.percentage ? prev : current;
  });

  return (
    <Modal
      {...modalProps}
      size="xl"
      centered
      title={<h2 className="text-2xl font-bold text-normal">{task.title}</h2>}
      padding="xl"
    >
      <div>
        <p className="text-md">{task.details}</p>
      </div>
      <div
        className={`mt-4 text-sm text-light underline ${
          task.serious >= 4 && !task.completed ? 'text-rose-600' : ''
        }`}
      >
        {task.completed === true ? '完了済み' : `深刻度レベル: ${task.serious}`}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="mt-3 flex gap-x-2">
          {task?.tags?.map((tag) => {
            return (
              <span
                key={tag}
                className="block rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-500"
              >
                {tag}
              </span>
            );
          })}
        </div>
        <p className="text-sm text-light">
          進捗率: {progressPercentage?.percentage}%
        </p>
      </div>
    </Modal>
  );
};
