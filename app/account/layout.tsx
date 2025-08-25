import { SidebarProvider, SidebarTrigger } from '@/app/_components/ui/sidebar';
import { AppSidebar } from '@/app/_components/app-sidebar';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <SidebarTrigger className="flex lg:hidden justify-center items-center absolute top-[27px] left-6" />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default AccountLayout;
