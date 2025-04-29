import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="h-screen grid place-items-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
