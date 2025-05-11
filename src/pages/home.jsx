import { useLoaderData } from "react-router";
import Categories from "@/components/main/categories";
import Hero from "@/components/main/hero";
import ProductList from "@/components/main/product-list";

export default function HomePage() {
  const loaderData = useLoaderData();

  return (
    <div className="flex flex-col">
      <Hero hero={loaderData.hero} />
      <Categories categories={loaderData.categories} />
      <ProductList categorizedProducts={loaderData.categorizedProducts} />
    </div>
  );
};
