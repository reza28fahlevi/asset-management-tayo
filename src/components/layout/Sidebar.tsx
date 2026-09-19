import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navSections } from '../../data/navigation';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/30">
      {/* Logo Brand */}
      <div className="h-16 px-space-md flex items-center gap-space-sm bg-surface-container-low flex-shrink-0 border-b border-surface-container">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm font-bold text-xl">
          <span className="material-symbols-outlined text-[26px]">directions_bus</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-primary leading-none">TAYO</span>
          <span className="text-[11px] font-medium text-on-surface-variant">Sistem Aset & Operasional</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-space-sm py-space-xs space-y-3 overflow-y-auto">
        {navSections.map((grp, idx) => (
          <div key={idx}>
            <div className="px-3 pt-2 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline">{grp.section}</span>
            </div>
            <div className="space-y-1">
              {grp.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-primary text-white font-semibold shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-white" : "text-secondary"}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-error-container text-error"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  );
};

