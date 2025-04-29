import { useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiX } from "react-icons/fi";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import AddProductForm from "@/components/AddProductForm";

// Mock data based on the provided structure but expanded for table view
const categories = [
  { id: "1", name: "Honey", count: 3 },
  { id: "2", name: "Ghee", count: 3 },
  { id: "3", name: "Dates", count: 3 },
  { id: "4", name: "Mustard Oil", count: 3 },
  { id: "5", name: "Molasses", count: 3 },
];

const products = [
  {
    id: 1,
    name: "Premium Wild Honey",
    category: "Honey",
    price: 450,
    quantity: 50,
    status: "In Stock",
    date_added: "2025-03-15",
  },
  {
    id: 2,
    name: "Organic Farm Honey",
    category: "Honey",
    price: 400,
    quantity: 30,
    status: "In Stock",
    date_added: "2025-03-18",
  },
  {
    id: 3,
    name: "Raw Unprocessed Honey",
    category: "Honey",
    price: 480,
    quantity: 40,
    status: "In Stock",
    date_added: "2025-03-10",
  },
  {
    id: 4,
    name: "Desi Cow Ghee",
    category: "Ghee",
    price: 850,
    quantity: 25,
    status: "In Stock",
    date_added: "2025-02-20",
  },
  {
    id: 5,
    name: "Organic Ghee",
    category: "Ghee",
    price: 800,
    quantity: 20,
    status: "Low Stock",
    date_added: "2025-02-25",
  },
  {
    id: 6,
    name: "Buffalo Milk Ghee",
    category: "Ghee",
    price: 950,
    quantity: 18,
    status: "Low Stock",
    date_added: "2025-03-05",
  },
  {
    id: 7,
    name: "Ajwa Dates",
    category: "Dates",
    price: 1200,
    quantity: 100,
    status: "In Stock",
    date_added: "2025-01-10",
  },
  {
    id: 8,
    name: "Medjool Dates",
    category: "Dates",
    price: 1500,
    quantity: 70,
    status: "In Stock",
    date_added: "2025-01-15",
  },
  {
    id: 9,
    name: "Cold Pressed Mustard Oil",
    category: "Mustard Oil",
    price: 300,
    quantity: 60,
    status: "In Stock",
    date_added: "2025-03-01",
  },
  {
    id: 10,
    name: "Sugarcane Molasses",
    category: "Molasses",
    price: 250,
    quantity: 40,
    status: "In Stock",
    date_added: "2025-02-10",
  },
];

export default function AdminProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productsData, setProductsData] = useState(products);

  // Filter products based on category and search query
  const filteredProducts = productsData.filter((product) => {
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;
    const searchMatch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Sort products based on current sort configuration
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Sorting handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="inline ml-1" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  // Delete confirmation handlers
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    // In a real app, you would delete from the backend here
    console.log(`Deleting product with id: ${productToDelete.id}`);
    setProductsData(productsData.filter((p) => p.id !== productToDelete.id));
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Handle adding a new product
  const handleAddProduct = (newProduct) => {
    const categoryObj = categories.find(
      (cat) => cat.id === newProduct.category_id
    );

    const newProductEntry = {
      id: productsData.length + 1,
      name: newProduct.title,
      category: categoryObj?.name || "Unknown",
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity) || 0,
      status: parseInt(newProduct.quantity) > 0 ? "In Stock" : "Out of Stock",
      date_added: new Date().toISOString().split("T")[0], // today's date
    };

    setProductsData([...productsData, newProductEntry]);
    setShowAddModal(false);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Product Management
            </h1>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium py-2 px-4 rounded-md flex items-center space-x-2"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus /> <span>Add Product</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div
            className={`bg-white p-4 rounded-lg shadow border-l-4 cursor-pointer
                      ${
                        selectedCategory === "all"
                          ? "border-yellow-500"
                          : "border-gray-200"
                      }`}
            onClick={() => setSelectedCategory("all")}
          >
            <p className="text-sm font-medium text-gray-500">All Products</p>
            <p className="text-2xl font-bold text-gray-900">
              {productsData.length}
            </p>
          </div>

          {categories.map((category) => (
            <div
              key={category.id}
              className={`bg-white p-4 rounded-lg shadow border-l-4 cursor-pointer
                        ${
                          selectedCategory === category.name
                            ? "border-yellow-500"
                            : "border-gray-200"
                        }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <p className="text-sm font-medium text-gray-500">
                {category.name}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  productsData.filter((p) => p.category === category.name)
                    .length
                }
              </p>
            </div>
          ))}
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium text-gray-700">Products</h2>
              <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full">
                {sortedProducts.length} items
              </span>
            </div>

            <div className="w-full md:w-64">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    Product Name {getSortIcon("name")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("category")}
                  >
                    Category {getSortIcon("category")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("price")}
                  >
                    Price {getSortIcon("price")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("quantity")}
                  >
                    Inventory {getSortIcon("quantity")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {product.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ৳ {product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.quantity} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          product.status === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        onClick={() => confirmDelete(product)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No products found matching your criteria
              </p>
            </div>
          )}

          {/* Pagination - Static for demo */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{sortedProducts.length}</span>{" "}
                  of{" "}
                  <span className="font-medium">{sortedProducts.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-yellow-50 border-yellow-500 text-yellow-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowAddModal(false)}
            >
              <div className="absolute inset-0 z-50 bg-gray-200 opacity-50"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add New Product
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2">
                  <AddProductForm
                    onAdd={handleAddProduct}
                    categories={categories.map((cat) => ({
                      id: cat.id,
                      title: cat.name,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{productToDelete?.name}
                        "? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
