import { Outlet } from "react-router";
import TopLoader from "@/components/shared/top-loader";

const AuthLayout = () => {
  return (
    <div className="h-screen">
      <TopLoader />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
