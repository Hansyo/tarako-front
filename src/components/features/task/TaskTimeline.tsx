import { TaskCategoryIcon } from './TaskCategoryIcon';
import { TaskDetailModal } from './TaskDetailModal';
import { TaskCategory } from '@/generated/typescript-axios';
import { useTasks } from '@/utils/hooks/api/useTasks';
import { useAuth } from '@/utils/hooks/useAuth';
import { Timeline } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  userId?: string;
};

export const TaskTimeline = ({ userId }: Props) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [modalTaskId, setModalTaskId] = useState('');
  const { user } = useAuth();

  const { tasks, isLoading } = useTasks({
    userIds: userId ? [userId] : user?.user_id ? [user.user_id] : undefined,
  });

  const sortedTasks = useMemo(() => {
    return tasks?.sort((a, b) => {
      if (a.updated_at == undefined || b.updated_at == undefined) {
        return 0;
      }

      return dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix();
    });
  }, [tasks]);

  const todayTasks = useMemo(() => {
    return sortedTasks?.filter((task) => {
      if (task.updated_at == undefined) {
        return false;
      }

      return dayjs.utc(task.updated_at).tz().isSame(dayjs(), 'day');
    });
  }, [sortedTasks]);
  const yesterdayTasks = useMemo(() => {
    return sortedTasks?.filter((task) => {
      if (task.updated_at == undefined) {
        return false;
      }

      return dayjs
        .utc(task.updated_at)
        .tz()
        .isSame(dayjs().subtract(1, 'day'), 'day');
    });
  }, [sortedTasks]);
  const beforeYesterdayTasks = useMemo(() => {
    return sortedTasks?.filter((task) => {
      if (task.updated_at == undefined) {
        return false;
      }

      return dayjs
        .utc(task.updated_at)
        .tz()
        .isSame(dayjs().subtract(2, 'day'), 'day');
    });
  }, [sortedTasks]);

  const onClickTimelineItem = (taskId: string) => {
    setModalTaskId(taskId);
    open();
  };

  // TODO: 原因を調査する
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (sortedTasks == undefined || isLoading) {
    return null;
  }

  return (
    <>
      <div className="space-y-20">
        {todayTasks && todayTasks.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold">本日</h3>
            <Timeline bulletSize={32} className="mt-5">
              {todayTasks.map((item) => {
                const progressPercentage = item.progresses.reduce(
                  (prev, current) => {
                    if (
                      prev.percentage == undefined ||
                      current.percentage == undefined
                    ) {
                      return prev;
                    }

                    return prev.percentage > current.percentage
                      ? prev
                      : current;
                  },
                );
                console.log(item.updated_at);
                return (
                  <Timeline.Item
                    key={item.task_id}
                    bullet={
                      <div
                        className={clsx(
                          'flex h-full w-full items-center justify-center rounded-full p-1',
                          {
                            'bg-red-500': item.category === TaskCategory.Hr,
                            'bg-blue-500':
                              item.category === TaskCategory.Accounting,
                            'bg-green-500':
                              item.category === TaskCategory.GeneralAffairs,
                            'bg-yellow-500':
                              item.category === TaskCategory.Diary,
                            'bg-gray-500': item.category === TaskCategory.Other,
                          },
                        )}
                      >
                        <TaskCategoryIcon
                          category={item.category}
                          color="white"
                        />
                      </div>
                    }
                    bulletSize={32}
                    title={
                      <div className="flex items-start justify-between">
                        <p className="text-xl">{item.title}</p>
                        <p className="text-md text-light">
                          {dayjs.utc(item.updated_at).tz().format('HH:mm')}
                        </p>
                      </div>
                    }
                    onClick={() => onClickTimelineItem(item.task_id)}
                    className="cursor-pointer rounded-md border border-gray-200 py-4 pl-8 pr-4 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-md">{item.details}</p>
                    </div>
                    <div
                      className={`mt-4 text-sm text-light underline ${
                        item.serious >= 4 && !item.completed
                          ? 'text-rose-600'
                          : ''
                      }`}
                    >
                      {item.completed === true
                        ? '完了済み'
                        : `深刻度レベル: ${item.serious}`}
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div className="mt-3 flex gap-x-2">
                        {item.tags.map((tag) => {
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
                        進捗率: {progressPercentage.percentage}%
                      </p>
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
        )}

        {yesterdayTasks && yesterdayTasks.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold">昨日</h3>
            <Timeline bulletSize={32} className="mt-5">
              {yesterdayTasks.map((item) => {
                const progressPercentage = item.progresses.reduce(
                  (prev, current) => {
                    if (
                      prev.percentage == undefined ||
                      current.percentage == undefined
                    ) {
                      return prev;
                    }

                    return prev.percentage > current.percentage
                      ? prev
                      : current;
                  },
                );
                return (
                  <Timeline.Item
                    key={item.task_id}
                    bullet={
                      <div
                        className={clsx(
                          'flex h-full w-full items-center justify-center rounded-full p-1',
                          {
                            'bg-red-500': item.category === TaskCategory.Hr,
                            'bg-blue-500':
                              item.category === TaskCategory.Accounting,
                            'bg-green-500':
                              item.category === TaskCategory.GeneralAffairs,
                            'bg-yellow-500':
                              item.category === TaskCategory.Diary,
                            'bg-gray-500': item.category === TaskCategory.Other,
                          },
                        )}
                      >
                        <TaskCategoryIcon
                          category={item.category}
                          color="white"
                        />
                      </div>
                    }
                    bulletSize={32}
                    title={
                      <div className="flex items-start justify-between">
                        <p className="text-xl">{item.title}</p>
                        <p className="text-md text-light">
                          {dayjs.utc(item.updated_at).tz().format('HH:mm')}
                        </p>
                      </div>
                    }
                    onClick={() => onClickTimelineItem(item.task_id)}
                    className="cursor-pointer rounded-md border border-gray-200 py-4 pl-8 pr-4 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-md">{item.details}</p>
                    </div>
                    <div
                      className={`mt-4 text-sm text-light underline ${
                        item.serious >= 4 && !item.completed
                          ? 'text-rose-600'
                          : ''
                      }`}
                    >
                      {item.completed
                        ? '完了済み'
                        : `深刻度レベル: ${item.serious}`}
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div className="mt-3 flex gap-x-2">
                        {item.tags.map((tag) => {
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
                        進捗率: {progressPercentage.percentage}%
                      </p>
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
        )}

        {beforeYesterdayTasks && beforeYesterdayTasks.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold">一昨日以前</h3>
            <Timeline bulletSize={32} className="mt-5">
              {beforeYesterdayTasks.map((item) => {
                const progressPercentage = item.progresses.reduce(
                  (prev, current) => {
                    if (
                      prev.percentage == undefined ||
                      current.percentage == undefined
                    ) {
                      return prev;
                    }

                    return prev.percentage > current.percentage
                      ? prev
                      : current;
                  },
                );
                return (
                  <Timeline.Item
                    key={item.task_id}
                    bullet={
                      <div
                        className={clsx(
                          'flex h-full w-full items-center justify-center rounded-full p-1',
                          {
                            'bg-red-500': item.category === TaskCategory.Hr,
                            'bg-blue-500':
                              item.category === TaskCategory.Accounting,
                            'bg-green-500':
                              item.category === TaskCategory.GeneralAffairs,
                            'bg-yellow-500':
                              item.category === TaskCategory.Diary,
                            'bg-gray-500': item.category === TaskCategory.Other,
                          },
                        )}
                      >
                        <TaskCategoryIcon
                          category={item.category}
                          color="white"
                        />
                      </div>
                    }
                    bulletSize={32}
                    title={
                      <div className="flex items-start justify-between">
                        <p className="text-xl">{item.title}</p>
                        <p className="text-md text-light">
                          {dayjs.utc(item.updated_at).tz().format('HH:mm')}
                        </p>
                      </div>
                    }
                    onClick={() => onClickTimelineItem(item.task_id)}
                    className="cursor-pointer rounded-md border border-gray-200 py-4 pl-8 pr-4 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-md">{item.details}</p>
                    </div>
                    <div
                      className={`mt-4 text-sm text-light underline ${
                        item.serious >= 4 && !item.completed
                          ? 'text-rose-600'
                          : ''
                      }`}
                    >
                      {item.completed === true
                        ? '完了済み'
                        : `深刻度レベル: ${item.serious}`}
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div className="mt-3 flex gap-x-2">
                        {item.tags.map((tag) => {
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
                        進捗率: {progressPercentage.percentage}%
                      </p>
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
        )}
      </div>

      <TaskDetailModal taskId={modalTaskId} opened={opened} onClose={close} />
    </>
  );
};
