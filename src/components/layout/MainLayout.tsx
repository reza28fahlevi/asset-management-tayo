import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ isDark, onToggleTheme }) => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col transition-colors duration-200">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col">
        <Header isDark={isDark} onToggleTheme={onToggleTheme} />
        <main className="relative pt-20 px-space-lg pb-space-xl flex-1 max-w-7xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
