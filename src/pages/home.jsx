import Categories from "@/components/main/categories";

import Hero from "@/components/main/hero";
import ProductList from "@/components/main/product-list";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <Categories />
      <ProductList />
    </div>
  );
};

export default HomePage;
