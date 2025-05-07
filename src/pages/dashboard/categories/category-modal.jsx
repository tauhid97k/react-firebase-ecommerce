import { useState, useEffect } from "react";
import { Modal } from "@/components/shared/modal";
import { ImageUploader } from "@/components/shared/image-uploader";

export const CategoryModal = ({ isOpen, onClose, onSubmit, category = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    isVisible: true,
    images: []
  });
  const [loading, setLoading] = useState(false);

  // Reset form data when modal opens or category changes
  useEffect(() => {
    // Only reset the form when the modal opens or when editing a different category
    if (isOpen) {
      if (category) {
        // If editing, populate with category data
        setFormData({
          title: category.title || "",
          isVisible: category.isVisible !== undefined ? category.isVisible : true,
          images: category.images || []
        });
      } else {
        // If adding new, reset to empty form
        setFormData({
          title: "",
          isVisible: true,
          images: []
        });
      }
    }
    // Include category in the dependency array
  }, [isOpen, category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Form data:", formData);
    
    // Set loading state
    setLoading(true);
    
    try {
      // Wait for the onSubmit promise to resolve
      await Promise.resolve(onSubmit(formData));
      console.log("onSubmit called successfully");
      // Only close the modal after successful submission
      onClose();
    } catch (error) {
      console.error("Error in form submission:", error);
      alert(`Error updating category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={category ? "Edit Category" : "Add New Category"}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
        <fieldset disabled={loading} className="space-y-4 disabled:opacity-70">
          {/* Category Image */}
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image
          </label>
          <ImageUploader 
            images={formData.images} 
            onChange={(images) => setFormData(prev => ({ ...prev, images }))}
            maxImages={1}
            storageFolder="categories"
          />
          <p className="text-xs text-gray-500 mt-1">
            Please upload a single image for the category
          </p>
        </div>
        
        {/* Category Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        

        
        {/* Visibility Toggle */}
        <div className="flex gap-2">
          <input
            type="checkbox"
            name="isVisible"
            id="isVisible"
            checked={formData.isVisible}
            onChange={handleChange}
            className="h-4 w-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <label htmlFor="isVisible" className="block text-sm font-medium text-gray-700">
              Visible to customers
            </label>
            <p className="text-xs text-gray-500">
            When unchecked, this category will not be visible on the public site
            </p>
          </div>
        </div>
        </fieldset>
        
        {/* Form Actions */}
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
