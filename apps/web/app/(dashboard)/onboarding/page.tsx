'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const { user, isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  // Next.js proxy should protect this, but we handle it just in case.
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-slate-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to Bamblu</h1>
        <p className="text-slate-400 mb-8">Let's set up your developer analytics profile.</p>

        {user && (
          <div className="mb-8 rounded-xl bg-slate-800/80 p-6 flex items-center gap-4">
            {user.image && (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="h-16 w-16 rounded-full ring-2 ring-slate-700"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-slate-400">{user.email}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {user && user.githubConnections && user.githubConnections.length > 0 ? (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 mb-4">
              <p className="text-sm font-medium text-green-400">
                ✓ GitHub Analytics Connected ({user.githubConnections[0].username})
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-5 mb-4 space-y-3">
              <h3 className="text-lg font-medium text-white">Connect your repositories</h3>
              <p className="text-sm text-slate-400">
                Bamblu needs access to your GitHub repositories to track your commits and pull requests.
              </p>
              <button
                type="button"
                onClick={() => { window.location.href = 'http://localhost:3001/api/github-integration/connect'; }}
                className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-white transition-colors"
              >
                Connect GitHub for Analytics
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
