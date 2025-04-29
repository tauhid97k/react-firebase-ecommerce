import { createBrowserRouter } from "react-router";
import DashboardLayout from "@/layouts/dashboard";
import OverviewPage from "@/pages/dashboard/overview";
import AuthLayout from "@/layouts/auth";
import MainLayout from "@/layouts/main";
import AdminSignInPage from "@/pages/auth/sign-in";
import HomePage from "@/pages/home";
import ProductsPage from "@/pages/dashboard/products";
import CategoriesPage from "@/pages/dashboard/categories";
import HomePage2 from "@/pages/home2";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "home2",
        element: <HomePage2 />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <AdminSignInPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
    ],
  },
]);
