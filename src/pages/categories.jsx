import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate, useLoaderData } from "react-router";

// Price filter options
const priceFilters = [
  { value: "all", label: "All Prices" },
  { value: "low-to-high", label: "Price: Low to High" },
  { value: "high-to-low", label: "Price: High to Low" },
];

// Stock filter options
const stockFilters = [
  { value: "all", label: "All Stock" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock (< 5)" },
];

export default function CategoriesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from the loader
  const { categories = [], products = [], selectedCategories: initialSelectedCategories = [] } = useLoaderData() || {};
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState(initialSelectedCategories);
  const [priceSort, setPriceSort] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  
  // Check if data is available
  const loading = !products || products.length === 0;
  const error = null;
  
  // We don't need the initial fetch effect anymore since data comes from the loader
  
  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    // Update selected categories
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updatedCategories);
    
    // Update URL query parameter
    const searchParams = new URLSearchParams(location.search);
    if (updatedCategories.length === 0) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', updatedCategories.join(','));
    }
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category_id));
    }
    
    // Filter by stock
    if (stockFilter === "in-stock") {
      result = result.filter(product => product.quantity > 0);
    } else if (stockFilter === "low-stock") {
      result = result.filter(product => product.quantity > 0 && product.quantity < 5);
    }
    
    // Sort by price
    if (priceSort === "low-to-high") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (priceSort === "high-to-low") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    
    return result;
  }, [products, selectedCategories, priceSort, stockFilter]);
  
  return (
    <main className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-gray-200 pb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Products by Category
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Browse our products by category, filter by stock availability, and sort by price.
          </p>
        </div>

        <div className="pt-12 pb-24 lg:grid lg:grid-cols-4 lg:gap-x-8">
          <aside className="space-y-8">
            {/* Categories filter */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">Categories</h2>
              {loading ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center gap-3">
                      <input
                        id={`category-${category.id}`}
                        name="category"
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm text-gray-700"
                      >
                        {category.title}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Price filter */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">Price</h2>
              <div className="space-y-4">
                {priceFilters.map((option) => (
                  <div key={option.value} className="flex items-center gap-3">
                    <input
                      id={`price-${option.value}`}
                      name="price"
                      type="radio"
                      checked={priceSort === option.value}
                      onChange={() => setPriceSort(option.value)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`price-${option.value}`}
                      className="text-sm text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stock filter */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">Availability</h2>
              <div className="space-y-4">
                {stockFilters.map((option) => (
                  <div key={option.value} className="flex items-center gap-3">
                    <input
                      id={`stock-${option.value}`}
                      name="stock"
                      type="radio"
                      checked={stockFilter === option.value}
                      onChange={() => setStockFilter(option.value)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`stock-${option.value}`}
                      className="text-sm text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="mt-10 lg:col-span-3 lg:mt-0">
            {loading ? (
              <div className="text-center py-12">
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                <p>{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p>No products found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-gray-200 group-hover:opacity-75">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="h-full w-full object-cover object-center"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f093956%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f093956%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2296.3%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                            e.target.classList.add('error');
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          <Link to={`/products/${product.id}`}>
                            <span className="absolute inset-0" />
                            {product.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-base font-medium text-gray-900">
                          ${parseFloat(product.price).toFixed(2)}
                        </p>
                        {product.quantity <= 5 && product.quantity > 0 && (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            Low stock
                          </span>
                        )}
                        {product.quantity === 0 && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
