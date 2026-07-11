import Link from 'next/link';

export function Navbar() {
  return (
    <header
      id="navbar"
      className="sticky top-0 z-30 flex items-center justify-between px-8 py-5 h-[78px] bg-[#0a0e1a] border-b border-white/5"
    >
      <Link href="/" className="text-xl font-bold tracking-wide text-white">
        BAMBLU
      </Link>

      <nav className="flex items-center gap-10">
        <Link
          href="#features"
          className="text-xs font-medium tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          FEATURES
        </Link>

        <Link
          href="#analytics"
          className="text-xs font-medium tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          ANALYTICS
        </Link>

        <Link
          href="#integrations"
          className="text-xs font-medium tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          INTEGRATIONS
        </Link>

        <Link
          href="#how-it-works"
          className="text-xs font-medium tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          HOW IT WORKS
        </Link>

        <Link
          href="#about"
          className="text-xs font-medium tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          ABOUT
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 transition-colors"
        >
          Log In
        </Link>

        <Link
          href="/signup"
          className="rounded-lg bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-black hover:bg-cyan-300 transition-colors"
        >
          Get Started Free
        </Link>
      </div>
    </header>
  );
}