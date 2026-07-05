'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, RefreshCw } from 'lucide-react';
import { SearchBar } from '@/components/shared/SearchBar';
import { useMutation } from '@tanstack/react-query';

interface NavbarProps {
  user: { name?: string | null; id: string };
}

export function Navbar({ user }: NavbarProps) {
  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: ['github', 'codeforces'], force: false }),
      });
      if (!res.ok) throw new Error('Sync failed');
      return res.json();
    },
  });

  return (
    <header
      id="navbar"
      className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3 border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="flex-1">
        <SearchBar id="navbar-search" placeholder="Search users, problems…" />
      </div>

      <div className="flex items-center gap-2">
        {/* Sync button */}
        <button
          id="navbar-sync-btn"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          title="Sync activity"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${syncMutation.isPending ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          {syncMutation.isPending ? 'Syncing…' : 'Sync'}
        </button>

        {/* Notifications */}
        <button
          id="navbar-notifications-btn"
          className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Sign out */}
        <button
          id="navbar-signout-btn"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
