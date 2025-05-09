// src/Layout/Layout.tsx
import Footer from '@/components/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import Head from '@/components/Head';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <SidebarProvider className="flex h-screen">
      <div className="w-64">
        <AppSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="shrink-0 p-2">
          <Head />
        </header>
        <main className="flex-1 overflow-hidden p-4">
          <Outlet />
        </main>
        <footer className="shrink-0">
          <Footer />
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
