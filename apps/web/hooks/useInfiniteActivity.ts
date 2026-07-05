import { useInfiniteQuery } from '@tanstack/react-query';

interface ActivityItem {
  id: string;
  occurredAt: string;
  _source: 'github' | 'codeforces';
  [key: string]: any;
}

interface ActivityResponse {
  success: boolean;
  data: {
    items: ActivityItem[];
    page: number;
    pageSize: number;
    hasNextPage: boolean;
    total?: number;
  };
}

export function useInfiniteActivity(userId: string, source: 'all' | 'github' | 'codeforces' = 'all') {
  return useInfiniteQuery<ActivityResponse['data'], Error>({
    queryKey: ['activity', userId, source],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/activity?userId=${userId}&source=${source}&page=${pageParam}&pageSize=20`);
      if (!res.ok) {
        throw new Error('Failed to fetch activity');
      }
      const json = await res.json() as ActivityResponse;
      if (!json.success) {
        throw new Error('Failed to fetch activity from API');
      }
      return json.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}
