import Footer from '@/components/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import Head from '@/components/Head';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <SidebarProvider className="flex">
      <div className="w-64">
        <AppSidebar />
      </div>
      <main className="flex-1 p-4 ">
        <div className="flex flex-col h-full gap-3">
          <header>
            <Head />
          </header>
          <div className="flex-1 w-full">
              <Outlet />
          </div>
          <footer>
            <Footer />
          </footer>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
