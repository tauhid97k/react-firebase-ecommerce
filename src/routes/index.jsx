import { createBrowserRouter } from "react-router";
import DashboardLayout from "@/layouts/dashboard";
import OverviewPage from "@/pages/dashboard/overview";
import AuthLayout from "@/layouts/auth";
import MainLayout from "@/layouts/main";
import AdminSignInPage from "@/pages/auth/sign-in";
import HomePage from "@/pages/home";
import AdminProductsPage from "@/pages/dashboard/products";
import AdminCategoriesPage from "@/pages/dashboard/categories";
import CategoriesPage from "@/pages/categories";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import ProductDetails from "@/pages/productdetails";

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
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
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
        element: <AdminProductsPage />,
      },

      {
        path: "categories",
        element: <AdminCategoriesPage />,
      },
    ],
  },
]);
