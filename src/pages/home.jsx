import Categories from "@/components/main/categories";
import Footer from "@/components/main/footer";
import Hero from "@/components/main/hero";
import ProductList from "@/components/main/product-list";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <Categories />
      <ProductList />
      <Footer />
    </div>
  );
};

export default HomePage;
