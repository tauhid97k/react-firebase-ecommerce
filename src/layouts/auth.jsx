import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
