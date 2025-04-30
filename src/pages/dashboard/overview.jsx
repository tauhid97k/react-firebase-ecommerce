import { useState } from "react";
import {
  Package,
  FolderPlus,
  Plus,
  Clipboard,
  ChevronDown,
  Search,
} from "lucide-react";

export default function OverviewPage() {
  // Sample data - in real app, this would come from an API
  const [categories, setCategories] = useState([
    { id: 1, name: "Ghee", count: 3 },
    { id: 2, name: "Spices", count: 5 },
    { id: 3, name: "Rice", count: 2 },
    { id: 4, name: "Flour", count: 4 },
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Cow Ghee",
      category: "Ghee",
      stock: 25,
      price: 499,
    },
    {
      id: 2,
      name: "Organic Buffalo Ghee",
      category: "Ghee",
      stock: 15,
      price: 599,
    },
    { id: 3, name: "A2 Desi Ghee", category: "Ghee", stock: 20, price: 699 },
    {
      id: 4,
      name: "Red Chilli Powder",
      category: "Spices",
      stock: 50,
      price: 99,
    },
    {
      id: 5,
      name: "Turmeric Powder",
      category: "Spices",
      stock: 45,
      price: 79,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("Ghee");
  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  // For dropdowns
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage your products and categories
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus size={18} className="mr-2" />
              Add Product
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <FolderPlus size={18} className="mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Category Selector */}
        <div className="mb-6">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-between items-center w-56 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>Category: {selectedCategory}</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Cards based on selected category */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Products in "{selectedCategory}" Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    In Stock: {product.stock}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{product.price}
                  </p>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Category Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`p-4 rounded-lg border ${
                  selectedCategory === category.name
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-gray-50 border-gray-200"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-md ${
                      selectedCategory === category.name
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Package size={20} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {category.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {category.count} Products
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
