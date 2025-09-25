import React from 'react';
import { Header } from './Header';
import { useAuth } from '@/store/authStore';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export function MainLayout({ 
  children, 
  showHeader = true 
}: MainLayoutProps) {
  const { state } = useAuth();

  // Don't show layout for login page
  if (!state.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="w-full flex flex-col">
        {/* Header */}
        {showHeader && (
          <Header />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
