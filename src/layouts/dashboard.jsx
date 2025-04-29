import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="fixed flex size-full">
      <Sidebar />
      <div className="flex w-full flex-col overflow-hidden">
        <Header />
        <main className="grow overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
