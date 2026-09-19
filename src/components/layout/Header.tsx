import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  const [pool, setPool] = useState("Pool Pusat Pulogebang");

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_1px_8px_rgba(0,0,0,0.02)] z-40 flex items-center justify-between px-space-lg transition-colors">
      <div className="flex items-center gap-space-md flex-1 max-w-2xl">
        <div className="relative flex items-center">
          <select
            value={pool}
            onChange={(e) => setPool(e.target.value)}
            className="appearance-none bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg py-2 pl-3 pr-8 shadow-xs border border-outline-variant/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Pool Pusat Pulogebang</option>
            <option>Pool Surabaya Waru</option>
            <option>Pool Solo Tirtonadi</option>
            <option>Pool Poris Tangerang</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
        </div>
      </div>

      <div className="flex items-center gap-space-sm">
        <Link to="/legalitas-regulasi" className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all" title="Peringatan Regulasi">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-white text-[9px] font-bold">3</span>
        </Link>
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all flex items-center justify-center"
          title={isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"}
          type="button"
          aria-label="Toggle theme"
        >
          <span className="material-symbols-outlined text-[22px] transition-transform duration-200">
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>
        <div className="h-6 w-px bg-outline-variant/50 mx-1"></div>
        <div className="flex items-center gap-2.5 pl-1">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-on-surface font-semibold leading-tight">Ratna Sari</div>
            <div className="text-[11px] text-on-surface-variant leading-tight">Fleet Operations Manager</div>
          </div>
          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-outline-variant"
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
          />
        </div>
      </div>
    </header>
  );
};
