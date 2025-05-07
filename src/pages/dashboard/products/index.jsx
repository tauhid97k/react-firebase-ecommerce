import { useState } from "react";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { Form, useSubmit, Outlet } from "react-router";
import { DataTable } from "@/components/shared/table";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ProductModal } from "./product-modal";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";

const AdminProductsPage = () => {
  // Get data from the loader
  const loaderData = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  // Track loading state based on navigation state
  const isSubmitting = navigation.state === "loading" || navigation.state === "submitting";
  
  // Use the revalidator hook for proper revalidation
  const revalidator = useRevalidator();
  
  // Get categories data directly from loader data
  const categories = loaderData?.categories || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Get products data directly from loader data
  const products = loaderData?.products || [];
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    // Apply search filter
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply category filter
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Render image cell for the data table
  function renderImage(info) {
    const images = info.getValue();
    if (!images || images.length === 0) {
      return <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">No Image</div>;
    }
    
    return (
      <img 
        src={images[0].url} 
        alt="Product" 
        className="w-12 h-12 object-cover rounded-md"
      />
    );
  }
  
  // Render price cell for the data table
  function renderPrice(info) {
    const price = info.getValue();
    return `$${parseFloat(price).toFixed(2)}`;
  }
  
  // Render actions cell for the data table
  function renderActions(info) {
    const product = info.row.original;
    
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleEdit(product)}
          className="p-1 text-blue-600 hover:text-blue-800"
          title="Edit product"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleDeleteClick(product)}
          className="p-1 text-red-600 hover:text-red-800"
          title="Delete product"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    );
  }
  
  // Define columns for the data table
  const columns = [
    {
      header: "Image",
      accessorKey: "images",
      cell: renderImage
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Category",
      accessorKey: "category_id",
      cell: info => {
        const categoryId = info.getValue();
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.title : "Unknown";
      }
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: renderPrice
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: info => {
        const quantity = parseInt(info.getValue()) || 0;
        const product = info.row.original;
        const warningThreshold = parseInt(product.stock_warning_at) || 5;
        
        // Show warning if quantity is below or equal to the threshold
        const isLowStock = quantity <= warningThreshold;
        
        return (
          <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
            {quantity}
          </span>
        );
      }
    },
    {
      header: "Visibility",
      accessorKey: "isVisible",
      cell: info => {
        const isVisible = info.getValue();
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isVisible ? 'Visible' : 'Hidden'}
          </span>
        );
      }
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: renderActions
    },
  ];

  // Handle opening modal for editing
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  // Handle opening delete confirmation modal
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  
  // Handle deleting a product
  const handleDeleteProduct = () => {
    if (productToDelete) {
      const formData = new FormData();
      formData.append('id', productToDelete.id);
      
      submit(formData, {
        method: "post",
        action: "/dashboard/products/delete"
      });
      
      // Revalidate after submission
      revalidator.revalidate();
      
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };
  
  // Handle form submission (add or edit)
  const handleSubmit = async (formData) => {
    console.log("Submitting product form with data:", formData);
    
    // Create a FormData object to submit
    const formDataToSubmit = new FormData();
    
    // Add all form data to the FormData object
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        formDataToSubmit.append(key, JSON.stringify(value));
      } else if (typeof value === 'boolean') {
        // Handle boolean values properly
        formDataToSubmit.append(key, value.toString());
      } else if (value !== null && value !== undefined) {
        // Convert all values to strings to avoid type issues
        formDataToSubmit.append(key, String(value));
      }
    });
    
    try {
      if (selectedProduct) {
        // Update existing product
        formDataToSubmit.append('id', selectedProduct.id);
        
        await submit(formDataToSubmit, {
          method: "post",
          action: "/dashboard/products/update"
        });
      } else {
        // Add new product
        await submit(formDataToSubmit, {
          method: "post",
          action: "/dashboard/products/add"
        });
      }
      
      // Revalidate after successful submission
      revalidator.revalidate();
      
      return true;
    } catch (error) {
      console.error("Error submitting product:", error);
      return false;
    }
  };
  
  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Ensure selectedProduct is reset when modal is closed
    setSelectedProduct(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Products</h1>
        <button
          type="button"
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Add Product
        </button>
      </div>
      
      <div className="border rounded-xl border-slate-200">
        <div className="p-6 flex items-center justify-between gap-4">
          {/* Search & Category */}
          <div className="flex items-center gap-4">
            <input
              name="search"
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block max-w-md shrink-0 w-full rounded-md bg-slate-50 px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <select
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md bg-slate-50 shrink-0 w-full pl-2 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DataTable 
          columns={columns} 
          data={filteredProducts} 
        />
      </div>
      
      {/* Product Modal */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmit}
        product={selectedProduct}
      />
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        confirmButtonText="Delete"
      />
      
      {/* This outlet is needed for the actions to work */}
      <Outlet />
    </div>
  );
};

export default AdminProductsPage;
