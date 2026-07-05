import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Get Started' };

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-primary">Bam</span>blu
          </h1>
          <p className="text-muted-foreground text-sm">Your developer career co-pilot.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/5 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Create your account</h2>
            <p className="text-sm text-muted-foreground">
              Connect GitHub to start tracking your coding journey.
            </p>
          </div>

          {/* Feature highlights */}
          <ul className="space-y-3">
            {[
              ['📊', 'Real-time GitHub activity heatmap'],
              ['⚡', 'Codeforces rating & problem tracker'],
              ['🧠', 'AI-powered skill gap analysis'],
              ['🗺️', 'Personalized SDE interview roadmap'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="text-base">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <form action="/api/auth/signin/github" method="POST">
            <input type="hidden" name="callbackUrl" value="/onboarding" />
            <button
              id="register-github-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 transition-colors duration-200"
            >
              Get started free with GitHub
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
