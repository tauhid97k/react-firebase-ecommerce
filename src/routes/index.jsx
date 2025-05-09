import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import { 
  loadHomePageData, 
  loadCategoriesPageData, 
  loadProductDetails,
  loadDashboardOverview,
  loadDashboardProducts,
  loadDashboardCategories
} from "@/api/loaders";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  addProduct,
  updateProduct,
  deleteProduct
} from "@/api/mutations";

// Layouts
import DashboardLayout from "@/layouts/dashboard";
import AuthLayout from "@/layouts/auth";
import MainLayout from "@/layouts/main";
import FullScreenLoader from "@/components/shared/full-screen-loader";

// Lazy loaded components
const HomePage = lazy(() => import("@/pages/home"));
const CategoriesPage = lazy(() => import("@/pages/categories"));
const ProductDetails = lazy(() => import("@/pages/productdetails"));
const AboutPage = lazy(() => import("@/pages/about"));
const ContactPage = lazy(() => import("@/pages/contact"));

// Admin pages
const AdminSignInPage = lazy(() => import("@/pages/auth/sign-in"));
const OverviewPage = lazy(() => import("@/pages/dashboard/overview"));
const AdminProductsPage = lazy(() => import("@/pages/dashboard/products/index"));
const AdminCategoriesPage = lazy(() => import("@/pages/dashboard/categories/index"));



export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    hydrateFallbackElement: <FullScreenLoader />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: loadHomePageData,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
        loader: loadCategoriesPageData,
      },
      {
        path: "categories/:id",
        element: <CategoriesPage />,
        loader: ({ params }) => loadCategoriesPageData({ categoryId: params.id }),
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
        loader: ({ params }) => loadProductDetails({ params }),
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
    hydrateFallbackElement: <FullScreenLoader />,
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
    hydrateFallbackElement: <FullScreenLoader />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
        loader: loadDashboardOverview,
      },
      {
        path: "products",
        element: <AdminProductsPage />,
        loader: loadDashboardProducts,
        children: [
          {
            path: "add",
            action: async ({ request }) => {
              const formData = await request.formData();
              const productData = Object.fromEntries(formData);
              // Parse any JSON strings in the formData
              if (productData.images) {
                productData.images = JSON.parse(productData.images);
              }
              return addProduct({ formData: productData });
            }
          },
          {
            path: "update",
            action: async ({ request }) => {
              const formData = await request.formData();
              const id = formData.get("id");
              const productData = Object.fromEntries(formData);
              
              // Parse any JSON strings in the formData
              if (productData.images) {
                productData.images = JSON.parse(productData.images);
              }
              
              // Ensure numeric fields are properly formatted
              if (productData.stock_warning_at) {
                productData.stock_warning_at = productData.stock_warning_at.toString();
              }
              
              if (productData.quantity) {
                productData.quantity = productData.quantity.toString();
              }
              
              if (productData.price) {
                productData.price = productData.price.toString();
              }
              
              return updateProduct({ id, formData: productData });
            }
          },
          {
            path: "delete",
            action: async ({ request }) => {
              const formData = await request.formData();
              const id = formData.get("id");
              return deleteProduct({ id });
            }
          }
        ]
      },
      {
        path: "categories",
        element: <AdminCategoriesPage />,
        loader: loadDashboardCategories,
        children: [
          {
            path: "add",
            action: async ({ request }) => {
              const formData = await request.formData();
              const categoryData = Object.fromEntries(formData);
              // Parse any JSON strings in the formData
              if (categoryData.images) {
                categoryData.images = JSON.parse(categoryData.images);
              }
              return addCategory({ formData: categoryData });
            }
          },
          {
            path: "update",
            action: async ({ request }) => {
              const formData = await request.formData();
              const id = formData.get("id");
              const categoryData = Object.fromEntries(formData);
              
              // Parse any JSON strings in the formData
              if (categoryData.images) {
                categoryData.images = JSON.parse(categoryData.images);
              }
              
              // Handle isVisible field properly
              if (categoryData.isVisible === 'true') {
                categoryData.isVisible = true;
              } else if (categoryData.isVisible === 'false') {
                categoryData.isVisible = false;
              }
              
              return updateCategory({ id, formData: categoryData });
            }
          },
          {
            path: "delete",
            action: async ({ request }) => {
              const formData = await request.formData();
              const id = formData.get("id");
              return deleteCategory({ id });
            }
          }
        ]
      },
    ],
  },
]);
