import { cookies } from 'next/headers';

export async function getUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const res = await fetch('http://localhost:3001/api/auth/me', {
      headers: {
        Cookie: `auth_token=${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}
