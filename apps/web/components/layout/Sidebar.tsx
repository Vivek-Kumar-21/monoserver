'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@bamblu/utils';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Map,
  Settings,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/compare',    label: 'Compare',    icon: Users },
  { href: '/roadmap',    label: 'Roadmap',    icon: Map },
  { href: '/settings',   label: 'Settings',   icon: Settings },
] as const;

interface SidebarProps {
  user: { name?: string | null; image?: string | null; email?: string | null };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="sidebar"
      className="hidden lg:flex flex-col w-60 border-r border-border bg-card/50 backdrop-blur-sm h-full"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="font-bold text-lg tracking-tight">
          <span className="text-primary">Bam</span>blu
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              id={`sidebar-nav-${label.toLowerCase()}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-border flex items-center gap-3">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name ?? 'User avatar'}
            className="h-8 w-8 rounded-full ring-2 ring-border"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {user.name?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{user.name ?? 'Developer'}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}
