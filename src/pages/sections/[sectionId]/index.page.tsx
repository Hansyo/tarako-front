import type { NextPage } from 'next';

import { PageTitle } from '@/components/common/PageTitle';
import SeverityTrend from '@/components/common/SeverityTrend';
import TaskStatus from '@/components/common/TaskStatus';
import { SectionCards } from '@/components/features/section/SectionCards';
import { BaseAuthLayout } from '@/components/layouts/BaseAuthLayout';
import { useSection } from '@/utils/hooks/api/useSection';
import { useUsers } from '@/utils/hooks/api/useUsers';
import { Avatar } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const mockChartDatas = [
  {
    date: '2023-01-01',
    users: { user1: 50, user2: 30, user3: 50, user4: 30, user5: 50, user6: 30 },
  },
  {
    date: '2023-01-02',
    users: { user1: 50, user2: 40, user3: 20, user4: 10, user5: 50, user6: 30 },
  },
  {
    date: '2023-01-03',
    users: { user1: 30, user2: 10, user3: 50, user4: 30, user5: 10, user6: 50 },
  },
  {
    date: '2023-01-04',
    users: { user1: 10, user2: 20, user3: 50, user4: 10, user5: 20, user6: 10 },
  },
  {
    date: '2023-01-05',
    users: { user1: 10, user2: 20, user3: 50, user4: 10, user5: 50, user6: 20 },
  },
];

const mockTaskDatas = [
  { name: 'user1', value: 5 },
  { name: 'user2', value: 5 },
  { name: 'user3', value: 5 },
  { name: 'user4', value: 5 },
  { name: 'user5', value: 5 },
];

const SectionDetailPage: NextPage = () => {
  const router = useRouter();
  const sectionId = Number(router.query.sectionId);

  const { users, isLoading } = useUsers();
  const { section } = useSection({ sectionId });

  if (users === undefined || section === undefined || isLoading) {
    return (
      <BaseAuthLayout>
        <div className="md:animate-spin" />
      </BaseAuthLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{section.name} - Tarako</title>
      </Head>
      <BaseAuthLayout>
        <div className="mx-auto max-w-screen-lg p-8">
          <PageTitle>{section.name}</PageTitle>
          <div className="mt-8 flex h-[320px] gap-4">
            <div className="flex-1">
              <SeverityTrend
                title="各メンバーの深刻度の推移"
                data={mockChartDatas}
              />
            </div>
            <div className="flex-1">
              <TaskStatus
                title="各メンバーのタスクの進行数"
                data={mockTaskDatas}
              />
            </div>
          </div>
          <section className="mt-12">
            <h2 className="text-2xl font-bold">メンバー状況</h2>
            <div className="mt-4 flex gap-4">
              {users
                ? users.map((user) => {
                    if (user.section_id !== sectionId) return null;
                    return (
                      <Link
                        key={user.user_id}
                        href={`/users/${user.user_id}`}
                        className="flex flex-1 items-center justify-center gap-8 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-100"
                      >
                        <Avatar src={user.icon} size={96} />
                        <div>
                          <p className="text-xl font-bold">{user.name}</p>
                          {section && (
                            <p className="mt-2 text-xs text-light">
                              {section.name}
                            </p>
                          )}
                          <p className="text-xs text-light">{user.email}</p>
                        </div>
                      </Link>
                    );
                  })
                : null}
            </div>
          </section>
          <div className="mt-12">
            <h2 className="text-2xl font-bold">部署一覧</h2>
            <div className="mt-4">
              <SectionCards visibleNum={4} />
              <Link
                href="/sections"
                className="text-md mt-4 block w-fit text-light underline"
              >
                全ての部署を見る
              </Link>
            </div>
          </div>
        </div>
      </BaseAuthLayout>
    </>
  );
};

export default SectionDetailPage;
