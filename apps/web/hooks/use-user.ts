import { useQuery } from '@tanstack/react-query';

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  githubConnections?: {
    id: string;
    username: string;
    connectedAt: string;
  }[];
}

async function fetchUser(): Promise<UserProfile | null> {
  const res = await fetch('http://localhost:3001/api/auth/me', {
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 401) {
      return null;
    }
    throw new Error('Failed to fetch user');
  }
  return res.json();
}

export function useUser() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: fetchUser,
    retry: false,
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
