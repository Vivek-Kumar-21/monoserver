import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const session = await auth();
  const user = await db.query.users.findFirst({
    where: eq(users.id, session!.user.id),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and integration handles.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {/* GitHub handle */}
        <div className="p-6 space-y-3">
          <h2 className="text-sm font-semibold">GitHub Handle</h2>
          <input
            id="settings-github-handle"
            type="text"
            defaultValue={user?.githubHandle ?? ''}
            placeholder="your-github-username"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Codeforces handle */}
        <div className="p-6 space-y-3">
          <h2 className="text-sm font-semibold">Codeforces Handle</h2>
          <input
            id="settings-codeforces-handle"
            type="text"
            defaultValue={user?.codeforcesHandle ?? ''}
            placeholder="tourist"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Save */}
        <div className="p-6 flex justify-end">
          <button
            id="settings-save-btn"
            type="button"
            className="rounded-xl bg-primary text-primary-foreground font-medium px-5 py-2.5 text-sm hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
        <p className="text-xs text-muted-foreground">
          Deleting your account is irreversible. All your data will be permanently removed.
        </p>
        <button
          id="settings-delete-account-btn"
          type="button"
          className="rounded-xl border border-destructive text-destructive font-medium px-4 py-2 text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
