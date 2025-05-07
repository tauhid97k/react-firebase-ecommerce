import { useState, useEffect } from "react";
import { Modal } from "@/components/shared/modal";
import { ImageUploader } from "@/components/shared/image-uploader";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

export const ProductModal = ({ isOpen, onClose, onSubmit, product = null }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    price: "",
    whatsappNumber: "",
    category_id: "",
    stock_warning_at: "5",
    isVisible: true,
    images: []
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "categories");
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Reset form data when modal opens or product changes
  useEffect(() => {
    // Only reset the form when the modal opens or when editing a different product
    if (isOpen) {
      if (product) {
        // If editing, populate with product data
        setFormData({
          title: product.title || "",
          description: product.description || "",
          quantity: product.quantity || "",
          price: product.price || "",
          whatsappNumber: product.whatsappNumber || "",
          category_id: product.category_id || "",
          stock_warning_at: product.stock_warning_at ? product.stock_warning_at.toString() : "5",
          isVisible: product.isVisible !== undefined ? product.isVisible : true,
          images: product.images || []
        });
      } else {
        // If adding new, reset to empty form
        setFormData({
          title: "",
          description: "",
          quantity: "",
          price: "",
          whatsappNumber: "",
          category_id: categories.length > 0 ? categories[0].id : "",
          stock_warning_at: "5",
          isVisible: true,
          images: []
        });
      }
    }
  }, [isOpen, product, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state
    setLoading(true);
    
    // Create a copy of form data with properly formatted values
    const processedFormData = {
      ...formData,
      // Ensure numeric fields are properly formatted
      quantity: formData.quantity.toString(),
      price: formData.price.toString(),
      stock_warning_at: formData.stock_warning_at.toString()
    };
    
    console.log('Product modal submitting with data:', processedFormData);
      
    try {
      // Pass the processed form data to the parent component's onSubmit
      await onSubmit(processedFormData);
      console.log('Product modal submission successful');
      onClose();
    } catch (error) {
      console.error("Error submitting product:", error);
      alert(`Error updating product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={product ? "Edit Product" : "Add New Product"}
    >
      <form onSubmit={handleSubmit}>
        <fieldset disabled={loading} className="space-y-4 disabled:opacity-70">
          {/* Product Images */}
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <ImageUploader 
            images={formData.images} 
            onChange={(images) => setFormData(prev => ({ ...prev, images }))}
            maxImages={5}
          />
        </div>
        
        {/* Product Title */}
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
        
        {/* Product Category */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            required
            value={formData.category_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        
        {/* Product Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        
        {/* Product Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            required
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        
        {/* Stock Warning Threshold */}
        <div>
          <label htmlFor="stock_warning_at" className="block text-sm font-medium text-gray-700">
            Low Stock Warning Threshold
          </label>
          <input
            type="number"
            name="stock_warning_at"
            id="stock_warning_at"
            required
            min="0"
            value={formData.stock_warning_at}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
          <p className="text-xs text-gray-500 mt-1">
            Show warning when quantity falls below this number
          </p>
        </div>
        
        {/* Product Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        
        {/* Whatsapp Number */}
        <div>
          <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
            Whatsapp Number
          </label>
          <input
            type="text"
            name="whatsappNumber"
            id="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        
        {/* Visibility Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isVisible"
            id="isVisible"
            checked={formData.isVisible}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isVisible" className="ml-2 block text-sm font-medium text-gray-700">
            Visible to customers
          </label>
          <p className="ml-4 text-xs text-gray-500">
            When unchecked, this product will not be visible on the public site
          </p>
        </div>
        </fieldset>
        
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 disabled:opacity-50"
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
