import { useState } from "react";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { Form, useSubmit, Outlet } from "react-router";
import { DataTable } from "@/components/shared/table";
import { CategoryModal } from "./category-modal";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const AdminCategoriesPage = () => {
  // Get data from the loader
  const loaderData = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  // Track loading state based on navigation state
  const isSubmitting = navigation.state === "loading" || navigation.state === "submitting";
  
  // Use the revalidator hook for proper revalidation
  const revalidator = useRevalidator();
  
  // Get categories and products data directly from loader data
  const categories = loaderData?.categories || [];
  const products = loaderData?.products || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle category form submission (add/edit)
  const handleCategorySubmit = async (formData) => {
    console.log("Submitting category form with data:", formData);
    
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
      if (selectedCategory) {
        // Update existing category
        formDataToSubmit.append('id', selectedCategory.id);
        
        await submit(formDataToSubmit, {
          method: "post",
          action: "/dashboard/categories/update"
        });
      } else {
        // Add new category
        await submit(formDataToSubmit, {
          method: "post",
          action: "/dashboard/categories/add"
        });
      }
      
      // Revalidate after successful submission
      revalidator.revalidate();
      
      return true;
    } catch (error) {
      console.error("Error submitting category:", error);
      return false;
    }
  };

  // Handle category deletion
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      const formData = new FormData();
      formData.append('id', categoryToDelete.id);
      
      submit(formData, {
        method: "post",
        action: "/dashboard/categories/delete"
      });
      
      // Revalidate after submission
      revalidator.revalidate();
      
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Custom cell renderers
  const renderImage = (info) => {
    const images = info.getValue();
    
    if (!images || images.length === 0) {
      return (
        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
          <span className="text-xs text-gray-500">No img</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        <img 
          src={images[0].url} 
          alt="Category" 
          className="h-14 w-14 rounded-lg object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f093956%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f093956%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2296.3%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
            e.target.classList.add('error');
          }}
        />
      </div>
    );
  };

  const renderActions = (info) => {
    const category = info.row.original;
    
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => {
            // Simply set the selected category and open the modal
            // Just like how the delete button works
            setSelectedCategory(category);
            setIsModalOpen(true);
          }}
          className="p-1 text-blue-600 hover:text-blue-800"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            setCategoryToDelete(category);
            setIsDeleteModalOpen(true);
          }}
          className="p-1 text-red-600 hover:text-red-800"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    );
  };

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
      header: "Total Products",
      accessorKey: "id",
      cell: info => {
        const categoryId = info.row.original.id;
        // Count products in this category
        const productCount = products.filter(product => product.category_id === categoryId).length;
        return (
          <span className="font-medium">
            {productCount}
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
      header: "Action",
      accessorKey: "id",
      cell: renderActions
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Categories</h1>
        <button
          onClick={() => {
            // Simply reset the selected category and open the modal
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Add Category
        </button>
      </div>

      <div className="border rounded-xl border-slate-200">
        <div className="p-6">
          <input
            name="search"
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block max-w-md w-full rounded-md bg-slate-50 px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
        <DataTable 
          columns={columns} 
          data={filteredCategories} 
        />
      </div>

      {/* Category Modal for Add/Edit */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Ensure selectedCategory is reset when modal is closed
          setSelectedCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        category={selectedCategory}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.title}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
      
      {/* This outlet is needed for the actions to work */}
      <Outlet />
    </div>
  );
};

export default AdminCategoriesPage;
