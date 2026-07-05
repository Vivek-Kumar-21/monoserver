import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: { default: 'Bamblu — Developer Career Intelligence', template: '%s | Bamblu' },
  description:
    'Track your coding activity across GitHub and Codeforces, get skill gap analysis, benchmark against peers, and receive personalized growth roadmaps tied to real job market demand.',
  keywords: ['developer', 'career', 'GitHub', 'Codeforces', 'skill gap', 'roadmap', 'FAANG', 'SDE'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Bamblu',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
