import Footer from "@/components/main/footer";
import Navbar from "@/components/main/navbar";
import { Outlet } from "react-router";
import TopLoader from "@/components/shared/top-loader";

const MainLayout = () => {
  return (
    <>
      <TopLoader />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
