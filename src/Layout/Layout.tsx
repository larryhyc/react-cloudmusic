// src/Layout/Layout.tsx
import Footer from '@/components/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import Head from '@/components/Head';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

const Layout = () => {
  return (
    <SidebarProvider className="flex h-screen scrollbar-hide">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="shrink-0 p-2">
          <Head />
        </header>
        <main className="flex-1 overflow-hidden p-4">
          <Toaster richColors position="top-center" />
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
