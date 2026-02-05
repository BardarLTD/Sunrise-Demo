'use client';

import Image from 'next/image';

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-[#1a1a1a] px-6">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Talentsheet"
          width={140}
          height={32}
          className="h-8 w-auto"
        />
      </div>

      {/* Hamburger Menu */}
      <button
        type="button"
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md transition-colors hover:bg-white/10"
        aria-label="Menu"
      >
        <span className="h-0.5 w-5 bg-slate-400 transition-colors" />
        <span className="h-0.5 w-5 bg-slate-400 transition-colors" />
        <span className="h-0.5 w-5 bg-slate-400 transition-colors" />
      </button>
    </header>
  );
}
